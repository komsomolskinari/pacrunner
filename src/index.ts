import { createContext, Script } from 'vm';
import { readFileSync } from 'fs';
import * as ffpac from './3rd/mozillaTSruntime';

// put an uuid
const exporterSig = '_25b121fbbd4840fba525f9281e95007c';

type RawContext = {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	[key: string]: any;
};

const pacMainExporter = `
// intergraded type check
if (typeof FindProxyForURL !== 'function'){
	throw new TypeError('FindProxyForURL is not function');
}
${exporterSig} = FindProxyForURL;
`;

/**
 * Select which version of PAC runtime will be used (not tested)
 */
export enum RuntimeVersion {
	_Error = -1,
	None,
	Firefox
}

const rtVer: RawContext[] = [];
rtVer[RuntimeVersion.None] = {};
rtVer[RuntimeVersion.Firefox] = ffpac;

function selectRuntime(ver: RuntimeVersion): RawContext {
	return rtVer[ver] === undefined ? {} : rtVer[ver];
}

export class PAC {
	private compiledPac: Script;
	private pacContext: RawContext;
	constructor(
		str: string,
		context: RawContext = {},
		runtime: RuntimeVersion = RuntimeVersion.None
	) {
		this.compiledPac = new Script(str + pacMainExporter);
		this.pacContext = context;
		Object.assign(this.pacContext, selectRuntime(runtime));
		if (typeof this.pacContext['FindProxyForURL'] !== 'undefined')
			throw new TypeError("Don't override FindProxyForURL in context");
	}

	static FromFile(
		file: string | number,
		context: RawContext = {},
		runtime: RuntimeVersion = RuntimeVersion.None
	): PAC {
		return new PAC(readFileSync(file).toString(), context, runtime);
	}

	static FromString(
		str: string,
		context: RawContext = {},
		runtime: RuntimeVersion = RuntimeVersion.None
	): PAC {
		return new PAC(str, context, runtime);
	}

	Run(url: string, context: RawContext = {}): string {
		// Build context and run PAC
		const ctx: RawContext = {};
		Object.assign(ctx, this.pacContext, context);
		if (typeof ctx.FindProxyForURL !== 'undefined') {
			throw new TypeError("Don't override FindProxyForURL in context");
		}
		createContext(ctx);
		this.compiledPac.runInContext(ctx);

		// Parse URL
		const host = new URL(url).hostname;
		// Call FindProxyForURL
		const ret = ctx[exporterSig](url, host);
		// Type check
		const tret = typeof ret;
		if (tret !== 'string') {
			throw new TypeError(
				`PAC should return string, ${ret}(${tret}) returned`
			);
		}
		return ret;
	}
}

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

	/**
	 * Init PAC runner with given text
	 * @param str PAC text content
	 * @param context Global context needed for PAC
	 * @param runtime Use which runtime version
	 */
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

	/**
	 * Init PAC runner from file
	 * @param file file name or fd
	 * @param context Global context needed for PAC
	 * @param runtime Use which runtime version
	 */
	static FromFile(
		file: string | number,
		context: RawContext = {},
		runtime: RuntimeVersion = RuntimeVersion.None
	): PAC {
		return new PAC(readFileSync(file).toString(), context, runtime);
	}

	/**
	 * Init PAC runner with given text, wrapper of `new PAC()`
	 * @see constructor()
	 * @param str PAC text content
	 * @param context Global context needed for PAC
	 * @param runtime Use which runtime version
	 */
	static FromString(
		str: string,
		context: RawContext = {},
		runtime: RuntimeVersion = RuntimeVersion.None
	): PAC {
		return new PAC(str, context, runtime);
	}

	/**
	 * Test URL with PAC
	 * @param url URL ( with protocol ) to be tested
	 * @param context Context for this run
	 */
	Run(url: string | URL, context: RawContext = {}): string {
		// Build context and run PAC
		const ctx: RawContext = {};
		Object.assign(ctx, this.pacContext, context);
		if (typeof ctx.FindProxyForURL !== 'undefined') {
			throw new TypeError("Don't override FindProxyForURL in context");
		}
		createContext(ctx);
		this.compiledPac.runInContext(ctx);

		const urlstr = typeof url == 'string' ? url : url.toJSON();
		// Parse URL
		const host =
			typeof url == 'string' ? new URL(url).hostname : url.hostname;
		// Call FindProxyForURL
		const ret = ctx[exporterSig](urlstr, host);
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

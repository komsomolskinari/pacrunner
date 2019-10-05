import { createContext, Script } from 'vm';
import { readFileSync } from 'fs';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const ffpac = require('./3rd/mozillaruntime');

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
let pacContext: RawContext = {};
let compiledPac: Script;

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

/**
 * Select PAC content and specify default context
 * @param content Content of PAC
 * @param context Default context for PAC
 * @param runtime Runtime version
 */
export function InitPAC(
	content: string,
	context: RawContext = {},
	runtime: RuntimeVersion = RuntimeVersion.None
): void {
	compiledPac = new Script(content + pacMainExporter);
	pacContext = context;
	Object.assign(pacContext, selectRuntime(runtime));
}

/**
 * Select PAC file and specify default context
 * @param file Location or fd of PAC
 * @param context Default context for PAC
 */
export function InitPACFromFile(
	file: string | number,
	context: RawContext = {}
): void {
	const str = readFileSync(file).toString();
	InitPAC(str, context);
}

/**
 * Run PAC
 * @param url URL to be tested, host parameter is not provided, it's basically part of URL
 * @param context Specific context for this PAC run
 */
export function RunPAC(url: string, context: RawContext = {}): string {
	const ctx: RawContext = {};
	Object.assign(ctx, pacContext);
	Object.assign(ctx, context);
	if (typeof ctx.FindProxyForURL !== 'undefined') {
		throw new TypeError("Don't override FindProxyForURL in context");
	}
	createContext(ctx);
	compiledPac.runInContext(ctx);

	const host = new URL(url).hostname;
	const ret = ctx[exporterSig](url, host);
	const tret = typeof ret;
	if (tret !== 'string') {
		throw new TypeError(
			`PAC should return string, ${ret}(${tret}) returned`
		);
	}
	return ret;
}

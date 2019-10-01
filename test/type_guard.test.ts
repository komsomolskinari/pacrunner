import { InitPACFromFile, RunPAC, InitPAC, RuntimeVersion } from '../src/index';

describe('Type guard', () => {
	test('Error when no entry', () => {
		InitPAC('');
		expect(() => RunPAC('http://yuzu-soft.com')).toThrowError(
			/FindProxyForURL/
		);
	});
	test('Error when main is not fuction', () => {
		InitPAC('var FindProxyForURL = 1;');
		expect(() => RunPAC('http://yuzu-soft.com')).toThrowError(
			/FindProxyForURL/
		);
	});
	test('Error when context has FindProxyForURL', () => {
		expect(() => {
			InitPAC('test/context_isolate_runpac.pac.js', {
				FindProxyForURL: 1
			});
			RunPAC('http://yuzu-soft.com');
		}).toThrowError(/override/);
	});
	test('No error when unexpected runtime selected', () => {
		expect(() => InitPAC('', {}, RuntimeVersion._Error)).not.toThrowError();
	});
	test('Error when PAC not init', () => {
		expect(() => RunPAC('http://yuzu-soft.com')).toThrowError(
			/FindProxyForURL/
		);
	});
	test('Error when PAC return non string', () => {
		InitPACFromFile('test/type_guard.pac.js');
		expect(() => RunPAC('http://yuzu-soft.com')).toThrowError(/PAC/);
	});
});

import { InitPACFromFile, RunPAC } from '../src/index';

describe('Context isolate', () => {
	test('InitPAC will clear all context', () => {
		InitPACFromFile('test/context_isolate_initpac.pac.js', {
			setThisContext: 1
		});
		expect(() => RunPAC('https://www.ietf.org/')).not.toThrowError();
		InitPACFromFile('test/context_isolate_initpac.pac.js', {
			anotherContext: 1
		});
		expect(() => RunPAC('https://www.ietf.org/')).toThrowError(
			/setThisContext/
		);
	});
	test('Context is isolated between RunPAC', () => {
		InitPACFromFile('test/context_isolate_runpac.pac.js');
		RunPAC('https://wikipedia.org');
		expect(RunPAC('https://wikipedia.org')).toBe('1');
		expect(RunPAC('https://wikipedia.org')).toBe('1');
	});
	test('RunPAC will override InitPAC', () => {
		InitPACFromFile('test/context_isolate_override.pac.js', { ctx: '1' });
		expect(RunPAC('https://wikipedia.org')).toBe('1');
		expect(RunPAC('https://wikipedia.org', { ctx: '2' })).toBe('2');
	});
});

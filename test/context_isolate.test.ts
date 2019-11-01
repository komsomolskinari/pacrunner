import { PAC } from '../src/index';
const site = 'https://wikipedia.org';

describe('Context isolate', () => {
	test('InitPAC will clear all context', () => {
		expect(() =>
			PAC.FromFile('test/context_isolate_initpac.pac.js', {
				setThisContext: 1
			}).Run(site)
		).not.toThrowError();
		expect(() =>
			PAC.FromFile('test/context_isolate_initpac.pac.js', {
				anotherContext: 1
			}).Run(site)
		).toThrowError(/setThisContext/);
	});
	test('Context is isolated between RunPAC', () => {
		const pac = PAC.FromFile('test/context_isolate_runpac.pac.js');
		pac.Run(site);
		expect(pac.Run(site)).toBe('1');
		expect(pac.Run(site)).toBe('1');
	});
	test('RunPAC will override InitPAC', () => {
		const pac = PAC.FromFile('test/context_isolate_override.pac.js', {
			ctx: '1'
		});
		expect(pac.Run(site)).toBe('1');
		expect(pac.Run(site, { ctx: '2' })).toBe('2');
	});
});

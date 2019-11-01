import { RuntimeVersion, PAC } from '../src/index';
const site = 'http://yuzu-soft.com';

describe('Type guard', () => {
	test('Error when no entry', () => {
		expect(() => new PAC('').Run(site)).toThrowError(/FindProxyForURL/);
	});
	test('Error when main is not fuction', () => {
		expect(() =>
			new PAC('var FindProxyForURL = 1;').Run(site)
		).toThrowError(/FindProxyForURL/);
	});
	test('Error when context has FindProxyForURL', () => {
		expect(() => {
			new PAC('', {
				FindProxyForURL: 1
			});
		}).toThrowError(/override/);
		expect(() => {
			new PAC('').Run(site, {
				FindProxyForURL: 1
			});
		}).toThrowError(/override/);
	});
	test('No error when unexpected runtime selected', () => {
		expect(() => new PAC('', {}, RuntimeVersion._Error)).not.toThrowError();
	});

	test('Error when PAC return non string', () => {
		expect(() =>
			PAC.FromFile('test/type_guard.pac.js').Run(site)
		).toThrowError(/PAC/);
	});
});

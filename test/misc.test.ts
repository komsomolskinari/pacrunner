import { PAC, RuntimeVersion } from '../src';

// Mostly for 100% coverage...

describe('misc', () => {
	test('PAC from string', () => {
		PAC.FromString('');
		PAC.FromString('', {}, RuntimeVersion.None);
	});
	test('PAC from file', () => {
		PAC.FromFile('test/basic_concept.pac.js', {}, RuntimeVersion.None);
	});
	test('URL object as input', () => {
		expect(
			PAC.FromFile('test/dumb.pac.js').Run(
				new URL('https://exhentai.org/')
			)
		).toBe('https://exhentai.org/ exhentai.org');
	});
});

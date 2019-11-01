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
});

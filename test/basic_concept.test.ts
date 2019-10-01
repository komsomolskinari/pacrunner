import { InitPACFromFile, RunPAC } from '../src/index';

describe('Basic concept', () => {
	test('Call function from VM', () => {
		InitPACFromFile('test/basic_concept.pac.js', {
			ExternalVariable: 'Awesome stuff:'
		});
		expect(RunPAC('http://exhentai.org/g/1407006/d929afe435')).toBe(
			'Awesome stuff: http://exhentai.org/g/1407006/d929afe435 exhentai.org'
		);
	});
});

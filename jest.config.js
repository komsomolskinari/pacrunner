module.exports = {
	preset: 'ts-jest/presets/js-with-ts',

	testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$',
	moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node']

	//testEnvironment: 'node',
	//roots: ['<rootDir>'],
	//testMatch: ['test/*.ts']
	//	testRegex: ['test[0-9a-zA-Z/_-]+\\.ts$']
};

module.exports = {
	roots: ['./tests'],
	transform: {
		'^.+\\.ts?$': 'ts-jest',
	},
	testEnvironment: 'node',
	testRegex: '/tests/.*\\.(test|spec)?\\.(ts|tsx|js)$',
	moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
	globals: {
		'ts-jest': {
			tsconfig: './tests/tsconfig.json',
		},
	},
	collectCoverageFrom: ['src/utils/*.ts', 'src/*.ts'],
	setupFilesAfterEnv: ['./jest.setup.js'],
};

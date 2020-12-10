import { ParseDomain } from '../../src/data/main';

const data: any[][] = [
	[
		{
			name: 'isAware',
			caption: 'Aware of Something',
			domain: 'd.advBoolean',
		},
		{ name: 'd.advBoolean', format: 'YesNo', domain: 'd.basicBoolean' },
		{ name: 'd.basicBoolean', type: 'boolean', domain: 'd.base' },
		{ name: 'd.base', type: 'string', format: 'NONE', domain: '' },
		{ name: 'name', type: 'string', length: 17 },
	],
];

describe('test ParseDomain', function () {
	it('simple', function () {
		const config = ParseDomain(data, data[0][0]);

		console.log('Configured column', config);

		// expect(config).toBe(7);
	});
});

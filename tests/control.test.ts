import { Main } from '../src/control';

function GetOptions(command: string = 'info'): any {
	return {
		command,
		sheetId: '1yUZ2cHkYdEC3twB6bNimEORO7ZJohJ3PgX4D74KC_lY',
		directory: './out/simple',
		customDir: '../sandfox-in/simple',
		project: 'simple',
		package: 'org.godzzo.simple',
		credential: 'credentials/gd-drive-access.json',
		hints: ['auth'],
		showLogo: 'yes',
		showArgs: 'yes',
		foxPath: '.',
	};
}

// npx jest --detectOpenHandles tests/control.test.ts
describe('Control / Main', () => {
	it('Save', async () => {
		const options = GetOptions();

		await Main(options);
	});

	it('Generate', async () => {
		const options = GetOptions('generate');

		await Main(options);
	});
});

/*
it('Generate', async () => {
	options.command = 'generate';

	await Main(options);
});
*/

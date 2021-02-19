import { Main } from '../src/control';

function GetOptionsSmartZ(command: string = 'info'): any {
	return {
		command,
		sheetId: '1vI81u888UvjT0WWRSgEoU12JepO6Fpv0TUiUdPEXmKY',
		directory: './out/smartz-nebu',
		project: 'smartz-nebu',
		customDir: '../MariaUt/smartz-nebu',
		package: 'com.lightport.smartz',
		credential: 'credentials/gd-drive-access.json',
		hints: ['auth'],
		showLogo: 'yes',
		showArgs: 'yes',
		foxPath: '.',
		template: 'ts-model',
		templateRoot: 'NONE',
	};
}

function GetOptionsSteam(command: string = 'info'): any {
	return {
		command,
		sheetId: '1Yl4-C2EeZDhxQB8HJiNlwrAqSZ5fdfbRdm9ggToparw',
		directory: './out/steam',
		project: 'steam',
		customDir: '../sandfox-in/steam',
		package: 'org.godzzo.steam',
		credential: 'credentials/gd-drive-access.json',
		hints: [],
		showLogo: 'yes',
		showArgs: 'yes',
		foxPath: '.',
		template: 'project',
		templateRoot: 'NONE',
	};
}

function GetOptionsDae(command: string = 'info'): any {
	return {
		command,
		sheetId: '13dpZgWtoIVyfGUrr9z-_DfR7HE9AgSgmLfDQ8382duI',
		directory: './out/daedalus',
		project: 'daedalus',
		customDir: '../sandfox-in/daedalus',
		package: 'org.godzzo.daedalus',
		credential: 'credentials/gd-drive-access.json',
		hints: ['auth'],
		showLogo: 'yes',
		showArgs: 'yes',
		foxPath: '.',
		template: 'project',
		templateRoot: 'NONE',
	};
}

function GetOptionsSimple(command: string = 'info'): any {
	return {
		command,
		sheetId: '1yUZ2cHkYdEC3twB6bNimEORO7ZJohJ3PgX4D74KC_lY',
		directory: './out/simple',
		project: 'simple',
		customDir: '../sandfox-in/simple',
		package: 'org.godzzo.simple',
		credential: 'credentials/gd-drive-access.json',
		hints: ['auth'],
		showLogo: 'yes',
		showArgs: 'yes',
		foxPath: '.',
		template: 'project',
		templateRoot: 'NONE',
	};
}

// npx jest --detectOpenHandles tests/control.test.ts
describe('Control / Main', () => {
	it('Save', async () => {
		const options = GetOptionsSteam();

		await Main(options);
	});

	it('Generate', async () => {
		const options = GetOptionsSteam('generate');

		await Main(options);
	});
});

/*
it('Generate', async () => {
	options.command = 'generate';

	await Main(options);
});
*/

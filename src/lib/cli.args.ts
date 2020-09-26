
const CliArgs = require('command-line-args');


export function ParseCliArgs() {
	// https://github.com/75lb/command-line-args/blob/master/doc/option-definition.md
	const optDef = [
		{ name: 'command', defaultOption: true, type: String, defaultValue: 'info' },
		{ name: 'directory', alias: 'd', type: String, defaultValue: './out/sample' },
		{ name: 'customDir', alias: 'q', type: String, defaultValue: './in/sample' },
		{ name: 'project', alias: 'p', type: String, defaultValue: 'sample' },
		{ name: 'package', alias: 'k', type: String, defaultValue: 'demo' },
		{ name: 'showLogo', type: String, defaultValue: 'yes' },
		{ name: 'showArgs', type: String, defaultValue: 'yes' },
		{ name: 'credential', alias: 'c', type: String, defaultValue: 'credentials/gd-drive-access.json' },
		{ name: 'sheetId', alias: 's', type: String, defaultValue: 'NONE' } // 1A-CnEIWo4YUtYWqw8QZGkfOJzzw0TBXEL1kll3C9nbE
	];

	const options = CliArgs(optDef);

	options.foxPath = process.env.SANDFOX? process.env.SANDFOX: '.';

	return options;
}

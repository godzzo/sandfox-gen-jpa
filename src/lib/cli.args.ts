
const CliArgs = require('command-line-args');


export function ParseCliArgs() {
	// https://github.com/75lb/command-line-args/blob/master/doc/option-definition.md
	const optDef = [
		{ name: 'command', defaultOption: true, type: String, defaultValue: 'info' },
		{ name: 'directory', alias: 'd', type: String, defaultValue: '.' },
		{ name: 'project', alias: 'p', type: String, defaultValue: 'sample' },
		{ name: 'showLogo', type: String, defaultValue: 'yes' },
		{ name: 'credential', alias: 'c', type: String, defaultValue: 'credentials/gd-drive-access.json' },
		{ name: 'sheetId', alias: 's', type: String, defaultValue: 'NONE' } // 1A-CnEIWo4YUtYWqw8QZGkfOJzzw0TBXEL1kll3C9nbE
	];

	const options = CliArgs(optDef);

	return options;
}

function Sample() {
	console.log('Example: node dist/index.js --verbose --timeout=1000 --src one.js --src two.js');

	// https://github.com/75lb/command-line-args/blob/master/doc/option-definition.md
	const optionDefinitions = [
		{ name: 'verbose', alias: 'v', type: Boolean },
		{ name: 'src', type: String, multiple: true, defaultOption: true },
		{ name: 'timeout', alias: 't', type: Number }
	];

	const options = CliArgs(optionDefinitions);
	console.log(JSON.stringify(options, null, 4));
}

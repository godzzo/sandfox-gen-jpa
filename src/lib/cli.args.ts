import CliArgs from 'command-line-args';
import { Options } from '../proc/common';
import { ReadJsonFile, FileExists } from './common';

export async function ParseCliArgs() {
	// https://github.com/75lb/command-line-args/blob/master/doc/option-definition.md
	const optDef = [
		{
			name: 'command',
			defaultOption: true,
			type: String,
			defaultValue: 'info',
		},
		{ name: 'config', type: String, defaultValue: '' },
		{
			name: 'directory',
			alias: 'd',
			type: String,
			defaultValue: './out/sample',
		},
		{
			name: 'customDir',
			alias: 'q',
			type: String,
			defaultValue: './in/sample',
		},
		{ name: 'project', alias: 'p', type: String, defaultValue: 'sample' },
		{ name: 'package', alias: 'k', type: String, defaultValue: 'demo' },
		{ name: 'showLogo', type: String, defaultValue: 'yes' },
		{ name: 'showArgs', type: String, defaultValue: 'yes' },
		{
			name: 'credential',
			alias: 'c',
			type: String,
			defaultValue: 'credentials/gd-drive-access.json',
		},
		{ name: 'hint', alias: 'h', type: String, defaultValue: '' },
		{ name: 'sheetId', alias: 's', type: String, defaultValue: 'NONE' }, // 1A-CnEIWo4YUtYWqw8QZGkfOJzzw0TBXEL1kll3C9nbE
		{ name: 'template', alias: 't', type: String, defaultValue: 'project' },
		{ name: 'templateRoot', type: String, defaultValue: 'NONE' },
	];

	let options = CliArgs(optDef) as Options;

	if (FileExists(options.config)) {
		const json = await ReadJsonFile(options.config);

		options = Object.assign(options, json);
	}

	options.foxPath = process.env.SANDFOX ? process.env.SANDFOX : '.';
	options.hints = options.hint.split(',');

	return options;
}

import path from 'path';
import CliArgs from 'command-line-args';

import { ReadJsonFile, FileExists } from './common';
import { Options } from '../proc/common';
import { initPlural } from '../data/plural';

export async function ParseCliArgs(
	procPath: string,
	templateLocations: string[] = []
) {
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

	CalculateTemplateLocations(procPath, templateLocations, options);

	options.hints = options.hint.split(',');

	initPlural(options);

	return options;
}

function CalculateTemplateLocations(
	procPath: string,
	templateLocations: string[],
	options: Options
) {
	// node_modules/dist || ./dist || ./src BY __dirname
	const moduleRoot = path.resolve(`${procPath}/../`);
	const ownRoot = path.resolve(`${__dirname}/../../`);

	options.foxPath = process.env.SANDFOX ?? moduleRoot;

	options.templatePaths = [];

	if (options.templateRoot !== 'NONE') {
		options.templatePaths.push(options.templateRoot);
	}

	if (process.env.SANDFOX) {
		options.templatePaths.push(process.env.SANDFOX);
	}

	options.templatePaths = [
		...options.templatePaths,
		...templateLocations,
		moduleRoot,
		ownRoot,
	];

	console.log('Template locations:', options.templatePaths);
}

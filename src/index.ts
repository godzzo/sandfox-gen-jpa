#!/usr/bin/env node

import { Log, LogObj, ReadFile, WriteJsonFile, MkDir } from "./lib/common";
import { ProcGenerate } from "./lib/proc";
import { ParseCliArgs } from "./lib/cli.args";
import { LoadMeta, LoadGSMeta } from "./lib/meta";
const chalk = require('chalk');


// node dist/index.js save -s 1A-CnEIWo4YUtYWqw8QZGkfOJzzw0TBXEL1kll3C9nbE 
// sakila: 1Zt3ff5GsxVW9VVsRwdWoG66TawIQ0fWCxU4VCoq-ROA

console.log('SandFox GEN JPA - Loaded...');

const options = ParseCliArgs();

(async () => {
	if (options.showArgs == 'yes'){
		LogObj(options, 'ParseCliArgs');
	}

	await PrintLogo(options);

	try {
		if (options.command == "info") {
			await InfoGSMeta(options);
		} else if (options.command == "save") {
			await SaveGSMeta(options);
		} else if (options.command == "generate") {
			await InvokeGenerate(options);
		} else {
			Log(`Don't known this command: ${options.command} :(`);
		}

		Log('Bye :)');
	} catch (err) {
		console.log(err);
	}
})();

async function PrintLogo(options: any) {
	if (options.showLogo == 'yes') {
		const logo = await ReadFile(`${options.foxPath}/config/logo.txt`);

		Log(chalk.yellow.bgRed.bold(logo));
	}
}

async function InfoGSMeta(options: any) {
	const data = await LoadGSMeta(options);
	LogObj(data, 'InfoGSMeta');
}

async function SaveGSMeta(options: any) {
	const data = await LoadGSMeta(options);

	await MkDir(`${options.directory}/config`);
	const jsonPath = `${options.directory}/config/${options.project}.json`;

	Log(`Write GoogleSheet meta to JsonFile: ${jsonPath} `);

	await WriteJsonFile(jsonPath, data);
}

async function InvokeGenerate(options: any) {
	const {tables, data} = await LoadMeta(options);

	await ProcGenerate(options, options.project, tables, data);
}

export const NgModelGen = (name: string) => 'Hello '+name;

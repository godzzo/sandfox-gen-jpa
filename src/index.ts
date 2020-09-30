#!/usr/bin/env node

import { Log, LogObj, ReadFile, WriteJsonFile, MkDir, ReadJsonFile } from "./lib/common";
import { ProcGenerate } from "./lib/proc";
import { ParseCliArgs } from "./lib/cli.args";
import { LoadMeta, LoadGSMeta } from "./lib/meta";
import { ApplyCustom } from "./lib/custom";

const chalk = require('chalk');

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
		} else if (options.command == "custom") {
			await InvokeCustom(options);
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

async function InvokeCustom(options: any) {
	const register = await ReadJsonFile(`${options.directory}/config/generateRegister.json`);

	console.log('register', register);

	await ApplyCustom(register, options);
}

export const NgModelGen = (name: string) => 'Hello '+name;

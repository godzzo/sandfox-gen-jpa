#!/usr/bin/env node

import { Log, LogObj, ReadFile, WriteJsonFile, MkDir, ReadJsonFile } from "./lib/common";
import { ProcGenerate } from "./lib/proc";
import { ParseCliArgs } from "./lib/cli.args";
import { LoadMeta, LoadGSMeta } from "./lib/meta";
import { ApplyCustom } from "./lib/custom";

const chalk = require('chalk');


// node dist/index.js save -s 1A-CnEIWo4YUtYWqw8QZGkfOJzzw0TBXEL1kll3C9nbE 
// sakila: 1Zt3ff5GsxVW9VVsRwdWoG66TawIQ0fWCxU4VCoq-ROA
/* 
	sakila:
	node dist/index.js save -s 1Zt3ff5GsxVW9VVsRwdWoG66TawIQ0fWCxU4VCoq-ROA -d ./out/sakila -p sakila-kt-jpa -k org.mysql.sakila
	node dist/index.js generate -s 1Zt3ff5GsxVW9VVsRwdWoG66TawIQ0fWCxU4VCoq-ROA -d ./out/sakila -p sakila-kt-jpa -k org.mysql.sakila

	node dist/index.js save     -s 1yUZ2cHkYdEC3twB6bNimEORO7ZJohJ3PgX4D74KC_lY -d ./out/simple -q ./in/simple -k -p simple -k org.godzzo.simple
	node dist/index.js generate -s 1yUZ2cHkYdEC3twB6bNimEORO7ZJohJ3PgX4D74KC_lY -d ./out/simple -q ./in/simple -k -p simple -k org.godzzo.simple
	node dist/index.js custom   -s 1yUZ2cHkYdEC3twB6bNimEORO7ZJohJ3PgX4D74KC_lY -d ./out/simple -q ./in/simple -k -p simple -k org.godzzo.simple
*/

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

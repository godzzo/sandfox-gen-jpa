
import { Log, LogObj, ReadJsonFile, WriteJsonFile } from "./lib/common";
import { ProcGenerate } from "./lib/proc";
import { ParseCliArgs } from "./lib/cli.args";
import { LoadSpreadsheetData } from "./lib/common";


console.log('Hello 2 :), SandFox GEN JPA - Loaded!');

const options = ParseCliArgs();

LogObj(options, 'ParseCliArgs');

(async () => {
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

async function InfoGSMeta(options: any) {
	const data = await LoadGSMeta(options);
	LogObj(data, 'InfoGSMeta');
}

async function SaveGSMeta(options: any) {
	const data = await LoadGSMeta(options);
	const jsonPath = `${options.directory}/config/${options.project}.json`;

	Log(`Write GoogleSheet meta to JsonFile: ${jsonPath} `);

	WriteJsonFile(jsonPath, data);
}

async function InvokeGenerate(options: any) {
	const {tables, data} = await LoadMeta(options);

	await ProcGenerate(options.project, tables, data);
}

async function LoadGSMeta(options: any) {
	if (options.sheetId == 'NONE') {
		throw new Error('Missing sheetId parameter!');
	}

	const credPath = `${options.directory}/${options.credential}`;

	Log(`credential: ${credPath}, sheetId: ${options.sheetId}`);

	const data = await LoadSpreadsheetData(
		options.sheetId,
		credPath
	);

	return data;
}

async function LoadMeta(options: any) {
	let data = null;

	if (options.sheetId != 'NONE') {
		data = await LoadGSMeta(options);
	} else {
		const jsonPath = `${options.directory}/config/${options.project}.json`;

		data = await ReadJsonFile(jsonPath);
	}

	const tables = data.shift();

	return {tables, data};
}

export const NgModelGen = (name: string) => 'Hello '+name;

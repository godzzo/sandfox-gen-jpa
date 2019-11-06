
import gsjson = require('google-spreadsheet-to-json');
import fs = require('fs');
import util = require("util");

export async function LoadSpreadsheetData(spreadsheetId: string, credentials: string) {
	return gsjson({
		spreadsheetId: spreadsheetId,
		credentials: credentials,
		// worksheet: [0, 1, 2]
		allWorksheets: true,
	});
}

export function LogObj(obj: any, msg: string = '') {
	console.log(msg, JSON.stringify(obj, null, 4));
}

export function Log(msg: string) {
	console.log(msg);
}

export async function MkDir(srcPath: string) {
	const mkdir = util.promisify(fs.mkdir);
	await mkdir(srcPath, {recursive: true});
}

export async function CopyFile(srcPath: string, destPath: string) {
	const copyFile = util.promisify(fs.copyFile);

	await copyFile(srcPath, destPath);
}

export async function ReadFile(filePath: string): Promise<string> {
	const readFile = util.promisify(fs.readFile);

	const buffer = await readFile(filePath, {encoding: 'utf8'});
	return buffer.toString();
}

export async function ReadJsonFile(filePath: string): Promise<any> {
	const text = await ReadFile(filePath);

	const data = JSON.parse(text);

	return data;
}

export async function WriteJsonFile(filePath: string, data: any) {
	const writeFile = util.promisify(fs.writeFile);

	try {
 		await writeFile(filePath, JSON.stringify(data, null, 4), "utf8");
	} catch(error) {
		console.log(error);
	}
}

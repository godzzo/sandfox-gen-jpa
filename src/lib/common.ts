
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

export async function ReadJsonFile(filePath: string): Promise<any> {
	const readFile = util.promisify(fs.readFile);

	const buffer = await readFile(filePath, {encoding: 'utf8'});
	const text = buffer.toString();

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

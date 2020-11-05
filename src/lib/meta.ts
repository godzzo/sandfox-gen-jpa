import { Log, ReadJsonFile } from '../lib/common';
import { LoadSpreadsheetData } from '../lib/common';

export async function LoadGSMeta(options: any) {
	if (options.sheetId == 'NONE') {
		throw new Error('Missing sheetId parameter!');
	}

	const credPath = `${options.foxPath}/${options.credential}`;

	Log(`credential: ${credPath}, sheetId: ${options.sheetId}`);

	const data = await LoadSpreadsheetData(options.sheetId, credPath);

	return data;
}

export async function LoadMeta(options: any) {
	let data = null;

	if (options.sheetId != 'NONE') {
		data = await LoadGSMeta(options);
	} else {
		const jsonPath = `${options.directory}/config/${options.project}.json`;

		data = await ReadJsonFile(jsonPath);
	}

	const tables = data.shift();

	return { tables, data };
}

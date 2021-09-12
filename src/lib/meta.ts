import { Options } from '../proc/common';
import { FileExists, Log, ReadJsonFile } from '../lib/common';
import { LoadSheet, GSInfo } from '../lib/common';
import { LocateTemplateFile } from 'gdut-generate';

export async function LoadGSMeta(options: Options) {
	if (options.sheetId === 'NONE') {
		throw new Error('Missing sheetId parameter!');
	}

	const credPath = FileExists(options.credential)
		? options.credential
		: LocateTemplateFile(options.credential, options, '');

	Log(`credential: ${credPath}, sheetId: ${options.sheetId}`);

	const data = await LoadSheet(options.sheetId, credPath);

	return ParseGSMeta(data);
}

export async function LoadMeta(options: Options) {
	let data = null;

	if (options.sheetId !== 'NONE') {
		data = await LoadGSMeta(options);
	} else {
		const jsonPath = `${options.directory}/config/${options.project}.json`;

		data = await ReadJsonFile(jsonPath);
	}

	const tables = data.shift();

	return { tables, data };
}

function ParseGSMeta(data: GSInfo): any[] {
	let tables: any = data.sheets.shift();

	tables = PrepareRecs(tables?.recs);

	const allData: any[] = data.sheets.map((sheet: any) => {
		return PrepareRecs(sheet.recs);
	});

	return [tables, ...allData];
}

function PrepareRecs(recs: any[]) {
	return recs.map((rec) => {
		const newRec: any = {};

		Object.entries(rec).forEach(([key, value]) => {
			if (value !== null) {
				newRec[key] = value;
			}
		});

		return newRec;
	});
}

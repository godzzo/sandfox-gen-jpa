import { LoadSpreadsheetData } from 'gdut-gsheet';
import gsjson from 'google-spreadsheet-to-json';
import fs from 'fs';
import path from 'path';
import util from 'util';
import md5 from 'md5';
import chalk from 'chalk';

export interface GSSheet {
	title: string;
	headers: string[];
	recs: any[];
}

export interface GSInfo {
	sheets: GSSheet[];
}

export async function LoadSheet(spreadsheetId: string, credentials: string) {
	return (await LoadSpreadsheetData(spreadsheetId, credentials)) as GSInfo;
}

export async function LoadSpreadsheetDataOld(
	spreadsheetId: string,
	credentials: string
) {
	return gsjson({
		spreadsheetId,
		credentials,
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

export function Warn(msg: string) {
	console.log(chalk.red.bgWhite(msg));
}

export function GetDir(filePath: string) {
	return path.dirname(filePath);
}

export async function MakeDirFromFile(oldFile: string) {
	const dirPath = GetDir(oldFile);

	await MkDir(dirPath);
}

export async function MkDir(srcPath: string) {
	const mkdir = util.promisify(fs.mkdir);
	await mkdir(srcPath, { recursive: true });
}

export function Checksum(data: string) {
	return md5(data);
}

export async function FileChecksum(filePath: string) {
	const data = await ReadFile(filePath);

	return md5(data);
}

export function FileSize(filePath: string) {
	try {
		const stats = fs.statSync(filePath);

		return stats.size;
	} catch (e) {
		console.log(e);

		return -1;
	}
}

export async function CopyFile(srcPath: string, destPath: string) {
	const copyFile = util.promisify(fs.copyFile);

	await copyFile(srcPath, destPath);
}

export async function ReadFile(filePath: string): Promise<string> {
	const readFile = util.promisify(fs.readFile);

	const buffer = await readFile(filePath, { encoding: 'utf8' });
	return buffer.toString();
}

export function FileExists(filePath: string) {
	return fs.existsSync(filePath);
}

export async function ReadJsonFile(filePath: string): Promise<any> {
	const text = await ReadFile(filePath);

	const data = JSON.parse(text);

	return data;
}

export async function WriteFile(filePath: string, data: string) {
	const writeFile = util.promisify(fs.writeFile);

	try {
		await writeFile(filePath, data, 'utf8');
	} catch (error) {
		console.log(error);
	}
}

export async function WriteJsonFile(filePath: string, data: any) {
	try {
		const json = JSON.stringify(data, null, 4);

		await WriteFile(filePath, json);
	} catch (error) {
		console.log(error);
	}
}

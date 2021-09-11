import { Options } from './../proc/common';
import * as util from 'util';
import * as fs from 'fs';
import * as pluralize from 'pluralize';

import { renderFile } from 'ejs';
import {
	CopyFile,
	FileExists,
	FileSize,
	Log,
	ReadFile,
	ReadJsonFile,
} from './common';
import { Register } from '../proc/common';

export function SetNames(data: any): any {
	const arrWords = data.name.split(/_/g);
	const arrHypen: string[] = [];
	const arrCapital: string[] = [];
	const arrLowerCamel: string[] = [];

	arrWords.forEach((word: string) => {
		const upper = word.charAt(0).toUpperCase() + word.substring(1);

		if (arrLowerCamel.length < 1) {
			arrLowerCamel.push(word);
		} else {
			arrLowerCamel.push(upper);
		}

		arrCapital.push(upper);

		arrHypen.push(word);
	});

	data.camelName = arrCapital.join('');
	data.lowerCamelName = arrLowerCamel.join('');
	data.hyphenName = arrHypen.join('-');
	data.periodName = arrHypen.join('.');

	data.pluralCamelName = pluralize.plural(data.camelName);
	data.pluralLowerCamelName = pluralize.plural(data.lowerCamelName);
	data.pluralHyphenName = pluralize.plural(data.hyphenName);
	data.pluralPeriodName = pluralize.plural(data.periodName);

	return data;
}

export async function ReadTemplateJsonFile(path: string, options: Options) {
	const filePath = LocateTemplateFile(path, options);

	return await ReadJsonFile(filePath);
}

export function LocateTemplateFile(
	path: string,
	options: Options,
	template?: string
) {
	template = template ?? options.template;

	for (const templatePath of options.templatePaths) {
		const checkPath = `${templatePath}/${template}${path}`;
		const checkTemplatePath = `${templatePath}/templates/${template}${path}`;

		if (FileExists(checkPath)) {
			return checkPath;
		}

		if (FileExists(checkTemplatePath)) {
			return checkTemplatePath;
		}
	}

	throw new Error(
		`Template not found: ${path} in templateHierarchy: ${JSON.stringify(
			options.templatePaths
		)}`
	);
}

export async function ReadTemplateFile(
	path: string,
	options: Options,
	template?: string
) {
	path = LocateTemplateFile(path, options, template);

	return await ReadFile(path);
}

export async function render(
	register: Register,
	templatePath: string,
	model: any,
	outputPath: string,
	options: Options
) {
	const writeFile = util.promisify(fs.writeFile);

	templatePath = LocateTemplateFile(templatePath, options);

	// Log(`GENERATE? ${templatePath}\n -- TO: ${outputPath}`);

	try {
		const html = await renderFile(templatePath, model, {
			outputFunctionName: 'echo',
		});

		await writeFile(outputPath, html, 'utf8');

		// TODO: model is circular should create a free one, to support serialize to json that
		register.renders.push({
			templatePath,
			outputPath,
			model: null,
			size: FileSize(outputPath),
			custom: null,
		});
	} catch (error) {
		console.log(error);
	}
}

export async function RegOwnCpFile(
	register: Register,
	srcPath: string,
	destPath: string,
	options: Options
) {
	await CopyFile(srcPath, destPath);

	register.copies.push({
		srcPath,
		destPath,
		size: FileSize(destPath),
		custom: null,
	});
}

export async function RegCpFile(
	register: Register,
	srcPath: string,
	destPath: string,
	options: Options
) {
	srcPath = LocateTemplateFile(srcPath, options);

	await CopyFile(srcPath, destPath);

	register.copies.push({
		srcPath,
		destPath,
		size: FileSize(destPath),
		custom: null,
	});
}

export function SetColumnAnnotation(column: any): string {
	let more = '';

	more +=
		column.length && column.length !== 'null'
			? `, length=${column.length}`
			: '';
	more +=
		column.needed && column.needed === 'yes'
			? `, nullable=false`
			: ', nullable=true';
	more += column.precision ? `, precision=${column.precision}` : '';
	more += column.scale ? `, precision=${column.scale}` : '';

	return `@Column(name="${column.name}"${more})`;
}

export function SetColumnDirective(column: any): string {
	// {name: "first_name", type: "varchar", length: 200}
	// {name: "last_update", type: "timestamp"}

	const cfg: any = {};

	cfg.name = column.name;

	if (column.columnType) {
		cfg.type = column.columnType;
	}

	if (column.length) {
		cfg.length = column.length;
	}

	return JSON.stringify(cfg);
}

/*
console.log(SetNames({name: 'hello'}));
console.log(SetNames({name: 'hello_world'}));
console.log(SetNames({name: 'hello_world_how_are_u'}));
*/

import { Options } from './../proc/common';
import * as util from 'util';
import * as fs from 'fs';
import path from 'path';
import * as pluralize from 'pluralize';

import { renderFile } from 'ejs';
import {
	CopyFile,
	FileExists,
	FileSize,
	GetAbsolutePath,
	Log,
	MakeDirFromFile,
	ReadFile,
	ReadJsonFile,
	ScanDir,
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

export async function ReadTemplateJsonFile(tPath: string, options: Options) {
	const filePath = LocateTemplateFile(tPath, options);

	return await ReadJsonFile(filePath);
}

export function LocateTemplateFile(
	tPath: string,
	options: Options,
	template?: string
) {
	template = template ?? options.template;

	for (const templatePath of options.templatePaths) {
		const checkPath = `${templatePath}/${template}${tPath}`;
		const checkTemplatePath = `${templatePath}/templates/${template}${tPath}`;

		console.log({
			checkPath,
			checkTemplatePath,
			exists: [FileExists(checkPath), FileExists(checkTemplatePath)],
		});

		if (FileExists(checkPath)) {
			return checkPath;
		}

		if (FileExists(checkTemplatePath)) {
			return checkTemplatePath;
		}
	}

	throw new Error(
		`Template not found: ${tPath} in templateHierarchy: ${JSON.stringify(
			options.templatePaths
		)}`
	);
}

export async function ReadTemplateFile(
	tPath: string,
	options: Options,
	template?: string
) {
	tPath = LocateTemplateFile(tPath, options, template);

	return await ReadFile(tPath);
}

type GenerateName = (source: string) => string;
type RenderMode = 'RENDER' | 'COPY' | 'NONE';

export async function RenderDir(
	sourceDir: string,
	targetDir: string,
	model: any,
	register: Register,
	options: Options,
	targetPath?: string | GenerateName,
	modeCheck?: (source: string) => RenderMode
) {
	let sourceFiles: string[] = [];

	// Calculate template source folder
	const templateFromDir = LocateTemplateFile(sourceDir, options);

	ScanDir(templateFromDir, sourceFiles);

	console.log('sourceFiles IN', [sourceDir, sourceFiles]);

	// Clear template source folder from founded file path
	sourceFiles = sourceFiles.map((el) =>
		GetAbsolutePath(el)
			.replace(GetAbsolutePath(templateFromDir), '')
			.replace(/\\/g, '/')
	);

	console.log('sourceFiles OUT', sourceFiles);

	for (const sourceFile of sourceFiles) {
		const mode = modeCheck ? modeCheck(sourceFile) : 'RENDER';

		if (mode !== 'NONE') {
			const source = path.join(sourceDir, sourceFile);

			let targetFile = sourceFile;

			if (targetPath) {
				if (typeof targetPath === 'string') {
					targetFile = sourceFile.replace(/_code_/g, targetPath);
				} else {
					targetFile = targetPath(sourceFile);
				}
			}

			const target = path.join(targetDir, targetFile);

			if (mode === 'RENDER') {
				await render(register, source, model, target, options);
			} else {
				await RegCpFile(register, source, target, options);
			}
		}
	}
}

export async function RenderFiles(
	files: [source: string, target: string][],
	templatePath: string,
	outputPath: string,
	model: any,
	register: Register,
	options: Options
) {
	for (const [source, target] of files) {
		await render(
			register,
			path.join(templatePath, source),
			model,
			path.join(outputPath, target),
			options
		);
	}
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

		await MakeDirFromFile(outputPath);

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

export async function RegCpFiles(
	files: [source: string, target: string][],
	templatePath: string,
	outputPath: string,
	register: Register,
	options: Options
) {
	for (const [source, target] of files) {
		await RegCpFile(
			register,
			path.join(templatePath, source),
			path.join(outputPath, target),
			options
		);
	}
}

export async function RegCpFile(
	register: Register,
	srcPath: string,
	destPath: string,
	options: Options
) {
	srcPath = LocateTemplateFile(srcPath, options);

	await MakeDirFromFile(destPath);

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

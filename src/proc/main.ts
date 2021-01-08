import { ReadJsonFile, WriteJsonFile } from '../lib/common';
import { PrepareData } from '../data/main';
import { JpaGenerateProject } from '../jpa/main';
import { Register, RenderData, CopyData } from './common';
import { TsModelGenerateProject } from '../ts-model/main';

export async function ProcGenerate(
	options: string,
	project: string,
	tables: any[],
	data: any[]
) {
	const register: Register = {
		renders: new Array<RenderData>(),
		copies: new Array<CopyData>(),
		outPath: '',
		created: new Date().toISOString(),
	};

	const groups: any = {};

	await PrepareData(tables, register, options, project, data, groups);

	await GenerateProject(register, options, project, tables, groups);

	await WriteGeneratedConfig(register, tables, groups);

	await WriteJsonFile(
		`${register.outPath}/config/generateRegister.json`,
		register
	);

	return register;
}

async function GenerateProject(
	register: Register,
	options: any,
	project: string,
	tables: any[],
	groups: any
) {
	await LoadTemplateConfig(options);

	if (options.templateConfig.type === 'jpa') {
		await JpaGenerateProject(register, options, project, tables, groups);
	} else if (options.templateConfig.type === 'ts-model') {
		await TsModelGenerateProject(
			register,
			options,
			project,
			tables,
			groups
		);
	} else {
		console.error('Template type UNKNOWN!');
	}
}

async function LoadTemplateConfig(options: any) {
	const templateRoot =
		options.templateRoot === 'NONE'
			? `${options.foxPath}/templates`
			: options.templateRoot;

	options.tmpl = `${templateRoot}/${options.template}`;

	options.templateConfig = await ReadJsonFile(
		`${options.tmpl}/template.json`
	);
}

async function WriteGeneratedConfig(
	register: any,
	tables: any[],
	groups: any[]
) {
	tables.forEach((table) => {
		if (table.columns) {
			table.columns.forEach((column: any) => {
				if (column.relation) {
					column.relation = column.relation.name;
				}
			});
		}
	});

	await WriteJsonFile(`${register.outPath}/config/tables.json`, tables);

	await WriteJsonFile(`${register.outPath}/config/groups.json`, groups);
}

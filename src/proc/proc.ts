import { TableInfo, TableConfig } from '../config';
import { Register, RenderData, CopyData, Options } from './common';
import { WriteJsonFile } from '../lib/common';
import { ReadTemplateJsonFile } from '../lib/generate';
import { PrepareData } from '../data/data';
import { JpaGenerateProject, JpaGeneratedConfig } from '../jpa/jpa';
import {
	TsModelGeneratedConfig,
	TsModelGenerateProject,
} from '../ts-model/ts-model';

export async function ProcGenerate(
	options: Options,
	project: string,
	tableConfigs: TableConfig[],
	data: any[]
) {
	const register: Register = {
		renders: new Array<RenderData>(),
		copies: new Array<CopyData>(),
		outPath: '',
		created: new Date().toISOString(),
	};

	const groups: any = {};

	await LoadTemplateConfig(options);

	const tables = await PrepareData(
		tableConfigs,
		register,
		options,
		project,
		data,
		groups
	);

	await GenerateProject(register, options, project, tables, groups);

	await WriteGeneratedConfig(register, options, tables, groups);

	await WriteJsonFile(
		`${register.outPath}/config/generateRegister.json`,
		register
	);

	return register;
}

async function GenerateProject(
	register: Register,
	options: Options,
	project: string,
	tables: TableInfo[],
	groups: any
) {
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

export async function LoadTemplateConfig(options: Options) {
	options.templateConfig = await ReadTemplateJsonFile(
		`/template.json`,
		options
	);
}

async function WriteGeneratedConfig(
	register: Register,
	options: Options,
	tables: TableInfo[],
	groups: any[]
) {
	tables.forEach((table) => {
		if (table.columns) {
			table.columns.forEach((column) => {
				if (column.relation) {
					column.relation = (column.relation as TableInfo).name;
				}
			});
		}
	});

	if (options.templateConfig.type === 'jpa') {
		await JpaGeneratedConfig(register, options, tables, groups);
	} else if (options.templateConfig.type === 'ts-model') {
		await TsModelGeneratedConfig(register, options, tables, groups);
	}
}

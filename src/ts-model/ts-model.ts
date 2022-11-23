import { RegCpFile, render } from 'gdut-generate';

import { TableInfo } from '../config';
import { MkDir } from '../lib/common';
import { Options, Register } from '../proc/common';
import { CollectEnums } from '../data/enum';

import { GenerateEnums } from './enum';
import { GenerateTables } from './table';

export async function TsModelGenerateProject(
	register: Register,
	options: Options,
	project: string,
	tables: TableInfo[],
	groups: any
) {
	await GenerateProject(register, options, project, tables, groups);

	const enums = CollectEnums(tables);

	await GenerateEnums(register, options, enums, project);

	await GenerateTables(register, options, tables, project);
}

export async function TsModelGeneratedConfig(
	register: Register,
	options: Options,
	tables: TableInfo[],
	groups: any[]
) {
	const out = options.directory;

	const jsonTables = JSON.stringify(tables, null, 2);
	const jsonGroups = JSON.stringify(groups, null, 2);

	const meta = { tables, groups, jsonTables, jsonGroups };

	await render(
		register,
		`/src/data/TablesConfig.ts.ejs`,
		meta,
		`${out}//src/data/TablesConfig.ts`,
		options
	);

	await render(
		register,
		`/src/data/GroupsConfig.ts.ejs`,
		meta,
		`${out}//src/data/GroupsConfig.ts`,
		options
	);
}

export async function GenerateProject(
	register: Register,
	options: Options,
	project: string,
	tables: TableInfo[],
	groups: any
) {
	const out = options.directory;

	register.outPath = out;

	await MkDir(`${out}/config`);
	await RegCpFile(
		register,
		`/config/custom.json`,
		`${out}/config/custom.json`,
		options
	);

	if (options.hints.includes('postgis')) {
		await render(
			register,
			`/src/data/model/model-types.d.ts.ejs`,
			options,
			`${out}/src/data/model/model-types.d.ts`,
			options
		);
	}
}

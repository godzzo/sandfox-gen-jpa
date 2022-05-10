import { TableInfo } from '../config';
import { RegCpFile, render } from 'gdut-generate';
import { MkDir, Warn } from '../lib/common';
import { Options, Register } from '../proc/common';

export async function TsModelGenerateProject(
	register: Register,
	options: Options,
	project: string,
	tables: TableInfo[],
	groups: any
) {
	await GenerateProject(register, options, project, tables, groups);

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

export async function GenerateTables(
	reg: Register,
	options: Options,
	tables: TableInfo[],
	project: string
) {
	const out = options.directory;

	await MkDir(`${out}/src/data/model`);

	for (const table of tables) {
		if (table.primary) {
			await GenerateTable(reg, options, project, {
				table,
				options,
				project,
			});
		} else {
			Warn(`Could not generate without primary: ${table.name}`);
		}
	}
}

async function GenerateTable(
	reg: Register,
	options: Options,
	project: string,
	meta: any
) {
	const out = options.directory;

	await render(
		reg,
		`/src/data/model/Entity.ts.ejs`,
		meta,
		`${out}/src/data/model/${meta.table.camelName}.ts`,
		options
	);
}

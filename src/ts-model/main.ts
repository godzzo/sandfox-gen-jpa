import { RegCpFile, render } from '../lib/generate';
import { MkDir, Warn, WriteJsonFile } from '../lib/common';
import { Register } from '../proc/common';

export async function TsModelGenerateProject(
	register: Register,
	options: any,
	project: string,
	tables: any[],
	groups: any
) {
	await GenerateProject(register, options, project, tables, groups);

	await GenerateTables(register, options, tables, project);
}

export async function TsModelGeneratedConfig(
	register: any,
	options: any,
	tables: any[],
	groups: any[]
) {
	const out = options.directory;

	const jsonTables = JSON.stringify(tables, null, 2);
	const jsonGroups = JSON.stringify(groups, null, 2);

	const meta = { tables, groups, jsonTables, jsonGroups };

	await render(
		register,
		`${options.tmpl}/src/data/TablesConfig.ts.ejs`,
		meta,
		`${out}//src/data/TablesConfig.ts`
	);

	await render(
		register,
		`${options.tmpl}/src/data/GroupsConfig.ts.ejs`,
		meta,
		`${out}//src/data/GroupsConfig.ts`
	);
}

export async function GenerateProject(
	register: Register,
	options: any,
	project: string,
	tables: any[],
	groups: any
) {
	const out = options.directory;
	const tmpl = options.tmpl;

	register.outPath = out;

	await MkDir(`${out}/config`);
	await RegCpFile(
		register,
		`${tmpl}/config/custom.json`,
		`${out}/config/custom.json`
	);
}

export async function GenerateTables(
	reg: Register,
	options: any,
	tables: any[],
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
	options: any,
	project: string,
	meta: any
) {
	const out = options.directory;

	await render(
		reg,
		`${options.tmpl}/src/data/model/Entity.ts.ejs`,
		meta,
		`${out}/src/data/model/${meta.table.camelName}.ts`
	);
}

import { RegCpFile, render } from '../lib/generate';
import { MkDir, Warn } from '../lib/common';
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

	await MkDir(`${out}/src/model`);

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
		`${options.tmpl}/src/model/Entity.ts.ejs`,
		meta,
		`${out}/src/model/${meta.table.camelName}.ts`
	);
}

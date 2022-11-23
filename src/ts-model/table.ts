import { render } from 'gdut-generate';

import { TableInfo } from '../config';
import { MkDir, Warn } from '../lib/common';
import { Options, Register } from '../proc/common';
import { CollectEnumImports } from './enum';

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
			const enumImports = CollectEnumImports(table);

			await GenerateTable(reg, options, project, {
				enumImports,
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

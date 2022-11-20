import { TableInfo } from '../config';
import { render } from 'gdut-generate';
import { MkDir } from '../lib/common';
import { Options, Register } from '../proc/common';
import { EnumSet } from './enum';

export async function GenerateMap(
	reg: Register,
	options: Options,
	project: string,
	tables: TableInfo[],
	groups: any,
	enums: EnumSet
) {
	const out = options.directory;
	const meta = { options, tables, project, groups, reg, enums };

	if (options.hints.includes('map')) {
		const mapDir = `${out}/src/main/kotlin/${options.packagePath}/map`;
		await MkDir(mapDir);

		for (const table of tables) {
			await GenerateTableMap(reg, options, mapDir, {
				table,
				...meta,
			});
		}
	}
}

async function GenerateTableMap(
	reg: Register,
	options: Options,
	mapDir: string,
	meta: any
) {
	const prjPath = 'src/main/kotlin/demo';

	await render(
		reg,
		`/${prjPath}/map/Map.kt.ejs`,
		meta,
		`${mapDir}/${meta.table.camelName}Map.kt`,
		options
	);
}

import { TableInfo } from './../config';
import { render } from 'gdut-generate';
import { MkDir, Warn } from '../lib/common';
import { Options, Register } from '../proc/common';

export async function GenerateGroups(
	reg: Register,
	options: Options,
	tables: TableInfo[],
	project: string,
	groups: any
) {
	const prjPath = 'src/main/kotlin/demo';

	const groupPath = `${options.directory}/src/main/kotlin/${options.packagePath}/group`;
	await MkDir(groupPath);

	for (const groupName of Object.keys(groups)) {
		const group = groups[groupName];

		const meta = { group, tables, options, project };

		await render(
			reg,
			`/${prjPath}/group/Group.kt.ejs`,
			meta,
			`${groupPath}/${meta.group.camelName}.kt`,
			options
		);

		const subCols = tables
			.map((table, idx) =>
				table.columns
					.filter(
						(el) =>
							el.type.startsWith('relation.many') &&
							typeof el.relation !== 'string' &&
							table.name === el.relation.owner &&
							el.relation.nested &&
							el.relation.groupNames.includes(group.name)
					)
					.map((column) => ({
						table,
						column,
					}))
			)
			.flat();

		const unique = (value: string, index: number, self: string[]) =>
			self.indexOf(value) === index;

		const subTypes = subCols.map((el) => el.table.camelName).filter(unique);

		await render(
			reg,
			`/${prjPath}/group/GroupValidator.kt.ejs`,
			{ ...meta, subCols, subTypes },
			`${groupPath}/${meta.group.camelName}Validator.kt`,
			options
		);

		await render(
			reg,
			`/${prjPath}/group/EventHandler.kt.ejs`,
			{ ...meta, table: group },
			`${groupPath}/${meta.group.camelName}EventHandler.kt`,
			options
		);
	}
}

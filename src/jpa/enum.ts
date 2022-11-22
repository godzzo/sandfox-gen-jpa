import { ColumnInfo, TableInfo } from '../config';
import { render } from 'gdut-generate';
import { MkDir, Warn } from '../lib/common';
import { Options, Register } from '../proc/common';

type EnumInfo = {
	name: string;
	type: string;
	values: string[];
};

export type EnumSet = { [key: string]: EnumInfo };

export async function GenerateEnums(
	reg: Register,
	options: Options,
	tables: TableInfo[],
	project: string
) {
	const enums = tables.flatMap((table) => {
		return table.columns
			.filter((column) => column.type.startsWith('enum.'))
			.map((column) => {
				// const name = column.type.replace(/enum(.ord.|.str.|.)/, '');

				const name = column.ktType;
				const type = column.type.startsWith('enum.ord')
					? 'ORDINAL'
					: 'STRING';

				const values = ParseValues(column);

				return { name, type, values };
			});
	});

	console.log(' >>> enums', JSON.stringify(enums, null, 4));

	const enumSet: EnumSet = enums
		.map((en) => {
			const values = [
				...new Set(
					enums
						.filter((el) => el.name === en.name)
						.flatMap((el) => el.values)
				),
			];
			let ctor = '';

			if (values.length > 0 && values[0].includes('(')) {
				const isStr = values[0].includes('"');

				ctor = isStr ? '(val value: String)' : '(val value: Int)';
			}

			return { ...en, ctor, values };
		})
		.reduce((prev: EnumSet, el) => ({ ...prev, [el.name]: el }), {});

	console.log(' >>> enumSet', JSON.stringify(enumSet, null, 4));

	for (const name of Object.keys(enumSet)) {
		const info = enumSet[name];

		await GenerateEnum(info, reg, options, project);
	}

	return enumSet;
}

function ParseValues(column: ColumnInfo): string[] {
	return column.options
		.filter((el) => el.startsWith('values:'))
		.flatMap((el) => el.replace(/^values:/g, '').split(';'));
}

async function GenerateEnum(
	info: EnumInfo,
	reg: Register,
	options: Options,
	project: string
) {
	const prjPath = 'src/main/kotlin/demo';

	const enumPath = `${options.directory}/src/main/kotlin/${options.packagePath}/enum`;
	await MkDir(enumPath);

	console.log('GenerateEnum', JSON.stringify(info, null, 4));

	await render(
		reg,
		`/${prjPath}/enum/Base.kt.ejs`,
		{ info, options, project },
		`${enumPath}/${info.name}.kt`,
		options
	);
}

import { ColumnInfo, TableInfo } from '../config';

export type EnumInfo = {
	name: string;
	type: string;
	values: string[];
};

export type EnumSet = { [key: string]: EnumInfo };

export function CollectEnums(tables: TableInfo[]) {
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

	// console.log(' >>> enums', JSON.stringify(enums, null, 4));

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

	return enumSet;
}

function ParseValues(column: ColumnInfo): string[] {
	return column.options
		.filter((el) => el.startsWith('values:'))
		.flatMap((el) => el.replace(/^values:/g, '').split(';'));
}

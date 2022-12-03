import { render } from 'gdut-generate';

import { TableInfo } from '../config';
import { MkDir } from '../lib/common';
import { Options, Register } from '../proc/common';
import { EnumInfo, EnumSet } from '../data/enum';

export async function GenerateEnums(
	reg: Register,
	options: Options,
	enums: EnumSet,
	project: string
) {
	const out = options.directory;

	await MkDir(`${out}/src/data/model/enum`);

	for (const name of Object.keys(enums)) {
		const info = enums[name];

		await GenerateEnum(info, reg, options, project);
	}

	await GenerateEnumsTs(enums, reg, options, project);
}

export function CollectEnumImports(table: TableInfo) {
	const enums = new Set();

	return table.columns
		.filter((column) => column.type.startsWith('enum.'))
		.filter((column) => {
			if (enums.has(column.ktType)) {
				return false;
			} else {
				enums.add(column.ktType);
				return true;
			}
		})
		.map((e) => `import { ${e.ktType} } from './enum/${e.ktType}';`);
}

async function GenerateEnum(
	info: EnumInfo,
	reg: Register,
	options: Options,
	project: string
) {
	// console.log('GenerateEnum', JSON.stringify(info, null, 4));

	const out = options.directory;

	const values = info.values.map((v) => {
		if (v.includes('(')) {
			return v.replace('(', ' = ').replace(')', '');
		} else {
			return v;
		}
	});

	await render(
		reg,
		`/src/data/model/Enum.ts.ejs`,
		{ info, values, options, project },
		`${out}/src/data/model/enum/${info.name}.ts`,
		options
	);
}

async function GenerateEnumsTs(
	enums: EnumSet,
	reg: Register,
	options: Options,
	project: string
) {
	// console.log('GenerateEnum', JSON.stringify(info, null, 4));

	const out = options.directory;

	const names = Object.keys(enums);

	const imports = names
		.map((e) => enums[e])
		.map((e) => `import { ${e.name} } from './${e.name}';`);

	await render(
		reg,
		`/src/data/model/enums.ts.ejs`,
		{ imports, names, options, project },
		`${out}/src/data/model/enum/enums.ts`,
		options
	);
}

import { render } from 'gdut-generate';

import { TableInfo } from '../config';
import { MkDir } from '../lib/common';
import { Options, Register } from '../proc/common';
import { CollectEnums, EnumInfo } from '../data/enum';

export async function GenerateEnums(
	reg: Register,
	options: Options,
	tables: TableInfo[],
	project: string
) {
	const enumSet = CollectEnums(tables);

	// console.log(' >>> enumSet', JSON.stringify(enumSet, null, 4));

	for (const name of Object.keys(enumSet)) {
		const info = enumSet[name];

		await GenerateEnum(info, reg, options, project);
	}

	return enumSet;
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

	// console.log('GenerateEnum', JSON.stringify(info, null, 4));

	await render(
		reg,
		`/${prjPath}/enum/Base.kt.ejs`,
		{ info, options, project },
		`${enumPath}/${info.name}.kt`,
		options
	);
}

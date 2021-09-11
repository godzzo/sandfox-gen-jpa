import { render } from '../lib/generate';
import { MkDir, Warn } from '../lib/common';
import { Options, Register } from '../proc/common';

export async function GenerateGroups(
	reg: Register,
	options: Options,
	tables: any[],
	project: string,
	groups: any
) {
	const prjPath = 'src/main/kotlin/demo';

	const groupPath = `${options.directory}/src/main/kotlin/${options.packagePath}/group`;
	await MkDir(groupPath);

	for (const groupName of Object.keys(groups)) {
		const group = groups[groupName];

		const meta = { group, options, project };

		await render(
			reg,
			`/${prjPath}/group/Group.kt.ejs`,
			meta,
			`${groupPath}/${meta.group.camelName}.kt`,
			options
		);

		await render(
			reg,
			`/${prjPath}/group/GroupValidator.kt.ejs`,
			meta,
			`${groupPath}/${meta.group.camelName}Validator.kt`,
			options
		);
	}
}

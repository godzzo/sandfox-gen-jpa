import { render } from '../lib/generate';
import { MkDir, Warn } from '../lib/common';
import { Register } from '../proc/common';

export async function GenerateGroups(
	reg: Register,
	options: any,
	tables: any[],
	project: string,
	groups: any
) {
	const prjPath = 'src/main/kotlin/demo';

	const groupPath = `${options.directory}/src/main/kotlin/${options.packagePath}/group`;
	await MkDir(groupPath);

	for (const groupName in groups) {
		const group = groups[groupName];

		const meta = { group, options, project };

		await render(
			reg,
			`${options.tmpl}/${prjPath}/group/Group.kt.ejs`,
			meta,
			`${groupPath}/${meta.group.camelName}.kt`
		);

		await render(
			reg,
			`${options.tmpl}/${prjPath}/group/GroupValidator.kt.ejs`,
			meta,
			`${groupPath}/${meta.group.camelName}Validator.kt`
		);
	}
}

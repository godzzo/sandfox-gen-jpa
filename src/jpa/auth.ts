import { TableInfo } from '../config';
import { render } from '../lib/generate';
import { MkDir } from '../lib/common';
import { Options, Register } from '../proc/common';

export async function GenerateAuthentication(
	reg: Register,
	options: Options,
	project: string,
	tables: TableInfo[],
	groups: any
) {
	const out = options.directory;
	const meta = { options, tables, project, groups, reg };

	if (options.hints.includes('auth')) {
		await render(
			reg,
			`/src/main/kotlin/demo/SecurityConfiguration.kt.ejs`,
			meta,
			`${out}/src/main/kotlin/${options.packagePath}/SecurityConfiguration.kt`,
			options
		);

		const serviceDir = `${out}/src/main/kotlin/${options.packagePath}/service`;
		await MkDir(serviceDir);
		await render(
			reg,
			`/src/main/kotlin/demo/service/UserDetailsServiceImpl.kt.ejs`,
			meta,
			`${serviceDir}/UserDetailsServiceImpl.kt`,
			options
		);

		const mapDir = `${out}/src/main/kotlin/${options.packagePath}/map`;
		await MkDir(mapDir);
		await render(
			reg,
			`/src/main/kotlin/demo/map/AuthUserDetails.kt.ejs`,
			meta,
			`${mapDir}/AuthUserDetails.kt`,
			options
		);
	}
}

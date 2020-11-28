import { render } from '../generate';
import { MkDir } from '../common';
import { Register } from '../proc/common';

export async function GenerateAuthentication(
	reg: Register,
	options: any,
	project: string,
	tables: any,
	groups: any
) {
	const tmpl = options.tmpl;
	const out = options.directory;
	const meta = { options, tables, project, groups, reg };

	if (options.hints.includes('auth')) {
		await render(
			reg,
			`${tmpl}/src/main/kotlin/demo/SecurityConfiguration.kt.ejs`,
			meta,
			`${out}/src/main/kotlin/${options.packagePath}/SecurityConfiguration.kt`
		);

		const serviceDir = `${out}/src/main/kotlin/${options.packagePath}/service`;
		await MkDir(serviceDir);
		await render(
			reg,
			`${tmpl}/src/main/kotlin/demo/service/UserDetailsServiceImpl.kt.ejs`,
			meta,
			`${serviceDir}/UserDetailsServiceImpl.kt`
		);

		const mapDir = `${out}/src/main/kotlin/${options.packagePath}/map`;
		await MkDir(mapDir);
		await render(
			reg,
			`${tmpl}/src/main/kotlin/demo/map/AuthUserDetails.kt.ejs`,
			meta,
			`${mapDir}/AuthUserDetails.kt`
		);
	}
}

import { render } from 'gdut-generate';

import { TableInfo } from '../config';
import { Options, Register } from '../proc/common';
import { MkDir } from '../lib/common';
import { hasColumn, hasTable } from '../lib/config.utils';

export async function GenerateAuthentication(
	reg: Register,
	options: Options,
	project: string,
	tables: TableInfo[],
	groups: any
) {
	const out = options.directory;
	const meta = {
		options,
		tables,
		project,
		groups,
		reg,

		hasNick: false,
		hasRoles: false,
	};

	if (options.hints.includes('auth')) {
		meta.hasNick = hasNick(tables);
		meta.hasRoles = hasTable(tables, 'user_role');

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

function hasNick(tables: TableInfo[]) {
	return hasColumn(tables, 'user', 'nick');
}

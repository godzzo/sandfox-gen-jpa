import { TableInfo } from '../config';
import { render } from '../lib/generate';
import { MkDir } from '../lib/common';
import { Options, Register } from '../proc/common';

export async function GenerateHibernate(
	reg: Register,
	options: Options,
	project: string,
	tables: TableInfo[],
	groups: any
) {
	const out = options.directory;
	const meta = { options, tables, project, groups, reg };
	const prjPath = 'src/main/kotlin/demo';

	if (options.hints.includes('hibernate-interceptor')) {
		await render(
			reg,
			`/${prjPath}/HibernatePropertiesConfiguration.kt.ejs`,
			meta,
			`${out}/src/main/kotlin/${options.packagePath}/HibernatePropertiesConfiguration.kt`,
			options
		);

		const entitylistenerPath = `${options.directory}/src/main/kotlin/${options.packagePath}/entitylistener`;
		await MkDir(entitylistenerPath);

		await render(
			reg,
			`/${prjPath}/entitylistener/IEntityListener.kt.ejs`,
			meta,
			`${entitylistenerPath}/EntityListener.kt`,
			options
		);

		const filterPath = `${out}/src/main/kotlin/${options.packagePath}/filter`;
		await MkDir(filterPath);

		await render(
			reg,
			`/${prjPath}/filter/HibernateSessionEventInterceptor.kt.ejs`,
			meta,
			`${filterPath}/HibernateSessionEventInterceptor.kt`,
			options
		);
	}
}

import { TableInfo } from '../config';
import { render } from '../lib/generate';
import { MkDir } from '../lib/common';
import { Options, Register } from '../proc/common';

export async function GenerateWebHandler(
	reg: Register,
	options: Options,
	project: string,
	tables: TableInfo[],
	groups: any
) {
	const tmpl = options.tmpl;
	const out = options.directory;
	const meta = { options, tables, project, groups, reg };
	const prjPath = 'src/main/kotlin/demo';

	if (options.hints.includes('web-handler')) {
		await render(
			reg,
			`${tmpl}/${prjPath}/WebMvcConfig.kt.ejs`,
			meta,
			`${out}/src/main/kotlin/${options.packagePath}/WebMvcConfig.kt`
		);

		const filterPath = `${out}/src/main/kotlin/${options.packagePath}/filter`;
		await MkDir(filterPath);

		await render(
			reg,
			`${tmpl}/${prjPath}/filter/WebHandlerInterceptor.kt.ejs`,
			meta,
			`${filterPath}/WebHandlerInterceptor.kt`
		);

		const controllerPath = `${out}/src/main/kotlin/${options.packagePath}/controller`;
		await MkDir(controllerPath);

		await render(
			reg,
			`${tmpl}/${prjPath}/controller/RestRuntimeExceptionHandler.kt.ejs`,
			meta,
			`${controllerPath}/RestRuntimeExceptionHandler.kt`
		);
	}
}

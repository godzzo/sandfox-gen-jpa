import { TableInfo } from '../config';
import { render } from '../lib/generate';
import { MkDir, Warn } from '../lib/common';
import { Options, Register } from '../proc/common';

export async function GenerateTables(
	reg: Register,
	options: Options,
	tables: TableInfo[],
	project: string
) {
	for (const table of tables) {
		if (table.primary) {
			await GenerateTable(reg, options, project, {
				table,
				options,
				project,
			});
		} else {
			Warn(`Could not generate without primary: ${table.name}`);
		}
	}
}

async function GenerateTable(
	reg: Register,
	options: Options,
	project: string,
	meta: any
) {
	const prjPath = 'src/main/kotlin/demo';

	const domainPath = `${options.directory}/src/main/kotlin/${options.packagePath}/domain`;
	await MkDir(domainPath);

	await render(
		reg,
		`${options.tmpl}/${prjPath}/domain/Entity.kt.ejs`,
		meta,
		`${domainPath}/${meta.table.camelName}.kt`
	);

	const controllerPath = `${options.directory}/src/main/kotlin/${options.packagePath}/controller`;
	await MkDir(controllerPath);

	await render(
		reg,
		`${options.tmpl}/${prjPath}/controller/FilterController.kt.ejs`,
		meta,
		`${controllerPath}/${meta.table.camelName}FilterController.kt`
	);

	const servicePath = `${options.directory}/src/main/kotlin/${options.packagePath}/service`;
	await MkDir(servicePath);

	await render(
		reg,
		`${options.tmpl}/${prjPath}/service/FilterService.kt.ejs`,
		meta,
		`${servicePath}/${meta.table.camelName}FilterService.kt`
	);

	const repoPath = `${options.directory}/src/main/kotlin/${options.packagePath}/repository`;
	await MkDir(repoPath);

	// if (meta.table.menu && meta.table.menu == 'yes') {
	await render(
		reg,
		`${options.tmpl}/${prjPath}/repository/Repository.kt.ejs`,
		meta,
		`${repoPath}/${meta.table.camelName}Repository.kt`
	);
	// }

	await GenerateEvents(reg, options, project, meta, prjPath);
	await GenerateProjections(reg, options, project, meta, prjPath);
	await GenerateTests(reg, options, project, meta);
	await GenerateXls(reg, options, project, meta, prjPath);
}

async function GenerateEvents(
	reg: Register,
	options: Options,
	project: string,
	meta: any,
	prjPath: string
) {
	const entitylistenerPath = `${options.directory}/src/main/kotlin/${options.packagePath}/entitylistener`;
	await MkDir(entitylistenerPath);

	await render(
		reg,
		`${options.tmpl}/${prjPath}/entitylistener/EntityListener.kt.ejs`,
		meta,
		`${entitylistenerPath}/${meta.table.camelName}EntityListener.kt`
	);

	const eventhandlerPath = `${options.directory}/src/main/kotlin/${options.packagePath}/eventhandler`;
	await MkDir(eventhandlerPath);

	await render(
		reg,
		`${options.tmpl}/${prjPath}/eventhandler/EventHandler.kt.ejs`,
		meta,
		`${eventhandlerPath}/${meta.table.camelName}EventHandler.kt`
	);
}

async function GenerateProjections(
	reg: Register,
	options: Options,
	project: string,
	meta: any,
	prjPath: string
) {
	const projPath = `${options.directory}/src/main/kotlin/${options.packagePath}/projection`;
	await MkDir(projPath);

	meta.extraNameTag = '';
	meta.generateGenerateOne = true;
	meta.generateGenerateMany = false;
	await render(
		reg,
		`${options.tmpl}/${prjPath}/projection/Projection.kt.ejs`,
		meta,
		`${projPath}/${meta.table.camelName}Projection.kt`
	);

	meta.extraNameTag = 'Base';
	meta.generateGenerateOne = false;
	meta.generateGenerateMany = false;
	await render(
		reg,
		`${options.tmpl}/${prjPath}/projection/Projection.kt.ejs`,
		meta,
		`${projPath}/${meta.table.camelName}BaseProjection.kt`
	);

	if (meta.table.audit) {
		meta.extraNameTag = 'Revision';
		meta.generateGenerateOne = true;
		meta.generateGenerateMany = true;
		await render(
			reg,
			`${options.tmpl}/${prjPath}/projection/Projection.kt.ejs`,
			meta,
			`${projPath}/${meta.table.camelName}RevisionProjection.kt`
		);
	}
}

async function GenerateTests(
	reg: Register,
	options: Options,
	project: string,
	meta: any
) {
	const tprjPath = 'src/test/kotlin/demo';

	const trepoPath = `${options.directory}/src/test/kotlin/${options.packagePath}/repository`;
	await MkDir(trepoPath);

	await render(
		reg,
		`${options.tmpl}/${tprjPath}/repository/TestRepository.kt.ejs`,
		meta,
		`${trepoPath}/Test${meta.table.camelName}Repository.kt`
	);

	const tctrlPath = `${options.directory}/src/test/kotlin/${options.packagePath}/controller`;
	await MkDir(tctrlPath);

	await render(
		reg,
		`${options.tmpl}/${tprjPath}/controller/TestFilterController.kt.ejs`,
		meta,
		`${tctrlPath}/TestFilter${meta.table.camelName}Controller.kt`
	);
}

async function GenerateXls(
	reg: Register,
	options: Options,
	project: string,
	meta: any,
	prjPath: string
) {
	if (options.hints.includes('excel')) {
		const controllerPath = `${options.directory}/src/main/kotlin/${options.packagePath}/controller`;

		await render(
			reg,
			`${options.tmpl}/${prjPath}/controller/XlsController.kt.ejs`,
			meta,
			`${controllerPath}/${meta.table.camelName}XlsController.kt`
		);

		const servicePath = `${options.directory}/src/main/kotlin/${options.packagePath}/service`;

		await render(
			reg,
			`${options.tmpl}/${prjPath}/service/XlsService.kt.ejs`,
			meta,
			`${servicePath}/${meta.table.camelName}XlsService.kt`
		);

		const generatorPath = `${options.directory}/src/main/kotlin/${options.packagePath}/generator`;
		await MkDir(generatorPath);

		await render(
			reg,
			`${options.tmpl}/${prjPath}/generator/XlsGenerator.kt.ejs`,
			meta,
			`${generatorPath}/${meta.table.camelName}XlsGenerator.kt`
		);
	}
}

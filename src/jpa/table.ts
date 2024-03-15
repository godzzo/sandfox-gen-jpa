import { TableInfo } from '../config';
import { render } from 'gdut-generate';
import { MkDir, Warn } from '../lib/common';
import { Options, Register } from '../proc/common';
import { EnumSet } from '../data/enum';
import { parseColumnsForAnnotation, parseUniques } from './annotation';

export async function GenerateTables(
	reg: Register,
	options: Options,
	tables: TableInfo[],
	project: string,
	enums: EnumSet
) {
	for (const table of tables) {
		if (table.primary) {
			await GenerateTable(table, reg, options, project, {
				table,
				tables,
				options,
				project,
				enums,
			});
		} else {
			Warn(`Could not generate without primary: ${table.name}`);
		}
	}
}

async function GenerateTable(
	table: TableInfo,
	reg: Register,
	options: Options,
	project: string,
	meta: any
) {
	const prjPath = 'src/main/kotlin/demo';

	const domainPath = `${options.directory}/src/main/kotlin/${options.packagePath}/domain`;
	await MkDir(domainPath);

	meta.columnAnnotations = parseColumnsForAnnotation(table);
	meta.uniques = parseUniques(table);

	await render(
		reg,
		`/${prjPath}/domain/Entity.kt.ejs`,
		meta,
		`${domainPath}/${meta.table.camelName}.kt`,
		options
	);

	const controllerPath = `${options.directory}/src/main/kotlin/${options.packagePath}/controller`;
	await MkDir(controllerPath);

	await render(
		reg,
		`/${prjPath}/controller/FilterController.kt.ejs`,
		meta,
		`${controllerPath}/filter/${meta.table.camelName}FilterController.kt`,
		options
	);

	await render(
		reg,
		`/${prjPath}/controller/BatchController.kt.ejs`,
		meta,
		`${controllerPath}/batch/${meta.table.camelName}BatchController.kt`,
		options
	);

	const servicePath = `${options.directory}/src/main/kotlin/${options.packagePath}/service`;
	await MkDir(servicePath);

	await render(
		reg,
		`/${prjPath}/service/FilterService.kt.ejs`,
		meta,
		`${servicePath}/filter/${meta.table.camelName}FilterService.kt`,
		options
	);

	const repoPath = `${options.directory}/src/main/kotlin/${options.packagePath}/repository`;
	await MkDir(repoPath);

	// if (meta.table.menu && meta.table.menu == 'yes') {
	await render(
		reg,
		`/${prjPath}/repository/Repository.kt.ejs`,
		meta,
		`${repoPath}/${meta.table.camelName}Repository.kt`,
		options
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
		`/${prjPath}/entitylistener/EntityListener.kt.ejs`,
		meta,
		`${entitylistenerPath}/${meta.table.camelName}EntityListener.kt`,
		options
	);

	const eventhandlerPath = `${options.directory}/src/main/kotlin/${options.packagePath}/eventhandler`;
	await MkDir(eventhandlerPath);

	await render(
		reg,
		`/${prjPath}/eventhandler/EventHandler.kt.ejs`,
		meta,
		`${eventhandlerPath}/${meta.table.camelName}EventHandler.kt`,
		options
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
	await render(
		reg,
		`/${prjPath}/projection/Projection.kt.ejs`,
		meta,
		`${projPath}/${meta.table.camelName}Projection.kt`,
		options
	);

	meta.extraNameTag = 'Base';
	await render(
		reg,
		`/${prjPath}/projection/Projection.kt.ejs`,
		meta,
		`${projPath}/${meta.table.camelName}BaseProjection.kt`,
		options
	);

	if (meta.table.audit) {
		meta.extraNameTag = 'Revision';
		await render(
			reg,
			`/${prjPath}/projection/Projection.kt.ejs`,
			meta,
			`${projPath}/${meta.table.camelName}RevisionProjection.kt`,
			options
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
		`/${tprjPath}/repository/TestRepository.kt.ejs`,
		meta,
		`${trepoPath}/Test${meta.table.camelName}Repository.kt`,
		options
	);

	const tctrlPath = `${options.directory}/src/test/kotlin/${options.packagePath}/controller`;
	await MkDir(tctrlPath);

	await render(
		reg,
		`/${tprjPath}/controller/TestFilterController.kt.ejs`,
		meta,
		`${tctrlPath}/TestFilter${meta.table.camelName}Controller.kt`,
		options
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
			`/${prjPath}/controller/XlsController.kt.ejs`,
			meta,
			`${controllerPath}/xls/${meta.table.camelName}XlsController.kt`,
			options
		);

		const servicePath = `${options.directory}/src/main/kotlin/${options.packagePath}/service`;

		await render(
			reg,
			`/${prjPath}/service/XlsService.kt.ejs`,
			meta,
			`${servicePath}/xls/${meta.table.camelName}XlsService.kt`,
			options
		);

		const generatorPath = `${options.directory}/src/main/kotlin/${options.packagePath}/generator`;
		await MkDir(generatorPath);

		await render(
			reg,
			`/${prjPath}/generator/XlsGenerator.kt.ejs`,
			meta,
			`${generatorPath}/${meta.table.camelName}XlsGenerator.kt`,
			options
		);
	}
}

import { render } from '../lib/generate';
import { MkDir, Warn } from '../lib/common';
import { Options, Register } from '../proc/common';

export async function GenerateTables(
	reg: Register,
	options: Options,
	tables: any[],
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
	// console.log("GENERATE TABLE: ", JSON.stringify(meta, null, 4));

	/*
./src/test/kotlin/org/godzzo/sb/sbkvscone/repository/TestUserRepository.kt	GEN
	*/

	const prjPath = 'src/main/kotlin/demo';
	const tprjPath = 'src/test/kotlin/demo';

	const domainPath = `${options.directory}/src/main/kotlin/${options.packagePath}/domain`;
	await MkDir(domainPath);

	await render(
		reg,
		`${options.tmpl}/${prjPath}/domain/Entity.kt.ejs`,
		meta,
		`${domainPath}/${meta.table.camelName}.kt`
	);

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

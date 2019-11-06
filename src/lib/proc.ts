import util = require("util");
import fs = require("fs");

import { SetNames, SetColumnAnnotation, render } from "./generate";
import { CopyFile, MkDir } from "./common";


export async function ProcGenerate(options: string, project: string, tables: Array<any>, data: Array<any>) {
	await GenerateProject(options, project, tables);

	await ParseTables(options, project, tables, data);
}

async function ParseTables(options: string, project: string, tables: Array<any>, data: Array<any>) {
	for (const idx in  tables)	{
		const table = tables[idx];
		const columns = data[table.pos - 1];

		SetNames(table);

		columns.forEach(SetNames);

		columns.forEach((column: any) => {
			column.annotations = SetColumnAnnotation(column);
			column.ktType = column.type;
		});

		table.columns = columns;

		await Generate(options, project, {table, options, project});
	};
}

async function GenerateProject(options: any, project: string, meta: any) {
	options.tmpl = `${options.foxPath}/templates/project`;
	options.packagePath = options.package.replace(/\./g, '/');

	const tmpl = options.tmpl;
	const out = options.directory;

	await CopyFile(`${tmpl}/gradlew`, `${out}/gradlew`);	
	await CopyFile(`${tmpl}/gradlew.bat`, `${out}/gradlew.bat`);	
	await CopyFile(`${tmpl}/README.md`, `${out}/README.md`);	
	await CopyFile(`${tmpl}/.gitignore`, `${out}/.gitignore`);	

	await render(`${tmpl}/build.gradle.kts.ejs`, options, `${out}/build.gradle.kts`);
	await render(`${tmpl}/settings.gradle.kts.ejs`, options, `${out}/settings.gradle.kts`);

	await MkDir(`${out}/gradle/wrapper`);
	await CopyFile(`${tmpl}/gradle/wrapper/gradle-wrapper.jar`, `${out}/gradle/wrapper/gradle-wrapper.jar`);	
	await CopyFile(`${tmpl}/gradle/wrapper/gradle-wrapper.properties`, `${out}/gradle/wrapper/gradle-wrapper.properties`);	

	await MkDir(`${out}/src/main/resources`);
	await render(`${tmpl}/src/main/resources/application.properties.ejs`
		, options, `${out}/src/main/resources/application.properties`);
	await MkDir(`${out}/src/main/kotlin/${options.packagePath}`);
	await render(`${tmpl}/src/main/kotlin/demo/Application.kt.ejs`
		, options, `${out}/src/main/kotlin/${options.packagePath}/Application.kt`);
	await MkDir(`${out}/src/test/kotlin/${options.packagePath}`);
	await render(`${tmpl}/src/test/kotlin/demo/ApplicationTests.kt.ejs`
		, options, `${out}/src/test/kotlin/${options.packagePath}/ApplicationTests.kt`);
}

async function Generate(options: any, project: string, meta: any) {
	console.log("GENERATE TABLE: ", JSON.stringify(meta, null, 4));

	/*
./src/test/kotlin/org/godzzo/sb/sbkvscone/repository/TestUserRepository.kt	GEN
	*/

	const domainPath = `${options.directory}/src/main/kotlin/${options.packagePath}/domain`;
	await MkDir(domainPath);
	
	await render(
		`${options.tmpl}/src/main/kotlin/demo/domain/Entity.kt.ejs`, 
		meta, 
		`${domainPath}/${meta.table.camelName}.kt`
	);

	const repoPath = `${options.directory}/src/main/kotlin/${options.packagePath}/repository`;
	await MkDir(repoPath);
	
	if (meta.table.menu && meta.table.menu == 'yes') {
		await render(
			`${options.tmpl}/src/main/kotlin/demo/repository/Repository.kt.ejs`, 
			meta, 
			`${repoPath}/${meta.table.camelName}Repository.kt`
		);
	}
}

async function GenerateBackEnd(project: string, meta: any) {
	const mkdir = util.promisify(fs.mkdir);

	try {
		const outDir = `out/${project}/backend/${meta.table.name}`;
		await mkdir(outDir, {recursive: true});

		render('templates/backend/controller.ts.ejs', meta, `${outDir}/${meta.table.periodName}.controller.ts`);
		render('templates/backend/entity.ts.ejs', meta, `${outDir}/${meta.table.periodName}.entity.ts`);
		render('templates/backend/module.ts.ejs', meta, `${outDir}/${meta.table.periodName}.module.ts`);
		render('templates/backend/service.ts.ejs', meta, `${outDir}/${meta.table.periodName}.service.ts`);
	} catch(error) {
		console.log(error);
	}
}

async function GenerateFrontEnd(project: string, meta: any) {
	const mkdir = util.promisify(fs.mkdir);

	try {
		const outDir = `out/${project}/frontend/${meta.table.name}`;
		await mkdir(outDir, {recursive: true});

		render('templates/frontend/component.html.ejs', meta, `${outDir}/${meta.table.periodName}.component.html`);
		render('templates/frontend/component.scss.ejs', meta, `${outDir}/${meta.table.periodName}.component.scss`);
		render('templates/frontend/component.ts.ejs', meta, `${outDir}/${meta.table.periodName}.component.ts`);
		render('templates/frontend/model.ts.ejs', meta, `${outDir}/${meta.table.periodName}.model.ts`);
		render('templates/frontend/service.ts.ejs', meta, `${outDir}/${meta.table.periodName}.service.ts`);
	} catch(error) {
		console.log(error);
	}
}
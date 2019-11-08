import { SetNames, SetColumnAnnotation, render } from "./generate";
import { CopyFile, MkDir, Warn } from "./common";


export async function ProcGenerate(options: string, project: string, tables: Array<any>, data: Array<any>) {
	await GenerateProject(options, project, tables);

	await ParseTables(options, project, tables, data);
}

async function ParseTables(options: string, project: string, tables: Array<any>, data: Array<any>) {
	tables.forEach((table: any) => {
		let columns = null;

		if (table.pos == 0) {
			columns = data[0].filter((row: any) => row.table == table.name);
		} else {
			columns = data[table.pos - 1];
		}

		SetNames(table);

		columns.forEach(SetNames);

		columns.forEach((column: any) => {
			column.annotations = SetColumnAnnotation(column);
			column.ktType = column.kttype;
			
			if (column.type == 'primary') {
				table.primary = column;
			}
		});

		if (!table.primary) {
			Warn(`Table not has primary ${table.name}!`);
		}

		table.columns = columns;
	});

	tables.forEach((table: any) => {
		table.columns.forEach((column: any) => {
			if (column.type.startsWith('relation') ) {
				const relName = column.type.split('.')[2];
				const relTable = tables.find(table => table.name == relName);
				
				column.relation = relTable;
			}
		});
	});

	for (const idx in  tables)	{
		const table = tables[idx];

		if (table.primary) {
			await Generate(options, project, {table, options, project});
		} else {
			Warn(`Could not generate without primary: ${table.name}`);
		}
	}
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
	// console.log("GENERATE TABLE: ", JSON.stringify(meta, null, 4));

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

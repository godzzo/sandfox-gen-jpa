import { SetNames, SetColumnAnnotation, render, RegCpFile } from "./generate";
import { MkDir, Warn, Log, WriteJsonFile } from "./common";
import pluralize = require('pluralize');


export type RenderData = {templatePath: string, outputPath: string, model: any, size: number};
export type CopyData = {srcPath: string, destPath: string, size: number};
export type Register = { outPath: string, created: string, renders: RenderData[], copies: CopyData[] };

export async function ProcGenerate(options: string, project: string, tables: Array<any>, data: Array<any>) {
	const register: Register = {
		renders: new Array<RenderData>(),
		copies: new Array<CopyData>(),
		outPath: '',
		created: new Date().toISOString(),
	};

	tables.forEach((table: any) => SetNames(table));

	await GenerateProject(register, options, project, tables);

	await ParseTables(register, options, project, tables, data);

	await WriteJsonFile(`${register.outPath}/config/generateRegister.json`, register);

	return register;
}

async function ParseTables(reg: Register, options: string, project: string, tables: Array<any>, data: Array<any>) {
	const relations: Array<any> = [];

	tables.forEach((table: any) => {
		let columns = null;

		// Handling ALL sheet - all table config in one sheet
		if (table.pos == 0) {
			columns = data[0].filter((row: any) => row.table == table.name);
		} else {
			columns = data[table.pos - 1];
		}

		// SetNames, Primary, Annotations
		PrepareColumns(table, columns);

		if (!table.primary) {
			Warn(`Table not has primary ${table.name}!`);
		}

		table.columns = columns;
	});

	LookRelationTables(relations, tables)

	CheckBidirectionalRelation(relations, tables);

	for (const idx in  tables)	{
		const table = tables[idx];

		if (table.primary) {
			await Generate(reg, options, project, {table, options, project});
		} else {
			Warn(`Could not generate without primary: ${table.name}`);
		}
	}
}

function PrepareColumns(table: any, columns: any) {
	console.log("PrepareColumns: ", JSON.stringify(columns, null, 4));

	columns.forEach(SetNames);

	table.primaries = [];

	columns.forEach((column: any) => {
		column.annotations = SetColumnAnnotation(column);
		column.ktType = column.kttype;
		
		if (column.type.startsWith('primary')) {
			table.primary = column;
			table.primaries.push(column);
		}
	});
}

function LookRelationTables(relations: Array<any>, tables : any) {
	// Lookup for tables whom targeted by relation
	tables.forEach((table: any) => {
		table.columns.forEach((column: any) => {
			if (column.type.startsWith('relation') || column.type.startsWith('primary.')) {
				const relName = column.type.split('.')[2];
				const relType = column.type.split('.')[1];

				const relTable = tables.find((table: any) => table.name == relName);
				
				column.relation = relTable;

				relations.push({
					srcTbl: table,
					srcCol: column,
					trgTbl: relTable,
					trgCol: relTable.columns.find((col: any) => col.type == 'primary'),
					relType
				});
			}
		});
	});
}

function CheckBidirectionalRelation(relations: Array<any>, tables : any) {
	relations.forEach((rel: any) => {
		/*Log(`
${rel.relType}: ${rel.srcTbl.name} >> ${rel.trgTbl.name} // ${rel.srcCol.name}
		`);*/

		if (rel.relType == "one" && `${rel.trgTbl.name}_id` == rel.srcCol.name) {
			const found = relations.find((rf: any) => 
				rf.srcTbl.name == rel.trgTbl.name &&
				rf.trgTbl.name == rel.srcTbl.name &&
				rf.relType == 'many'
			);

			if (!found) {
				const colName = pluralize.plural(
					rel.srcTbl.name
				);

				const newCol: any = {
					name: colName,
					type: `relation.many.${rel.trgTbl.name}`,
					relation: rel.srcTbl
				};

				SetNames(newCol);

				/*
				Warn(`Bidirectional relation not Found!
				rf.srcTbl.name == ${rel.trgTbl.name} &&
				rf.trgTbl.name == ${rel.srcTbl.name} &&
				rf.relType == 'many'
				${colName}
				`);*/

				rel.trgTbl.columns.push(newCol);
			}
		}
	})
}

async function GenerateProject(reg: Register, options: any, project: string, tables: any) {
	options.tmpl = `${options.foxPath}/templates/project`;
	options.packagePath = options.package.replace(/\./g, '/');

	const tmpl = options.tmpl;
	const out = options.directory;

	reg.outPath = out;

	await RegCpFile(reg, `${tmpl}/gradlew`, `${out}/gradlew`);	
	await RegCpFile(reg, `${tmpl}/gradlew.bat`, `${out}/gradlew.bat`);	
	await RegCpFile(reg, `${tmpl}/README.md`, `${out}/README.md`);	
	await RegCpFile(reg, `${tmpl}/.gitignore`, `${out}/.gitignore`);	

	await render(reg, `${tmpl}/build.gradle.kts.ejs`, options, `${out}/build.gradle.kts`);
	await render(reg, `${tmpl}/settings.gradle.kts.ejs`, options, `${out}/settings.gradle.kts`);

	await MkDir(`${out}/gradle/wrapper`);
	await RegCpFile(reg, `${tmpl}/gradle/wrapper/gradle-wrapper.jar`, `${out}/gradle/wrapper/gradle-wrapper.jar`);	
	await RegCpFile(reg, `${tmpl}/gradle/wrapper/gradle-wrapper.properties`, `${out}/gradle/wrapper/gradle-wrapper.properties`);	

	await MkDir(`${out}/src/main/resources`);
	await render(reg, `${tmpl}/src/main/resources/application.properties.ejs`
		, options, `${out}/src/main/resources/application.properties`);

	await MkDir(`${out}/src/main/kotlin/${options.packagePath}`);
	await render(reg, `${tmpl}/src/main/kotlin/demo/Application.kt.ejs`
		, options, `${out}/src/main/kotlin/${options.packagePath}/Application.kt`);
	await render(reg, `${tmpl}/src/main/kotlin/demo/SpecConfiguration.kt.ejs`
		, options, `${out}/src/main/kotlin/${options.packagePath}/SpecConfiguration.kt`);

	await render(reg, `${tmpl}/src/main/kotlin/demo/RepositoryRestCustomization.kt.ejs`
		, {options, tables}, `${out}/src/main/kotlin/${options.packagePath}/RepositoryRestCustomization.kt`);

	await MkDir(`${out}/src/main/kotlin/${options.packagePath}/util`);
	await render(reg, `${tmpl}/src/main/kotlin/demo/util/FilterHelper.kt.ejs`
		, options, `${out}/src/main/kotlin/${options.packagePath}/util/FilterHelper.kt`);
	
	await MkDir(`${out}/src/test/kotlin/${options.packagePath}`);
	await render(reg, `${tmpl}/src/test/kotlin/demo/ApplicationTests.kt.ejs`
		, options, `${out}/src/test/kotlin/${options.packagePath}/ApplicationTests.kt`);

	await MkDir(`${out}/src/test/kotlin/${options.packagePath}/util`);
	await render(reg, `${tmpl}/src/test/kotlin/demo/util/TestPageRequest.kt.ejs`
		, options, `${out}/src/test/kotlin/${options.packagePath}/util/TestPageRequest.kt`);
}

async function Generate(reg: Register, options: any, project: string, meta: any) {
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

	const controllerPath = `${options.directory}/src/main/kotlin/${options.packagePath}/controller`;
	await MkDir(controllerPath);

	await render(
		reg,
		`${options.tmpl}/${prjPath}/controller/FilterController.kt.ejs`, 
		meta, 
		`${controllerPath}/${meta.table.camelName}FilterController.kt`
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

	await render(
		reg,
		`${options.tmpl}/${prjPath}/projection/Projection.kt.ejs`, 
		meta, 
		`${projPath}/${meta.table.camelName}Projection.kt`
	);

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

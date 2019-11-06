import util = require("util");
import fs = require("fs");

import { SetNames, SetColumnDirective, render } from "../lib/generate";


export async function ProcGenerate(project: string, tables: Array<any>, data: Array<any>) {
	await ParseTables(project, tables, data);
}

async function Generate(project: string, meta: any) {
	console.log("GENERATE TABLE: ", JSON.stringify(meta, null, 4));
	
	// await GenerateBackEnd(project, meta);
	// await GenerateFrontEnd(project, meta);
}

async function ParseTables(project: string, tables: Array<any>, data: Array<any>) {
	for (const idx in  tables)	{
		const table = tables[idx];
		const columns = data[table.pos - 1];

		SetNames(table);

		columns.forEach(SetNames);

		columns.forEach((column: any) => {
			column.directiveSettings = SetColumnDirective(column);
			column.tsType = column.type;
		});

		table.columns = columns;

		await Generate(project, {table});
	};
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
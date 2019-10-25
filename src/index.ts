
import util = require("util");
import fs = require("fs");

import { LoadSpreadsheetData } from "./lib/common";
import { SetNames, SetColumnDirective, render } from "./lib/generate";

(async () => {
	try {
		const data = await LoadSpreadsheetData(
			'1A-CnEIWo4YUtYWqw8QZGkfOJzzw0TBXEL1kll3C9nbE',
			"credentials/gd-drive-access-a930341b5052.json"
		);

		console.log(JSON.stringify(data));

		ParseWorkSheets("sample", data);
	} catch (err) {
		console.log(err);
	}
})();

async function generate(project: string, meta: any) {
	await generateBackEnd(project, meta);
	await generateFrontEnd(project, meta);
}

async function generateBackEnd(project: string, meta: any) {
	const mkdir = util.promisify(fs.mkdir);

	try{
		const outDir = `out/${project}/backend/${meta.table.name}`;
		await mkdir(outDir, {recursive: true});

		render('templates/backend/controller.ts.ejs', meta, `${outDir}/${meta.table.periodName}.controller.ts`);
		render('templates/backend/entity.ts.ejs', meta, `${outDir}/${meta.table.periodName}.entity.ts`);
		render('templates/backend/module.ts.ejs', meta, `${outDir}/${meta.table.periodName}.module.ts`);
		render('templates/backend/service.ts.ejs', meta, `${outDir}/${meta.table.periodName}.service.ts`);
	}catch(error){
		console.log(error);
	}
}

async function generateFrontEnd(project: string, meta: any) {
	const mkdir = util.promisify(fs.mkdir);

	try{
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

function ParseWorkSheets(project: string, data: Array<any>) {
	const meta = data.shift();

	meta.forEach((table: any) => {
		const columns = data[table.pos - 1];

		SetNames(table);

		columns.forEach(SetNames);

		columns.forEach((column: any) => {

			column.directiveSettings = SetColumnDirective(column);
			column.tsType = column.type;
		});

		table.columns = columns;

		console.log("TABLE: ", JSON.stringify(table, null, 4));

		generate(project, {table});
	});
}

export const NgModelGen = (name: string) => 'Hello '+name;

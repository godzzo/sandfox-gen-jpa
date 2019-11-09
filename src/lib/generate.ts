import util = require("util");
import fs = require("fs");
import { renderFile } from "ejs";
import pluralize = require('pluralize');
import { Log } from "./common";


export function SetNames(data: any): any {
	const arrWords = data.name.split(/_/g);
	const arrHypen: string[] = [];
	const arrCapital: string[] = [];
	const arrLowerCamel: string[] = [];

	arrWords.forEach((word: string) => {
		const upper = word.charAt(0).toUpperCase() + word.substring(1);

		if (arrLowerCamel.length < 1) {
			arrLowerCamel.push(word);
		} else {
			arrLowerCamel.push(upper);
		}

		arrCapital.push(upper);

		arrHypen.push(word);
	});

	data.camelName = arrCapital.join('');
	data.lowerCamelName = arrLowerCamel.join('');
	data.pluralCamelName = pluralize.plural(data.camelName);
	data.pluralLowerCamelName = pluralize.plural(data.lowerCamelName);
	
	data.hyphenName = arrHypen.join('-');
	data.periodName = arrHypen.join('.');

	return data;
}

export async function render(templatePath: string, model: any, outputPath: string) {
	const writeFile = util.promisify(fs.writeFile);

	// Log(`GENERATE? ${templatePath}\n -- TO: ${outputPath}`);

	try {
		const html = await renderFile(templatePath, model);

 		await writeFile(outputPath, html, "utf8");
	} catch(error) {
		console.log(error);
	}
}

export function SetColumnAnnotation(column: any): string {
	let more = '';

	more += column.length && column.length != 'null' ? `, length=${column.length}`: ''; 
	more += column.needed && column.needed == 'yes' ? `, nullable=false`: ', nullable=true'; 
	more += column.precision? `, precision=${column.precision}`: ''; 
	more += column.scale? `, precision=${column.scale}`: ''; 
 
	return `@Column(name="${column.name}"${more})`;
}

export function SetColumnDirective(column: any): string {
	// {name: "first_name", type: "varchar", length: 200}
	// {name: "last_update", type: "timestamp"}

	const cfg: any = {};

	cfg.name = column.name;

	if (column.columnType) {
		cfg.type = column.columnType
	}

	if (column.length) {
		cfg.length = column.length
	}

	return JSON.stringify(cfg);
}

/*
console.log(SetNames({name: 'hello'}));
console.log(SetNames({name: 'hello_world'}));
console.log(SetNames({name: 'hello_world_how_are_u'}));
*/

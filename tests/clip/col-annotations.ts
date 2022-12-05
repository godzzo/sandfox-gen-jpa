import { CopyData, Register, RenderData } from 'gdut-generate';
import { PrepareData } from '../../src/data/data';
import { parseColumnsForAnnotation } from '../../src/jpa/annotation';
import { ParseCliArgs } from '../../src/lib/cli.args';
import { LogObj } from '../../src/lib/common';
import { LoadMeta } from '../../src/lib/meta';

/**
 * *RUN*: ts-node --project src/tsconfig.json .\tests\clip\col-annotations.ts  --config .\config\sf-enum-digi-kt.json
 */

(async () => {
	const { tables } = await prepareTableInfos();

	// console.log(tables);

	const keywordTable = tables.find((e) => e.camelName === 'Keyword');

	if (keywordTable) {
		const parsed = parseColumnsForAnnotation(keywordTable);

		LogObj(parsed, 'annotation meta');
	} else {
		throw new Error('Keyword table not found!');
	}
})().catch((err) => console.error(err));

function createRegister(): Register {
	return {
		renders: new Array<RenderData>(),
		copies: new Array<CopyData>(),
		outPath: '',
		created: new Date().toISOString(),
	};
}

async function prepareTableInfos() {
	const options = await ParseCliArgs('.', ['./templates']);
	const register = createRegister();
	const groups: any = {};
	const { tables: tableConfigs, data } = await LoadMeta(options);

	const project = options.project;

	const tables = await PrepareData(
		tableConfigs,
		register,
		options,
		options.project,
		data,
		groups
	);

	return { tables, tableConfigs, register, options, data, groups, project };
}

import { SetColumnAnnotation, SetNames } from '../lib/generate';
import { Register } from '../proc/common';
import { Warn } from '../lib/common';
import { AddGroupsForTable } from './group';
import { CheckBidirectionalRelation, LookRelationTables } from './relation';

export async function PrepareData(
	tables: any[],
	register: Register,
	options: string,
	project: string,
	data: any[],
	groups: any
) {
	tables.forEach((table: any) => {
		SetNames(table);

		table.audit = table.audit && table.audit === 'yes';
	});

	await ParseTables(register, options, project, tables, data, groups);
}

async function ParseTables(
	reg: Register,
	options: string,
	project: string,
	tables: any[],
	data: any[],
	groups: any
) {
	const relations: any[] = [];

	tables.forEach((table: any) => {
		let columns = null;

		// Handling ALL sheet - all table config in one sheet
		if (table.pos === 0) {
			columns = data[0].filter((row: any) => row.table === table.name);
		} else {
			columns = data[table.pos - 1];
		}

		AddGroupsForTable(table, columns, data, groups);

		// SetNames, Primary, Annotations
		columns = PrepareColumns(data, table, columns);

		if (!table.primary) {
			Warn(`Table not has primary ${table.name}!`);
		}

		table.columns = columns;
	});

	LookRelationTables(relations, tables);

	CheckBidirectionalRelation(relations, tables);
}

function PrepareColumns(data: any[], table: any, columns: any): any[] {
	console.log('PrepareColumns: ', JSON.stringify(columns, null, 4));

	columns.forEach(SetNames);

	table.primaries = [];

	return columns.map((column: any) =>
		PrepareColumn(data, table, columns, column)
	);
}

function PrepareColumn(
	data: any[],
	table: any,
	columns: any[],
	column: any
): any {
	column = ParseDomain(data, column);

	column.annotations = SetColumnAnnotation(column);
	column.ktType = column.kttype;
	PrepareTsType(data, table, columns, column);
	column.writeOnly = column.writeonly ? column.writeonly === 'yes' : false;
	column.resultMode = column.resultmode ? column.resultmode : 'NONE';

	if (column.type) {
		if (column.type.startsWith('primary')) {
			table.primary = column;
			table.primaries.push(column);
		}
	} else {
		console.log('Column type not found', column);
	}

	if (column.type.startsWith('relation.one')) {
		const lName = column.lowerCamelName;

		column.relName = lName.endsWith('Id')
			? lName.substring(0, lName.length - 2)
			: lName;
	}

	return column;
}

function PrepareTsType(
	data: any[],
	table: any,
	columns: any[],
	column: any
): any {
	if (column.tstype) {
		column.tsType = column.tstype;
	} else {
		column.tsType = column.type;

		if (column.type === 'primary') {
			column.tsType = 'number';
		}
	}
}

/**
 * Locate domain add column config
 *
 */
export function ParseDomain(data: any, column: any): any {
	if (column.domain) {
		const domain: any[] = data[0].filter(
			(row: any) => row.name === column.domain
		);

		if (domain.length > 0) {
			const link: any = ParseDomain(data, domain[0]);

			return { ...link, ...column };
		} else {
			console.error(`Domain not found: ${column.domain}`, column);

			return column;
		}
	} else {
		return column;
	}
}

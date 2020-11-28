import { SetColumnAnnotation, SetNames } from '../generate';
import { Register } from "../proc/common";
import { Warn } from '../common';
import { AddGroupsForTable } from './group';
import { CheckBidirectionalRelation, LookRelationTables } from './relation';

export async function PrepareData(tables: any[], register: Register, options: string, project: string, data: any[], groups: any) {
	tables.forEach((table: any) => {
		SetNames(table);

		table.audit = table.audit && table.audit == 'yes';
	});

	await ParseTables(register, options, project, tables, data, groups);
}

async function ParseTables(
	reg: Register,
	options: string,
	project: string,
	tables: Array<any>,
	data: Array<any>,
	groups: any
) {
	const relations: Array<any> = [];

	tables.forEach((table: any) => {
		let columns = null;

		// Handling ALL sheet - all table config in one sheet
		if (table.pos == 0) {
			columns = data[0].filter((row: any) => row.table == table.name);
		} else {
			columns = data[table.pos - 1];
		}

		AddGroupsForTable(table, columns, data, groups);

		// SetNames, Primary, Annotations
		PrepareColumns(table, columns);

		if (!table.primary) {
			Warn(`Table not has primary ${table.name}!`);
		}

		table.columns = columns;
	});

	LookRelationTables(relations, tables);

	CheckBidirectionalRelation(relations, tables);
}

function PrepareColumns(table: any, columns: any) {
	console.log('PrepareColumns: ', JSON.stringify(columns, null, 4));

	columns.forEach(SetNames);

	table.primaries = [];

	columns.forEach((column: any) => {
		column.annotations = SetColumnAnnotation(column);
		column.ktType = column.kttype;
		column.writeOnly = column.writeonly
			? column.writeonly === 'yes'
			: false;

		if (column.type.startsWith('primary')) {
			table.primary = column;
			table.primaries.push(column);
		}
	});
}

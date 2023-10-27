import { TableInfo } from '../config';

export function findTable(tables: TableInfo[], name: string) {
	const found = tables.find((e) => e.name === name);

	if (found) {
		return found;
	} else {
		throw new Error(`Table ${name} not found`);
	}
}

export function hasColumn(
	tables: TableInfo[],
	tableName: string,
	columnName: string
) {
	const table = findTable(tables, tableName);

	return hasColumnOfTable(table, columnName);
}

export function hasColumnOfTable(table: TableInfo, colName: string) {
	const found = table.columns.find((e) => e.name === colName);

	return found ? true : false;
}

export function hasTable(tables: TableInfo[], name: string) {
	const found = tables.find((e) => e.name === name);

	return found ? true : false;
}

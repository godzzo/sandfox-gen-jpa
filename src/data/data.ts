import { ColumnInfo } from './../config';
import { ColumnConfig, TableConfig, TableInfo } from '../config';
import { SetNames } from 'gdut-generate';
import { Register, Options } from '../proc/common';
import { SplitOpts, Warn } from '../lib/common';
import { AddGroupsForTable } from './group';
import {
	CheckBidirectionalRelation,
	LookRelationTables,
	RelationInfo,
} from './relation';
import { SetColumnAnnotation } from './column';

export async function PrepareData(
	tables: TableConfig[],
	register: Register,
	options: Options,
	project: string,
	data: any[],
	groups: any
) {
	tables.forEach((table) => {
		SetNames(table);

		table.audit = table.audit && table.audit === 'yes';
		table.nested = table.nested && table.nested === 'yes';
		table.owner = table.owner ? table.owner : 'NONE';

		table.hints = {};

		if (table.hint) {
			table.hint
				.split(/\n/g)
				.map((el) => el.split(':'))
				.forEach(([name, val]) => {
					if (table.hints) {
						table.hints[name] = val;
					}
				});
		}

		if (table.hints && table.hints.tableName) {
			(table as any).tableName = table.hints.tableName;
		} else {
			(table as any).tableName = table.name;
		}
	});

	await ParseTables(register, options, project, tables, data, groups);

	return tables as TableInfo[];
}

async function ParseTables(
	reg: Register,
	options: Options,
	project: string,
	tables: any[],
	data: any[],
	groups: any
) {
	const relations: RelationInfo[] = [];

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

	SetupColumn(column, table);

	return column;
}

// TODO: ColumnConfig is ColumnInfo when called with GroupColumn to create TableColumn! Handling like writeOnly...
export function SetupColumn(columnConfig: ColumnConfig, table?: any) {
	SetNames(columnConfig);

	const column = columnConfig as unknown as ColumnInfo;

	column.annotations = SetColumnAnnotation(columnConfig);
	// column.ktType = column.kttype;
	column.ktValue = columnConfig.ktType === 'String' ? '""' : '0';

	if (table) {
		column.type = column.type.replace(/#table/g, table.name);
	}

	PrepareTsType(columnConfig);

	// prettier-ignore
	column.writeOnly = columnConfig.writeOnly
		? (columnConfig.writeOnly as any) === true || columnConfig.writeOnly === 'yes'
		: false;

	column.options = SplitOpts(columnConfig.opts);

	if (
		column.writeOnly &&
		!columnConfig.opts?.includes('@JsonProperty') &&
		!columnConfig.opts?.includes('@JsonIgnore')
	) {
		column.options.push(
			'@JsonProperty(access = JsonProperty.Access.WRITE_ONLY)'
		);
	}

	column.unique = columnConfig.unique
		? (columnConfig.unique as any) === true || columnConfig.unique === 'yes'
		: false;

	column.resultMode = columnConfig.resultMode
		? columnConfig.resultMode
		: 'NONE';

	if (columnConfig.type) {
		if (columnConfig.type.startsWith('primary') && table) {
			table.primary = column;
			table.primaries.push(column);
		}
	} else {
		console.log('Column type not found', columnConfig);
	}

	if (columnConfig.type.startsWith('relation.one')) {
		const lName = column.lowerCamelName;

		column.relName = lName.endsWith('Id')
			? lName.substring(0, lName.length - 2)
			: lName;
	}
}

function PrepareTsType(column: ColumnConfig): any {
	if (!column.tsType) {
		column.tsType = column.type;

		if (!column.type) {
			console.error('Column Type node found!', column);
		}

		if (column.type.startsWith('primary')) {
			column.tsType = 'number';
		}

		if (column.type.startsWith('enum.')) {
			if (!column.ktType) {
				console.error(
					'Column ktType node found for enumeration!',
					column
				);
			}

			column.tsType = column.ktType;
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

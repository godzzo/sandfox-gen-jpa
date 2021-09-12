import { TableInfo, ColumnInfo } from './../config';
import { SetNames } from 'gdut-generate';
import pluralize from 'pluralize';

export type RelationInfo = {
	srcTbl: TableInfo;
	srcCol: ColumnInfo;
	trgTbl: TableInfo;
	trgCol?: ColumnInfo;
	relType: string;
};

export function LookRelationTables(
	relations: RelationInfo[],
	tables: TableInfo[]
) {
	// Lookup for tables whom targeted by relation
	tables.forEach((table) => {
		table.columns.forEach((column) => {
			if (
				column.type.startsWith('relation') ||
				column.type.startsWith('primary.')
			) {
				const relName = column.type.split('.')[2];
				const relType = column.type.split('.')[1];

				const relTable = tables.find((el) => el.name === relName);

				if (relTable) {
					column.relation = relTable;

					relations.push({
						srcTbl: table,
						srcCol: column,
						trgTbl: relTable,
						trgCol: relTable.columns.find((col) =>
							col.type.startsWith('primary')
						),
						relType,
					});
				} else {
					console.error(
						`Relation target not found: ${relName}`,
						column
					);
				}
			}
		});
	});
}

export function CheckBidirectionalRelation(
	relations: RelationInfo[],
	tables: TableInfo[]
) {
	relations.forEach((rel) => {
		/*Log(`
${rel.relType}: ${rel.srcTbl.name} >> ${rel.trgTbl.name} // ${rel.srcCol.name}
		`);*/

		if (
			rel.relType === 'one' &&
			`${rel.trgTbl.name}_id` === rel.srcCol.name
		) {
			const found = relations.find(
				(rf) =>
					rf.srcTbl.name === rel.trgTbl.name &&
					rf.trgTbl.name === rel.srcTbl.name &&
					rf.relType === 'many'
			);

			if (!found) {
				const colName = pluralize.plural(rel.srcTbl.name);

				const newCol: any = {
					name: colName,
					caption: rel.srcTbl.caption,
					type: `relation.many.${rel.trgTbl.name}`,
					relation: rel.srcTbl,
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
	});
}

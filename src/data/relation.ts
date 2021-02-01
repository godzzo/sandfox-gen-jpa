import { SetNames } from '../lib/generate';
import pluralize from 'pluralize';

export function LookRelationTables(relations: any[], tables: any) {
	// Lookup for tables whom targeted by relation
	tables.forEach((table: any) => {
		table.columns.forEach((column: any) => {
			if (
				column.type.startsWith('relation') ||
				column.type.startsWith('primary.')
			) {
				const relName = column.type.split('.')[2];
				const relType = column.type.split('.')[1];

				const relTable = tables.find((el: any) => el.name === relName);

				column.relation = relTable;

				if (!relTable) {
					console.error(
						`Relation target not found: ${relName}`,
						column
					);
				}

				relations.push({
					srcTbl: table,
					srcCol: column,
					trgTbl: relTable,
					trgCol: relTable.columns.find((col: any) =>
						col.type.startsWith('primary')
					),
					relType,
				});
			}
		});
	});
}

export function CheckBidirectionalRelation(relations: any[], tables: any) {
	relations.forEach((rel: any) => {
		/*Log(`
${rel.relType}: ${rel.srcTbl.name} >> ${rel.trgTbl.name} // ${rel.srcCol.name}
		`);*/

		if (
			rel.relType === 'one' &&
			`${rel.trgTbl.name}_id` === rel.srcCol.name
		) {
			const found = relations.find(
				(rf: any) =>
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

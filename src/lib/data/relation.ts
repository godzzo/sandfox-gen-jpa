import { SetNames } from "../generate";
import pluralize from "pluralize";

export function LookRelationTables(relations: Array<any>, tables: any) {
	// Lookup for tables whom targeted by relation
	tables.forEach((table: any) => {
		table.columns.forEach((column: any) => {
			if (
				column.type.startsWith('relation') ||
				column.type.startsWith('primary.')
			) {
				const relName = column.type.split('.')[2];
				const relType = column.type.split('.')[1];

				const relTable = tables.find(
					(table: any) => table.name == relName
				);

				column.relation = relTable;

				relations.push({
					srcTbl: table,
					srcCol: column,
					trgTbl: relTable,
					trgCol: relTable.columns.find(
						(col: any) => col.type == 'primary'
					),
					relType,
				});
			}
		});
	});
}

export function CheckBidirectionalRelation(relations: Array<any>, tables: any) {
	relations.forEach((rel: any) => {
		/*Log(`
${rel.relType}: ${rel.srcTbl.name} >> ${rel.trgTbl.name} // ${rel.srcCol.name}
		`);*/

		if (
			rel.relType == 'one' &&
			`${rel.trgTbl.name}_id` == rel.srcCol.name
		) {
			const found = relations.find(
				(rf: any) =>
					rf.srcTbl.name == rel.trgTbl.name &&
					rf.trgTbl.name == rel.srcTbl.name &&
					rf.relType == 'many'
			);

			if (!found) {
				const colName = pluralize.plural(rel.srcTbl.name);

				const newCol: any = {
					name: colName,
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

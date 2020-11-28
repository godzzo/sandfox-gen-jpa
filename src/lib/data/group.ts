import { SetNames } from "../generate";

/**
 * Locate Groups of given Table (add Group Columns)
 */
export function AddGroupsForTable(
	table: any,
	columns: Array<any>,
	data: Array<any>,
	groups: any
) {
	if (table.groups) {
		table.groupNames = table.groups.split(',');

		table.groupConfigs = table.groupNames.map((groupName: string) => {
			return LocateAndRegisterGroup(groupName, groups, data);
		});

		console.log(`Table - ${table.name} - groups: ${table.groups}`);

		table.groupConfigs.forEach((groupConfig: any) => {
			columns.push(...groupConfig.columns);
		});
	} else {
		table.groupConfigs = [];
	}
}

/**
 * Prepare a GroupConfig and register by name,
 * If it registered already will return with the existed,
 * if not the newly created ones.
 */
function LocateAndRegisterGroup(name: string, groups: any, data: any[]) {
	if (!groups[name]) {
		const groupColumns = data[0].filter((row: any) => row.table == name);

		const config: any = { name };

		SetNames(config);

		const columns = groupColumns.map((el: any) => {
			el.group = name;

			return el;
		});

		config.columns = columns;
		groups[name] = config;
	}

	return groups[name];
}

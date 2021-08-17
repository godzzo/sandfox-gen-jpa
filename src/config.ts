export type NameInfo = {
	name: string;
	camelName: string;
	lowerCamelName: string;
	pluralCamelName: string;
	pluralLowerCamelName: string;
	hyphenName: string;
	periodName: string;
};

export type ColumnInfo = NameInfo & {
	table: string;
	caption: string;
	type: string;
	needed: string;
	defaultValue: any;
	annotations: string;
	ktType: string;
	ktValue: string;
	tsType: string;
	writeOnly: boolean;
	resultMode: string;
	options: [];
	relName: string;
	relation: string | TableInfo;
};

export type GroupInfo = NameInfo & {
	columns: ColumnInfo[];
};

export type TableInfo = NameInfo & {
	pos: number;
	caption: string;
	menu: string;
	groups: string;
	authority: string;
	audit: boolean;
	groupNames: string[];
	groupConfigs: GroupInfo[];
	primaries: ColumnInfo[];
	primary: ColumnInfo;
	columns: ColumnInfo[];
};

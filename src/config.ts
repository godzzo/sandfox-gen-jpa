export interface TableConfig {
	pos: number;
	name: string;
	caption: string;
	menu: string;
	groups: string;
	authority: string;
	audit?: string | boolean;
	nested?: string | boolean;
	owner?: string;
	hint?: string; // mtom:keyword
	hints?: { [name: string]: string };
}

export type ColumnConfig = {
	table: string;
	name: string;
	caption: string;
	domain: string;
	type: string;
	ktType: string;
	tsType: string;
	columnType: string;
	length: number;
	needed: string;
	edit: string;
	resultType: string;
	writeOnly?: string;
	resultMode?: string;
	opts?: string; // no-auto
};

export type NameInfo = {
	name: string;
	camelName: string;
	lowerCamelName: string;
	pluralCamelName: string;
	pluralLowerCamelName: string;
	pluralHyphenName: string;
	pluralPeriodName: string;
	hyphenName: string;
	periodName: string;
};

export type ColumnInfo = NameInfo & {
	table: string;
	caption: string;
	type: string;
	length?: number;
	needed: string;
	defaultValue: any;
	annotations: string;
	ktType: string;
	ktValue: string;
	tsType: string;
	writeOnly: boolean;
	resultMode: string;
	options: string[];
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
	nested: boolean;
	owner: string;
	groupNames: string[];
	groupConfigs: GroupInfo[];
	primaries: ColumnInfo[];
	primary: ColumnInfo;
	columns: ColumnInfo[];
};

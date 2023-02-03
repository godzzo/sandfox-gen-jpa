import { TableInfo } from '../config';

export function parseColumnsForAnnotation(table: TableInfo) {
	const imports: string[] = [];

	const annotatedCols = table.columns.filter((col) => {
		return (
			col.options &&
			col.options.filter((opt) => opt.startsWith('@')).length > 0
		);
	});

	const colAnnotations = annotatedCols.reduce((prev, col) => {
		const sets = col.options
			.filter((opt) => opt.startsWith('@'))
			.map((opt) => parseColumnAnnotations(opt, imports));

		prev[col.name] = sets;

		return prev;
	}, {} as { [key: string]: string[] });

	table.columns.forEach((col) => {
		if (colAnnotations[col.name]) {
			const anns = colAnnotations[col.name].join('\n\t');
			col.annotations += `\n\t${anns}`;
		}
	});

	return {
		imports,
		allImports: imports.length > 0 ? '\n' + imports.join('\n') : '',
		cols: colAnnotations,
	};
}

function parseColumnAnnotations(option: string, imports: string[]) {
	const add = (def: string) => {
		if (!imports.includes(def)) {
			imports.push(def);
		}
	};

	let name = option;
	let parms = '';

	if (option.includes('(')) {
		const tags = option.split('(');

		name = tags[0];

		parms = '(' + tags.slice(1).join('(');
	}

	if (name.includes('.')) {
		const tags = name.split('.');
		const annotation = '@' + tags.slice(-1)[0];
		const importDef = 'import ' + name.replace('@', '').replace(/\(.*/, '');

		add(importDef);

		return annotation + parms;
	} else {
		const onlyName = option.replace(/\(.*/, '');

		if (knownAnnotations[onlyName]) {
			add('import ' + knownAnnotations[onlyName]);
		}

		return option;
	}
}

const knownAnnotations: { [key: string]: string } = {
	'@CreationTimestamp': 'org.hibernate.annotations.CreationTimestamp',
	'@UpdateTimestamp': 'org.hibernate.annotations.UpdateTimestamp',
	'@ReadOnlyProperty': 'org.springframework.data.annotation.ReadOnlyProperty',
	'@JsonIgnore': 'com.fasterxml.jackson.annotation.JsonIgnore',
	// TODO: writeOnly prop - @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
	'@JsonProperty': 'com.fasterxml.jackson.annotation.JsonProperty',
};

import { TableInfo } from '../config';

export function parseColumnsForAnnotation(table: TableInfo) {
	const imports: string[] = [];

	const annotatedCols = table.columns.filter((col) => {
		if (!col.options) {
			console.log(
				`>>> Column ${col.lowerCamelName} does not have annotation!!! <<<`
			);
		}

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

	return { imports, cols: colAnnotations };
}

function parseColumnAnnotations(option: string, imports: string[]) {
	const add = (def: string) => {
		if (!imports.includes(def)) {
			imports.push(def);
		}
	};

	if (option.includes('.')) {
		const tags = option.split('.');
		const annotation = '@' + tags.slice(-1)[0];
		const importDef = 'import ' + option.replace('@', '');

		add(importDef);

		return annotation;
	} else {
		if (knownAnnotations[option]) {
			add('import ' + knownAnnotations[option]);
		}

		return option;
	}
}

const knownAnnotations: { [key: string]: string } = {
	'@CreationTimestamp': 'org.hibernate.annotations.CreationTimestamp',
	'@UpdateTimestamp': 'org.hibernate.annotations.UpdateTimestamp',
};

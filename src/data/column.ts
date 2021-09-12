export function SetColumnAnnotation(column: any): string {
	let more = '';

	more +=
		column.length && column.length !== 'null'
			? `, length=${column.length}`
			: '';
	more +=
		column.needed && column.needed === 'yes'
			? `, nullable=false`
			: ', nullable=true';
	more += column.precision ? `, precision=${column.precision}` : '';
	more += column.scale ? `, precision=${column.scale}` : '';

	return `@Column(name="${column.name}"${more})`;
}

export function SetColumnDirective(column: any): string {
	// {name: "first_name", type: "varchar", length: 200}
	// {name: "last_update", type: "timestamp"}

	const cfg: any = {};

	cfg.name = column.name;

	if (column.columnType) {
		cfg.type = column.columnType;
	}

	if (column.length) {
		cfg.length = column.length;
	}

	return JSON.stringify(cfg);
}

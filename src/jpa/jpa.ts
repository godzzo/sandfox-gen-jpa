import { TableInfo } from '../config';
import { Options, Register } from '../proc/common';
import { MkDir, WriteJsonFile } from '../lib/common';
import { RegOwnCpFile } from 'gdut-generate';
import { GenerateProject } from './project';
import { GenerateTables } from './table';
import { GenerateGroups } from './group';
import { GenerateAuthentication } from './auth';
import { GenerateHibernate } from './hibernate';
import { GenerateMap } from './map';
import { GenerateWebHandler } from './web-handler';
import { GenerateEnums } from './enum';

export async function JpaGenerateProject(
	register: Register,
	options: Options,
	project: string,
	tables: TableInfo[],
	groups: any
) {
	await GenerateProject(register, options, project, tables, groups);

	const enums = await GenerateEnums(register, options, tables, project);

	await GenerateTables(register, options, tables, project, enums);

	await GenerateGroups(register, options, tables, project, groups);

	await GenerateAuthentication(register, options, project, tables, groups);

	await GenerateMap(register, options, project, tables, groups, enums);

	await GenerateHibernate(register, options, project, tables, groups);

	await GenerateWebHandler(register, options, project, tables, groups);
}

export async function JpaGeneratedConfig(
	register: Register,
	options: Options,
	tables: TableInfo[],
	groups: any[]
) {
	const configPath = `${register.outPath}/config`;
	const outPath = `${options.directory}/src/main/resources/config`;

	await MkDir(outPath);

	await WriteJsonFile(`${configPath}/tables.json`, tables);
	await WriteJsonFile(`${configPath}/groups.json`, groups);

	await RegOwnCpFile(
		register,
		`${configPath}/tables.json`,
		`${outPath}/tables.json`,
		options
	);
	await RegOwnCpFile(
		register,
		`${configPath}/groups.json`,
		`${outPath}/groups.json`,
		options
	);
}

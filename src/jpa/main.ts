import { Register } from '../proc/common';
import { WriteJsonFile } from '../lib/common';
import { GenerateProject } from './project';
import { GenerateTables } from './table';
import { GenerateGroups } from './group';
import { GenerateAuthentication } from './auth';
import { GenerateMap } from './map';

export async function JpaGenerateProject(
	register: Register,
	options: any,
	project: string,
	tables: any[],
	groups: any
) {
	await GenerateProject(register, options, project, tables, groups);

	await GenerateTables(register, options, tables, project);

	await GenerateGroups(register, options, tables, project, groups);

	await GenerateAuthentication(register, options, project, tables, groups);

	await GenerateMap(register, options, project, tables, groups);
}

export async function JpaGeneratedConfig(
	register: any,
	options: any,
	tables: any[],
	groups: any[]
) {
	await WriteJsonFile(`${register.outPath}/config/tables.json`, tables);

	await WriteJsonFile(`${register.outPath}/config/groups.json`, groups);
}

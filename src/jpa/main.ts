import { Register } from '../proc/common';
import { GenerateProject } from './project';
import { GenerateTables } from './table';
import { GenerateGroups } from './group';
import { GenerateAuthentication } from './auth';

export async function JpaGenerateProject(
	register: Register,
	options: string,
	project: string,
	tables: any[],
	groups: any
) {
	await GenerateProject(register, options, project, tables, groups);

	await GenerateTables(register, options, tables, project);

	await GenerateGroups(register, options, tables, project, groups);

	await GenerateAuthentication(register, options, project, tables, groups);
}

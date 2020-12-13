#!/usr/bin/env node
import { Main } from './control';
import { ParseCliArgs } from './lib/cli.args';

console.log('SandFox GEN JPA - Loaded...');

(async () => {
	const options = await ParseCliArgs();

	await Main(options);
})();

export const NgModelGen = (name: string) => 'Hello ' + name;

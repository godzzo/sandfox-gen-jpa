#!/usr/bin/env node
import { Main } from './control';
import { ParseCliArgs } from './lib/cli.args';

console.log('SandFox GEN JPA - Loaded...');

async function Start() {
	const options = await ParseCliArgs();

	await Main(options);
}

// tslint:disable:no-floating-promises
Start().then();

export const NgModelGen = (name: string) => 'Hello ' + name;

#!/usr/bin/env node

import { Main } from './control';
import { ParseCliArgs } from './lib/cli.args';

console.log('SandFox GEN JPA - Loaded...');

async function Start() {
	const options = await ParseCliArgs(__dirname);

	await Main(options);
}

Start().catch((err) => {
	console.log(err);
});

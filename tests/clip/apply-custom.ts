import { RenderDir } from 'gdut-generate';
import { InitRegister, Options, Register } from '../../src/proc/common';
import { ParseCliArgs } from '../../src/lib/cli.args';
import { ReadJsonFile, WriteJsonFile } from '../../src/lib/common';
import { ApplyCustom } from 'gdut-generate';

const out = './out/tmp/custom-src-dir';
const custom = './out/tmp/custom-real-dir';

(async () => {
	const options: Options = await ParseCliArgs('.', ['./templates']);
	const reg = InitRegister();

	options.template = 'test';
	options.directory = out;
	options.customDir = custom;

	// SampleRenderer(options, reg);

	InvokeCustom(options);
})().catch((err) => console.error(err));

async function InvokeCustom(options: Options) {
	const register = await ReadJsonFile(
		`${options.directory}/config/generateRegister.json`
	);

	console.log('register', JSON.stringify(register, null, 4));

	await ApplyCustom(register, options);

	await WriteJsonFile(
		`${options.customDir}/config/customRegister.json`,
		register
	);

	console.log('register', JSON.stringify(register, null, 4));
}

async function SampleRenderer(options: Options, reg: Register) {
	const data = {
		items: [
			{ id: 1, name: 'John' },
			{ id: 2, name: 'Eva' },
			{ id: 3, name: 'Fred' },
			{ id: 4, name: 'Martha' },
			{ id: 5, name: 'Giraffe' },
			{ id: 6, name: 'Gizella' },
			{ id: 7, name: 'Baby Joel' },
		],
	};

	await RenderDir('/handler', out, { options, data }, reg, options, 'user');

	await WriteJsonFile(
		`${options.directory}/config/generateRegister.json`,
		reg
	);
}

import { RenderDir } from 'gdut-generate';
import { InitRegister, Options } from '../../src/proc/common';
import { ParseCliArgs } from '../../src/lib/cli.args';
import { WriteJsonFile } from '../../src/lib/common';

const out = './out/tmp/render-dir';

(async () => {
	const options: Options = await ParseCliArgs('.', ['./templates']);
	const reg = InitRegister();

	options.template = 'test';

	const data = {
		items: [
			{ id: 1, name: 'John' },
			{ id: 2, name: 'Eva' },
			{ id: 3, name: 'Fred' },
			{ id: 4, name: 'Martha' },
			{ id: 5, name: 'Giraffe' },
		],
	};

	await RenderDir('/handler', out, { options, data }, reg, options, 'user');

	await WriteJsonFile(`${out}/register.json`, reg);
})().catch((err) => console.error(err));

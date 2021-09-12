import { RenderFiles } from 'gdut-generate';
import { InitRegister, Options } from '../../src/proc/common';
import { ParseCliArgs } from '../../src/lib/cli.args';
import { WriteJsonFile } from '../../src/lib/common';

const out = './out/tmp/render-files';

(async () => {
	const options: Options = await ParseCliArgs('.', ['./templates']);
	const reg = InitRegister();

	options.template = 'project';

	await RenderFiles(
		[
			[`/build.gradle.kts.ejs`, `/build.gradle.kts`],
			[`/settings.gradle.kts.ejs`, `/settings.gradle.kts.ejs`],
			[`/config/custom.json`, `/config/custom.json`],
		],
		'',
		out,
		options,
		reg,
		options
	);

	await WriteJsonFile(`${out}/register.json`, reg);
})().catch((err) => console.error(err));

import { TableInfo } from '../config';
import { render, RegCpFile, RegCpFiles, RenderFiles } from '../lib/generate';
import { MkDir } from '../lib/common';
import { Options, Register } from '../proc/common';

export async function GenerateProject(
	reg: Register,
	options: Options,
	project: string,
	tables: TableInfo[],
	groups: any
) {
	options.packagePath = options.package.replace(/\./g, '/');

	const out = options.directory;

	reg.outPath = out;

	await RegCpFile(reg, `/gradlew`, `${out}/gradlew`, options);
	await RegCpFile(reg, `/gradlew.bat`, `${out}/gradlew.bat`, options);
	await RegCpFile(reg, `/README.md`, `${out}/README.md`, options);
	await RegCpFile(reg, `/gitignore`, `${out}/.gitignore`, options);

	await render(
		reg,
		`/build.gradle.kts.ejs`,
		options,
		`${out}/build.gradle.kts`,
		options
	);
	await render(
		reg,
		`/settings.gradle.kts.ejs`,
		options,
		`${out}/settings.gradle.kts`,
		options
	);

	await MkDir(`${out}/config`);
	await RegCpFile(
		reg,
		`/config/custom.json`,
		`${out}/config/custom.json`,
		options
	);

	await MkDir(`${out}/gradle/wrapper`);
	await RegCpFile(
		reg,
		`/gradle/wrapper/gradle-wrapper.jar`,
		`${out}/gradle/wrapper/gradle-wrapper.jar`,
		options
	);
	await RegCpFile(
		reg,
		`/gradle/wrapper/gradle-wrapper.properties`,
		`${out}/gradle/wrapper/gradle-wrapper.properties`,
		options
	);

	await MkDir(`${out}/src/main/resources`);
	await render(
		reg,
		`/src/main/resources/application.properties.ejs`,
		options,
		`${out}/src/main/resources/application.properties`,
		options
	);

	await MkDir(`${out}/src/main/kotlin/${options.packagePath}`);
	await render(
		reg,
		`/src/main/kotlin/demo/Application.kt.ejs`,
		options,
		`${out}/src/main/kotlin/${options.packagePath}/Application.kt`,
		options
	);
	await render(
		reg,
		`/src/main/kotlin/demo/SpecConfiguration.kt.ejs`,
		options,
		`${out}/src/main/kotlin/${options.packagePath}/SpecConfiguration.kt`,
		options
	);

	await render(
		reg,
		`/src/main/kotlin/demo/RepositoryRestCustomization.kt.ejs`,
		{ options, tables, groups },
		`${out}/src/main/kotlin/${options.packagePath}/RepositoryRestCustomization.kt`,
		options
	);

	const controllerPath = `${out}/src/main/kotlin/${options.packagePath}/controller`;
	await MkDir(controllerPath);
	await render(
		reg,
		`/src/main/kotlin/demo/controller/AppController.kt.ejs`,
		options,
		`${controllerPath}/AppController.kt`,
		options
	);

	const filterPath = `${out}/src/main/kotlin/${options.packagePath}/filter`;
	await MkDir(filterPath);
	await render(
		reg,
		`/src/main/kotlin/demo/filter/ApiFilter.kt.ejs`,
		{ options, tables, groups },
		`${filterPath}/ApiFilter.kt`,
		options
	);

	const servicePath = `${out}/src/main/kotlin/${options.packagePath}/service`;
	await MkDir(servicePath);

	await MkDir(`${out}/src/main/kotlin/${options.packagePath}/util`);
	await render(
		reg,
		`/src/main/kotlin/demo/util/FilterHelper.kt.ejs`,
		options,
		`${out}/src/main/kotlin/${options.packagePath}/util/FilterHelper.kt`,
		options
	);
	await render(
		reg,
		`/src/main/kotlin/demo/util/BaseUtil.kt.ejs`,
		options,
		`${out}/src/main/kotlin/${options.packagePath}/util/BaseUtil.kt`,
		options
	);

	await GenerateTest(reg, options, out);
	await GenerateWebSocket(reg, options, out, controllerPath, servicePath);
	await GenerateThymeleaf(reg, options, out, controllerPath);
}

async function GenerateWebSocket(
	reg: Register,
	options: Options,
	out: string,
	controllerPath: string,
	servicePath: string
) {
	if (options.hints.includes('websocket')) {
		await render(
			reg,
			`/src/main/kotlin/demo/WebSocketConfig.kt.ejs`,
			options,
			`${out}/src/main/kotlin/${options.packagePath}/WebSocketConfig.kt`,
			options
		);

		await render(
			reg,
			`/src/main/kotlin/demo/controller/BroadcastController.kt.ejs`,
			options,
			`${controllerPath}/BroadcastController.kt`,
			options
		);

		await render(
			reg,
			`/src/main/kotlin/demo/service/EntityMessageService.kt.ejs`,
			options,
			`${servicePath}/EntityMessageService.kt`,
			options
		);
	}
}

async function GenerateThymeleaf(
	reg: Register,
	options: Options,
	out: string,
	controllerPath: string
) {
	if (options.hints.includes('thymeleaf')) {
		await render(
			reg,
			`/src/main/kotlin/demo/ThymeleafExtraConfiguration.kt.ejs`,
			options,
			`${out}/src/main/kotlin/${options.packagePath}/ThymeleafExtraConfiguration.kt`,
			options
		);

		await render(
			reg,
			`/src/main/kotlin/demo/controller/PageController.kt.ejs`,
			options,
			`${controllerPath}/PageController.kt`,
			options
		);
	}
}

async function GenerateTest(reg: Register, options: Options, out: string) {
	await MkDir(`${out}/src/test/kotlin/${options.packagePath}`);
	await render(
		reg,
		`/src/test/kotlin/demo/ApplicationTests.kt.ejs`,
		options,
		`${out}/src/test/kotlin/${options.packagePath}/ApplicationTests.kt`,
		options
	);

	await MkDir(`${out}/src/test/kotlin/${options.packagePath}/util`);
	await render(
		reg,
		`/src/test/kotlin/demo/util/TestPageRequest.kt.ejs`,
		options,
		`${out}/src/test/kotlin/${options.packagePath}/util/TestPageRequest.kt`,
		options
	);
}

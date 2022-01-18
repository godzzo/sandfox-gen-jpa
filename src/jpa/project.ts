import { TableInfo } from '../config';
import { RegCpFile, RegCpFiles, RenderFiles } from 'gdut-generate';
import { Options, Register } from '../proc/common';

export type JpaContext = {
	source: string;
	service: string;
	controller: string;
	filter: string;
	util: string;
	test: string;
	testUtil: string;
};

export function PreparePath(options: Options): JpaContext {
	const source = `/src/main/kotlin/${options.packagePath}`;
	const test = `/src/test/kotlin/${options.packagePath}`;
	const service = `${source}/service`;
	const controller = `${source}/controller`;
	const filter = `${source}/filter`;
	const util = `${source}/util`;
	const testUtil = `${test}/util`;

	return {
		source,
		test,
		service,
		controller,
		filter,
		util,
		testUtil,
	};
}

export async function GenerateProject(
	reg: Register,
	options: Options,
	project: string,
	tables: TableInfo[],
	groups: any
) {
	options.packagePath = options.package.replace(/\./g, '/');
	const out = options.directory;
	const ctx = PreparePath(options);

	reg.outPath = out;

	await RegCpFiles(
		[
			[`/gradlew`, `/gradlew`],
			[`/gradlew.bat`, `/gradlew.bat`],
			[`/README.md`, `/README.md`],
			[`/gitignore`, `/.gitignore`],
			['/config/custom.json', '/config/custom.json'],
			[
				'/gradle/wrapper/gradle-wrapper.jar',
				'/gradle/wrapper/gradle-wrapper.jar',
			],
			[
				'/gradle/wrapper/gradle-wrapper.properties',
				'/gradle/wrapper/gradle-wrapper.properties',
			],
		],
		'',
		out,
		reg,
		options
	);

	await RenderFiles(
		[
			['/build.gradle.kts.ejs', '/build.gradle.kts'],
			['/settings.gradle.kts.ejs', '/settings.gradle.kts'],
			[
				'/src/main/resources/application.properties.ejs',
				'/src/main/resources/application.properties',
			],
			[
				`/src/main/kotlin/demo/Application.kt.ejs`,
				`${ctx.source}/Application.kt`,
			],
			[
				`/src/main/kotlin/demo/SpecConfiguration.kt.ejs`,
				`${ctx.source}/SpecConfiguration.kt`,
			],
			[
				`/src/main/kotlin/demo/RepositoryRestCustomization.kt.ejs`,
				`${ctx.source}/RepositoryRestCustomization.kt`,
			],
			[
				`/src/main/kotlin/demo/controller/AppController.kt.ejs`,
				`${ctx.controller}/AppController.kt`,
			],
			[
				`/src/main/kotlin/demo/filter/ApiFilter.kt.ejs`,
				`${ctx.filter}/ApiFilter.kt`,
			],
			[
				`/src/main/kotlin/demo/util/FilterHelper.kt.ejs`,
				`${ctx.util}/FilterHelper.kt`,
			],
			[
				`/src/main/kotlin/demo/util/BaseUtil.kt.ejs`,
				`${ctx.util}/BaseUtil.kt`,
			],
		],
		'',
		out,
		{ ...options, options, tables, groups },
		reg,
		options
	);

	await GenerateTest(reg, options, out, ctx);
	await GenerateWebSocket(reg, options, out, ctx);
	await GenerateThymeleaf(reg, options, out, ctx);
	await GenerateRepositoryService(reg, options, out, ctx);
}

async function GenerateRepositoryService(
	reg: Register,
	options: Options,
	out: string,
	ctx: JpaContext
) {
	if (options.hints.includes('repository-service')) {
		await RenderFiles(
			[
				[
					`/src/main/kotlin/demo/service/RepositoryService.kt.ejs`,
					`${ctx.service}/RepositoryService.kt`,
				],
			],
			'',
			out,
			options,
			reg,
			options
		);
	}
}

async function GenerateWebSocket(
	reg: Register,
	options: Options,
	out: string,
	ctx: JpaContext
) {
	if (options.hints.includes('websocket')) {
		await RenderFiles(
			[
				[
					`/src/main/kotlin/demo/WebSocketConfig.kt.ejs`,
					`${ctx.source}/WebSocketConfig.kt`,
				],
				[
					`/src/main/kotlin/demo/controller/BroadcastController.kt.ejs`,
					`${ctx.controller}/BroadcastController.kt`,
				],
				[
					`/src/main/kotlin/demo/service/EntityMessageService.kt.ejs`,
					`${ctx.service}/EntityMessageService.kt`,
				],
			],
			'',
			out,
			options,
			reg,
			options
		);
	}
}

async function GenerateThymeleaf(
	reg: Register,
	options: Options,
	out: string,
	ctx: JpaContext
) {
	if (options.hints.includes('thymeleaf')) {
		await RenderFiles(
			[
				[
					`/src/main/kotlin/demo/ThymeleafExtraConfiguration.kt.ejs`,
					`${ctx.source}/ThymeleafExtraConfiguration.kt`,
				],
				[
					`/src/main/kotlin/demo/controller/PageController.kt.ejs`,
					`${ctx.controller}/PageController.kt`,
				],
			],
			'',
			out,
			options,
			reg,
			options
		);
	}
}

async function GenerateTest(
	reg: Register,
	options: Options,
	out: string,
	ctx: JpaContext
) {
	await RenderFiles(
		[
			[
				`/src/test/kotlin/demo/ApplicationTests.kt.ejs`,
				`${ctx.test}/ApplicationTests.kt`,
			],
			[
				`/src/test/kotlin/demo/util/TestPageRequest.kt.ejs`,
				`${ctx.testUtil}/TestPageRequest.kt`,
			],
		],
		'',
		out,
		options,
		reg,
		options
	);
}

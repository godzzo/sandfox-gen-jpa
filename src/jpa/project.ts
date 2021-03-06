import { render, RegCpFile } from '../lib/generate';
import { MkDir } from '../lib/common';
import { Register } from '../proc/common';

export async function GenerateProject(
	reg: Register,
	options: any,
	project: string,
	tables: any,
	groups: any
) {
	options.tmpl = `${options.foxPath}/templates/project`;
	options.packagePath = options.package.replace(/\./g, '/');

	const tmpl = options.tmpl;
	const out = options.directory;

	reg.outPath = out;

	await RegCpFile(reg, `${tmpl}/gradlew`, `${out}/gradlew`);
	await RegCpFile(reg, `${tmpl}/gradlew.bat`, `${out}/gradlew.bat`);
	await RegCpFile(reg, `${tmpl}/README.md`, `${out}/README.md`);
	await RegCpFile(reg, `${tmpl}/.gitignore`, `${out}/.gitignore`);

	await render(
		reg,
		`${tmpl}/build.gradle.kts.ejs`,
		options,
		`${out}/build.gradle.kts`
	);
	await render(
		reg,
		`${tmpl}/settings.gradle.kts.ejs`,
		options,
		`${out}/settings.gradle.kts`
	);

	await MkDir(`${out}/config`);
	await RegCpFile(
		reg,
		`${tmpl}/config/custom.json`,
		`${out}/config/custom.json`
	);

	await MkDir(`${out}/gradle/wrapper`);
	await RegCpFile(
		reg,
		`${tmpl}/gradle/wrapper/gradle-wrapper.jar`,
		`${out}/gradle/wrapper/gradle-wrapper.jar`
	);
	await RegCpFile(
		reg,
		`${tmpl}/gradle/wrapper/gradle-wrapper.properties`,
		`${out}/gradle/wrapper/gradle-wrapper.properties`
	);

	await MkDir(`${out}/src/main/resources`);
	await render(
		reg,
		`${tmpl}/src/main/resources/application.properties.ejs`,
		options,
		`${out}/src/main/resources/application.properties`
	);

	await MkDir(`${out}/src/main/kotlin/${options.packagePath}`);
	await render(
		reg,
		`${tmpl}/src/main/kotlin/demo/Application.kt.ejs`,
		options,
		`${out}/src/main/kotlin/${options.packagePath}/Application.kt`
	);
	await render(
		reg,
		`${tmpl}/src/main/kotlin/demo/SpecConfiguration.kt.ejs`,
		options,
		`${out}/src/main/kotlin/${options.packagePath}/SpecConfiguration.kt`
	);

	await render(
		reg,
		`${tmpl}/src/main/kotlin/demo/RepositoryRestCustomization.kt.ejs`,
		{ options, tables, groups },
		`${out}/src/main/kotlin/${options.packagePath}/RepositoryRestCustomization.kt`
	);

	const controllerPath = `${out}/src/main/kotlin/${options.packagePath}/controller`;
	await MkDir(controllerPath);
	await render(
		reg,
		`${tmpl}/src/main/kotlin/demo/controller/AppController.kt.ejs`,
		options,
		`${controllerPath}/AppController.kt`
	);

	const filterPath = `${out}/src/main/kotlin/${options.packagePath}/filter`;
	await MkDir(filterPath);
	await render(
		reg,
		`${tmpl}/src/main/kotlin/demo/filter/ApiFilter.kt.ejs`,
		{ options, tables, groups },
		`${filterPath}/ApiFilter.kt`
	);

	await MkDir(`${out}/src/main/kotlin/${options.packagePath}/util`);
	await render(
		reg,
		`${tmpl}/src/main/kotlin/demo/util/FilterHelper.kt.ejs`,
		options,
		`${out}/src/main/kotlin/${options.packagePath}/util/FilterHelper.kt`
	);

	await MkDir(`${out}/src/test/kotlin/${options.packagePath}`);
	await render(
		reg,
		`${tmpl}/src/test/kotlin/demo/ApplicationTests.kt.ejs`,
		options,
		`${out}/src/test/kotlin/${options.packagePath}/ApplicationTests.kt`
	);

	await MkDir(`${out}/src/test/kotlin/${options.packagePath}/util`);
	await render(
		reg,
		`${tmpl}/src/test/kotlin/demo/util/TestPageRequest.kt.ejs`,
		options,
		`${out}/src/test/kotlin/${options.packagePath}/util/TestPageRequest.kt`
	);
}

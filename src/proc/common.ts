export type CustomData = {
	found: boolean;
	errors: string[];
	checkSumBefore: string | null;
	checkSumAfter: string | null;
	copyAsCustom: boolean;
};

export type RenderData = {
	templatePath: string;
	outputPath: string;
	model: any;
	size: number;
	custom: CustomData | null;
};

export type CopyData = {
	srcPath: string;
	destPath: string;
	size: number;
	custom: CustomData | null;
};

export function InitRegister(outPath = './out/tmp'): Register {
	return {
		renders: [],
		copies: [],
		outPath,
		created: new Date().toISOString(),
	};
}

export type Register = {
	outPath: string;
	created: string;
	renders: RenderData[];
	copies: CopyData[];
};

export type PluralDictionary = {
	irregulars: { single: string; plural: string }[];
};

export type Options = {
	command: string;
	config: string;
	customDir: string;
	project: string;
	package: string;
	showLogo: string;
	showArgs: string;
	credential: string;
	hint: string;
	hints: string[];
	sheetId: string;
	directory: string;
	foxPath: string;
	template: string;
	templateRoot: string;
	templatePaths: string[];
	packagePath: string;
	templateConfig: TemplateConfig;
	plural?: PluralDictionary;
};

export type TemplateConfig = { type: string };

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

export type Register = {
	outPath: string;
	created: string;
	renders: RenderData[];
	copies: CopyData[];
};

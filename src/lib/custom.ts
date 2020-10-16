import { ReadFile, FileExists, WriteFile, CopyFile, MkDir, 
  MakeDirFromFile, FileChecksum, Checksum, ReadJsonFile } from './common';
import { Register, RenderData, CopyData } from './proc';


interface CustomConfig {
  ignore: {
    copyAsCustom: boolean;
    masks: string[];
  };
}

export async function ApplyCustom(reg: Register, options: any) {
    console.log('reg', {reg, options});

    const customConfigPath = `${options.customDir}/config/custom.json`;
    let customConfig = null;

    if (FileExists(customConfigPath)) {
      customConfig = await ReadJsonFile(customConfigPath) as CustomConfig;
    } else {
      customConfig = await ReadJsonFile(`${options.directory}/config/custom.json`) as CustomConfig;
    }

    for (const el of reg.renders) {
        const { basePath, oldFile } = ParsePath(el.outputPath, options);

        const newContent = await ReadFile(el.outputPath);

        console.log(el.outputPath, {basePath, oldFile});

        await CustomFile(oldFile, el, newContent, customConfig);
    }

    for (const el of reg.copies) {
      const { basePath, oldFile } = ParsePath(el.destPath, options);

      await CopyNotFoundFile(oldFile, el, customConfig);
    }
}

function DontIgnore(filePath: string, customConfig:  CustomConfig) {
  const found = customConfig.ignore.masks.find(el => new RegExp(el).test(filePath) );

  return (found === undefined);
}

async function CopyNotFoundFile(oldFile: string, el: CopyData, customConfig: CustomConfig) {
  if (!FileExists(oldFile)) {
      el.custom = { found: false, errors: [], checkSumBefore: null, checkSumAfter: null, copyAsCustom: false };

      await MakeDirFromFile(oldFile);

      if (DontIgnore(oldFile, customConfig)) {
        await CopyFile(el.destPath, oldFile); 

      } else if (customConfig.ignore.copyAsCustom) {
        el.custom.copyAsCustom = true;

        await CopyFile(el.destPath, `${oldFile}.custom`); 
      }
  } else {
    el.custom = { found: true, errors: [], checkSumBefore: null, checkSumAfter: null, copyAsCustom: false };
  }
}

async function CustomFile(oldFile: string, el: RenderData, newContent: string, customConfig: CustomConfig) {
  if (FileExists(oldFile)) {
    await CustomExistsFile(el, oldFile, newContent, customConfig);
  } else {
    await CustomNotFoundFile(el, oldFile, customConfig);
  }
}

function ParsePath(outputPath: string, options: any) {
  const basePath = outputPath.replace(options.directory, '');
  const oldFile = `${options.customDir}${basePath}`;

  return { basePath, oldFile };
}

async function CustomNotFoundFile(el: RenderData, oldFile: string, customConfig: CustomConfig) {
  el.custom = { found: false, errors: [], checkSumAfter: null, checkSumBefore: null, copyAsCustom: false };

  console.log('UNABLE TO LOCATE OLD FILE!');

  if (FileExists(el.outputPath)) {
    await MakeDirFromFile(oldFile);

    if (DontIgnore(oldFile, customConfig)) {
      await CopyFile(el.outputPath, oldFile);

    } else if (customConfig.ignore.copyAsCustom) {
      el.custom.copyAsCustom = true;

      await CopyFile(el.outputPath, `${oldFile}.custom`);
    }

    el.custom.checkSumAfter = await FileChecksum(oldFile);
  } else {
    el.custom?.errors.push('GENERATED FILE NOT FOUND!');

    console.log('GENERATED FILE NOT FOUND!');
  }
}

async function CustomExistsFile(el: RenderData, oldFile: string, newContent: string, customConfig: CustomConfig) {
  el.custom = { found: true, errors: [], checkSumAfter: null, checkSumBefore: null, copyAsCustom: false };

  const oldContent = await ReadFile(oldFile);

  console.log('FOUND OLD FILE!');

  el.custom.checkSumBefore = Checksum(oldContent);

  const appliedContent = InvokeCustomization(newContent, oldContent);

  el.custom.checkSumAfter = Checksum(appliedContent);

  if (DontIgnore(oldFile, customConfig)) {
    await WriteFile(oldFile, appliedContent);

  } else if (customConfig.ignore.copyAsCustom) {
    el.custom.copyAsCustom = true;

    await WriteFile(`${oldFile}.custom`, appliedContent);
  }
}

function InvokeCustomization(newContent: string, oldContent: string) {
    const customs: any[] = [];

    ParseCustoms(customs, oldContent);

    const blocks = InsertCustoms(customs, newContent);

    const appliedContent = blocks.join('');

    return appliedContent;
}

function ParseCustoms(customs: any[], text: string) {
    const parts = text.split('/*FOXB-');
  
    parts.forEach(part => {
      if (part.includes('/*FOXE-')) {
        const name = ParseName(part);
  
        const custom = ParseCustom(name, part);
        const remaining = ParseRemaining(name, part);
  
        customs.push({name, data: custom, remaining});
      }
    });
  }
  
  function InsertCustoms(customs: any[], text: string) {
    const parts = text.split('/*FOXB-');
    const blocks: string[] = [];
  
    parts.forEach(part => {
      if (part.includes('/*FOXE-')) {
        const name = ParseName(part);
  
        const remaining = ParseRemaining(name, part);
        const custom = customs.find(el => el.name === name );
  
        if (custom && custom.data.trim().length !== 0) {
  
          const text = custom.data.replace(/^[\n|\r]*/g, '').replace(/[\n|\r]*$/g, '');

          blocks.push(`/*FOXB-${name}*/\n${text}\n/*FOXE-${name}*/`);

          console.log(`[[[${text}]]]`);
  
        } else {
          blocks.push(`/*FOXB-${name}*/\n/*FOXE-${name}*/`);
        }
  
        blocks.push(remaining);
  
      } else {
        blocks.push(part);
      }
    });
  
    return blocks;
  }
  
  function ParseName(part: string) {
    return part.substring(0, part.indexOf('*/'));
  }
  
  function ParseRemaining(name: string, part: string) {
    return part.replace(new RegExp(`.*FOXE-${name}\\*\\/`, 'ms'), '');
  }
  
  function ParseCustom(name: string, part: string) {
    return part.replace(new RegExp(`\n\\/\\*FOXE-${name}\\*\\/.*$`, 'ms'), '').substring(name.length+3);
  }
  
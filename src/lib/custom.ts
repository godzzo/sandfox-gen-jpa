import { ReadFile, FileExists, WriteFile, CopyFile } from './common';
import { Register } from './proc';


export async function ApplyCustom(reg: Register, options: any) {
    console.log('reg', {reg, options});

    for (const el of reg.renders) {
        
        const basePath = el.outputPath.replace(options.directory, '');
        const oldFile = `${options.customDir}${basePath}`;

        const newContent = await ReadFile(el.outputPath);

        console.log(el.outputPath, {basePath, oldFile});

        if (FileExists(oldFile)) {
            const oldContent = await ReadFile(oldFile);

            console.log('FOUND OLD FILE!');

            const appliedContent = InvokeCustomization(newContent, oldContent)

            await WriteFile(oldFile, appliedContent);
        } else {
            console.log('UNABLE TO LOCATE OLD FILE!');

            await CopyFile(el.outputPath, oldFile);
        }
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
  
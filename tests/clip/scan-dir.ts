import { ScanDir } from '../../src/lib/common';

const files: string[] = [];

ScanDir('./templates', files);

console.log(files);

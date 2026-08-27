import fs from 'fs';
import path from 'path';
import { createResumePdfDoc } from '../src/utils/generateResumePdf';

const doc = createResumePdfDoc();
const pdfArrayBuffer = doc.output('arraybuffer');
const buffer = Buffer.from(pdfArrayBuffer);

const outputPath = path.join(process.cwd(), 'public', 'Saivinod_Kotipalli_Resume.pdf');
fs.writeFileSync(outputPath, buffer);
console.log('Successfully generated public/Saivinod_Kotipalli_Resume.pdf (size:', buffer.length, 'bytes)');

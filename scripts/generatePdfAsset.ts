import fs from 'fs';
import path from 'path';
import { createResumePdfDoc } from '../src/utils/generateResumePdf';

const doc = createResumePdfDoc();
const pdfArrayBuffer = doc.output('arraybuffer');
const buffer = Buffer.from(pdfArrayBuffer);

const outputPath1 = path.join(process.cwd(), 'public', 'Sunanda_Sri_Karumuri_Resume.pdf');
const outputPath2 = path.join(process.cwd(), 'public', 'Saivinod_Kotipalli_Resume.pdf');
fs.writeFileSync(outputPath1, buffer);
fs.writeFileSync(outputPath2, buffer);
console.log('Successfully generated public/Sunanda_Sri_Karumuri_Resume.pdf and Saivinod_Kotipalli_Resume.pdf (size:', buffer.length, 'bytes)');

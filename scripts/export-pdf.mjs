// Exports a PDF fallback with one page per step (every beat of every slide), for when the
// live deck can't be used. Needs Playwright and pdf-lib (see scripts/shots.mjs).
//   npm run pdf                 writes exports/stopscan-deck.pdf, the IPTC talk
//   npm run pdf -- --aud iui    writes exports/amito-iui-2027-demo.pdf, the IUI demo video
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { capture } from './shots.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
let PDFDocument;
try { ({ PDFDocument } = await import('pdf-lib')); }
catch {
  console.error('pdf-lib is not installed. Run:\n  npm i --no-save playwright pdf-lib && npx playwright install chromium');
  process.exit(1);
}

const ai = process.argv.indexOf('--aud');
const aud = ai > -1 ? process.argv[ai + 1] : 'iptc';
const name = aud === 'iui' ? 'amito-iui-2027-demo' : aud === 'jpegtrust' ? 'stopscan-deck-jpegtrust' : 'stopscan-deck';
const files = await capture({ aud, type: 'jpeg', outDir: join(root, 'shots/pdf') });
const pdf = await PDFDocument.create();
pdf.setTitle(aud === 'iui' ? 'AMITO, IUI 2027 demo' : 'STOP&SCAN and Amito');
for (const f of files) {
  const img = await pdf.embedJpg(readFileSync(f));
  const page = pdf.addPage([960, 540]);
  page.drawImage(img, { x: 0, y: 0, width: 960, height: 540 });
}
mkdirSync(join(root, 'exports'), { recursive: true });
const out = join(root, `exports/${name}.pdf`);
writeFileSync(out, await pdf.save());
console.log(`Wrote ${files.length} pages to exports/${name}.pdf`);

// Renders every step of the deck to shots/kNN.png so changes can be reviewed without clicking
// through. Needs Playwright, which is not a default dependency because it downloads a browser:
//   npm i --no-save playwright pdf-lib && npx playwright install chromium
//
// Usage
//   npm run shots                 every step
//   npm run shots -- --only 4,12  just those step numbers (0-based, shown as kNN in the file name)
//   npm run shots -- --slides 8   every step of slide 8 (1-based, as in the deck counter)
import { mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

export async function capture({ only = null, slides = null, type = 'png', outDir = join(root, 'shots'), wait = 3200 } = {}) {
  let chromium;
  try { ({ chromium } = await import('playwright')); }
  catch {
    console.error('Playwright is not installed. Run:\n  npm i --no-save playwright pdf-lib && npx playwright install chromium');
    process.exit(1);
  }
  const { build, preview } = await import('vite');
  await build({ root, logLevel: 'warn' });
  const server = await preview({ root, preview: { port: 4174 }, logLevel: 'warn' });
  const url = server.resolvedUrls.local[0];
  mkdirSync(outDir, { recursive: true });

  const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  const problems = [];
  page.on('pageerror', e => problems.push(String(e)));
  page.on('console', m => { if (m.type() === 'error') problems.push(m.text()); });
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.addStyleTag({ content: '.ui{display:none!important}' });

  const steps = await page.evaluate(() => window.deck.steps);
  let ks = steps.map((_, k) => k);
  if (only) ks = only;
  if (slides) ks = ks.filter(k => slides.includes(steps[k][0] + 1));
  const files = [];
  for (const k of ks) {
    await page.evaluate(k => window.deck.go(k), k);
    await page.waitForTimeout(wait);
    const file = join(outDir, `k${String(k).padStart(2, '0')}.${type === 'jpeg' ? 'jpg' : 'png'}`);
    await page.screenshot({ path: file, type, ...(type === 'jpeg' ? { quality: 88 } : {}) });
    files.push(file);
  }
  await browser.close();
  await new Promise(r => server.httpServer.close(r));
  if (problems.length) console.warn('Page reported\n  ' + problems.join('\n  '));
  return files;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const arg = name => { const i = process.argv.indexOf(name); return i > -1 ? process.argv[i + 1].split(',').map(Number) : null; };
  const files = await capture({ only: arg('--only'), slides: arg('--slides') });
  console.log(`Wrote ${files.length} screenshots to shots/`);
}

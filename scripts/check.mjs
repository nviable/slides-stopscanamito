// Checks the slide files before a build. Run with `npm run check`.
// Errors stop the build. Warnings are worth a look but don't block.
import { readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const slidesDir = join(root, 'src/slides');
const index = readFileSync(join(slidesDir, 'index.js'), 'utf8');
const files = [...index.matchAll(/from '\.\/([^']+)\?raw'/g)].map(m => m[1]);
const { layouts } = await import(join(root, 'src/pile/layouts.js'));
const { CHIPS } = await import(join(root, 'src/pile/chips.js'));

const errors = [], warnings = [], rows = [];
const err = (f, m) => errors.push(`${f}: ${m}`);
const warn = (f, m) => warnings.push(`${f}: ${m}`);

if (!files.length) err('src/slides/index.js', 'no slide imports found');
const seenIds = new Set();
let totalSteps = 0;

files.forEach((f, n) => {
  const path = join(slidesDir, f);
  if (!existsSync(path)) { err(f, 'imported in index.js but the file does not exist'); return; }
  const html = readFileSync(path, 'utf8');
  const opens = html.match(/<section class="slide[^"]*"/g) || [];
  if (opens.length !== 1) err(f, `needs exactly one <section class="slide">, found ${opens.length}`);
  const sec = html.match(/<section class="slide[^>]*>/)?.[0] || '';
  const id = sec.match(/data-id="([^"]+)"/)?.[1];
  const label = sec.match(/data-label="([^"]+)"/)?.[1];
  const steps = +(sec.match(/data-steps="(\d+)"/)?.[1] || 1);
  totalSteps += steps;
  if (!id) err(f, 'missing data-id on the section');
  if (!label) err(f, 'missing data-label on the section');
  if (!/<aside class="notes">/.test(html)) warn(f, 'no <aside class="notes"> speaker notes');
  if (/<script/i.test(html)) err(f, 'slide files must not contain <script>. Put behaviour in src/pile or src/engine');

  const beats = [...html.matchAll(/data-(?:in|out|only)="([\d,]+)"/g)].flatMap(m => m[1].split(',').map(Number));
  const maxBeat = beats.length ? Math.max(...beats) : 0;
  if (maxBeat > steps - 1) err(f, `a data-in/out/only refers to beat ${maxBeat} but data-steps is ${steps} (beats 0 to ${steps - 1})`);
  const usesLayoutBeats = id && layouts[id] && layouts[id].length > 0;
  if (steps > 1 && maxBeat < steps - 1 && !usesLayoutBeats) warn(f, `data-steps is ${steps} but nothing changes after beat ${maxBeat}`);

  for (const m of html.matchAll(/src="(media\/[^"]+)"/g)) {
    if (!existsSync(join(root, 'public', m[1]))) err(f, `image not found: public/${m[1]}`);
  }
  for (const m of html.matchAll(/href="(https?:[^"]+)"/g)) {
    if (!/target="_blank"/.test(html.slice(m.index, m.index + 400))) warn(f, `external link without target="_blank": ${m[1]}`);
  }
  const text = html.replace(/<[^>]+>/g, ' ');
  if (/—|&mdash;/.test(text)) warn(f, 'contains an em dash. House style uses plain sentences instead');
  if (/#[0-9a-fA-F]{6}\b/.test(html)) warn(f, 'hard-coded hex colour. Use a token from src/styles/deck.css');

  if (id && id !== 'tech' && seenIds.has(id) && layouts[id]) warn(f, `data-id "${id}" is shared with another slide that has a pile layout`);
  if (id) seenIds.add(id);
  rows.push([String(n + 1).padStart(2), f.padEnd(34), (id || '?').padEnd(11), String(steps).padStart(2), layouts[id] ? 'pile' : '']);
});

const chipIds = new Set();
CHIPS.forEach(c => {
  if (chipIds.has(c.id)) err('src/pile/chips.js', `duplicate chip id ${c.id}`);
  chipIds.add(c.id);
  if (c.label.length > 22) warn('src/pile/chips.js', `"${c.label}" is long and may overflow a 328px column`);
});

console.log('\n #  file                               id          steps');
rows.forEach(r => console.log(' ' + r.join(' ')));
console.log(`\n${files.length} slides, ${totalSteps} steps, ${CHIPS.length} chips`);
if (warnings.length) console.log('\nWarnings\n  ' + warnings.join('\n  '));
if (errors.length) { console.error('\nErrors\n  ' + errors.join('\n  ')); process.exit(1); }
console.log('\nCheck passed');

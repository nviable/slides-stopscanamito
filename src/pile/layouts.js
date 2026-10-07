import { CHIPS, byId, ofSector, ofStep, ofFamily, rnd } from './chips.js';

// Where the chips sit on each slide. Keys match a slide's data-id. Each function gets the
// current beat (0-based) and returns { chipId: placement }.
//
// A placement is { x, y, r?, s?, o, cls?, dl?, odl? }
//   x, y   top-left of the chip in stage pixels (the stage is 1920 x 1080)
//   r      rotation in degrees        s      scale (default 1)
//   o      opacity                    cls    'lit' | 'fresh' | 'empty' | 'weak' | 'done'
//   dl     transition delay (s)       odl    opacity delay (s), defaults to dl
//
// Chips a layout leaves out fade to opacity 0 where they are. Return { __drop: true } and
// they fall below the stage instead, so the next slide can bring them up from the bottom.
// Slides with no entry here (the tech slides, for example) hide every chip.

export const COL = { stop: 0, source: 1, content: 2, alignment: 3, reflect: 4 };
export const COLX = [100, 448, 796, 1144, 1492]; // left edge of each STOP&SCAN column, width 328

// These four rules are placed on the frameworks slide only. Other layouts keep the
// original three so their policy rows do not overflow the stage.
const EXTRA_RULES = new Set(['india', 'caai', 'krfw', 'sgel']);

export const layouts = {
  title: () => ({ __drop: true }),
  misinfo: () => ({ __drop: true }),
  pilot: () => ({ __drop: true }),

  // "Many hands are building tools". One sector arrives per beat.
  build(b) {
    const out = { __drop: true };
    const zoneX = [100, 560, 1020, 1480];
    ['research', 'industry', 'standards', 'gov'].forEach((sector, si) => ofSector(sector).filter(id => !EXTRA_RULES.has(id)).forEach((id, j) => {
      const x = zoneX[si] + (j % 2) * 46 + rnd(id, 'x') * 36;
      const y = 400 + j * 88 + rnd(id, 'y') * 18;
      if (si <= b) out[id] = { x, y, r: (rnd(id, 'r') - .5) * 8, o: 1, dl: si === b ? j * .08 : 0 };
    }));
    return out;
  },

  // "Two families of evidence". Beat 1 dims everything behind the question card.
  families(b) {
    const out = {}, o = b ? .28 : 1;
    ofFamily('det').forEach((id, j) => { out[id] = { x: 110 + (j % 2) * 340, y: 470 + Math.floor(j / 2) * 90, r: (rnd(id, 'r') - .5) * 3, o, dl: j * .05 }; });
    ofFamily('prov').forEach((id, j) => { out[id] = { x: 1010 + (j % 2) * 380, y: 470 + Math.floor(j / 2) * 80, r: (rnd(id, 'r') - .5) * 3, o, dl: j * .05 }; });
    ofFamily('policy').filter(id => !EXTRA_RULES.has(id)).forEach((id, j) => { out[id] = { x: 420 + j * 330, y: 908, o }; });
    return out;
  },

  // "Literacy help exists". The pile sits on the right. Beat 1 lifts the rules into a
  // block across that side and tucks the rest of the pile underneath.
  frameworks(b) {
    const out = {};
    const rules = ['euai', 'eucop', 'nist', 'india', 'caai', 'krfw', 'sgel'];
    const ruleSet = new Set(rules);
    const ruleAt = j => ({ x: 1110 + (j % 2) * 380, y: 348 + Math.floor(j / 2) * 64, r: 0 });
    if (!b) {
      const ids = CHIPS.map(c => c.id).filter(id => !EXTRA_RULES.has(id)).sort((a, c) => rnd(a, 's') - rnd(c, 's'));
      ids.forEach((id, k) => {
        const col = k % 2, row = Math.floor(k / 2);
        const x = 1180 + col * 330 + rnd(id, 'fx') * 24, y = 376 + row * 50 + rnd(id, 'fy') * 6;
        if (byId[id].sector === 'practice') out[id] = { x, y: y + 40, o: 0 };
        else out[id] = { x, y, r: (rnd(id, 'r') - .5) * 6, o: .42, dl: row * .02 };
      });
      rules.forEach((id, j) => { if (EXTRA_RULES.has(id)) out[id] = { ...ruleAt(j), o: 0 }; });
      return out;
    }
    rules.forEach((id, j) => { out[id] = { ...ruleAt(j), o: 1, dl: j * .04 }; });
    const rest = CHIPS.map(c => c.id).filter(id => !ruleSet.has(id)).sort((a, c) => rnd(a, 's') - rnd(c, 's'));
    rest.forEach((id, k) => {
      const col = k % 3, row = Math.floor(k / 3);
      const place = { x: 1110 + col * 245, y: 710 + row * 36, r: 0, s: .7, dl: .08 + row * .02 };
      if (byId[id].sector === 'practice') out[id] = { ...place, o: 1, cls: 'fresh', dl: .12 + row * .03 };
      else out[id] = { ...place, o: .42 };
    });
    return out;
  },

  // "STOP&SCAN gives every method a place". The pile sorts into the columns.
  scan() {
    const out = {};
    ['source', 'content', 'alignment'].forEach(st => ofStep(st).forEach((id, j) => {
      out[id] = { x: COLX[COL[st]] + 14, y: 410 + j * 54, o: 1, dl: .05 + j * .045 + COL[st] * .05 };
    }));
    ofStep('policy').filter(id => !EXTRA_RULES.has(id)).forEach((id, j) => { out[id] = { x: 520 + j * 330, y: 970, o: 1, dl: .3 }; });
    return out;
  },

  // Marcus's walkthrough. Chips light up under the step pill as he uses them.
  // Beat 0 encounter, 1 Stop, 2 Source, 3 Content, 4 Alignment, 5 Now Reflect.
  marcus(b) {
    const out = {};
    const plan = {
      2: [['earliest', 'lit'], ['revimg', 'lit'], ['c2pa', 'empty']],
      3: [['zoom', 'lit'], ['imgdet', 'lit']],
      4: [['newsarch', 'lit'], ['indvid', 'lit']]
    };
    const state = {};
    for (let k = 2; k <= b; k++) (plan[k] || []).forEach(([id, cls]) => { state[id] = k === b ? cls : (cls === 'lit' ? 'done' : cls); });
    if (b >= 4) state.imgdet = 'weak'; // two detectors that disagree make one weak check
    const stack = {};
    Object.keys(state).forEach(id => {
      const col = COL[byId[id].step], n = stack[col] || 0;
      stack[col] = n + 1;
      out[id] = { x: COLX[col] + 8, y: 248 + n * 52, o: state[id] === 'done' ? .75 : 1, cls: state[id], dl: n * .08 };
    });
    CHIPS.forEach(({ id, step }) => { if (!out[id] && step in COL) out[id] = { x: COLX[COL[step]] + 110, y: 190, s: .3, o: 0 }; });
    return out;
  },

  // "Built for repetition". The sorted pile shrinks into a strip under the step pills.
  dist() {
    const out = {};
    ['source', 'content', 'alignment'].forEach(st => ofStep(st).forEach((id, j) => {
      out[id] = { x: COLX[COL[st]] + 10 + (j % 2) * 158, y: 108 + Math.floor(j / 2) * 24, s: .45, o: .9, dl: j * .02 };
    }));
    return out;
  },

  // Handoff. Every chip flies into the Amito chat window and fades as it arrives.
  handoff() {
    const out = {};
    CHIPS.forEach(({ id }, k) => {
      if (EXTRA_RULES.has(id)) return;
      const dl = k * .025;
      out[id] = { x: 1330 + rnd(id, 'hx') * 90, y: 520 + rnd(id, 'hy') * 80, s: .2, o: 0, dl, odl: dl + .55 };
    });
    return out;
  },

  // Asks, opening. Beat 1 brings four provenance chips back out of Amito, in two columns,
  // each above its 'Does well' and 'Leaves open' lines.
  asks1(b) {
    const out = {};
    if (b >= 1) ['capture', 'c2pa', 'iptcvp', 'watermark'].forEach((id, k) => {
      out[id] = { x: 100 + (k % 2) * 880, y: 672 + Math.floor(k / 2) * 170, o: 1, cls: 'lit', dl: .1 + k * .08 };
    });
    return out;
  }
};

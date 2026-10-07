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

// Government rules for marking and labelling. All seven stay together from Many
// hands through the handoff. Distribution leaves the whole set out of the method strip.
const MARKING_RULES = ['euai', 'eucop', 'nist', 'india', 'caai', 'krfw', 'sgel'];

export const layouts = {
  title: () => ({ __drop: true }),
  misinfo: () => ({ __drop: true }),
  pilot: () => ({ __drop: true }),

  // "Many hands are building tools". One sector arrives per beat. Beat 3 is government,
  // and the seven marking rules stack in that column.
  build(b) {
    const out = { __drop: true };
    const zoneX = [100, 560, 1020, 1480];
    ['research', 'industry', 'standards', 'gov'].forEach((sector, si) => {
      if (si > b) return;
      if (sector === 'gov') {
        MARKING_RULES.forEach((id, j) => {
          out[id] = { x: 1472, y: 388 + j * 62, r: (rnd(id, 'r') - .5) * 4, o: 1, dl: j * .06 };
        });
        return;
      }
      ofSector(sector).forEach((id, j) => {
        const x = zoneX[si] + (j % 2) * 46 + rnd(id, 'x') * 36;
        const y = 400 + j * 88 + rnd(id, 'y') * 18;
        out[id] = { x, y, r: (rnd(id, 'r') - .5) * 8, o: 1, dl: si === b ? j * .08 : 0 };
      });
    });
    return out;
  },

  // "Two families of evidence". Beat 1 dims everything behind the question card.
  families(b) {
    const out = {}, o = b ? .28 : 1;
    ofFamily('det').forEach((id, j) => { out[id] = { x: 110 + (j % 2) * 340, y: 470 + Math.floor(j / 2) * 90, r: (rnd(id, 'r') - .5) * 3, o, dl: j * .05 }; });
    ofFamily('prov').forEach((id, j) => { out[id] = { x: 1010 + (j % 2) * 380, y: 470 + Math.floor(j / 2) * 80, r: (rnd(id, 'r') - .5) * 3, o, dl: j * .05 }; });
    // One block under the label. Widths are the rendered chips, with a small gap,
    // so the seven rules stay together and clear of the source line.
    const rulePos = {
      euai: [100, 896], eucop: [344, 896], nist: [614, 896], india: [826, 896],
      caai: [100, 954], krfw: [374, 954], sgel: [642, 954]
    };
    MARKING_RULES.forEach((id, j) => {
      const [x, y] = rulePos[id];
      out[id] = { x, y, r: 0, o, dl: j * .04 };
    });
    return out;
  },

  // "Literacy help exists". Beat 1 shows the whole pile, including detection and
  // everyday practice, spaced so none cover another. Detection sits in the first
  // rows. Beat 2 marks practice and moves the marking rules below the methods.
  frameworks(b) {
    const out = {};
    const rules = MARKING_RULES;
    const ruleSet = new Set(rules);
    if (!b) {
      const shown = [...CHIPS].sort((a, c) => {
        const ad = a.family === 'det' ? 0 : 1, cd = c.family === 'det' ? 0 : 1;
        return ad - cd || rnd(a.id, 's') - rnd(c.id, 's');
      });
      shown.forEach((c, k) => {
        const col = k % 3, row = Math.floor(k / 3);
        out[c.id] = { x: 1104 + col * 258, y: 328 + row * 56, r: (rnd(c.id, 'r') - .5) * 2, s: .82, o: 1, dl: row * .012 };
      });
      return out;
    }
    const ruleAt = j => ({ x: 1110 + (j % 2) * 380, y: 728 + Math.floor(j / 2) * 62, r: 0, s: .9 });
    rules.forEach((id, j) => { out[id] = { ...ruleAt(j), o: 1, dl: j * .04 }; });
    const rest = CHIPS.map(c => c.id).filter(id => !ruleSet.has(id)).sort((a, c) => rnd(a, 's') - rnd(c, 's'));
    rest.forEach((id, k) => {
      const col = k % 3, row = Math.floor(k / 3);
      const place = { x: 1110 + col * 245, y: 312 + row * 36, r: 0, s: .7, dl: .08 + row * .02 };
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
    // One row of all seven marking rules. x is the unscaled top-left. Scale keeps the band above the source line.
    const ruleX = [120, 326, 556, 738, 968, 1206, 1436];
    MARKING_RULES.forEach((id, j) => { out[id] = { x: ruleX[j], y: 956, s: .8, o: 1, dl: .28 + j * .02 }; });
    return out;
  },

  // Marcus's walkthrough. Chips sit under the step pill as he uses them.
  // Beat 0 encounter, 1 Stop, 2 Source, 3 Content, 4 Alignment, 5 Now Reflect.
  // `step` matches the current step pill (filled). `stepdone` matches a past pill (outline).
  // `empty` and `weak` stay dashed. A failed method must not look successful.
  marcus(b) {
    const out = {};
    const plan = {
      2: [['earliest', 'step'], ['revimg', 'step'], ['c2pa', 'empty']],
      3: [['zoom', 'step'], ['imgdet', 'step']],
      4: [['newsarch', 'step'], ['indvid', 'step']]
    };
    const state = {};
    for (let k = 2; k <= b; k++) (plan[k] || []).forEach(([id, cls]) => { state[id] = k === b ? cls : (cls === 'step' ? 'stepdone' : cls); });
    if (b >= 4) state.imgdet = 'weak'; // two detectors that disagree make one weak check
    const stack = {};
    Object.keys(state).forEach(id => {
      const col = COL[byId[id].step], n = stack[col] || 0;
      stack[col] = n + 1;
      out[id] = { x: COLX[col] + 8, y: 300 + n * 48, o: 1, cls: state[id], dl: n * .08 };
    });
    CHIPS.forEach(({ id, step }) => { if (!out[id] && step in COL) out[id] = { x: COLX[COL[step]] + 110, y: 190, s: .3, o: 0 }; });
    return out;
  },

  // Distribution. Four beats reveal one card at a time. The sorted pile stays a quiet
  // strip along the top on every beat so the cards and Amito have the stage.
  dist() {
    const out = {};
    ['source', 'content', 'alignment'].forEach(st => ofStep(st).forEach((id, j) => {
      out[id] = { x: COLX[COL[st]] + (j % 3) * 104, y: 14 + Math.floor(j / 3) * 22, s: .36, o: .7, dl: j * .02 };
    }));
    return out;
  },

  // Handoff. Every chip flies into the Amito chat window and fades as it arrives.
  handoff() {
    const out = {};
    CHIPS.forEach(({ id }, k) => {
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

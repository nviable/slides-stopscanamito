// The method pile. Every chip is one method a person could use, from detectors and
// provenance checks to everyday habits like reading an account's history.
//
//   id      stable key, used by the layouts in ./layouts.js
//   label   text on the chip, keep it under about 22 characters so it fits a column
//   family  colour of the chip's dot (see FAMILY_COLOR)
//   sector  who builds it, which decides when it arrives on the "Many hands" slide.
//           'practice' chips arrive later, on the frameworks slide
//   step    the STOP&SCAN element it sorts into. 'policy' chips sit in a band below the columns
//
// To add a method, add a row here. The layouts place it automatically by sector and step.

export const FAMILY_COLOR = {
  det: 'var(--lilac)',      // detection
  prov: 'var(--welcome)',   // provenance
  search: 'var(--turq)',    // search
  human: 'var(--fuel)',     // everyday verification practice
  policy: 'var(--outline)'  // rules
};

export const STEP_COLOR = {
  source: 'var(--source)',
  content: 'var(--content)',
  alignment: 'var(--align)',
  policy: 'var(--outline)'
};

export const CHIPS = [
  { id: 'imgdet', label: 'Image detectors', family: 'det', sector: 'research', step: 'content' },
  { id: 'viddet', label: 'Video detectors', family: 'det', sector: 'research', step: 'content' },
  { id: 'voicedet', label: 'Voice detectors', family: 'det', sector: 'research', step: 'content' },
  { id: 'forensic', label: 'Forensic filters', family: 'det', sector: 'research', step: 'content' },
  { id: 'capture', label: 'Capture signing', family: 'prov', sector: 'industry', step: 'source' },
  { id: 'apple', label: 'Apple Reference Image', family: 'prov', sector: 'industry', step: 'source' },
  { id: 'watermark', label: 'Watermark check', family: 'prov', sector: 'industry', step: 'source' },
  { id: 'meta', label: 'Metadata reader', family: 'prov', sector: 'industry', step: 'content' },
  { id: 'revimg', label: 'Reverse image search', family: 'search', sector: 'industry', step: 'source' },
  { id: 'c2pa', label: 'C2PA validator', family: 'prov', sector: 'standards', step: 'source' },
  { id: 'jtrust', label: 'JPEG Trust report', family: 'prov', sector: 'standards', step: 'source' },
  { id: 'iptcvp', label: 'IPTC publisher list', family: 'prov', sector: 'standards', step: 'source' },
  { id: 'euai', label: 'EU AI Act, Art. 50', family: 'policy', sector: 'gov', step: 'policy' },
  { id: 'eucop', label: 'EU Code of Practice', family: 'policy', sector: 'gov', step: 'policy' },
  { id: 'nist', label: 'NIST AI 100-4', family: 'policy', sector: 'gov', step: 'policy' },
  { id: 'acct', label: 'Account history', family: 'human', sector: 'practice', step: 'source' },
  { id: 'earliest', label: 'Trace earliest post', family: 'human', sector: 'practice', step: 'source' },
  { id: 'zoom', label: 'Check visible details', family: 'human', sector: 'practice', step: 'content' },
  { id: 'geo', label: 'Geolocation', family: 'human', sector: 'practice', step: 'content' },
  { id: 'lateral', label: 'Lateral reading', family: 'human', sector: 'practice', step: 'alignment' },
  { id: 'newsarch', label: 'News archive search', family: 'human', sector: 'practice', step: 'alignment' },
  { id: 'factcheck', label: 'Fact-check archives', family: 'human', sector: 'practice', step: 'alignment' },
  { id: 'indvid', label: 'Independent footage', family: 'human', sector: 'practice', step: 'alignment' }
];

export const byId = Object.fromEntries(CHIPS.map(c => [c.id, c]));
export const ofSector = sector => CHIPS.filter(c => c.sector === sector).map(c => c.id);
export const ofStep = step => CHIPS.filter(c => c.step === step).map(c => c.id);
export const ofFamily = family => CHIPS.filter(c => c.family === family).map(c => c.id);

// Deterministic jitter so the "pile" looks hand-thrown but renders the same every time.
export function rnd(id, salt) {
  let h = 2166136261;
  const s = id + ':' + salt;
  for (let k = 0; k < s.length; k++) { h ^= s.charCodeAt(k); h = Math.imul(h, 16777619); }
  return ((h >>> 0) % 10000) / 10000;
}

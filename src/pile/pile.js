import { CHIPS, FAMILY_COLOR, STEP_COLOR, rnd } from './chips.js';

// Builds one <span class="chip"> per method inside the pile layer and moves them to the
// placements a layout returns. All motion is CSS transitions on transform and opacity.
export function createPile(container) {
  const el = {};
  CHIPS.forEach(({ id, label, family, step }) => {
    const c = document.createElement('span');
    c.className = 'chip';
    c.dataset.chip = id;
    c.append(document.createElement('i'), document.createTextNode(label));
    c.style.setProperty('--fam', FAMILY_COLOR[family]);
    c.style.setProperty('--lc', STEP_COLOR[step]);
    container.appendChild(c);
    el[id] = c;
  });

  function apply(spec = {}) {
    CHIPS.forEach(({ id }) => {
      const c = el[id], p = spec[id];
      if (p) {
        c.style.setProperty('--dl', (p.dl || 0) + 's');
        c.style.setProperty('--odl', (p.odl != null ? p.odl : (p.dl || 0)) + 's');
        c.style.transform = `translate(${p.x}px, ${p.y}px) rotate(${p.r || 0}deg) scale(${p.s || 1})`;
        c.style.opacity = p.o;
        c.className = 'chip' + (p.cls ? ' ' + p.cls : '');
      } else {
        c.style.setProperty('--dl', '0s');
        c.style.setProperty('--odl', '0s');
        c.style.opacity = 0;
        if (spec.__drop) c.style.transform = `translate(${300 + rnd(id, 'dx') * 1300}px, 1200px) scale(.6)`;
        c.className = 'chip';
      }
    });
  }

  return { apply };
}

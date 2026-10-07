import './styles/design-system/colors.css';
import './styles/design-system/typography.css';
import './styles/design-system/spacing.css';
import './styles/design-system/effects.css';
import './styles/deck.css';
import './styles/slides.css';
import './styles/chrome.css';

import { slides } from './slides/index.js';
import { layouts } from './pile/layouts.js';
import { createPile } from './pile/pile.js';
import { createDeck } from './engine/deck.js';

const stage = document.getElementById('stage');
const pileLayer = document.getElementById('pile');
pileLayer.insertAdjacentHTML('beforebegin', slides.join('\n'));

const deck = createDeck({
  viewport: document.getElementById('viewport'),
  stage,
  pile: createPile(pileLayer),
  layouts,
  ui: {
    bar: document.getElementById('ui'),
    count: document.getElementById('count'),
    notes: document.getElementById('notes'),
    prev: document.getElementById('bPrev'),
    next: document.getElementById('bNext'),
    notesButton: document.getElementById('bNotes'),
    audButton: document.getElementById('bAud'),
    fullButton: document.getElementById('bFull')
  }
});

// Used by scripts/shots.mjs and handy in the browser console.
window.deck = deck;

// Pilot headlines count up to the figure already in the markup. The bar widths
// grow in CSS. Reduced motion keeps the final figures.
const pilot = stage.querySelector('[data-id="pilot"]');
if (pilot) {
  const motionOK = !matchMedia('(prefers-reduced-motion: reduce)').matches;
  let run = 0;
  const figures = () => [...pilot.querySelectorAll('.hnum[data-to]')];
  const showFinal = () => {
    run++;
    figures().forEach(el => { el.textContent = el.dataset.to + '%'; });
  };
  const countUp = () => {
    const token = ++run;
    figures().forEach((el, i) => {
      const to = Number(el.dataset.to);
      if (!motionOK) { el.textContent = to + '%'; return; }
      const delay = 300 + i * 100;
      const dur = 640;
      const t0 = performance.now();
      el.textContent = '0%';
      const step = now => {
        if (token !== run) return;
        const p = (now - t0 - delay) / dur;
        if (p < 0) { requestAnimationFrame(step); return; }
        const e = 1 - Math.pow(1 - Math.min(1, p), 3);
        el.textContent = Math.round(e * to) + '%';
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  };
  new MutationObserver(() => { pilot.classList.contains('on') ? countUp() : showFinal(); })
    .observe(pilot, { attributes: true, attributeFilter: ['class'] });
  if (pilot.classList.contains('on')) countUp();
}

if (import.meta.hot) import.meta.hot.accept(() => location.reload());

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

if (import.meta.hot) import.meta.hot.accept(() => location.reload());

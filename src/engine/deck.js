// Presentation engine. Knows nothing about the talk's content.
//
// Slides are <section class="slide" data-id data-label data-steps> elements inside #stage.
// Each slide has data-steps beats (default 1). Within a slide:
//   [data-in="k"]    appears from beat k onward
//   [data-out="k"]   disappears from beat k onward
//   [data-only="k"]  shows only on beat k (a comma list such as "2,3" also works)
//   .pill[data-k]    gets .now on beat k and .past before it (the Marcus step strip)
//   <aside class="notes"> holds speaker notes, shown with N
// The pile layout for a slide comes from layouts[slide.dataset.id](beat).

const W = 1920, H = 1080;

export function createDeck({ viewport, stage, pile, layouts, ui }) {
  const slides = [...stage.querySelectorAll('.slide')];
  const steps = [];
  slides.forEach((s, i) => { const n = +(s.dataset.steps || 1); for (let b = 0; b < n; b++) steps.push([i, b]); });

  function fit() {
    const r = viewport.getBoundingClientRect();
    const s = Math.min(r.width / W, r.height / H) || 1;
    stage.style.transform = `translate(${(r.width - W * s) / 2}px, ${(r.height - H * s) / 2}px) scale(${s})`;
  }
  addEventListener('resize', fit);
  fit();

  let cur = -1;
  let aud = 'iptc';

  function go(k) {
    k = Math.max(0, Math.min(steps.length - 1, k));
    const [i, b] = steps[k];
    slides.forEach((s, j) => { s.classList.toggle('on', j === i); s.setAttribute('aria-hidden', j === i ? 'false' : 'true'); });
    const s = slides[i];
    s.dataset.beat = b;
    s.querySelectorAll('[data-in]').forEach(e => e.classList.toggle('in', b >= +e.dataset.in));
    s.querySelectorAll('[data-out]').forEach(e => e.classList.toggle('gone', b >= +e.dataset.out));
    s.querySelectorAll('[data-only]').forEach(e => e.classList.toggle('off', !e.dataset.only.split(',').map(Number).includes(b)));
    s.querySelectorAll('.pill[data-k]').forEach(p => { const kk = +p.dataset.k; p.classList.toggle('now', kk === b); p.classList.toggle('past', kk < b); });
    const lay = layouts[s.dataset.id];
    pile.apply(lay ? lay(b) : {});
    cur = k;
    updateUI();
  }

  function updateUI() {
    if (cur < 0) return;
    const [i, b] = steps[cur], n = +(slides[i].dataset.steps || 1);
    ui.count.textContent = `${i + 1} / ${slides.length}` + (n > 1 ? `  ·  ${b + 1} of ${n}` : '');
    renderNotes(i);
    try { history.replaceState(null, '', '#s' + (i + 1) + (aud === 'jpegtrust' ? '-jpegtrust' : '')); } catch (e) { /* sandboxed viewers */ }
  }

  function renderNotes(i) {
    const box = ui.notes;
    box.textContent = '';
    const h = document.createElement('h5');
    h.textContent = `Slide ${i + 1} · ${slides[i].dataset.label || ''}`;
    box.appendChild(h);
    const a = slides[i].querySelector('.notes');
    if (a && a.firstElementChild) box.appendChild(a.firstElementChild.cloneNode(true));
    const keys = document.createElement('div');
    keys.className = 'keys';
    keys.textContent = 'Arrow keys, space or click to move · N notes · A audience · F full screen';
    box.appendChild(keys);
  }

  function setNotes(on) { ui.notes.hidden = !on; ui.notesButton.setAttribute('aria-pressed', on ? 'true' : 'false'); }

  function setAudience(a) {
    aud = a;
    document.body.dataset.aud = a;
    ui.audButton.textContent = 'Audience: ' + (a === 'iptc' ? 'IPTC' : 'JPEG Trust');
    try { localStorage.setItem('ss-aud', a); } catch (e) { /* storage blocked */ }
    updateUI();
  }

  function fullscreen() {
    try {
      if (document.fullscreenElement) { document.exitFullscreen && document.exitFullscreen(); }
      else if (document.documentElement.requestFullscreen) { const p = document.documentElement.requestFullscreen(); if (p && p.catch) p.catch(() => {}); }
    } catch (e) { /* not allowed here */ }
  }

  let idleT;
  function wake() {
    ui.bar.classList.remove('idle');
    clearTimeout(idleT);
    idleT = setTimeout(() => { if (!ui.bar.matches(':hover, :focus-within')) ui.bar.classList.add('idle'); }, 2800);
  }
  addEventListener('mousemove', wake);
  addEventListener('touchstart', wake, { passive: true });

  addEventListener('keydown', e => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const k = e.key;
    if ((k === ' ' || k === 'Enter') && e.target.closest && e.target.closest('button, a')) return;
    if (['ArrowRight', 'ArrowDown', 'PageDown', ' ', 'Enter'].includes(k)) { e.preventDefault(); go(cur + 1); }
    else if (['ArrowLeft', 'ArrowUp', 'PageUp', 'Backspace'].includes(k)) { e.preventDefault(); go(cur - 1); }
    else if (k === 'Home') { e.preventDefault(); go(0); }
    else if (k === 'End') { e.preventDefault(); go(steps.length - 1); }
    else if (k === 'n' || k === 'N') setNotes(ui.notes.hidden);
    else if (k === 'a' || k === 'A') setAudience(aud === 'iptc' ? 'jpegtrust' : 'iptc');
    else if (k === 'f' || k === 'F') fullscreen();
    else return;
    wake();
  });
  stage.addEventListener('click', e => {
    if (e.target.closest('a, button')) return;
    const r = stage.getBoundingClientRect();
    go(e.clientX - r.left < r.width * .3 ? cur - 1 : cur + 1);
  });
  ui.prev.addEventListener('click', () => go(cur - 1));
  ui.next.addEventListener('click', () => go(cur + 1));
  ui.notesButton.addEventListener('click', () => setNotes(ui.notes.hidden));
  ui.audButton.addEventListener('click', () => setAudience(aud === 'iptc' ? 'jpegtrust' : 'iptc'));
  ui.fullButton.addEventListener('click', fullscreen);

  // Deep links. #s7 opens slide 7, #k12 opens step 12, #jpegtrust sets the audience.
  let start = 0, a0 = null;
  try { a0 = localStorage.getItem('ss-aud'); } catch (e) { /* storage blocked */ }
  (location.hash || '').slice(1).split('-').forEach(t => {
    let m = /^s(\d+)$/.exec(t);
    if (m) { const si = +m[1] - 1, k = steps.findIndex(([i]) => i === si); if (k >= 0) start = k; }
    m = /^k(\d+)$/.exec(t);
    if (m) start = Math.min(steps.length - 1, +m[1]);
    if (t === 'iptc' || t === 'jpegtrust') a0 = t;
  });
  setAudience(a0 === 'jpegtrust' ? 'jpegtrust' : 'iptc');
  go(start);
  wake();

  return { go, steps, slides, get current() { return cur; } };
}

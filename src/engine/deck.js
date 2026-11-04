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
//
// Audiences. A switches between them. Slides without data-auds belong to the talk, shown
// for IPTC and JPEG Trust. data-auds="iui" (a space-separated list) limits a slide to those
// audiences, so the IUI demo video has its own slides and order.

const W = 1920, H = 1080;
const AUDS = { iptc: 'IPTC', jpegtrust: 'JPEG Trust', iui: 'IUI' };
const ORDER = Object.keys(AUDS);
const TALK = ['iptc', 'jpegtrust'];
const inAudience = (s, a) => (s.dataset.auds ? s.dataset.auds.trim().split(/\s+/) : TALK).includes(a);

export function createDeck({ viewport, stage, pile, layouts, ui }) {
  const all = [...stage.querySelectorAll('.slide')];
  let slides = [];
  const steps = [];
  function collect(a) {
    slides = all.filter(s => inAudience(s, a));
    steps.length = 0;
    slides.forEach((s, i) => { const n = +(s.dataset.steps || 1); for (let b = 0; b < n; b++) steps.push([i, b]); });
  }

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
    const s = slides[i];
    all.forEach(sl => { sl.classList.toggle('on', sl === s); sl.setAttribute('aria-hidden', sl === s ? 'false' : 'true'); });
    s.dataset.beat = b;
    s.querySelectorAll('[data-in]').forEach(e => e.classList.toggle('in', b >= +e.dataset.in));
    s.querySelectorAll('[data-out]').forEach(e => e.classList.toggle('gone', b >= +e.dataset.out));
    s.querySelectorAll('[data-only]').forEach(e => e.classList.toggle('off', !e.dataset.only.split(',').map(Number).includes(b)));
    s.querySelectorAll('.pill[data-k]').forEach(p => { const kk = +p.dataset.k; p.classList.toggle('now', kk === b); p.classList.toggle('past', kk < b); });
    // A slide's video[data-autoplay] plays while the slide is on and pauses when it leaves
    all.forEach(sl => sl.querySelectorAll('video[data-autoplay]').forEach(v => { if (sl === s) v.play().catch(() => {}); else v.pause(); }));
    cur = k;
    applyLayout();
    updateUI();
  }

  function applyLayout() {
    if (cur < 0) return;
    const [i, b] = steps[cur];
    const s = slides[i];
    const lay = layouts[s.dataset.id];
    pile.apply(lay ? lay(b, aud) : {});
  }

  function updateUI() {
    if (cur < 0) return;
    const [i, b] = steps[cur], n = +(slides[i].dataset.steps || 1);
    ui.count.textContent = `${i + 1} / ${slides.length}` + (n > 1 ? `  ·  ${b + 1} of ${n}` : '');
    renderNotes(i);
    try { history.replaceState(null, '', '#s' + (i + 1) + (aud === 'iptc' ? '' : '-' + aud)); } catch (e) { /* sandboxed viewers */ }
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

  // Switching keeps the current slide when the new audience has it, else starts from the top.
  function setAudience(a, move = true) {
    const was = cur >= 0 ? slides[steps[cur][0]] : null;
    aud = a;
    collect(a);
    document.body.dataset.aud = a;
    ui.audButton.textContent = 'Audience: ' + AUDS[a];
    try { localStorage.setItem('ss-aud', a); } catch (e) { /* storage blocked */ }
    if (move) { const k = steps.findIndex(([i]) => slides[i] === was); go(k >= 0 ? k : 0); }
  }
  const nextAudience = () => ORDER[(ORDER.indexOf(aud) + 1) % ORDER.length];

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
    else if (k === 'a' || k === 'A') setAudience(nextAudience());
    else if (k === 'f' || k === 'F') fullscreen();
    else return;
    wake();
  });
  stage.addEventListener('click', e => {
    if (e.target.closest('a, button, video')) return;
    const r = stage.getBoundingClientRect();
    go(e.clientX - r.left < r.width * .3 ? cur - 1 : cur + 1);
  });
  ui.prev.addEventListener('click', () => go(cur - 1));
  ui.next.addEventListener('click', () => go(cur + 1));
  ui.notesButton.addEventListener('click', () => setNotes(ui.notes.hidden));
  ui.audButton.addEventListener('click', () => setAudience(nextAudience()));
  ui.fullButton.addEventListener('click', fullscreen);

  // Deep links. #s7 opens slide 7, #k12 opens step 12, #jpegtrust or #iui sets the audience.
  // Slide and step numbers count within the audience.
  let a0 = null, si = null, k0 = null;
  try { a0 = localStorage.getItem('ss-aud'); } catch (e) { /* storage blocked */ }
  (location.hash || '').slice(1).split('-').forEach(t => {
    let m = /^s(\d+)$/.exec(t);
    if (m) si = +m[1] - 1;
    m = /^k(\d+)$/.exec(t);
    if (m) k0 = +m[1];
    if (AUDS[t]) a0 = t;
  });
  setAudience(AUDS[a0] ? a0 : 'iptc', false);
  let start = 0;
  if (si !== null) { const k = steps.findIndex(([i]) => i === si); if (k >= 0) start = k; }
  if (k0 !== null) start = Math.min(steps.length - 1, k0);
  go(start);
  wake();

  return { go, steps, get slides() { return slides; }, get audience() { return aud; }, get current() { return cur; } };
}

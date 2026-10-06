# STOP&SCAN and Amito deck

A 30 minute talk for the IPTC working group and JPEG Trust. The STOP&SCAN team (AMAS humanities group) presents the framework, and the Amito team (AMAS technology group) presents the toolkit. Questions come after the 30 minutes. The deck is a Vite app in plain JavaScript, presented in a browser at 1920 x 1080 and scaled to fit.

## Commands

```bash
npm install          # Vite only
npm run dev          # http://localhost:5173 with live reload
npm run check        # validates slide files. Run after every change
npm run build        # check, then build to dist/
npm run shots        # screenshots of every step to shots/ (needs Playwright, see below)
npm run shots -- --slides 8     # just slide 8, all its beats
npm run pdf          # PDF fallback, one page per step, to exports/
```

Playwright and pdf-lib are not default dependencies because Playwright downloads a browser. Install them when you need screenshots with `npm i --no-save playwright pdf-lib && npx playwright install chromium`. If a Chromium binary already exists, point `CHROMIUM_PATH` at it instead of installing.

## How it fits together

- `src/slides/*.html` holds one `<section class="slide">` per file. `src/slides/index.js` sets the order. The tech team's slides are in `src/slides/tech/`.
- `src/engine/deck.js` handles navigation, beats, notes, the audience switch and deep links. It knows nothing about the talk.
- `src/pile/chips.js` lists the methods in the pile. `src/pile/layouts.js` places them on each slide by the slide's `data-id`. `src/pile/pile.js` moves them with CSS transitions.
- `src/styles/design-system/` is copied from the STOP&SCAN design system. Don't edit it here. `src/styles/deck.css` maps deck tokens onto it, `slides.css` holds per-slide components, and `chrome.css` holds the presenter controls.
- `public/media/` holds brand images. Slides reference them as `media/...`.

### Slide attributes

| Attribute | Meaning |
| --- | --- |
| `data-id` | Layout key in `src/pile/layouts.js`. Slides without a layout hide the pile |
| `data-label` | Name shown in the notes panel |
| `data-steps="n"` | Number of beats on the slide, default 1 |
| `data-in="k"` | Element appears from beat k (0-based) |
| `data-out="k"` | Element leaves from beat k |
| `data-only="k"` | Element shows only on beat k, or a comma list |
| `.pill[data-k]` | Step strip pill, gets `.now` on beat k and `.past` before it |
| `<aside class="notes">` | Speaker notes, a `<ul>` inside |

Everything on a slide is absolutely positioned in stage pixels (1920 x 1080). Keep text clear of the bottom 60px, where the `.src` source line sits.

## Rules for content

- **Claims.** Every factual claim on a slide must match `docs/claims.md`, word for word in substance, with its source in the slide's `.src` line. Label preprints and blog posts as such. If a claim isn't in the register, verify it against a primary source and add it to the register in the same change. Never round a number differently from the register.
- **Brand.** Follow `docs/design-system.md`.
  - Write STOP&SCAN exactly like that in titles. The step names are Stop, Source, Content, Alignment and Now Reflect.
  - The five step colours mean those steps only. Never reuse them for anything else.
  - Gochi Hand is for Amito's speech bubbles only.
  - No emoji.
  - Use tokens from `deck.css`. `npm run check` warns about hard-coded hex colours.
- **House style for copy.** Plain, direct sentences. No em dashes, and avoid colons and semicolons in running text. Name things the way the audience does, for example media integrity, provenance, content credentials.
- **Logos.** Tool logos may be used, taken from favicons. Save them in `public/media/logos/`.
- **Not shown.** The video forensics ontology is under submission. Don't add it.

## Ownership

- John and the STOP&SCAN team own slides 1 to 10 and 15 to 18, plus `docs/claims.md`.
- The Amito tech team owns `src/slides/tech/`. They may add slides there. Import any new ones in `index.js` between the handoff and the asks.
- Changes to `src/engine/` or `src/pile/` affect everyone. Keep them small and describe them in the PR.

## Before you finish a change

1. Run `npm run check` and fix any errors.
2. Run `npm run shots -- --slides <n>` for each slide you touched, then look at the images for overlaps, clipped text or chips sitting on top of content.
3. If you changed a claim, update `docs/claims.md` in the same commit.

# STOP&SCAN and Amito deck

The presentation for the IPTC working group and JPEG Trust. It runs in a browser, built with Vite and plain JavaScript on the STOP&SCAN design system.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:5173. Saving any file reloads the page.

## Present it

| Key | Action |
| --- | --- |
| Right arrow, space, click | Next beat |
| Left arrow, click on the left third | Previous beat |
| N | Speaker notes |
| A | Switch the asks between IPTC and JPEG Trust |
| F | Full screen |
| Home, End | First or last step |

Deep links work too. `#s8` opens slide 8, `#s17-jpegtrust` opens slide 17 with the JPEG Trust asks.

## Edit it

Each slide is one HTML file in `src/slides/`, and `src/slides/index.js` sets the order. Slides can reveal content in beats with `data-steps`, `data-in`, `data-out` and `data-only`. `CLAUDE.md` explains every attribute.

The moving method chips are defined in `src/pile/chips.js` and placed per slide in `src/pile/layouts.js`.

Brand tokens come from the STOP&SCAN design system in `src/styles/design-system/`. Brand rules are in `docs/design-system.md`. Every factual claim must match `docs/claims.md`.

### Tech team

Your slides are in `src/slides/tech/`. Copy one of them to add another, import it in `src/slides/index.js` between the handoff and the asks, and run `npm run check`. A slide whose `data-id` is `tech` hides the method pile, so you have the whole stage.

## Check it

```bash
npm run check   # catches missing attributes, beat numbers that don't exist, missing images
npm run build   # runs the check, then builds to dist/
```

For screenshots of every step, or a PDF fallback, install Playwright once.

```bash
npm i --no-save playwright pdf-lib && npx playwright install chromium
npm run shots                # shots/kNN.png for every step
npm run shots -- --slides 8  # only slide 8
npm run pdf                  # exports/stopscan-deck.pdf
```

## Work on it with Claude Code

Open the repo in Claude Code. `CLAUDE.md` gives it the structure, the content rules and the checks to run before finishing. Ask for changes in plain language, for example "make the asks slide tighter" or "add a slide after the demo about the roadmap". Review the screenshots it produces before merging.

## Collaborate

Work on a branch and open a pull request. The STOP&SCAN team owns the slides outside `tech/` and `docs/claims.md`, and the tech team owns `src/slides/tech/`. Changes to `src/engine/` or `src/pile/` affect everyone, so call them out in the PR.

## Deploy

`npm run build` writes a static site to `dist/` with relative paths, so it works on any static host. To serve it at slides.stopandscan.org on GitHub Pages, add a `public/CNAME` file containing `slides.stopandscan.org`, publish `dist/`, and point the domain's DNS at GitHub Pages.

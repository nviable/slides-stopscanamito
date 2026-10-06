# STOP&SCAN Design System

Design system for **STOP&SCAN**, a five-step digital-literacy habit ("pause before you trust, scan before you share, reflect before you act") built for the ITU AI for Good AMAS Young Researcher Associate Programme. **Amito** is the friendly mascot/guide who carries the experience; STOP&SCAN is the brand and the habit itself.

The product is a single Astro + React educational website (no separate mobile app or docs site) covering: a marketing home page, a guided **Learn** lesson, an independent **Practice** case library, a **Resources** hub (the reasoning behind each step), a **Meet Amito** character page, comics, a `localStorage`-only reflection journal, and a project/about page.

## Sources

This system was built by reading the live product source, not by guessing from screenshots:

- **GitHub repo:** [nviable/amas-stop-and-scan](https://github.com/nviable/amas-stop-and-scan) — Astro + React + Tailwind. Key files read: `design.md` (the repo's own brand guideline doc), `tailwind.config.js`, `src/index.css`, `src/components/**`, `src/lib/framework.ts`, `src/lib/assets.ts`, `src/data/resources.ts`, `docs/LESSON_CONTENT_GUIDE.md`, `SITEMAP.md`.
- No Figma file or slide deck was attached.

**Explore the repo further** if you need something this system doesn't cover — the full lesson engine (`src/components/lesson/LessonEngine.tsx`), case-file JSON schema (`src/lib/caseTypes.ts`, `src/data/cases/*.json`), the PDF comic reader, and the hero canvas animations (`src/lib/heroFluid.ts`, `src/lib/heroGrid.ts`) all live there and were intentionally simplified or omitted here (see "Intentional additions & omissions" below).

## Content fundamentals

**Voice:** warm, clear, encouraging — a guide beside the learner, never an authority that "detects fakes." Short sentences, concrete actions. Cynicism, scolding, and "gotcha" framing are explicitly against the brand.

**Certainty is not the goal — calibration is.** The single most distinctive copy rule: *"I don't know yet" is a complete and honest answer.* Copy validates uncertainty rather than demanding a fake/real verdict. Example (footer, rotating quote): <em>"You slowed down when the post wanted speed. That is the habit."</em>

**Person:** copy speaks directly to the learner in second person ("Before checking, I felt…" is the learner's own reflection prompt, written as first person for them to complete). Amito speaks in first person ("Hi! I'm Amito.").

**Framework naming is exact and consistent:** always **STOP&SCAN** (ampersand, no spaces) in titles/logos; **Stop & Scan** acceptable in body prose. Steps are **Stop, Source, Content, Alignment, Now Reflect** — SCAN is a backronym of Source/Content/Alignment/Now-reflect, with Stop as the pre-commitment step before it. Never call Amito "the product" — "Amito carries the experience — but STOP&SCAN is the habit."

**No emoji in UI chrome.** The one expressive-punctuation exception is a flag glyph (⚑) used inside lesson feedback to mark a teaching-signal option — not decorative emoji. Sample case-file post copy (in-world "bad" content being evaluated) does use emoji (🚀, 🙏) — that's mimicking real manipulative social posts, not the brand's own voice.

**Vibe:** educational, calm, a little playful (Amito, Gochi Hand speech bubbles) but never juvenile or gimmicky. Sentences are short and instructional in headings, slightly longer and reasoned in body/"why it works" copy.

## Visual foundations

**Color:** light paper theme by default (`#fbf8f2` background, `#f6f0e4` cream, lilac-tinted `#fef7ff` surfaces). One primary blue (`#004cd7`) for the single most important action per view — sparingly. Five **framework step colors** are strictly semantic (stop-red, source-cyan, content-green, alignment-pink, reflect-orange) and are never reused for unrelated UI states (e.g. stop-red ≠ generic error). A small set of supporting accents (fuel-yellow, turquoise, pastel-green, flamingo, welcome-blue, lilac-accent) add warmth without touching the primary/framework palettes. Dark inverse surface (`#342b4b`) is reserved for the footer and dark panels — the site never defaults to dark mode.

**Type:** Outfit (display/headings/labels, 600–700 weight) + Nunito Sans (body, 400–700) + Gochi Hand (Amito's speech bubbles only — never for anything else). Labels/nav are uppercase Outfit with +0.05em tracking. Display sizes are large (48/56 hero, 32/40 section) — this is a confident, roomy type system, not a dense one.

**Spacing:** a tight, deliberate 6-step scale — 4·8·16·24·32·48px (xs→xxl). Page margins: 20px mobile / 40px desktop. Content max-width 1152px.

**Corner radius:** small controls 4–12px; cards and panels 24px (`rounded-xxl`); buttons and chips are fully pill-shaped (`rounded-full`). Sharp and pill radii are never mixed within one composition.

**Cards:** white or `surface-container-lowest`, 24px radius, soft shadow (`0 4px 20px -2px rgba(36,27,58,.08)`), a barely-there hairline border (`1px solid rgba(31,22,53,.1)`) — no colored left-border accents.

**Backgrounds:** mostly flat/solid framework-step colors or the light hero gradient (`linear-gradient(180deg,#dce1ff,#fbf8f2)`); a very subtle 24px dot-grid "paper texture" sits behind general page chrome. No repeating illustrated patterns. The source app also drives two canvas-based generative backgrounds (a WebGL-ish "smoke" fluid sim on the home hero, an animated dot-grid on step heroes) — decorative and implementation-heavy, so this design system stands in with static gradients/solids (see omissions below) rather than recreating the canvas code.

**Imagery:** Amito mascot art is warm, flat-shaded, friendly-cartoon style (not photographic, not 3D-rendered) — the closest thing this brand has to "photography." No grain, no B&W treatment, no stock-photo aesthetic. Full-bleed use is common for the mascot in hero moments; team photos exist for the About/Project page context but aren't part of the visual brand system.

**Animation:** calm and purposeful, never noisy. A gentle 4s float (±12px) on spotlight Amito art; a 2.4s glow-pulse behind the mascot; buttons/options press to `scale(0.95)` over ~150ms; framework tiles lift slightly on hover (`scale(1.02–1.05)`). Every animation has a `prefers-reduced-motion` fallback (static pose / solid ring instead of pulsing).

**Hover / press states:** primary buttons brighten (`brightness(1.05)`) on hover; accent (outlined) buttons fill solid on hover; ghost buttons tint to cream; inverse buttons drop to 90% opacity. All interactive buttons/options press to 95% scale — no color-shift press state.

**Borders & shadows:** two elevation levels only — `shadow-soft` (cards, bubbles) and the slightly heavier `shadow-card` (elevated panels, hero CTAs). Hairline borders (`1px solid rgba(31,22,53,.1)`) are preferred over heavy chrome.

**Transparency & blur:** used narrowly — the sticky header is paper at 90% opacity with a backdrop blur; a soft lilac "aura glow" (blurred, low-opacity box-shadow) sits behind Amito spotlight cards. Not used as a general surface treatment.

**Layout rules:** header is fixed/sticky across all pages; footer is dark inverse-surface, never sticky. Content is centered with a hard 1152px max-width and consistent mobile/desktop side margins — no full-width text blocks.

## Iconography

Two parallel icon systems, used for different purposes:

1. **UI chrome icons** — [Lucide](https://lucide.dev) (2px stroke, no fill, `size-[1em]`), the same visual language as this design system's `Icon` component. The source app imports `lucide-react` (npm); since components here can't depend on npm packages, `Icon` instead drives the Lucide **CDN UMD build** (`unpkg.com/lucide@.../umd/lucide.js`) via `data-lucide` attributes — same icons, same stroke weight, CDN-loaded. One custom exception exists upstream (a hand-drawn LinkedIn glyph, since Lucide dropped brand icons) — not recreated here since it's a one-off social link, not a system icon.
2. **Framework step icons** — five bespoke PNG icons (`assets/amito/icons/{stop,source,content,alignment,reflect}.png`), always shown on a white circle over the step's brand color, paired with the matching Amito pose. These are brand assets, not part of an icon font/set — copied in as-is.

No emoji are used as icons anywhere in the product UI. Unicode is not used for iconography (the ⚑ flag in lesson feedback is the one exception, functioning as a signal marker rather than decoration).

## Font note

Outfit, Nunito Sans, and Gochi Hand are **the real brand fonts** (no substitution needed) — loaded via a Google Fonts CDN `@import` in `tokens/typography.css` rather than self-hosted `@font-face` binaries, since the source repo ships them as `@fontsource` npm packages (a build-time dependency, not a static font file this project could copy). If you need them self-hosted, download the Outfit/Nunito Sans/Gochi Hand `.woff2` files from Google Fonts or the `@fontsource` npm packages and swap the `@import` in `tokens/typography.css` for local `@font-face` rules.

## Intentional additions & omissions

**Additions** (the source app defines these only as Tailwind utility classes, not components — formalized here as reusable primitives): `Button` (was `.btn-primary/accent/ghost/inverse`), `Card` (was `.card`), `Chip` (was `.chip`), `NavLink` (was `.nav-link`), `ChoiceOption` (was the option tile inside `ChoiceGroup`).

**Omissions:** `HeroSection`/`StepHeroSection`'s canvas-driven animated backgrounds (fluid smoke sim, animated dot grid) were not recreated — too implementation-heavy for a static design system; the UI kit uses flat gradients/solid colors instead. `MobileNav`'s slide-in hamburger drawer, the PDF comic reader, the full case-file lesson engine (real case JSON, hint/reveal logic, journal persistence), and one-off content blocks (`AmitoToolkitBlock`, `AiForGoodSummitBlock`) are out of scope for this system — read them directly in the source repo if you need to rebuild that functionality.

## What's in this project

- **`styles.css`** — root stylesheet; imports everything under `tokens/`.
- **`tokens/`** — `colors.css`, `typography.css` (+ Google Fonts import), `spacing.css`, `effects.css` (shadows, motion, paper texture).
- **`assets/`** — `logo.png` (full-color wordmark + hand icon — the only lockup found in the source repo; no separate monochrome/icon-only mark exists, so `brightness(0) invert(1)` is used for dark backgrounds), `favicon.svg`, `icon-512.png`, `amito/` (mascot poses + step icons), `media/`, `comics/`.
- **`guidelines/`** — 18 foundation specimen cards (Colors ×4, Type ×4, Spacing ×3, Effects ×3, Brand ×4) driving the Design System tab.
- **`components/`** — 17 React primitives grouped by concern:
  - `core/` — Icon, Button, Card, Chip
  - `feedback/` — SpeechBubble
  - `amito/` — Amito, AmitoSays, AmitoSpotlight
  - `layout/` — HeroBadge, PageHero, CtaBanner
  - `navigation/` — NavLink, SiteHeader, SiteFooter
  - `lesson/` — StepProgress, ChoiceOption
  - `media/` — YouTubeTeaser
- **`ui_kits/website/`** — interactive click-through recreation of the site (Home, Learn + a fully playable 5-step lesson demo, Practice, Resources, Meet Amito).
- **`SKILL.md`** — Claude Code / Agent Skills-compatible entry point for this system.

## Caveats — please help iterate

- Fonts load from the Google Fonts CDN rather than self-hosted files (see note above) — send the actual `.woff2` files if you'd rather this system be fully offline-capable.
- The hero canvas backgrounds (fluid smoke, animated dot grid) are a distinctive part of the live site's feel and are **not** reproduced — flag if you want a static-approximation version built.
- Case-file content in the UI kit's Learn demo is illustrative, written to match the tone/structure of the real cases in `src/data/cases/` — not copied verbatim.
- Only one logo lockup was found in the source repo (the full-color wordmark); if a separate icon-only or monochrome mark exists elsewhere, please attach it.

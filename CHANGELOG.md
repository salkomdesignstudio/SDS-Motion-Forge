# Changelog

## [Unreleased] — v5 Phase 1: Registry + Lossless Modular Builds

> **Compatibility statement:** dist/motion.css remains computed-value-identical
> to published 4.0.3 (verify-against-published: 0 deviations). All new files
> are additive; no existing export, path, class or keyframe changed.

### Added

- **`registry/motion.registry.json`** — the machine-readable single source of
  truth (R3): 388 classes with category, keyframes, tokens used, custom
  properties, compositor-safety, requires-char-split / requires-children /
  requires-js flags, trigger type, alias links and since-version. Generated
  from source CSS by `scripts/generate-registry.js`; authored descriptions
  live only in `registry/meta/descriptions.json`. `npm run verify:registry`
  fails the build on any drift (permanent CI step).
- **Category source split** — `src/categories/{core,text,buttons,inputs,cards,loaders,scroll}.css`.
  `src/motion.css` is now a thin `@import` entry inlined by postcss-import at
  build time. The one-time split was machine-verified lossless
  (`scripts/split-css.js`): 607 selectors and 324 keyframes — zero missing,
  zero duplicated, per-selector cascade order preserved. The cross-category
  `will-change` hint rule was split per category (appended after each
  category's own rules, preserving its cascade position); the interactive tail
  block stayed in text.css to keep the published `.sds-ink-bleed` /
  `.sds-char-orbit` declaration order.
- **Standalone category bundles** — `dist/categories/{name}.css` + `.min.css`,
  built by `scripts/build-categories.js`: core (tokens + modifiers +
  reduced-motion + scroll gate) + the category + cross-category keyframe
  dependencies resolved from the source partition (never regex). Decision:
  core is inlined (≈3 KB min / ≈1 KB gzip) so every bundle is paste-and-go via
  npm and CDN; multi-category users should import `dist/motion.css` (single
  core copy). Verified per-build by `npm run verify:split` (partition
  integrity, keyframe closure, entry order, standalone completeness incl.
  reduced-motion).
- **New exports** (all additive): `./categories/{core,text,buttons,inputs,cards,loaders,scroll}`,
  explicit `./dist/categories/*.css(.min.css)` paths,
  `./registry/motion.registry.json`, `./tokens/motion.tokens.json`,
  `./tokens/figma.tokens.json`. Tokens + registry now ship in the tarball.
- **`examples/vite-loaders`** — acceptance fixture: a Vite app importing only
  `categories/loaders`, rendering all 51 loaders from the registry export;
  `scripts/verify-loaders-example.js` asserts selector + keyframe completeness
  of the emitted CSS.
- **`index.d.ts`** — module declarations for every new CSS subpath.
- README: per-category min+gzip size table (generated into markers by the
  build — never hand-edited) and category-bundle usage docs.

### Changed

- `npm run build` additionally builds category bundles and regenerates the
  registry; `release:check` adds `verify:registry` and `verify:split`.
- `postcss.config.js` adds `postcss-import` (devDependency) to inline the
  category entry; `dist/motion.css` output remains equivalent (gate-proven).

## [Unreleased] — v5 Phase 0: Motion Token System + Specification

> **Compatibility statement:** zero computed-value deviations from published
> 4.0.3, machine-proven on every build by `scripts/verify-against-published.js`
> against the committed tarball baseline (`baseline/`). Report:
> `compat/compatibility-report.md`.

### Added

- **Motion token system** — `tokens/motion.tokens.json` (W3C Design Tokens format):
  - Duration scale `--sds-duration-{instant,fast,base,slow,slower,dramatic}`
    (0.3s / 0.4s / 0.8s / 1.4s / 2.2s / 3s) — values derived from existing v4
    usage so no default changed.
  - Easing scale `--sds-ease-{standard,decelerate,accelerate,emphasized,spring,bounce}`
    — the six cubic-beziers already shipped in v4, extracted and named verbatim.
  - Distance scale `--sds-distance-{sm,md,lg}` (24/48/80px) for entrance offsets (new).
- **`scripts/generate-tokens.js`** (`npm run build:tokens`) — generates from the
  tokens JSON: the CSS custom-property block in `src/motion.css`,
  `tokens/figma.tokens.json` (Tokens Studio format for the SDS Figma plugin suite),
  and `tokens/sds-motion-tokens.ts` (TypeScript constants). `--check` mode fails
  the build on drift (wired into `release:check`).
- **`SPEC.md`** — the SDS Motion Specification: principles, duration/easing
  selection matrix, choreography rules, reduced-motion philosophy,
  compositor-only policy, naming and governance.
- **`scripts/verify-against-published.js`** (`npm run verify:published`) — the
  permanent R1 compatibility gate. Diffs exports map, every published selector's
  computed declarations (var()-resolved), every keyframe block, `:root` token
  defaults, and the JS engines' public API surface against the published
  tarball. Any unapproved deviation fails the build; emits
  `compat/compatibility-report.md`.
- **`baseline/`** — committed `npm pack` of published 4.0.3 (the contract).
- **`registry/inventory.json` + `registry/INVENTORY.md`** — generated inventory
  of all 388 published classes: category, keyframes, custom properties,
  compositor-safety audit, duration/easing usage statistics, and documented
  pre-existing anomalies (e.g. `sds-charOrbitBob` referenced but never defined;
  duplicate `.sds-ink-bleed` declaration).
- **`index.d.ts`** — additive `SdsDurationToken`, `SdsEasingToken`,
  `SdsDistanceToken` types.

### Changed (value-identical, gate-verified)

- `src/motion.css` animation declarations now reference tokens with literal
  fallbacks (e.g. `var(--sds-duration-slow, 1.4s)`): 102 duration literals and
  37 easing literals tokenized; `sds-fast`/`sds-normal`/`sds-slow`/`sds-xslow`
  modifiers route through the scale; legacy `--sds-duration`/`--sds-easing`
  resolve through the v5 tokens. Computed defaults are byte-for-byte identical.
- `npm run build` now runs token generation first; `release:check` additionally
  runs `verify:tokens` and `verify:published`.

### Nothing removed, nothing renamed

Every v3/v4 class name, keyframe name, dist path, export subpath, data
attribute and CDN usage pattern is untouched.

## [4.0.3] - 2026-06-01

### Fixed — Critical (production impact)

- **`dist/sds-scroll.min.js`** — `rootMargin` value was `'0px 0px-40px 0px'` (missing space between `0px` and `-40px`), causing `new IntersectionObserver()` to throw a `DOMException` in all browsers. All `[data-sds]` scroll-gate animations were silently broken for every user of the scroll engine. Fixed to `'0px 0px -40px 0px'`.

- **`dist/sds-scroll.min.js` + `dist/motion-interactive.min.js`** — Both minified JS files were hand-authored shadow copies of their source files with no automated build derivation. They had diverged from `src/` (confirmed by SHA256 hash comparison and structural analysis) and had no `sourceMappingURL`. Any future manual edit would reproduce the rootMargin class of bug. Added `terser` to `devDependencies` with a `build:js` script that generates both files from source with source maps. The hand-authored artifacts are now in `.gitignore` and must never be committed.

- **`verify-build.js`** — The pre-publish gate checked for `href="../dist/motion.min.css"` in `docs/index.html`, which was the old incorrect path. This caused `npm run release:check`, CI, and `npm publish` to fail permanently. Updated to check the correct `dist/motion.min.css` path.

- **`docs/index.html` — CSS path** — `href` was `../dist/motion.min.css`. When Netlify serves `docs/` as the web root (`netlify.toml`: `publish = "docs"`), `../dist/` resolves above the publish root and the file is not found. The CDN fallback fired on every production page load, adding ~200–400ms latency and FOUC. Changed to `dist/motion.min.css`, matching the `docs/dist/` copy created by the Netlify build command. The `netlify.toml` comment documented this as the correct path since v4.0.0 — the HTML was never updated to match.

### Fixed — Correctness

- **`docs/index.html` — Scroll docs** — Code example used `data-sds` attribute with `sds-in` class. These belong to different systems: `[data-sds]` is activated by `sds-play` (the `sds-scroll.min.js` engine); `sds-in` activates `[data-sds-scroll]` (the inline IntersectionObserver path). Any developer copying this example shipped a scroll animation that stayed hidden permanently. Fixed: attribute changed to `data-sds-scroll` and selector updated to match.

- **`docs/index.html` — Stagger previews** — `sds-scroll-stagger-pop` and `sds-scroll-stagger-grid` gallery cards and modal previews rendered as a single childless `<span>`. The CSS for these classes targets `> *` (direct children), so animations were completely invisible. Added 4 child `<span>` elements to `previewMarkup` (gallery) and `previewMarkupModal` (modal). Updated `modalApply()` and `modalReplay()` to reset child elements for stagger types.

- **`docs/index.html` — Wave replay** — Gallery card hover-replay reset `demo.style.animation` on the parent element. For wave and char-split animations, the actual CSS animations are on `.sds-char` child spans. `play()` now queries `.sds-char` descendants and resets them when present.

- **`docs/index.html` — Malformed closing tag** — Hero CTA "Browse 300+ Animations" button had `</` + newline + `>` instead of `</a>`, producing a bogus comment token and an unclosed `<a>` element in the DOM.

- **`docs/index.html` — Gallery description** — Copy said "Click to copy the class." Clicking opens the detail modal. Updated to "Click to open the detail view and copy code."

- **`docs/index.html` — Clipboard** — All five `navigator.clipboard.writeText()` calls were fire-and-forget. Fails silently under `file://` or when clipboard permission is denied. Added `.then()/.catch()` with visual error state on every copy button.

### Fixed — Accessibility

- **`docs/index.html` — Gallery keyboard access** — Gallery `<div class="card">` elements had click handlers but no `tabindex`, `role`, or `keydown` support. Added `tabindex="0"`, `role="button"`, `aria-label`, and Enter/Space keyboard handlers to every generated card.

- **`docs/index.html` — Search label** — Search `<input>` had no programmatic label. Added `aria-label="Search animations"`.

### Fixed — Versioning

- **`docs/index.html`** — Page `<title>`, nav version pill, and hero badge all showed `v4.0.0`. Updated all three to `v4.0.3`.

- **`src/motion.css` + `dist/motion.css`** — CSS header comment showed `Version: 4.0.0`. Updated to `4.0.3`.

### Fixed — TypeScript

- **`index.d.ts`** — Type unions were severely incomplete. Every class in `dist/motion.css` is now typed:

  | Type                 | Before   | After         |
  | -------------------- | -------- | ------------- |
  | `SdsTextAnimation`   | 28 / 100 | **100 / 100** |
  | `SdsButtonAnimation` | 13 / 50  | **50 / 50**   |
  | `SdsInputAnimation`  | 14 / 51  | **51 / 51**   |
  | `SdsCardAnimation`   | 13 / 49  | **49 / 49**   |
  | `SdsLoaderAnimation` | 12 / 51  | **51 / 51**   |
  | `SdsScrollAnimation` | 20 / 54  | **54 / 54**   |

  Added `SdsInteractiveAnimation` (7 JS-engine classes) and `SdsScrollGate` (`sds-play`, `sds-scroll-auto`). JSDoc comments document which classes require child elements and which engines need to be loaded.

### Added — Build Pipeline

- **`terser@^5.48.0`** added to `devDependencies`. JS engines are now minified from source by `npm run build:js` with source maps. The `build` script now runs `npm run build:css && npm run build:js`.
- **Source maps** generated for both engines: `dist/sds-scroll.min.js.map` and `dist/motion-interactive.min.js.map`. Both are included in the npm package and resolvable via CDN.
- **`.gitignore`** — Added `dist/sds-scroll.min.js`, `dist/sds-scroll.min.js.map`, `dist/motion-interactive.min.js`, `dist/motion-interactive.min.js.map` and `docs/dist/`. Generated artifacts are never committed.
- **`package.json` exports** — Added source map files to `exports` map and `"files"` array.
- **`browserslist`** field added to `package.json` (`> 0.5%, last 2 versions, not dead, not ie 11`). Autoprefixer target is now explicit and deterministic.
- **`"type": "commonjs"` removed** — CSS libraries have no module type. The field was incorrect and misleading to tooling.
- **`engines.node`** updated from `>=14` to `>=18`. Node 14 reached EOL in April 2023.

### Added — verify-build.js (8 stages, was 7)

- **Stage 1** — Added source map files and JS source files to `REQUIRED_FILES`.
- **Stage 6** — New: `sds-scroll.min.js` rootMargin validity check (no digit-immediately-adjacent-to-dash pattern).
- **Stage 6** — New: both `*.min.js` files must contain `sourceMappingURL` — proves they were built by terser, not hand-authored.
- **Stage 6** — New: size regression gates (scroll engine < 5 KB, interactive engine < 15 KB).
- **Stage 7** — New: CSS header version must match `package.json` version.
- **Stage 7** — New: `docs/index.html` version string must match `package.json` version.

### Performance

- `dist/sds-scroll.min.js`: 1.6 KB → **1.28 KB** on disk (0.62 KB gzip) — 20% smaller.
- `dist/motion-interactive.min.js`: 9.3 KB → **6.98 KB** on disk (2.41 KB gzip) — 25% smaller.

### Documentation

- **`README.md`** — Complete rewrite: accurate file sizes, correct animation counts, TypeScript usage with React/Angular/Vue examples, full stagger/children documentation for all categories, Contributing guide, complete modifier reference, PostCSS integration, Svelte/SvelteKit integration, corrected project structure.
- **`docs/index.html`** — Fixed incorrect "38kb" minified size stat, added CHANGELOG link in footer, updated contributor documentation.

---

## [4.0.0] - 2026-06-01

### Added

#### Text animations — grew from 50 to 100 (+50 new classes)

**5 physics animations (per-character, use `.sds-char` spans with `--i` index):**

- `sds-gravity-bounce` — inelastic floor bounce with decreasing amplitude
- `sds-drop-settle` — staggered per-char fall with spring overshoot
- `sds-wave-cascade` — translateY wave propagates char-to-char (loop)
- `sds-center-burst` — chars start at center, fan out to reading position
- `sds-explode-formation` — chars start scattered (`--dx`, `--dy`, `--dr`), spring into place

**45 new motion family classes:**
`sds-fold-down`, `sds-fold-up`, `sds-flip-x`, `sds-flip-y`, `sds-door-open`,
`sds-zoom-punch`, `sds-zoom-far`, `sds-vapor-rise`, `sds-light-speed`, `sds-roll-in`,
`sds-swing-in`, `sds-skew-slide`, `sds-pop-in`, `sds-tracking-expand`, `sds-tracking-contract`,
`sds-blur-focus`, `sds-wipe-right`, `sds-wipe-left`, `sds-reveal-up`, `sds-reveal-down`,
`sds-iris-open`, `sds-shimmer-sweep`, `sds-color-cycle`, `sds-glow-pulse`, `sds-neon-flicker-in`,
`sds-echo-out`, `sds-shadow-lift`, `sds-spotlight-text`, `sds-pixel-in`, `sds-glitch-slide`,
`sds-squash-stretch`, `sds-bounce-drop`, `sds-slant-rise`, `sds-grand-entrance`,
`sds-slide-blur-left`, `sds-slide-blur-right`, `sds-wobble`, `sds-rubber-band`, `sds-jello`,
`sds-tada`, `sds-heartbeat-text`, `sds-typing-caret`, `sds-float-bob`,
`sds-underline-grow`, `sds-strike-through`

#### New files

- `src/sds-scroll.js` / `dist/sds-scroll.min.js` (1.6 KB) — scroll-gate engine
  - `[data-sds]` attribute gates any animation until viewport entry
  - `data-sds-repeat` replays on every re-entry
  - `data-sds-delay="N"` waits N ms after entry before starting
  - One shared `IntersectionObserver` for the whole page
  - `MutationObserver` watches for dynamically added elements (SPA-safe)
  - `prefers-reduced-motion`: immediately shows all elements, skips observer
- `src/motion-interactive.js` / `dist/motion-interactive.min.js` (9.6 KB) — JS interactive engine
  - Zero-config: add a class → engine auto-wires everything
  - `sds-word-morph` + `data-words` — blur/translate word cycling, CPU-saved via IntersectionObserver
  - `sds-jelly-hover` — squash + stretch spring on mouseenter
  - `sds-scatter-return` — chars scatter on hover, spring back on leave
  - `sds-shockwave` — click fires radial impulse force
  - `sds-spring-kerning` — mouse X maps to letter-spacing −12px…+12px
  - `sds-magnetic-pull` — cursor attracts char spans (shared rAF loop)
  - `sds-repulsion-field` — cursor pushes char spans away (shared rAF loop)
  - Exposes `window.SDSInteractive.{ scan, initEl, cleanup }` for SPA use
  - `MutationObserver` for dynamic elements; `WeakMap` for clean memory management
  - Touch/hover-incapable devices: disables magnetic, repulsion, scatter, spring-kerning
  - `prefers-reduced-motion`: skips all transitions, shows final state

#### Scroll gate CSS (added to `src/motion.css`)

```css
[data-sds]:not(.sds-play) {
  animation-play-state: paused;
  opacity: 0;
}
[data-sds].sds-play {
  opacity: 1;
  animation-play-state: running;
}
html:not(.sds-js) [data-sds] {
  opacity: 1;
  animation-play-state: running;
}
```

### Updated

- `docs/index.html` — v4.0.0, updated stats (100 text animations, 300+ total), updated hero/badges
- `package.json` — version 4.0.0, new exports for JS files, `src/` added to `files`
- `README.md` — complete rewrite for v4.0.0

### No breaking changes

All v3.x class names, keyframe names, and CSS custom properties are preserved.

---

## [3.2.2] - 2026-05-30

### Fixed

- `sds-loader-progress`, `sds-loader-data`, `sds-loader-bar` — added `position: relative` so `::after` pseudo-element renders correctly
- `sds-perspective-swing`, `sds-film-burn`, `sds-smoke-reveal`, `sds-elastic-bounce`, `sds-unfurl`, `sds-scroll-unfold` — added `will-change` for GPU acceleration, no more jank
- `sds-perspective-swing` — added `backface-visibility: hidden` to fix Chrome 3D flicker
- `sds-typewriter-pro` — added `max-width: max-content` to prevent text clipping
- `prefers-reduced-motion` — scroll-animated elements now stay visible instead of being permanently hidden at `opacity: 0`
- `package.json` exports — added `"style"` condition so Vite, Webpack 5, and Rollup correctly resolve the CSS without silent failures
- `package.json` — added `"sideEffects": ["**/*.css"]` to prevent bundlers from tree-shaking the stylesheet
- Version mismatch between CSS header and package.json — now both say 3.2.2

### Added

- Scroll animation activation via `data-sds-scroll` attribute + IntersectionObserver (paste-once script)
- CSS scroll-driven animation support via `sds-scroll-auto` class (Chrome 115+, zero JS)
- Full install guide in CSS header for Angular, React, Vue, Next.js, Flutter Web, CDN
- Stagger/children animation documentation in header
- Complete modifier reference in header

## [3.2.1] - 2026-05-28

- Minor patch release

## [3.2.0] - 2026-05-27

- Extended animation set across all 6 categories

## [3.0.2] - 2026-05-27

- Stability improvements

## [3.0.1] - 2026-05-25

- Performance improvements

## [1.1.2] - 2026-05-24

- Bug fixes

## [1.1.1] - 2026-05-24

- Initial stable release

## [1.1.0] - 2026-05-22

- First public release

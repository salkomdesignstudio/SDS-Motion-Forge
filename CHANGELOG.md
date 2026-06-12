# Changelog

## [5.0.0] — Unreleased

> ## Nothing removed, nothing changed.
> Every class name, keyframe, computed animation value, export path, dist
> file, data attribute and CDN usage pattern from v3/v4 works identically in
> v5. This is not a promise — it is machine-proven on every build by the
> published-tarball gate (`npm run verify:published`) against the committed
> 4.0.3 baseline, with the full diff published in
> [`compat/compatibility-report.md`](compat/compatibility-report.md). The two
> intentional deviations (both pure bug fixes: reduced-motion coverage for
> child-driven effects; scroll-gating of clip-path effects that never fired)
> are documented with rationale in
> [`compat/approved-deviations.json`](compat/approved-deviations.json).
>
> v5 is purely additive: motion tokens + SPEC (Phase 0), the effect registry
> and per-category bundles (Phase 1), generated Tailwind/React/Angular/
> Web-Components packages (Phase 2), the visual/perf/a11y/size quality gates
> (Phase 3), the docs platform with the machine-enforced copy-paste guarantee
> and the custom bundle builder (Phase 4), and open-source governance
> (Phase 5). Details per phase below.

## [Unreleased] — v5 Phase 5: Open-Source Governance

### Added

- **`CONTRIBUTING.md`** — the registry → codegen architecture, the published-
  tarball contract, local dev setup, and the machine-enforced checklist for
  new animations (registry entry, authored description, visual baseline,
  compositor lint, budgets).
- **RFC process** — `docs/rfcs/0000-template.md`; required for new
  categories, public API changes, token changes, and anything needing a
  compatibility deviation.
- **`VERSIONING.md`** — strict semver, the one-major deprecation cycle,
  permanent v3 alias exemption, independent wrapper versioning, and the
  `next` dist-tag promote/rollback mechanics.
- **`SECURITY.md`** (private reporting, 72h ack, supply-chain scope) and
  **`CODE_OF_CONDUCT.md`** (Contributor Covenant 2.1).
- **Issue/PR templates** — bug reports ask for a docs-playground snippet
  reproduction (the snippets are machine-verified, so the diff against them
  isolates the bug); animation requests ask for a named motion family with a
  one-line motion description and a distinctness statement, mirroring the
  SPEC quality bar; the PR template carries the compatibility statement.

## [Unreleased] — v5 Phase 4: Docs Platform + Copy-Paste Guarantee + Bundle Builder

> The website IS the product: what you see in a preview, what you copy, and
> what npm ships are now one machine-verified artifact.

### Added — the copy-paste guarantee (machine-enforced)

- **`npm run verify:snippets`** — `npm pack`s the core package, installs the
  tarball into `test/snippets-fixture/`, renders every generated snippet as
  its own standalone page (732 pages: HTML tab + Bootstrap tab × 366 effects)
  and asserts in Playwright that each one actually animates (computed
  `animation-name`, `sds-play` arrival for scroll, engine attach for
  interactive, transition wiring for label-float). **All 732 pass.** A snippet
  that only works because the docs site loaded a helper fails CI.
- **Six generated code tabs per effect** — HTML+CSS (paste-into-empty-file
  complete, with exact CDN lines), vanilla JS (engine options as comments),
  React (`<SdsMotion>`/`<SdsText>` with imports + CSS import), Angular
  (standalone component + directive), Tailwind (setup + utility + speed
  variants), Bootstrap 5 (real `btn`/`form-control`/`card` components with the
  SDS class layered on — rule documented: SDS layers on top, never replaces).
  Zero hand-written snippets; "How it works" copy (trigger, animated
  properties, controlling tokens, customization) is templated per category and
  interpolated from registry facts.
- **Tailwind tab enforcement** — all 353 utilities + 353 speed variants
  compile against the real plugin in the example app's toolchain
  (`scripts/docs/verify-tailwind-utilities.js`).
- **Rotating React/Angular samples** — 3 effects per category (deterministic
  per ISO week) generated into `examples/nextjs/app/snippets` and
  `examples/angular/src/app/snippets.component.ts`; both apps build green —
  type errors in registry-generated unions fail CI.

### Added — docs platform

- **Single artifact (preview = npm = snippet):** the docs page's inline copy
  of the animation CSS (~1,300 lines) and inline copy of the interactive
  engine were deleted; the page now consumes `dist/motion.min.css` and the
  built engines (CDN fallback). The hand-maintained ANIMATIONS literal is
  replaced by registry-generated `docs/docs-data.js`; the gallery/modal
  preview markup is byte-identical to the HTML tab's body — they cannot
  diverge. Drift gate: `npm run verify:docs` (in `release:check`).
- **Gallery upgrades** (bento design and #0014D1 kept): per-card replay
  buttons, a reduced-motion preview toggle that simulates the accessible
  fallback, search/filter as before — now over registry data.
- **`docs/builder.html` — custom bundle builder:** checkbox tree from the
  registry; client-side assembly of selected rules + their keyframes + core
  (tokens, modifiers, reduced-motion, scroll gate) resolved from structured
  `builder-data.json` — never regex; in-browser minify; live min+gzip via
  CompressionStream; downloads `sds-motion-custom.min.css`. **Acceptance
  verified in CI:** driving the real page, 5 selected effects produce a
  standalone stylesheet < 8 KB whose every effect animates in a smoke page.
- **`docs/llms.txt` + publicly served `docs/registry.json`** — AI coding
  tools get install lines, usage patterns, token names and the full
  machine-readable registry.
- Authored effect descriptions were imported from the docs page into
  `registry/meta/descriptions.json` (single authored home); the registry
  gains `animatedProps`, `loop` and meta display names.

### Fixed — a shipped 4.0.3 bug found by the snippet gate

- **Nine scroll effects never played when scroll-gated, in any browser using
  Chromium's intersection semantics.** IntersectionObserver computes the
  target's intersection AFTER its own clip-path/transform; the scroll gate
  pauses effects at their 0% frame, so effects whose first frame fully clips
  (`sds-scroll-curtain`, `-clip-left`, `-clip-right`, `-radial`, `-ink`,
  `-scan`, `-split`) or moves the box off-screen (`-velvet`, `-gravity`)
  never intersected — content stayed permanently invisible with every
  documented scroll method. Fix: an additive rule neutralizes
  clip-path/transform ONLY while the element is gated (it is `opacity: 0` —
  visually identical); on `sds-play`/`sds-in` the rule stops matching and the
  animation plays from its true first frame. Verified by before/after
  Playwright probes; recorded in `compat/approved-deviations.json`.

## [Unreleased] — v5 Phase 3: Quality Infrastructure

> Every gate below runs in CI; the publish gate (`release:check`) now includes
> reduced-motion, compositor-lint and size budgets. R1 gate remains green
> (0 deviations vs published 4.0.3).

### Added — gates

- **Visual regression** (`npm run test:visual`) — Playwright renders every
  registry effect (359) on a generated fixture page and snapshots **three
  deterministic frames** per effect (1,077 committed baselines, 2.1 MB).
  Determinism technique: every CSS animation (incl. pseudo-elements) is
  paused via the Web Animations API and seeked with
  `anim.currentTime = delay + fraction × iterationDuration` at fractions
  0.13/0.47/0.86 (avoiding steps() boundaries) — identical pixels on every
  run. Verified: full re-run passes 359/359 in ~40s. Linux baselines are
  maintained by the `update-visual-baselines` workflow (artifact-reviewed,
  never hand-edited).
- **Performance gate** (`npm run test:perf`) — Playwright + CDP on the
  heaviest effect per category, measured in isolation (all other animations
  paused): requires **0-ish layout reflows** (budget 6), bounded style
  recalcs, and ≥ 55 fps (env-tunable). Current: all six at 60 fps,
  layoutΔ = 0.
- **Compositor-only stylelint rule** (`npm run lint:css`) — custom plugin
  `sds/compositor-only` forbids non-compositor properties inside @keyframes.
  The 133 pre-existing 4.0.3 offender keyframes are FROZEN in
  `compat/compositor-quarantine.json` with exactly their legacy properties;
  the list can never grow.
- **Reduced-motion gate** (`npm run verify:reduced-motion`) — parses the
  built CSS and proves all 373 animating selectors (self, pseudo-element,
  child, attribute-gated) are neutralized under
  `prefers-reduced-motion: reduce`, and scroll-gated content is forced
  visible.
- **A11y gate** (`npm run test:a11y`) — axe-core WCAG 2.x A/AA on the docs
  site and the loaders example. Live animation previews (`.card-demo`) are
  excluded with documented rationale (axe samples them mid-frame; their
  colors are the demonstrated effect).
- **Bundle budgets** (`npm run size`) — size-limit on 14 artifacts (core CSS,
  both JS engines, all category bundles, react/elements/tailwind outputs);
  budgets committed at current+4 % so any 5 % regression fails.
- **Pack-tarball install smoke** (`npm run smoke:pack`) — `npm pack`s the
  core package and all four wrappers and installs the real tarballs into all
  four example apps, then builds them — proving the npm-install path, not the
  repo path. All green.
- **CI matrix** rewritten: core gates on 3 OS × Node 18/20/22 every push;
  packages build+test+publint; visual+perf on PRs to main (diff artifacts on
  failure); a11y; pack-smoke.

### Fixed — accessibility (R5)

- **Reduced motion now covers child-driven effects.** In ≤ 4.0.3, effects
  animating plain child elements (`sds-kinetic-wave`, stagger/cascade
  containers, `sds-loader-dots/wave/grid/...` — 20 selectors) kept moving
  under `prefers-reduced-motion: reduce`, because the children carry no
  `sds-` class and matched no neutralizer. Added `[class*="sds-"] > *` to the
  reduced-motion clamp (additive; no effect outside the media query).
- Docs site now passes axe WCAG AA: accessible names for icon-only
  controls, label association for the playground select, `role="img"` on the
  hero kinetic text, and AA-contrast footer/marquee text.

### Acceptance demonstrations (all verified)

1. A keyframe animating `width` → `lint:css` exits non-zero with the R4
   message; revert restores green.
2. Stripping the reduced-motion block → `verify:reduced-motion` exits 1
   reporting 5 gaps.
3. Appending +5 % to `dist/motion.min.css` → `size-limit` fails
   ("exceeded by 1.81 kB"); rebuild restores green.

## [Unreleased] — v5 Phase 2: Framework Layer (generated, not hand-written)

> Repo is now an npm workspace; the root package publishes exactly as before
> (R1 gate still 0 deviations). All wrapper packages launch at 1.0.0
> independently, with zero runtime dependencies, and generate their effect
> types/artifacts from `registry/motion.registry.json` (R3).

### Added — packages/

- **`@salkomdesignstudio/motion-forge-tailwind` 1.0.0** — Tailwind v4
  CSS-first plugin generated from the registry: 353 `animate-sds-*` utilities
  carrying the FULL effect rules (statics, pseudo-elements, child staggers via
  nesting), all 324 keyframes inside `@theme` (verified tree-shaken: 3
  utilities compile to 5.63 KB minified, zero keyframe leakage), SDS tokens in
  `@theme`, reduced-motion neutralization, and functional speed variants
  `animate-sds-x-{instant…dramatic}` over the `--sds-duration-*` namespace.
  Slash modifiers (`/slow`) are not possible on static utilities in Tailwind
  v4 (measured) — documented in the package README. Also ships a generated
  Tailwind v3 preset (`/v3-preset`, keyframes+animation only, limitation
  documented). Acceptance fixture: `examples/tailwind-v4`.
- **`@salkomdesignstudio/motion-forge-react` 1.0.0** — `<SdsMotion as effect
  inView replay delay duration easing>` (polymorphic, registry-typed
  effects, token-aware timing), SSR-safe `<SdsText>` char splitting
  (server renders plain text; split on mount; aria-label container +
  aria-hidden chars), `useSdsInView` hook. tsup ESM+CJS+d.ts; `react>=18`
  peer; imports no CSS (dev-only console warning when effect styles are
  absent). 12 vitest tests cover observer cleanup, StrictMode double-mount,
  50× fast re-render leak accounting and SSR renderToString. Acceptance
  fixture: `examples/nextjs` — `next build` prerenders the page (verified:
  plain text, no premature `.sds-char` spans, effect classes present).
- **`@salkomdesignstudio/motion-forge-angular` 1.0.0** — standalone
  `sdsMotion` / `sdsText` / `sdsInView` directives with signal inputs
  (`input()`/`output()`), Renderer2 char splitting, `isPlatformBrowser` +
  `afterNextRender` SSR safety, no zone APIs. Built with ng-packagr (partial
  compilation), peers `@angular/core >= 17.1`. Acceptance fixture:
  `examples/angular` — bootstraps with `provideZonelessChangeDetection()`.
- **`@salkomdesignstudio/motion-forge-elements` 1.0.0** — vanilla-TS Web
  Components `<sds-motion>` / `<sds-text>`, zero deps, no Lit. Shadow DOM is
  OFF by design: SDS effects are page-level classes and must inherit document
  CSS (tokens, reduced-motion, theming) — rationale documented. Ships
  ESM+CJS+IIFE (`/global` auto-registers for CDN use).

### Changed

- Root `package.json` gains `workspaces: ["packages/*"]` (publishing
  unaffected), plus `build:packages` / `test:packages` scripts.
- `postcss.config.js` converted to object/string plugin form — required by
  bundlers (Next.js) that resolve the repo config through symlinked workspace
  deps; identical output with postcss-cli (gate-verified).
- All shared codegen lives in `scripts/codegen/effects-data.js`; the three TS
  packages generate `src/generated/effects.ts` from it at build time —
  identical unions, impossible to diverge.

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

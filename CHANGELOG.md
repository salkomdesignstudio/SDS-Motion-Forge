# Changelog

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
[data-sds]:not(.sds-play) { animation-play-state: paused; opacity: 0; }
[data-sds].sds-play        { opacity: 1; animation-play-state: running; }
html:not(.sds-js) [data-sds] { opacity: 1; animation-play-state: running; }
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

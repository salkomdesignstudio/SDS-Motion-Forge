# Changelog

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

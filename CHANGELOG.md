# Changelog

## 3.2.0 - Stability and Release Hardening

### Fixed
- Restored required legacy aliases to avoid breaking existing consumers:
  - `.sds-scroll-fade-up`
  - `.sds-input-focus-glow`
  - `.sds-card-neon`
  - `.sds-card-depth`
  - `.sds-card-flip`
  - `.sds-loader-progress-glow`
- Added a `prefers-reduced-motion` block for accessibility-safe default behavior.

### Changed
- Hardened `verify-build.js` with stricter selector/keyframe/token checks plus source-to-dist selector parity.
- Added `types` export and included `index.d.ts` in publish `files`.
- Added `release:check` script to enforce build, verify, publint, and pack dry-run before publish.

### CI/CD
- Added cross-platform and cross-node CI matrix (`ubuntu/windows/macos`, Node `18/20/22`).
- Added publish workflow with `npm publish --provenance --access public`.

## 3.1.0 - Production Engineering Release

### Bug Fixes and Breaking-Change Prevention
- Expanded shorthand animation properties where needed to reduce cascade conflicts in consuming frameworks.
- Namespaced keyframes with `sds-` prefixes to reduce collisions.
- Added variable fallbacks in critical spots for safer imports.
- Improved placeholder and Firefox selector compatibility in input classes.
- Added Safari clip-path coverage for key scroll/text reveal effects.

### Features
- Added `sideEffects` metadata.
- Added package `exports` entries for CSS files.
- Added TypeScript declaration file.
- Added pre-publish verification script.
- Added legacy aliases for renamed classes.

## 3.0.2
- Initial public release with 90+ animation classes across 6 categories.

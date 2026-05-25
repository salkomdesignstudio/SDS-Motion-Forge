# Changelog

## 3.1.0 — Production Engineering Release

### Bug Fixes & Breaking-Change Prevention
- **Fixed**: All animation shorthand properties expanded to explicit sub-properties (`animation-name`, `animation-duration`, `animation-timing-function`, `animation-fill-mode`, etc.) — eliminates cascade conflicts with frameworks that reset the `animation` shorthand
- **Fixed**: All `@keyframes` names consistently namespaced with `sds-` prefix — prevents collisions with Tailwind, Bootstrap, and custom `@keyframes` in consuming projects
- **Fixed**: CSS custom properties now include explicit fallback values in every `var()` call (e.g. `var(--sds-primary, #0015D1)`) — classes now work correctly even if the consumer imports SDS Motion Forge before `:root` custom properties are declared
- **Fixed**: `sds-input-morph-ph` placeholder animation: added `-moz-placeholder` and `placeholder` selectors with explicit sub-properties instead of shorthand — works in Firefox and Chrome without cross-browser failure
- **Fixed**: `sds-input-elevate-wrap` label selector: added `:-moz-placeholder-shown` vendor alias for Firefox 100% compatibility
- **Fixed**: Duplicate `animation` shorthand on `sds-scroll-glitch` — expanded to `animation-name`, `animation-duration`, `animation-timing-function`, `animation-fill-mode` multi-value lists
- **Fixed**: `sds-typewriter-pro` and `sds-loader-type` multi-animation shorthand expanded to sub-properties; `animation-direction: alternate` added to loader-type for proper infinite loop
- **Fixed**: `-webkit-clip-path` fallback added to `sds-slice-reveal`, `sds-scroll-curtain`, `sds-scroll-radial`, `sds-scroll-scan` — Safari < 14 compatibility

### New Features
- **Added**: `sideEffects` field in `package.json` — prevents Webpack/Vite tree-shaking from dropping CSS imports (critical for Next.js and CRA)
- **Added**: Conditional `exports` field in `package.json` with `"style"` condition — enables Vite, Next.js, and modern bundlers to resolve CSS imports natively
- **Added**: TypeScript declarations in `types/index.d.ts` — all animation class names exported as typed unions; CSS module declarations for Vite `moduleResolution: bundler`
- **Added**: `scripts/verify-build.js` — pre-publish verification script that checks all critical class names, `@keyframes`, and design tokens exist in the built output; runs automatically during `npm publish`
- **Added**: `@media (prefers-reduced-motion: reduce)` block — accessibility requirement, collapses all animations to instant for users who opt out of motion
- **Added**: Legacy aliases for all class names that appear in README examples but map to renamed internal classes: `sds-scroll-fade-up`, `sds-input-focus-glow`, `sds-card-neon`, `sds-card-depth`, `sds-card-flip`, `sds-loader-progress-glow`
- **Added**: `will-change` applied to loop-only animations with transform/box-shadow cycles — improves GPU compositing for high-frequency animations without over-promoting static elements
- **Added**: CHANGELOG.md

### Performance
- `will-change: transform` added only where animations loop infinitely on transform properties — avoids unnecessary GPU layer promotion for one-shot entrance animations
- `will-change: box-shadow` added only to continuous shadow-cycling animations
- All `filter` operations maintained but scoped to entrance animations (one-shot), not infinite loops, minimising repaint cost at steady state

### SSR & Hydration Safety
- Zero JavaScript — no DOM reads, no `window`/`document` access — the stylesheet is fully safe in SSR environments (Next.js App Router, Nuxt, Astro, Remix)
- No `@import` statements — compatible with strict CSP policies that block CSS imports
- No `:global()` selectors — compatible with CSS Modules consumers

### Backward Compatibility
All class names from v3.0.x are preserved. Legacy aliases ensure README code examples continue working unchanged.

---

## 3.0.2
- Initial public release with 90+ animation classes across 6 categories

# Migration Guide — SDS Motion Forge

## Quick answer for most users

**If you are upgrading from v4.0.x to v5.0.0: you do not need to change anything.**

Every class name, keyframe, computed animation value, export path, dist file, data attribute, and CDN usage pattern from v4 works identically in v5. This is not a promise — it is machine-proven on every build by the `verify:published` gate against the committed 4.0.3 baseline tarball. Two intentional deviations exist (both bug fixes; see the [compatibility report](compat/compatibility-report.md)).

If you are upgrading and just want to know whether your existing code will break: **it won't**.

The rest of this guide explains the new features available to you in v5 and how to adopt them.

---

## v4.0.x → v5.0.0

### What you do not need to change

| Surface | Status |
|---|---|
| All class names (`sds-velvet-drop`, `sds-btn-magnetic`, etc.) | Unchanged |
| All keyframe names (`sds-velvetDrop`, `sds-btnMagnetic`, etc.) | Unchanged |
| All computed animation values (duration, easing, delay, fill) | Unchanged — machine-proven |
| `dist/motion.css` and `dist/motion.min.css` | Same paths, same content |
| `dist/sds-scroll.min.js` and `dist/motion-interactive.min.js` | Same paths, same behavior |
| `data-sds`, `data-sds-repeat`, `data-sds-delay` attributes | Unchanged |
| `window.SDSInteractive.scan/initEl/cleanup` globals | Unchanged |
| `--sds-primary`, `--sds-duration`, `--sds-easing` custom properties | Still work |
| CDN URLs (jsDelivr / unpkg) | Same paths |
| `package.json` exports map subpaths | All preserved, new ones added |
| Legacy v3 aliases (e.g., `sds-scroll-fade-up`) | Preserved forever |

### New features available in v5

#### 1. Per-category bundles — import only what you use

v5 ships standalone category bundles. Each includes core (tokens, modifiers, reduced-motion, scroll gate) plus its own animations. **This is purely additive.** Your existing `dist/motion.css` import continues to work exactly as before.

```js
// Before (still works):
import '@salkomdesignstudio/sds-motion-forge/dist/motion.min.css';

// New option — only the loader category (~8 KB gzip):
import '@salkomdesignstudio/sds-motion-forge/categories/loaders';
```

```html
<!-- CDN — new option: category-only -->
<link rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/@salkomdesignstudio/sds-motion-forge/dist/categories/loaders.min.css" />
```

**When to use:** if your page uses animations from only one or two categories, category bundles reduce your CSS payload. If you use animations from three or more categories, the full `dist/motion.css` is more efficient (single copy of core).

#### 2. Motion token scale — named duration and easing tokens

v5 introduces named CSS custom properties for the timing system:

```css
:root {
  --sds-duration-instant:  0.3s;
  --sds-duration-fast:     0.4s;
  --sds-duration-base:     0.8s;   /* ← was --sds-duration in v4 */
  --sds-duration-slow:     1.4s;
  --sds-duration-slower:   2.2s;
  --sds-duration-dramatic: 3s;

  --sds-ease-standard:    cubic-bezier(0.22, 1, 0.36, 1);
  --sds-ease-spring:      cubic-bezier(0.34, 1.56, 0.64, 1);
  /* … and four more named easings */
}
```

**Compatibility:** `--sds-duration` and `--sds-easing` still resolve through the v5 tokens — no existing overrides break. The new named tokens are additive.

**Adopting:** override `--sds-duration-base` instead of `--sds-duration` in new code to signal intent:

```css
/* Before */
:root { --sds-duration: 0.6s; }

/* After (both work, prefer the named form in new code) */
:root { --sds-duration-base: 0.6s; }
```

#### 3. Framework wrappers

Four new packages, all generated from the motion registry:

```bash
npm install @salkomdesignstudio/motion-forge-react      # React 18+
npm install @salkomdesignstudio/motion-forge-angular    # Angular 17+
npm install @salkomdesignstudio/motion-forge-tailwind   # Tailwind v3 + v4
npm install @salkomdesignstudio/motion-forge-elements   # Web Components
```

These are opt-in. Your existing vanilla HTML usage does not change.

#### 4. TypeScript types — complete for all 600+ classes

`index.d.ts` now exports typed unions for every animation class:

```ts
import type { SdsTextAnimation, SdsButtonAnimation, SdsModifier } from '@salkomdesignstudio/sds-motion-forge';

function anim(base: SdsTextAnimation, ...mods: SdsModifier[]): string {
  return [base, ...mods].join(' ');
}
```

See [README.md — TypeScript & Autocomplete](README.md#typescript--autocomplete) for usage examples.

#### 5. New export subpaths

These are all additive:

```js
// Category CSS bundles
import '@salkomdesignstudio/sds-motion-forge/categories/text';
import '@salkomdesignstudio/sds-motion-forge/categories/buttons';
import '@salkomdesignstudio/sds-motion-forge/categories/inputs';
import '@salkomdesignstudio/sds-motion-forge/categories/cards';
import '@salkomdesignstudio/sds-motion-forge/categories/loaders';
import '@salkomdesignstudio/sds-motion-forge/categories/scroll';
import '@salkomdesignstudio/sds-motion-forge/categories/core'; // tokens + modifiers only

// Machine-readable data (for tooling)
import registry from '@salkomdesignstudio/sds-motion-forge/registry/motion.registry.json';
import tokens from '@salkomdesignstudio/sds-motion-forge/tokens/motion.tokens.json';
import figmaTokens from '@salkomdesignstudio/sds-motion-forge/tokens/figma.tokens.json';
```

### Two intentional behavior changes (both bug fixes)

These are the only changes to observable behavior. Both are fixes for bugs that made effects permanently invisible.

**Fix 1 — Reduced motion now covers child-driven effects (20 selectors)**

In v4.0.3, effects that animate plain child elements (`sds-kinetic-wave`, stagger/cascade containers, `sds-loader-dots`, etc.) kept playing under `prefers-reduced-motion: reduce` because the children carry no `sds-` class and matched no neutralizer. v5 adds `[class*="sds-"] > *` to the reduced-motion clamp. This is purely additive.

**Impact on your code:** if you tested with `prefers-reduced-motion: reduce` in v4 and observed these effects still playing, they now stop — which is the correct behavior per WCAG 2.1 §2.3.3.

**Fix 2 — Nine scroll effects now fire correctly in Chromium**

In v4.0.3, nine clip-path/transform scroll effects (`sds-scroll-curtain`, `sds-scroll-clip-left`, `sds-scroll-clip-right`, `sds-scroll-radial`, `sds-scroll-ink`, `sds-scroll-scan`, `sds-scroll-split`, `sds-scroll-velvet`, `sds-scroll-gravity`) never fired when gated via `[data-sds]`. IntersectionObserver computes intersection after the element's own clip-path; the scroll gate paused them at their 0% frame (fully clipped), so they never entered the viewport. Content stayed permanently invisible.

The fix adds an additive rule that neutralizes clip-path/transform only while the element is gated — the element is `opacity: 0` and visually identical to the old behavior, but IntersectionObserver can now detect it entering the viewport.

**Impact on your code:** if you used these effects with `[data-sds]` and concluded they "don't work" — they now work. If you worked around the bug by using the inline `IntersectionObserver` pattern (`[data-sds-scroll]` + `sds-in` class) instead, both patterns still work.

---

## v3.x → v4.0.0

If you are on v3.x, the recommended path is v3 → v4 → v5. The v3-to-v4 migration is simple because all class names are preserved.

### What changed in v4

- **Two new JavaScript engines** were added — `sds-scroll.min.js` and `motion-interactive.min.js`. These are strictly optional. If you do not load them, nothing breaks.
- **`data-sds` scroll gate** — the preferred scroll animation method changed from `[data-sds-scroll]` + the inline IntersectionObserver snippet to `[data-sds]` + `sds-scroll.min.js`. Both patterns still work in v4 and v5.
- **50 new text animations** and expanded loader, button, card, and input categories.
- **`package.json` exports map** was added — `"style"` condition added for Vite, webpack 5, and Rollup.
- **`sideEffects: ["**/*.css"]`** was added to prevent bundler tree-shaking.

### Steps for v3 → v4

1. **Update the package:** `npm install @salkomdesignstudio/sds-motion-forge@4`
2. **Nothing else is required.** All v3 class names work identically.
3. If you used the old `[data-sds-scroll]` + inline IntersectionObserver pattern, it still works. Optionally adopt the new `sds-scroll.min.js` engine for automatic SPA support and delay features.

---

## Legacy CDN users

If you consume the library via an unversioned CDN URL (e.g., pointing at `@latest` or a floating version), you are automatically on the latest release. All class names are permanently backward-compatible — your existing HTML requires no changes.

The six v3 legacy aliases are exempt from removal forever, regardless of major version changes:

| What you wrote | What it resolves to |
|---|---|
| `sds-scroll-fade-up` | `sds-scroll-rise` |
| `sds-input-focus-glow` | `sds-input-focus` |
| `sds-card-neon` | `sds-card-glow` |
| `sds-card-depth` | `sds-card-parallax` |
| `sds-card-flip` | `sds-card-slice` |
| `sds-loader-progress-glow` | `sds-loader-progress` |

These will never be removed. CDN users who cannot update their HTML are explicitly protected.

---

## Getting help

- **Something broke after upgrading?** Open an issue with the [bug report template](https://github.com/salkomdesignstudio/SDS-Motion-Forge/issues/new?template=bug_report.md) — include your before/after versions, the class name affected, and the browser.
- **Common setup issues:** see [TROUBLESHOOTING.md](TROUBLESHOOTING.md).
- **Machine-readable compatibility diff:** `compat/compatibility-report.md` — generated on every build.

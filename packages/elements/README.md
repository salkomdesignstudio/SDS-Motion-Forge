# @salkomdesignstudio/motion-forge-elements

Framework-free Web Components for [SDS Motion Forge](https://www.npmjs.com/package/@salkomdesignstudio/sds-motion-forge).
Vanilla TypeScript, zero dependencies, no Lit.

```html
<!-- 1. the CSS (core package) -->
<link rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/@salkomdesignstudio/sds-motion-forge/dist/motion.min.css" />

<!-- 2. the elements (auto-register) -->
<script src="https://cdn.jsdelivr.net/npm/@salkomdesignstudio/motion-forge-elements/dist/index.global.js" defer></script>

<!-- 3. use -->
<sds-motion effect="sds-card-lift" in-view>A card</sds-motion>
<sds-text effect="sds-kinetic-wave">Motion</sds-text>
```

Or as a module:

```ts
import { defineSdsElements } from '@salkomdesignstudio/motion-forge-elements';
defineSdsElements(); // idempotent, SSR no-op
```

## `<sds-motion>`

| Attribute | Effect |
|---|---|
| `effect` | any registry effect class, e.g. `sds-card-rise` |
| `in-view` | gate on viewport entry (IntersectionObserver) |
| `replay` | with `in-view`: replay on every re-entry |
| `delay` | ms number (`200`) or CSS time (`0.2s`) |
| `duration` | SDS token (`slow`) or CSS time |
| `easing` | SDS token (`spring`) or CSS easing |

## `<sds-text>`

Splits its text into `.sds-char` spans with `--i` stagger indexes;
`aria-label` keeps the text readable to assistive tech.

## Why shadow DOM is OFF (by design)

SDS effects are page-level CSS classes. The design tokens (`--sds-*`), the
`prefers-reduced-motion` neutralization block and your theme overrides all live
in document stylesheets. A shadow root would isolate the element from exactly
the CSS that makes it work — so these elements style themselves in the light
DOM, like any other SDS consumer.

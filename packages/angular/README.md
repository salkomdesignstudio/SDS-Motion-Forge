# @salkomdesignstudio/motion-forge-angular

Angular bindings for [SDS Motion Forge](https://www.npmjs.com/package/@salkomdesignstudio/sds-motion-forge).
Standalone directives with signal inputs; effect names are TypeScript unions
**generated from the motion registry**. SSR-safe (`isPlatformBrowser` +
`afterNextRender`) and zoneless-compatible (no zone APIs).

> **This package ships no CSS.** Add the stylesheet to your application:
>
> ```json
> // angular.json → architect.build.options.styles
> ["node_modules/@salkomdesignstudio/sds-motion-forge/dist/motion.min.css"]
> ```

## Directives

```ts
import {
  SdsMotionDirective,
  SdsTextDirective,
  SdsInViewDirective,
} from '@salkomdesignstudio/motion-forge-angular';
```

```html
<!-- any effect, typed from the registry -->
<h1 sdsMotion="sds-velvet-drop">Hello</h1>

<!-- viewport-gated, replaying, token-driven timing -->
<section sdsMotion="sds-scroll-rise" inView replay duration="slow" easing="spring">…</section>

<!-- per-character splitting (Renderer2, SSR-safe, aria-preserving) -->
<h2 sdsText="sds-kinetic-wave">Motion</h2>

<!-- visibility primitive -->
<div sdsInView (sdsInViewChange)="onVisible($event)">…</div>
```

### `[sdsMotion]` inputs

| Input | Type | Notes |
|---|---|---|
| `sdsMotion` | `SdsEffect` | required; registry-generated union |
| `inView` | `boolean` | withhold the effect until viewport entry |
| `replay` | `boolean` | with `inView`: replay on every re-entry |
| `delay` | `number \| string` | ms number or CSS time |
| `duration` | `SdsDurationToken \| string` | `instant\|fast\|base\|slow\|slower\|dramatic` or raw CSS |
| `easing` | `SdsEasingToken \| string` | `standard\|decelerate\|accelerate\|emphasized\|spring\|bounce` or raw CSS |

### `[sdsInView]`

Emits `sdsInViewChange: boolean`; applies `inViewClass` (default `sds-in`,
matching the core library's scroll pattern) while visible; `once` (default
true) stops observing after first entry.

Peer dependencies: `@angular/core >= 17.1`, `@angular/common >= 17.1`.
Zero runtime dependencies. Built with ng-packagr (partial compilation).

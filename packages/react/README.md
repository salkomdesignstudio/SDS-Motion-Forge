# @salkomdesignstudio/motion-forge-react

React bindings for [SDS Motion Forge](https://www.npmjs.com/package/@salkomdesignstudio/sds-motion-forge).
Effect names are TypeScript unions **generated from the motion registry** —
autocomplete for all 350+ effects, guaranteed in sync with the CSS.

> **This package ships no CSS.** Load the stylesheet once in your app —
> that keeps the CSS cacheable, CDN-compatible, and identical to what every
> non-React consumer gets:
>
> ```ts
> import '@salkomdesignstudio/sds-motion-forge/dist/motion.min.css';
> // or a category bundle:
> import '@salkomdesignstudio/sds-motion-forge/categories/text';
> ```
> In development, `<SdsMotion>` warns in the console if the effect's styles
> are missing.

## `<SdsMotion>`

```tsx
import { SdsMotion } from '@salkomdesignstudio/motion-forge-react';

<SdsMotion as="h1" effect="sds-velvet-drop">Hello</SdsMotion>

// Gate on viewport entry; replay on every re-entry
<SdsMotion effect="sds-scroll-rise" inView replay>Section</SdsMotion>

// Tokens or raw CSS values
<SdsMotion effect="sds-card-rise" duration="slow" easing="spring" delay={150}>
  Card
</SdsMotion>
```

| Prop | Type | Notes |
|---|---|---|
| `as` | `ElementType` | rendered element, default `div` |
| `effect` | `SdsEffect` | registry-generated union |
| `inView` | `boolean` | withhold the effect until the element enters the viewport |
| `replay` | `boolean` | with `inView`: remove on exit, replay on re-entry |
| `delay` | `number \| string` | ms number or CSS time |
| `duration` | `SdsDurationToken \| string` | `'instant' \| 'fast' \| 'base' \| 'slow' \| 'slower' \| 'dramatic'` or raw CSS |
| `easing` | `SdsEasingToken \| string` | `'standard' \| 'decelerate' \| 'accelerate' \| 'emphasized' \| 'spring' \| 'bounce'` or raw CSS |

## `<SdsText>` — SSR-safe char splitting

```tsx
import { SdsText } from '@salkomdesignstudio/motion-forge-react';

<SdsText as="h1" effect="sds-kinetic-wave">Motion</SdsText>
```

The server renders the plain string (SEO-safe, no hydration mismatch); after
mount the text splits into `.sds-char` spans with `--i` stagger indexes,
`aria-label` on the container and `aria-hidden` chars.

## `useSdsInView(ref, options)`

```tsx
const ref = useRef<HTMLDivElement>(null);
const inView = useSdsInView(ref, { once: false, threshold: 0.2 });
```

IntersectionObserver-backed, SSR-safe, StrictMode-safe, observers fully cleaned
up on unmount (covered by tests).

Peer dependency: `react >= 18`. Zero runtime dependencies.

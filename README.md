# SDS Motion Forge

**Every class that worked in v3/v4 works identically in v5 — machine-verified against the published tarball on every build.**

**600+ production-ready CSS animations. One class name. Zero required JavaScript.**

[![npm version](https://img.shields.io/npm/v/@salkomdesignstudio/sds-motion-forge.svg?style=flat-square)](https://www.npmjs.com/package/@salkomdesignstudio/sds-motion-forge)
[![Bundle size](https://img.shields.io/bundlephobia/minzip/@salkomdesignstudio/sds-motion-forge?style=flat-square)](https://bundlephobia.com/package/@salkomdesignstudio/sds-motion-forge)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)
[![CI](https://github.com/salkomdesignstudio/SDS-Motion-Forge/actions/workflows/ci.yml/badge.svg)](https://github.com/salkomdesignstudio/SDS-Motion-Forge/actions/workflows/ci.yml)

A production-grade motion system for modern UI — framework-agnostic, accessible, and backward-compatible. Add a class and your element animates. That is the entire API.

> **Live demo:** [sds-motion-forge.netlify.app](https://sds-motion-forge.netlify.app) — every effect with six copy-paste code tabs (HTML, JS, React, Angular, Tailwind, Bootstrap), each one machine-verified against the packed npm tarball before it can ship.
> **Custom bundle builder:** [/builder.html](https://sds-motion-forge.netlify.app/builder.html) — pick effects, download exactly their CSS (+ tokens, reduced-motion, keyframes), live size estimate.
> **Motion specification:** [SPEC.md](SPEC.md) — principles, token scale, duration/easing selection matrix, choreography rules.
> **For AI tools:** [llms.txt](https://sds-motion-forge.netlify.app/llms.txt) · [registry.json](https://sds-motion-forge.netlify.app/registry.json) — the full machine-readable effect registry.

---

## Table of Contents

- [What's in v5](#whats-in-v5)
- [Quick Start](#quick-start)
- [Installation](#installation)
  - [npm / yarn / pnpm](#npm--yarn--pnpm)
  - [CDN (no build step)](#cdn-no-build-step)
  - [Framework Integrations](#framework-integrations)
- [How It Works](#how-it-works)
- [Animation Reference](#animation-reference)
  - [Text — 104 classes](#text--104-classes)
  - [Buttons — 100 classes](#buttons--100-classes)
  - [Inputs — 100 classes](#inputs--100-classes)
  - [Cards — 100 classes](#cards--100-classes)
  - [Loaders — 100 classes](#loaders--100-classes)
  - [Scroll — 100 classes](#scroll--100-classes)
- [Interactive Animations (JS engine)](#interactive-animations-js-engine)
- [Modifiers](#modifiers)
- [Stagger & Children Animations](#stagger--children-animations)
- [Theming](#theming)
- [TypeScript & Autocomplete](#typescript--autocomplete)
- [Accessibility](#accessibility)
- [Browser Support](#browser-support)
- [Project Structure](#project-structure)
- [Build from Source](#build-from-source)
- [Contributing](#contributing)
- [Backward Compatibility](#backward-compatibility)
- [License](#license)

---

## What's in v5

- **104 text animations** — 50 originals + 5 physics per-character animations + 49 new motion families
- **100 button animations** — ambient, hover, entrance, and kinetic effects for interactive elements
- **100 input animations** — focus, validation, ambient, and reveal states for form fields
- **100 card animations** — entry, ambient, hover, 3D, and choreography effects for containers
- **100 loader animations** — self-contained spinners, progress indicators, and motion loaders
- **100 scroll animations** — viewport-triggered entrance effects across 15+ motion families
- **`sds-scroll.min.js`** — 1.28 KB scroll-gate engine. Elements stay hidden until they enter the viewport, with optional replay and delay.
- **`motion-interactive.min.js`** — 6.98 KB cursor-reactive engine. Magnetic pull, repulsion field, shockwave click, scatter return, spring kerning, word morph, jelly hover. Zero config.
- **Full backward compatibility** — every v3.x class name still works identically

---

## Quick Start

```html
<!doctype html>
<html>
  <head>
    <link rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/@salkomdesignstudio/sds-motion-forge/dist/motion.min.css" />
  </head>
  <body>
    <h1 class="sds-velvet-drop">Hello World</h1>
    <button class="sds-btn-magnetic">Click me</button>
    <span class="sds-loader-orbital"></span>
  </body>
</html>
```

That's it. No JavaScript. No configuration. No build step.

---

## Installation

### npm / yarn / pnpm

```bash
npm install @salkomdesignstudio/sds-motion-forge
# or
yarn add @salkomdesignstudio/sds-motion-forge
# or
pnpm add @salkomdesignstudio/sds-motion-forge
```

### Category bundles (v5) — import only what you use

Each category ships as a self-sufficient bundle (its animations + their
keyframes + core: tokens, modifiers, reduced-motion, scroll gate). One import,
no other setup:

```js
// Only the loaders — nothing else ships
import '@salkomdesignstudio/sds-motion-forge/categories/loaders';
```

```html
<!-- Or via CDN -->
<link rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/@salkomdesignstudio/sds-motion-forge/dist/categories/loaders.min.css" />
```

<!-- @sds-size-table:start -->
| Bundle | Import | Minified | Gzip |
|---|---|---|---|
| text | `@salkomdesignstudio/sds-motion-forge/categories/text` | 45.5 KB | 8.4 KB |
| buttons | `@salkomdesignstudio/sds-motion-forge/categories/buttons` | 49.1 KB | 8.6 KB |
| inputs | `@salkomdesignstudio/sds-motion-forge/categories/inputs` | 47.0 KB | 8.4 KB |
| cards | `@salkomdesignstudio/sds-motion-forge/categories/cards` | 39.6 KB | 7.5 KB |
| loaders | `@salkomdesignstudio/sds-motion-forge/categories/loaders` | 49.1 KB | 8.1 KB |
| scroll | `@salkomdesignstudio/sds-motion-forge/categories/scroll` | 33.6 KB | 5.8 KB |
| core only | `@salkomdesignstudio/sds-motion-forge/categories/core` | 3.3 KB | 1.0 KB |
| **everything** | `@salkomdesignstudio/sds-motion-forge` | **241.6 KB** | **38.4 KB** |
<!-- @sds-size-table:end -->

Core is intentionally **inlined** into every category bundle so each one works
standalone via npm or a single CDN `<link>` — no peer imports to forget, no
broken styles when a pipeline strips `@import`. Core costs ~3 KB minified
(~1 KB gzip); if you combine **two or more** categories, import the full
`dist/motion.css` instead — it ships exactly one copy of core and every class.

### CDN (no build step)

```html
<!-- Core CSS — required for all animations -->
<link rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/@salkomdesignstudio/sds-motion-forge/dist/motion.min.css" />

<!-- Scroll gate engine — optional, load near </body> -->
<script
  src="https://cdn.jsdelivr.net/npm/@salkomdesignstudio/sds-motion-forge/dist/sds-scroll.min.js"
  defer></script>

<!-- Interactive engine — optional, load near </body> -->
<script
  src="https://cdn.jsdelivr.net/npm/@salkomdesignstudio/sds-motion-forge/dist/motion-interactive.min.js"
  defer></script>
```

### Framework packages (v5)

First-class wrappers, generated from the motion registry — typed effect
unions for all 350+ animations, zero runtime dependencies:

| Package | What you get |
|---|---|
| [`@salkomdesignstudio/motion-forge-tailwind`](packages/tailwind) | `animate-sds-*` utilities for Tailwind v4 (CSS-first, tree-shaken) + v3 preset |
| [`@salkomdesignstudio/motion-forge-react`](packages/react) | `<SdsMotion>`, SSR-safe `<SdsText>`, `useSdsInView` |
| [`@salkomdesignstudio/motion-forge-angular`](packages/angular) | standalone `sdsMotion` / `sdsText` / `sdsInView` directives (signal inputs, zoneless-ready) |
| [`@salkomdesignstudio/motion-forge-elements`](packages/elements) | framework-free `<sds-motion>` / `<sds-text>` Web Components |

The core package stays 100 % framework-agnostic — wrappers are optional sugar.

### Framework Integrations

#### React / Next.js

```jsx
// Import once in _app.js, layout.js, or main.jsx
import '@salkomdesignstudio/sds-motion-forge/dist/motion.min.css';

export default function Hero() {
  return <h1 className="sds-grand-entrance">Hello React</h1>;
}
```

**Next.js App Router** — add to `app/layout.tsx`:

```tsx
import '@salkomdesignstudio/sds-motion-forge/dist/motion.min.css';
```

#### Vue

```js
// main.js / main.ts
import '@salkomdesignstudio/sds-motion-forge/dist/motion.min.css';
```

```html
<template>
  <h1 class="sds-zoom-punch">Hello Vue</h1>
</template>
```

#### Angular

Add to `styles.scss` or list in `angular.json` under `architect.build.options.styles`:

```scss
@import '@salkomdesignstudio/sds-motion-forge/dist/motion.min.css';
```

```html
<h1 class="sds-door-open">Hello Angular</h1>
```

#### Svelte / SvelteKit

```html
<!-- +layout.svelte -->
<script>
  import '@salkomdesignstudio/sds-motion-forge/dist/motion.min.css';
</script>

<h1 class="sds-elastic-bounce">Hello Svelte</h1>
```

#### Tailwind CSS

Motion Forge layers cleanly alongside Tailwind. Classes never conflict because all SDS classes are prefixed `sds-`:

```html
<button class="px-6 py-3 rounded-full bg-blue-600 text-white sds-btn-plasma">
  Tailwind + Motion
</button>
<div class="rounded-xl shadow-lg p-6 sds-card-levitate">
  Card with ambient float
</div>
```

#### Bootstrap

```html
<button class="btn btn-primary sds-btn-neon">Bootstrap + Neon</button>
<div class="card sds-card-holo">Holographic card</div>
```

#### PostCSS (use the source)

The source file is published so you can process it through your own PostCSS pipeline:

```js
// postcss.config.js
module.exports = {
  plugins: [
    require('postcss-import'),
    require('autoprefixer'),
  ],
};
```

```css
/* your-styles.css */
@import '@salkomdesignstudio/sds-motion-forge/src/motion.css';
```

#### Flutter Web

```html
<!-- web/index.html -->
<link rel="stylesheet"
  href="packages/sds_motion_forge/dist/motion.min.css" />
```

---

## How It Works

The library has three independent layers. Use only what you need.

### Layer 1 — CSS Core (always, no JS)

The entire `motion.min.css` file. Add a class → animation plays. Works in any environment, including static HTML, SSR, and email-safe HTML.

```html
<span class="sds-velvet-drop">Animates immediately on load</span>
```

### Layer 2 — Scroll Gate (`sds-scroll.min.js`, optional)

Load once. The engine observes `[data-sds]` elements via `IntersectionObserver` and adds `sds-play` when they enter the viewport.

```html
<script src="dist/sds-scroll.min.js" defer></script>

<h2 data-sds class="sds-scroll-rise">Appears when scrolled into view</h2>
<p data-sds data-sds-repeat class="sds-bounce-in-up">Replays on re-entry</p>
<div data-sds data-sds-delay="200" class="sds-slide-blur-left">200ms delay</div>
```

**Attributes:**

| Attribute | Required | Effect |
|---|---|---|
| `data-sds` | Yes | Gates the animation until viewport entry |
| `data-sds-repeat` | No | Remove `sds-play` on exit so the element replays on re-entry |
| `data-sds-delay="N"` | No | Wait N milliseconds after viewport entry before starting |

### Layer 3 — Interactive Engine (`motion-interactive.min.js`, optional)

Load once. Zero JavaScript from you — just add a class. The engine auto-wires all event listeners, physics loops, and MutationObserver cleanup.

```html
<script src="dist/motion-interactive.min.js" defer></script>

<h2 class="sds-magnetic-pull">Cursor attracts each character</h2>
```

---

## Animation Reference

### Text — 104 classes

Apply to any element containing text.

#### Original 50

| Class | Effect | Type |
|---|---|---|
| `sds-velvet-drop` | Weighted drop-in with blur and bounce | entrance |
| `sds-liquid-rise` | Fluid upward reveal with skew | entrance |
| `sds-phantom-blur` | Bright blur crystallises to sharp | entrance |
| `sds-gravity-drop` | Accelerated fall with elastic overshoot | entrance |
| `sds-elastic-stamp` | Scales from zero with elastic rotation | entrance |
| `sds-slice-reveal` | Horizontal clip-path wipe | entrance |
| `sds-char-orbit` | Orbits in from above with rotation | entrance |
| `sds-ink-bleed` | Letter-spacing collapses as blur resolves | entrance |
| `sds-focus-pull` | Camera-focus blur → sharp | entrance |
| `sds-depth-warp` | Flies in from deep Z-space | entrance |
| `sds-typewriter-pro` | Classic typewriter with blinking caret | entrance |
| `sds-highlight-burn` | Highlight marker swipe | entrance |
| `sds-shatter-in` | Explodes in from massive scale with blur | entrance |
| `sds-weight-drop` | Extreme-easing gravity overshoot | entrance |
| `sds-smoke-reveal` | Smoke-field blur resolves to text | entrance |
| `sds-depth-charge` | Deep Z-space warp with delay | entrance |
| `sds-film-burn` | Sepia focus-pull entrance | entrance |
| `sds-streak-in` | High-speed streak from left | entrance |
| `sds-elastic-bounce` | Spring overshoot bounce-in | entrance |
| `sds-cipher-reveal` | Brightness and blur decode | entrance |
| `sds-word-blur-in` | Blur resolves to sharp with scale | entrance |
| `sds-split-reveal` | Polygon clip-path splits from center | entrance |
| `sds-bounce-in-up` | Multi-step elastic bounce from below | entrance |
| `sds-cinema-title` | Letter-spacing collapse with blur | entrance |
| `sds-unfurl` | clip-path + scaleX unfurls left→right | entrance |
| `sds-refract` | Chromatic RGB split | loop |
| `sds-static-burst` | Glitch-static corruption | loop |
| `sds-neon-flare` | Pulsing neon glow | loop |
| `sds-scramble-decode` | Blur + skew decoding | loop |
| `sds-kinetic-wave` | Per-child translateY wave (needs `.sds-char` children) | loop |
| `sds-perspective-swing` | rotateY swing with perspective | entrance |
| `sds-gradient-sweep` | Moving brand gradient mask | loop |
| `sds-prism-split` | Full-spectrum chromatic aberration | loop |
| `sds-arc-orbit` | Per-child stagger orbit (needs `.sds-char` children) | entrance |
| `sds-signal-wave` | Wider stagger wave (needs `.sds-char` children) | loop |
| `sds-glitch-flicker` | Analog glitch flickering | loop |
| `sds-velocity-blur-text` | Motion-blur streak from left | entrance |
| `sds-neon-pulse-text` | Breathing neon glow | loop |
| `sds-morph-word` | scaleX + skewX + letter-spacing morph | loop |
| `sds-levitate` | Gentle float with subtle rotation | loop |
| `sds-hologram-text` | Holographic hue-rotate flicker | loop |
| `sds-aurora-text` | Six-colour gradient sweep | loop |
| `sds-oscillate` | Sine-wave Y + rotate + scaleX | loop |
| `sds-flicker-on` | Stepped opacity neon power-on | loop |
| `sds-magnetic-drift` | Circular XY drift | loop |
| `sds-data-stream` | clip-path + brightness data-decode | entrance |
| `sds-chromatic-shift` | Slow hue-rotate colour cycle | loop |
| `sds-ripple-text` | letter-spacing + scale + blur ripple | loop |
| `sds-stagger-chars` | Per-child skewY stagger (needs `.sds-char` children) | entrance |
| `sds-heat-shimmer` | Subtle heat-distortion skewX | loop |

#### Physics per-character (requires `.sds-char` spans)

These animate each character individually using the `--i` CSS variable as a stagger index.

```html
<h1 class="sds-drop-settle">
  <span class="sds-char" style="--i:0">H</span>
  <span class="sds-char" style="--i:1">e</span>
  <span class="sds-char" style="--i:2">l</span>
  <span class="sds-char" style="--i:3">l</span>
  <span class="sds-char" style="--i:4">o</span>
</h1>
```

**Tip:** Load `motion-interactive.min.js` — it automatically splits text into `.sds-char` spans for any element using these classes.

| Class | Effect |
|---|---|
| `sds-gravity-bounce` | Falls from above, inelastic floor bounce |
| `sds-drop-settle` | Staggered fall with spring settle |
| `sds-wave-cascade` | translateY wave propagates char-to-char (loop) |
| `sds-center-burst` | Chars start at center, fan out to reading position |
| `sds-explode-formation` | Scattered start (`--dx`, `--dy`, `--dr`), springs into place |

For `sds-explode-formation`, set per-character displacement variables:

```html
<span class="sds-explode-formation">
  <span class="sds-char" style="--i:0; --dx:-60px; --dy:-40px; --dr:-30deg">S</span>
  <span class="sds-char" style="--i:1; --dx:20px;  --dy:-60px; --dr:45deg">D</span>
  <span class="sds-char" style="--i:2; --dx:70px;  --dy:-20px; --dr:-20deg">S</span>
</span>
```

#### New motion families (45 classes)

| Class | Effect | Type |
|---|---|---|
| `sds-fold-down` | 3D fold from above (top-origin hinge) | entrance |
| `sds-fold-up` | 3D fold from below (bottom-origin hinge) | entrance |
| `sds-flip-x` | 180° horizontal axis flip | entrance |
| `sds-flip-y` | 180° vertical axis flip | entrance |
| `sds-door-open` | rotateY from left edge like a door swinging open | entrance |
| `sds-zoom-punch` | scale 0.2 → 1.12 → 1 punch | entrance |
| `sds-zoom-far` | scale 2.2 → 1 with blur, arrives from Z-distance | entrance |
| `sds-vapor-rise` | translateY + blur + saturate ghostly rise | entrance |
| `sds-light-speed` | translateX + multi-step skewX streak | entrance |
| `sds-roll-in` | Rolls in with 360° rotation | entrance |
| `sds-swing-in` | Pendular rotateX swing from top origin | entrance |
| `sds-skew-slide` | translateX + skewX arrives at an angle | entrance |
| `sds-pop-in` | scale 0 → spring overshoot with rotation | entrance |
| `sds-tracking-expand` | Letter-spacing compressed → normal | entrance |
| `sds-tracking-contract` | Letter-spacing wide → collapses inward | entrance |
| `sds-blur-focus` | blur + letter-spacing → sharp focus | entrance |
| `sds-wipe-right` | Polygon clip expands left→right | entrance |
| `sds-wipe-left` | Polygon clip expands right→left | entrance |
| `sds-reveal-up` | Polygon mask slides upward | entrance |
| `sds-reveal-down` | Polygon mask slides downward | entrance |
| `sds-iris-open` | circle() clip-path opens from center | entrance |
| `sds-shimmer-sweep` | Light shimmer over brand gradient | loop |
| `sds-color-cycle` | Hue-rotating gradient background-clip text | loop |
| `sds-glow-pulse` | text-shadow expands and contracts | loop |
| `sds-neon-flicker-in` | Stepped opacity + glow neon power-on | entrance |
| `sds-echo-out` | Layered offset text-shadow appear | entrance |
| `sds-shadow-lift` | Floats up, layered text-shadow grows | loop |
| `sds-spotlight-text` | Cyclic brightness + blur radial | loop |
| `sds-pixel-in` | blur + contrast step-based | entrance |
| `sds-glitch-slide` | translateX displacement + clip-path | entrance |
| `sds-squash-stretch` | scaleY 0.15 → stretch → spring settle | entrance |
| `sds-bounce-drop` | Multi-bounce drop from high above | entrance |
| `sds-slant-rise` | translateY + rotate + skewX entrance | entrance |
| `sds-grand-entrance` | translateY + scale + rotate + blur combo | entrance |
| `sds-slide-blur-left` | Enters from left with motion blur | entrance |
| `sds-slide-blur-right` | Enters from right with motion blur | entrance |
| `sds-wobble` | translateX + rotate oscillating | loop |
| `sds-rubber-band` | scaleX + scaleY rapid stretch | loop |
| `sds-jello` | skewX + skewY rapid decay | loop |
| `sds-tada` | scale + rotate celebratory | loop |
| `sds-heartbeat-text` | Double-pulse scale heartbeat | loop |
| `sds-typing-caret` | width 0 → 100% typewriter with cursor | entrance |
| `sds-float-bob` | Gentle Y float with micro-rotation | loop |
| `sds-underline-grow` | `::after` underline draws left→right | entrance |
| `sds-strike-through` | `::after` strikeout line draws left→right | entrance |

---

### Buttons — 100 classes

Apply directly to `<button>` or `<a>` elements. Effects are ambient — no interaction required.

```html
<button class="sds-btn-magnetic">Magnetic pulse</button>
<button class="sds-btn-plasma">Plasma glow</button>
<button class="sds-btn-aurora">Aurora border</button>
<button class="sds-btn-neon">Neon sign</button>
<button class="sds-btn-charge">Charging animation</button>
<button class="sds-btn-hologram">Hologram flicker</button>
```

All 100 button classes:

```
sds-btn-amp          sds-btn-aurora       sds-btn-border-flow  sds-btn-bounce
sds-btn-burst        sds-btn-charge       sds-btn-crystal      sds-btn-depth-press
sds-btn-dissolve     sds-btn-edge         sds-btn-energy       sds-btn-fire
sds-btn-flare        sds-btn-float        sds-btn-flux         sds-btn-glow-core
sds-btn-glow-surge   sds-btn-gradient-shift sds-btn-gravity    sds-btn-gravity-pull
sds-btn-heartbeat    sds-btn-hologram     sds-btn-ice          sds-btn-kinetic
sds-btn-lift         sds-btn-liquid       sds-btn-magnetic     sds-btn-magnetic-trail
sds-btn-momentum     sds-btn-morph        sds-btn-neon         sds-btn-neon-trace
sds-btn-outline-grow sds-btn-plasma       sds-btn-press        sds-btn-pulse-border
sds-btn-quantum      sds-btn-radar        sds-btn-recoil       sds-btn-ripple
sds-btn-rotate       sds-btn-scan         sds-btn-shimmer      sds-btn-shock
sds-btn-split        sds-btn-stretch      sds-btn-swipe        sds-btn-tilt
sds-btn-volt         sds-btn-warp
```

---

### Inputs — 100 classes

State-based effects for `<input>` and `<textarea>` elements. Some activate on `:focus`, others run continuously.

```html
<input class="sds-input-focus" placeholder="Focus glow" />
<input class="sds-input-voltage" placeholder="Voltage pulse" />
<input class="sds-input-glow-border" placeholder="Animated glow border" />
<input class="sds-input-shake" placeholder="Error shake" />
<input class="sds-input-success" placeholder="Success pulse" />
<input class="sds-input-laser" placeholder="Laser scan line" />
<input class="sds-input-aurora" placeholder="Aurora sweep" />
```

**Floating label wrapper** — `sds-input-elevate-wrap` requires a specific structure:

```html
<div class="sds-input-elevate-wrap">
  <label for="email">Email</label>
  <input id="email" placeholder=" " type="email" />
</div>
```

All 100 input classes:

```
sds-input-active-line    sds-input-aurora         sds-input-bloom
sds-input-border-beam    sds-input-burst          sds-input-caret
sds-input-charge         sds-input-comet          sds-input-crystal
sds-input-depth          sds-input-echo           sds-input-electric
sds-input-elevate-wrap   sds-input-expand         sds-input-fire
sds-input-flicker        sds-input-flow           sds-input-focus
sds-input-focus-glow     sds-input-frost          sds-input-ghost
sds-input-glitch-valid   sds-input-glow-border    sds-input-gradient-border
sds-input-gravity        sds-input-ink            sds-input-kinetic
sds-input-laser          sds-input-momentum       sds-input-morph
sds-input-morph-ph       sds-input-neon           sds-input-neural
sds-input-orbit          sds-input-plasma         sds-input-prism
sds-input-pulse-dot      sds-input-quantum        sds-input-radar
sds-input-ring           sds-input-ripple         sds-input-scan
sds-input-shake          sds-input-shimmer        sds-input-solar
sds-input-success        sds-input-unlock         sds-input-void
sds-input-voltage        sds-input-waveform       sds-input-zap
```

---

### Cards — 100 classes

Entry and ambient effects for card and container elements.

```html
<div class="sds-card-float">Ambient float</div>
<div class="sds-card-levitate">Levitate with depth shadow</div>
<div class="sds-card-holo">Holographic tilt</div>
<div class="sds-card-portal">Depth portal entrance</div>
<div class="sds-card-spring">Spring entrance</div>
<div class="sds-card-aurora">Aurora border loop</div>
```

**Cards that animate children** — these apply animations to `> *` direct children:

```html
<!-- sds-card-stagger, sds-card-cascade, sds-card-slice need child elements -->
<div class="sds-card-stagger">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>
```

All 100 card classes:

```
sds-card-aurora       sds-card-bloom        sds-card-breath       sds-card-burst
sds-card-cascade      sds-card-cinematic    sds-card-deep-float   sds-card-depth
sds-card-drift        sds-card-electric     sds-card-expand       sds-card-flip
sds-card-flip-reveal  sds-card-float        sds-card-fold         sds-card-force
sds-card-glass        sds-card-glitch       sds-card-glow         sds-card-gravity
sds-card-holo         sds-card-ink          sds-card-iris         sds-card-levitate
sds-card-liquid-border sds-card-magnetic    sds-card-momentum     sds-card-morph
sds-card-neon         sds-card-neon-border  sds-card-parallax     sds-card-portal
sds-card-prism        sds-card-rise         sds-card-rotate       sds-card-scan
sds-card-shadow-lift  sds-card-shimmer      sds-card-slice        sds-card-smoke
sds-card-snap         sds-card-spotlight    sds-card-spring       sds-card-stagger
sds-card-tilt         sds-card-unfold       sds-card-vortex       sds-card-warp
sds-card-wave
```

---

### Loaders — 100 classes

Add a class to an empty `<span>` or `<div>`. The CSS generates the animation entirely with pseudo-elements.

```html
<span class="sds-loader-orbital"></span>
<span class="sds-loader-fluid"></span>
<span class="sds-loader-arc"></span>
<span class="sds-loader-dna"></span>
<span class="sds-loader-morph"></span>
<span class="sds-loader-progress"></span>
<span class="sds-loader-vortex"></span>
<span class="sds-loader-helix"></span>
```

**Loaders that animate children** — these require child elements:

```html
<!-- Wave: 5 children for the bar pattern -->
<div class="sds-loader-wave">
  <span></span><span></span><span></span><span></span><span></span>
</div>

<!-- Dots: 3 children -->
<div class="sds-loader-dots">
  <span></span><span></span><span></span>
</div>

<!-- Grid: 9 children for a 3×3 grid -->
<div class="sds-loader-grid">
  <span></span><span></span><span></span>
  <span></span><span></span><span></span>
  <span></span><span></span><span></span>
</div>

<!-- Cascade: variable children -->
<div class="sds-loader-cascade">
  <span></span><span></span><span></span><span></span>
</div>

<!-- Signal: variable children -->
<div class="sds-loader-signal">
  <span></span><span></span><span></span><span></span><span></span>
</div>
```

All 100 loader classes:

```
sds-loader-arc          sds-loader-bar          sds-loader-bounce
sds-loader-breath       sds-loader-cascade      sds-loader-clock
sds-loader-comet        sds-loader-crystal      sds-loader-cube
sds-loader-data         sds-loader-dna          sds-loader-dots
sds-loader-electric     sds-loader-expand       sds-loader-fluid
sds-loader-glitch       sds-loader-grid         sds-loader-helix
sds-loader-hex          sds-loader-hourglass    sds-loader-infinity
sds-loader-liquid-ring  sds-loader-matrix       sds-loader-morph
sds-loader-mosaic       sds-loader-neon-ring    sds-loader-neural
sds-loader-orbit-3      sds-loader-orbital      sds-loader-pendulum
sds-loader-ping         sds-loader-plasma-ring  sds-loader-prism
sds-loader-progress     sds-loader-progress-glow sds-loader-pulse
sds-loader-quantum      sds-loader-radar        sds-loader-ring
sds-loader-ripple       sds-loader-signal       sds-loader-skeleton
sds-loader-snake        sds-loader-solar        sds-loader-spark
sds-loader-star         sds-loader-target       sds-loader-type
sds-loader-vortex       sds-loader-warp         sds-loader-wave
```

---

### Scroll — 100 classes

Scroll animations fire immediately when the class is applied. Gate them on viewport entry using one of the three methods below.

#### Method 1 — `sds-scroll.min.js` (works everywhere)

```html
<script src="dist/sds-scroll.min.js" defer></script>

<div data-sds class="sds-scroll-rise">Rises on scroll</div>
<div data-sds data-sds-repeat class="sds-scroll-spring">Replays on re-entry</div>
<div data-sds data-sds-delay="300" class="sds-scroll-blur">300ms delay</div>
```

The engine adds `sds-play` to each element when it enters the viewport, `html.sds-js` to the document on load, and removes `sds-play` on exit when `data-sds-repeat` is present.

#### Method 2 — Inline IntersectionObserver (paste-once, zero dependencies)

```html
<div data-sds-scroll class="sds-scroll-rise">Content</div>

<script>
new IntersectionObserver(function(entries) {
  entries.forEach(function(e) {
    if (e.isIntersecting) e.target.classList.add('sds-in');
  });
}).observe(document.querySelector('[data-sds-scroll]'));
</script>
```

For multiple elements, use `querySelectorAll`:

```js
var io = new IntersectionObserver(function(entries) {
  entries.forEach(function(e) {
    if (e.isIntersecting) { e.target.classList.add('sds-in'); io.unobserve(e.target); }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('[data-sds-scroll]').forEach(function(el) { io.observe(el); });
```

#### Method 3 — `sds-scroll-auto` (CSS-only, Chrome / Edge 115+)

Zero JavaScript. Uses the CSS Scroll-Driven Animations API:

```html
<div class="sds-scroll-auto sds-scroll-rise">Animates automatically on scroll</div>
```

#### Stagger scroll animations

These animate direct child elements — they must have children to be visible:

```html
<!-- sds-scroll-stagger-pop and sds-scroll-stagger-grid animate > * children -->
<div data-sds class="sds-scroll-stagger-pop">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
  <div>Item 4</div>
</div>
```

All 100 scroll classes:

```
sds-scroll-blur         sds-scroll-bounce       sds-scroll-cascade
sds-scroll-charge       sds-scroll-cinema       sds-scroll-clip-left
sds-scroll-clip-right   sds-scroll-crystallize  sds-scroll-curtain
sds-scroll-depth        sds-scroll-dissolve     sds-scroll-drift
sds-scroll-elastic      sds-scroll-elastic-pop  sds-scroll-fade-up
sds-scroll-flash        sds-scroll-flip         sds-scroll-fog
sds-scroll-glitch       sds-scroll-gravity      sds-scroll-hologram
sds-scroll-ink          sds-scroll-liquid       sds-scroll-magnetic
sds-scroll-morph        sds-scroll-neon         sds-scroll-orbit
sds-scroll-perspective-left sds-scroll-phantom  sds-scroll-prism
sds-scroll-punch        sds-scroll-radial       sds-scroll-rise
sds-scroll-scale        sds-scroll-scan         sds-scroll-shatter
sds-scroll-skew         sds-scroll-slide        sds-scroll-slide-right
sds-scroll-snap         sds-scroll-spiral       sds-scroll-split
sds-scroll-spring       sds-scroll-stagger-grid sds-scroll-stagger-pop
sds-scroll-streak       sds-scroll-tilt         sds-scroll-unfold
sds-scroll-velvet       sds-scroll-vortex       sds-scroll-warp
sds-scroll-warp-in      sds-scroll-wave-rise    sds-scroll-zoom-blur
```

---

## Interactive Animations (JS engine)

Load `motion-interactive.min.js` once. Add a class. No other JavaScript required.

The engine auto-initializes on page load, handles `MutationObserver` for dynamically added content, uses a shared `requestAnimationFrame` loop for physics, and respects `prefers-reduced-motion` and `(hover: none)` media queries.

| Class | Trigger | Effect |
|---|---|---|
| `sds-word-morph` | Auto (interval) | Cycles through `data-words` with blur/translate transition |
| `sds-jelly-hover` | mouseenter | Squash + stretch spring |
| `sds-scatter-return` | mouseenter / mouseleave | Chars scatter randomly, spring back on leave |
| `sds-shockwave` | click | Radial impulse force from click point |
| `sds-spring-kerning` | mousemove | Mouse X controls letter-spacing −12px…+12px |
| `sds-magnetic-pull` | mousemove | Cursor attracts each character span |
| `sds-repulsion-field` | mousemove | Cursor pushes each character span away |

```html
<script src="dist/motion-interactive.min.js" defer></script>

<!-- Word morph: comma-separated words in data-words -->
<h2 class="sds-word-morph" data-words="Fast,Beautiful,Precise,Powerful">Fast</h2>

<!-- Magnetic pull: optional radius in pixels (default 110) -->
<h2 class="sds-magnetic-pull" data-sds-radius="140">Magnetic</h2>

<!-- Repulsion field -->
<h2 class="sds-repulsion-field" data-sds-radius="100">Push away</h2>

<!-- Jelly hover: works on any element, not just text -->
<span class="sds-jelly-hover">Jelly</span>

<!-- Scatter return: chars randomly scatter on hover -->
<span class="sds-scatter-return">Scatter</span>

<!-- Shockwave click: cursor pointer is added automatically -->
<h2 class="sds-shockwave">Click for shockwave</h2>

<!-- Spring kerning: mouse X position controls spacing -->
<span class="sds-spring-kerning">Kerning</span>
```

### SPA and dynamic content

After inserting new elements into the DOM:

```js
// Scan a specific container for new interactive elements
window.SDSInteractive.scan(containerElement);

// Initialize a single element
window.SDSInteractive.initEl(element);

// Remove all listeners / intervals from an element (e.g. before removal)
window.SDSInteractive.cleanup(element);
```

---

## Modifiers

Stack any modifier on any animation class. Modifiers never conflict because all SDS classes are namespaced `sds-`.

### Speed

```html
<span class="sds-velvet-drop sds-fast">0.5× speed</span>
<span class="sds-velvet-drop">Default speed (0.8s)</span>
<span class="sds-velvet-drop sds-slow">1.6× speed</span>
<span class="sds-velvet-drop sds-xslow">2.2× speed</span>
```

### Delay

```html
<span class="sds-liquid-rise sds-delay-1">0.1s delay</span>
<span class="sds-liquid-rise sds-delay-2">0.2s delay</span>
<span class="sds-liquid-rise sds-delay-3">0.3s delay</span>
<span class="sds-liquid-rise sds-delay-4">0.4s delay</span>
<span class="sds-liquid-rise sds-delay-5">0.5s delay</span>
<span class="sds-liquid-rise sds-delay-6">0.6s delay</span>
<span class="sds-liquid-rise sds-delay-8">0.8s delay</span>
<span class="sds-liquid-rise sds-delay-10">1.0s delay</span>
```

Note: `sds-delay-7` and `sds-delay-9` do not exist — the sequence steps 6 → 8 → 10.

### Playback

```html
<span class="sds-refract sds-loop">Loops forever</span>
<span class="sds-refract sds-loop sds-alt">Alternates direction each loop</span>
<span class="sds-refract sds-once">Plays once then stops</span>
```

### Fill mode

```html
<span class="sds-velvet-drop sds-fill-both">Holds first and last keyframe</span>
<span class="sds-velvet-drop sds-fill-forward">Holds last keyframe after finishing</span>
```

### Pause on hover

```html
<!-- Pause when the element itself is hovered -->
<span class="sds-neon-flare sds-loop sds-pause-hover">Pauses on hover</span>
```

### Complete modifier reference

| Class | Effect |
|---|---|
| `sds-fast` | 0.5× duration |
| `sds-normal` | 1× duration (reset to default) |
| `sds-slow` | 1.6× duration |
| `sds-xslow` | 2.2× duration |
| `sds-delay-1` | 0.1s start delay |
| `sds-delay-2` | 0.2s start delay |
| `sds-delay-3` | 0.3s start delay |
| `sds-delay-4` | 0.4s start delay |
| `sds-delay-5` | 0.5s start delay |
| `sds-delay-6` | 0.6s start delay |
| `sds-delay-8` | 0.8s start delay |
| `sds-delay-10` | 1.0s start delay |
| `sds-loop` | Infinite iteration |
| `sds-alt` | Alternating direction on loop |
| `sds-once` | Play once, stop in final state |
| `sds-fill-both` | Hold both first and last keyframe |
| `sds-fill-forward` | Hold last keyframe after completion |
| `sds-pause-hover` | Pause animation when element is hovered |

---

## Stagger & Children Animations

Some animation classes target direct child elements (`> *`) rather than the element itself. These classes produce no visible animation unless children are present.

### Summary of classes that need children

| Category | Classes requiring child elements |
|---|---|
| Text | `sds-kinetic-wave`, `sds-arc-orbit`, `sds-signal-wave`, `sds-stagger-chars` |
| Text (physics) | `sds-gravity-bounce`, `sds-drop-settle`, `sds-wave-cascade`, `sds-center-burst`, `sds-explode-formation` |
| Buttons | `sds-btn-icon-launch`, `sds-btn-spin-settle`, `sds-btn-label-slide`, `sds-btn-label-typewrite`, `sds-btn-label-wave`, `sds-btn-nudge`, `sds-btn-swap-flip` |
| Cards | `sds-card-cascade`, `sds-card-slice`, `sds-card-stagger`, `sds-card-accordion-in`, `sds-card-checker`, `sds-card-fan-spread`, `sds-card-layers`, `sds-card-reveal-stack` |
| Loaders | `sds-loader-cascade`, `sds-loader-dots`, `sds-loader-grid`, `sds-loader-signal`, `sds-loader-wave`, `sds-loader-bounce-bar`, `sds-loader-dots-bounce`, `sds-loader-dots-expand`, `sds-loader-dots-fade`, `sds-loader-dots-flip`, `sds-loader-dots-wave`, `sds-loader-equalizer`, `sds-loader-pinwheel`, `sds-loader-spin-fade`, `sds-loader-squares`, `sds-loader-windmill` |
| Scroll | `sds-scroll-stagger-pop`, `sds-scroll-stagger-grid`, `sds-scroll-cascade`, `sds-scroll-stagger-fade`, `sds-scroll-stagger-rise`, `sds-scroll-stagger-slide` |

### Char-split text animations

The five physics animations and the four char-targeted loops (kinetic-wave, arc-orbit, signal-wave, stagger-chars) require each character to be wrapped in a span with the `sds-char` class and a `--i` custom property for the stagger index:

```html
<h1 class="sds-kinetic-wave">
  <span class="sds-char" style="--i:0">M</span>
  <span class="sds-char" style="--i:1">o</span>
  <span class="sds-char" style="--i:2">t</span>
  <span class="sds-char" style="--i:3">i</span>
  <span class="sds-char" style="--i:4">o</span>
  <span class="sds-char" style="--i:5">n</span>
</h1>
```

**Automating the split:** Load `motion-interactive.min.js` — it automatically splits text for the above classes without any extra code. The `aria-label` attribute is preserved so screen readers still read the full word.

---

## Theming

Override CSS custom properties to match your brand. Changes apply to every animation that uses that variable.

```css
/* Global override */
:root {
  --sds-primary:      #0015d1;   /* Brand colour — used in gradients, glows, text effects */
  --sds-primary-dim:  rgba(0, 21, 209, 0.08);  /* Low-opacity brand tint */
  --sds-primary-glow: rgba(0, 21, 209, 0.30);  /* Glow / shadow blur colour */
  --sds-accent:       #d10028;   /* Accent / error colour */
  --sds-success:      #00c48c;   /* Success colour */
  --sds-duration:     0.8s;      /* Base animation duration */
  --sds-easing:       cubic-bezier(0.22, 1, 0.36, 1);  /* Base easing */
}
```

### Motion tokens (v5 scale)

The library's timing now flows through a named token scale, specified in
[`SPEC.md`](SPEC.md) and sourced from [`tokens/motion.tokens.json`](tokens/motion.tokens.json)
(W3C Design Tokens format — also exported for Figma Tokens / Tokens Studio and as a
generated TypeScript constants module). Defaults are identical to v4; the legacy
`--sds-duration` / `--sds-easing` tokens keep working forever.

| Token | Value | Token | Curve |
|---|---|---|---|
| `--sds-duration-instant` | 0.3s | `--sds-ease-standard` | `cubic-bezier(0.22, 1, 0.36, 1)` |
| `--sds-duration-fast` | 0.4s | `--sds-ease-decelerate` | `cubic-bezier(0.16, 1, 0.3, 1)` |
| `--sds-duration-base` | 0.8s | `--sds-ease-accelerate` | `cubic-bezier(0.6, -0.28, 0.74, 0.05)` |
| `--sds-duration-slow` | 1.4s | `--sds-ease-emphasized` | `cubic-bezier(0.215, 0.61, 0.355, 1)` |
| `--sds-duration-slower` | 2.2s | `--sds-ease-spring` | `cubic-bezier(0.34, 1.56, 0.64, 1)` |
| `--sds-duration-dramatic` | 3s | `--sds-ease-bounce` | `cubic-bezier(0.68, -0.55, 0.27, 1.55)` |

Entrance distances: `--sds-distance-sm` (24px), `--sds-distance-md` (48px), `--sds-distance-lg` (80px).

```css
/* Speed up every standard entrance, keep everything else */
:root { --sds-duration-base: 0.6s; }

/* Scoped override — affects only animations inside .hero */
.hero {
  --sds-primary:      #7c3aed;
  --sds-primary-glow: rgba(124, 58, 237, 0.35);
  --sds-duration:     1.2s;
}
```

---

## TypeScript & Autocomplete

The package ships a complete `index.d.ts` with typed unions for every class in the library. Works in any TypeScript project.

```ts
import type { SdsAnimationClass, SdsTextAnimation, SdsModifier } from '@salkomdesignstudio/sds-motion-forge';

// className builder with full autocomplete
function anim(base: SdsTextAnimation, ...mods: SdsModifier[]): string {
  return [base, ...mods].join(' ');
}

const cls = anim('sds-velvet-drop', 'sds-slow', 'sds-delay-2');
// → 'sds-velvet-drop sds-slow sds-delay-2'
```

Available exported types:

| Type | Classes |
|---|---|
| `SdsTextAnimation` | All 104 text animation classes |
| `SdsButtonAnimation` | All 100 button animation classes |
| `SdsInputAnimation` | All 100 input animation classes |
| `SdsCardAnimation` | All 100 card animation classes |
| `SdsLoaderAnimation` | All 100 loader animation classes |
| `SdsScrollAnimation` | All 100 scroll animation classes |
| `SdsInteractiveAnimation` | All 7 JS-engine classes |
| `SdsModifier` | All 18 modifier classes |
| `SdsScrollGate` | `sds-play`, `sds-scroll-auto` |
| `SdsAnimationClass` | Union of all the above |

**React with TypeScript:**

```tsx
import type { SdsButtonAnimation } from '@salkomdesignstudio/sds-motion-forge';

interface ButtonProps {
  animation?: SdsButtonAnimation;
  children: React.ReactNode;
}

export function Button({ animation = 'sds-btn-magnetic', children }: ButtonProps) {
  return <button className={animation}>{children}</button>;
}
```

**Angular with TypeScript:**

```ts
import type { SdsTextAnimation } from '@salkomdesignstudio/sds-motion-forge';

@Component({
  selector: 'app-heading',
  template: '<h1 [class]="animation">{{ text }}</h1>',
})
export class HeadingComponent {
  @Input() animation: SdsTextAnimation = 'sds-velvet-drop';
  @Input() text = 'Hello';
}
```

---

## Accessibility

Motion Forge respects `prefers-reduced-motion` automatically across all three layers. No configuration required.

When `prefers-reduced-motion: reduce` is set by the user's OS:

| Layer | Behavior |
|---|---|
| CSS core | All animations collapse to `0.01ms` and play once — elements immediately reach their final state |
| Scroll gate (`sds-scroll.min.js`) | `sds-play` is added to every `[data-sds]` element immediately, bypassing the observer — all elements are visible |
| Interactive engine | Transitions and physics loops are skipped entirely; elements display in their static final state |
| `sds-word-morph` | Still cycles words but skips the blur/translate transition — instant word swap |

**Screen reader support:** The interactive engine's `splitChars` function sets `aria-label` on the parent to preserve the full readable text, then marks each individual `<span>` with `aria-hidden="true"`.

---

## Browser Support

| Browser | Minimum |
|---|---|
| Chrome / Edge | 80+ |
| Firefox | 78+ |
| Safari | 14+ |
| Opera | 67+ |

**Feature notes:**

- `clip-path`, `transform`, `filter`, `@keyframes`: all modern browsers
- `backdrop-filter` (used in demo page): Chrome 76+, Firefox 103+, Safari 9+ (with `-webkit-`)
- CSS Scroll-Driven Animations (`sds-scroll-auto`): Chrome / Edge 115+ only; graceful fallback — element is visible but does not animate on scroll
- `IntersectionObserver` (used by scroll engines): all modern browsers; not supported in IE11
- `WeakMap`, `MutationObserver` (used by interactive engine): all modern browsers

IE11 is not supported.

---

## Project Structure

```
SDS-Motion-Forge/
├── src/
│   ├── motion.css                    # Source — 300+ animations, 177 KB
│   ├── sds-scroll.js                 # Scroll gate engine source, 3.6 KB
│   └── motion-interactive.js         # Interactive JS engine source, 15.2 KB
│
├── dist/                             # Generated by `npm run build` — do not edit
│   ├── motion.css                    # PostCSS-processed, 177 KB
│   ├── motion.min.css                # Minified, 119 KB (gzip: ~20 KB, brotli: ~16 KB)
│   ├── sds-scroll.min.js             # Terser-minified, 1.28 KB (gzip: ~0.6 KB)
│   ├── sds-scroll.min.js.map         # Source map
│   ├── motion-interactive.min.js     # Terser-minified, 6.98 KB (gzip: ~2.4 KB)
│   └── motion-interactive.min.js.map # Source map
│
├── docs/
│   └── index.html                    # Self-contained live demo and documentation page
│
├── .github/
│   └── workflows/
│       ├── ci.yml                    # Tests on Node 18/20/22 × Ubuntu/macOS/Windows
│       └── publish.yml               # npm publish with OIDC provenance on release
│
├── index.d.ts                        # TypeScript declarations — all 376+ classes typed
├── verify-build.js                   # Pre-publish verification (8-stage gate)
├── postcss.config.js                 # PostCSS config (autoprefixer)
├── package.json
└── netlify.toml                      # Docs site deployment config
```

### Build pipeline

```
src/motion.css
    → postcss (autoprefixer)
    → dist/motion.css
    → cleancss
    → dist/motion.min.css

src/sds-scroll.js
    → terser (compress + mangle + source-map)
    → dist/sds-scroll.min.js
    → dist/sds-scroll.min.js.map

src/motion-interactive.js
    → terser (compress + mangle + source-map)
    → dist/motion-interactive.min.js
    → dist/motion-interactive.min.js.map
```

The `dist/*.min.js` files are **generated artifacts** — they are in `.gitignore` and must never be edited manually. Always edit the source in `src/`, then rebuild.

---

## Build from Source

### Prerequisites

- Node.js 18 or higher
- npm 9 or higher

### Setup

```bash
git clone https://github.com/salkomdesignstudio/SDS-Motion-Forge.git
cd SDS-Motion-Forge
npm install
```

### Available scripts

```bash
# Build everything (CSS + JS) for production
npm run build

# Build CSS only
npm run build:css

# Build and minify JS engines only
npm run build:js

# Build CSS with source maps (for development)
npm run build:dev

# Watch CSS for changes and rebuild continuously
npm run build:watch

# Run all pre-publish checks
npm run release:check

# Verify build artifacts (8-stage check)
npm run build:verify

# Validate package.json exports with publint
npm run validate

# Preview what will be published to npm
npm run pack:check
```

### Local preview of the demo page

After building, copy the `dist/` folder into `docs/` so the demo page can load the CSS:

```bash
npm run build
cp -r dist docs/dist
# Then open docs/index.html in a browser
```

---

## Contributing

Contributions are welcome. This is an MIT-licensed open-source project.

**Start with [CONTRIBUTING.md](CONTRIBUTING.md)** — it explains the
registry → codegen architecture, the compatibility contract, and the
machine-enforced checklist for new animations. Public API changes and new
categories go through the [RFC process](docs/rfcs/0000-template.md).
Governance: [VERSIONING.md](VERSIONING.md) · [SECURITY.md](SECURITY.md) ·
[CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

### Reporting bugs

Please [open an issue](https://github.com/salkomdesignstudio/SDS-Motion-Forge/issues/new) with:
- The class name(s) affected
- What you expected to happen
- What actually happened
- Browser and version
- A minimal reproduction (CodePen, StackBlitz, or HTML snippet)

### Requesting animations

Open an issue with the label **`animation-request`**. Include a description of the effect and, if possible, a reference (gif, video, live example).

### Submitting a pull request

1. **Fork** the repository and create a branch: `git checkout -b feat/my-animation`
2. **Install** dependencies: `npm install`
3. **Make your changes** in `src/` — never edit files in `dist/` directly
4. **Rebuild**: `npm run build`
5. **Verify the build passes**: `npm run build:verify`
6. **Test visually** by opening `docs/index.html` (after `cp -r dist docs/dist`)
7. **Commit** with a descriptive message
8. **Open a PR** against `main` with a description of what the animation does

### Adding a new animation

All CSS animations live in `src/motion.css`. Follow these conventions:

- **Naming:** `sds-[descriptive-name]` — lowercase, hyphenated, `sds-` prefix required
- **Keyframe naming:** `sds-camelCaseName` matching the class (e.g., `.sds-velvet-drop` → `@keyframes sds-velvetDrop`)
- **CSS variables:** Use `--sds-duration` for duration and `--sds-easing` for the easing function where possible
- **`will-change`:** Add `will-change: transform, opacity` for GPU-composited animations
- **Reduced motion:** The global `prefers-reduced-motion` block in the CSS covers all animations automatically
- **`both` fill mode:** Use `animation-fill-mode: both` so the element holds its pre-animation state

After adding a CSS animation:
1. Add the class name to `REQUIRED_CLASSES` in `verify-build.js`
2. Add the `@keyframes` name to `REQUIRED_KEYFRAMES` in `verify-build.js`
3. Add the TypeScript type to the appropriate union in `index.d.ts`
4. Add the animation to the `ANIMATIONS` object in `docs/index.html` for gallery display

### Code style

- CSS: 2-space indentation, one declaration per line
- JavaScript: 2-space indentation, `var` declarations (ES5 compatible), semicolons
- No linter is enforced currently — follow the style of surrounding code

---

## Backward Compatibility

All v3.x class names continue to work identically. The following legacy aliases are permanent and will never be removed:

| Legacy class | Resolves to |
|---|---|
| `sds-scroll-fade-up` | `sds-scroll-rise` |
| `sds-input-focus-glow` | `sds-input-focus` |
| `sds-card-neon` | `sds-card-glow` |
| `sds-card-depth` | `sds-card-parallax` |
| `sds-card-flip` | `sds-card-slice` |
| `sds-loader-progress-glow` | `sds-loader-progress` |

---

## License

MIT © [Salkom Design Studio](https://salkomdesignstudio.com)

Built by **Govarthanan** — UI/UX Designer & Frontend Developer  
[Salkom Design Studio](https://salkomdesignstudio.com) · Puducherry, India 🇮🇳

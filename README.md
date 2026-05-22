# SDS Motion

**90+ production-ready CSS animations — applied with a single class name.**

No JavaScript. No dependencies. Drop it into HTML, Angular, React, Vue, Bootstrap, or Tailwind and start animating in seconds.

[![npm version](https://img.shields.io/npm/v/@salkomdesignstudio/sds-motion-forge.svg?style=flat-square)](https://www.npmjs.com/package/@salkomdesignstudio/sds-motion-forge)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)
[![Bundle size](https://img.shields.io/bundlephobia/minzip/@salkomdesignstudio/sds-motion-forge?style=flat-square)](https://bundlephobia.com/package/@salkomdesignstudio/sds-motion-forge)

---

## Install

```bash
npm install @salkomdesignstudio/sds-motion-forge
```

---

## Usage

### HTML / Bootstrap / Tailwind

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@salkomdesignstudio/sds-motion-forge/dist/motion.min.css">

<h1 class="sds-velvet-drop">Hello World</h1>
<button class="sds-btn-magnetic">Click Me</button>
<div class="sds-card-float">Card</div>
```

### Angular (`styles.scss` or `angular.json`)

```scss
@import '@salkomdesignstudio/sds-motion-forge/dist/motion.min.css';
```

```html
<h1 class="sds-liquid-rise">Hello Angular</h1>
```

### React

```jsx
import '@salkomdesignstudio/sds-motion-forge/dist/motion.min.css';

export default function Hero() {
  return <h1 className="sds-phantom-blur">React Ready</h1>;
}
```

### Vue

```js
// main.js
import '@salkomdesignstudio/sds-motion-forge/dist/motion.min.css';
```

```html
<template>
  <h1 class="sds-gravity-drop">Vue Animated</h1>
</template>
```

---

## Animation Categories

| Category | Prefix | Example Classes |
|---|---|---|
| **Text** | `sds-` | `sds-velvet-drop`, `sds-liquid-rise`, `sds-refract`, `sds-phantom-blur` |
| **Buttons** | `sds-btn-` | `sds-btn-magnetic`, `sds-btn-glow-surge`, `sds-btn-neon`, `sds-btn-plasma` |
| **Inputs** | `sds-input-` | `sds-input-focus-glow`, `sds-input-shake`, `sds-input-success` |
| **Cards** | `sds-card-` | `sds-card-float`, `sds-card-flip`, `sds-card-neon`, `sds-card-depth` |
| **Loaders** | `sds-loader-` | `sds-loader-spin`, `sds-loader-dots`, `sds-loader-progress-glow` |
| **Scroll** | `sds-scroll-` | `sds-scroll-fade-up`, `sds-scroll-velvet`, `sds-scroll-glitch` |

---

## Quick Reference

### Text Animations
```html
<span class="sds-velvet-drop">Velvet Drop</span>
<span class="sds-liquid-rise">Liquid Rise</span>
<span class="sds-refract">Refract</span>
<span class="sds-phantom-blur">Phantom Blur</span>
<span class="sds-gravity-drop">Gravity Drop</span>
<span class="sds-static-burst">Static Burst</span>
<span class="sds-elastic-stamp">Elastic Stamp</span>
<span class="sds-slice-reveal">Slice Reveal</span>
```

### Button Animations
```html
<button class="sds-btn-magnetic">Magnetic</button>
<button class="sds-btn-liquid">Liquid</button>
<button class="sds-btn-energy">Energy</button>
<button class="sds-btn-plasma">Plasma</button>
<button class="sds-btn-neon">Neon</button>
<button class="sds-btn-lift">Lift Shadow</button>
```

### Card Animations
```html
<div class="sds-card-float">Float</div>
<div class="sds-card-flip">Flip</div>
<div class="sds-card-depth">Depth</div>
<div class="sds-card-neon">Neon</div>
```

### Loader Animations
```html
<div class="sds-loader-spin"></div>
<div class="sds-loader-dots"></div>
<div class="sds-loader-progress-glow"></div>
```

### Scroll Animations
```html
<section class="sds-scroll-fade-up">Fades up on scroll</section>
<section class="sds-scroll-velvet">Velvet drop on scroll</section>
<section class="sds-scroll-glitch">Glitch reveal on scroll</section>
```

---

## Utility Modifiers

```html
<!-- Delays -->
<span class="sds-velvet-drop sds-delay-3">Delayed 0.3s</span>

<!-- Speed -->
<span class="sds-liquid-rise sds-fast">Fast</span>
<span class="sds-liquid-rise sds-slow">Slow</span>
<span class="sds-liquid-rise sds-xslow">Very Slow</span>

<!-- Loop -->
<span class="sds-refract sds-loop">Loops forever</span>
<span class="sds-refract sds-alt">Alternates</span>

<!-- Pause on hover -->
<div class="sds-pause-hover">
  <span class="sds-refract sds-loop">Pauses when you hover the parent</span>
</div>
```

---

## CSS Custom Properties (Theming)

Override these to match your brand:

```css
:root {
  --sds-primary:       #0015D1;
  --sds-primary-dim:   rgba(0, 21, 209, 0.08);
  --sds-primary-glow:  rgba(0, 21, 209, 0.30);
  --sds-accent:        #d10028;
  --sds-success:       #00c48c;
  --sds-duration:      0.8s;
  --sds-easing:        cubic-bezier(0.22, 1, 0.36, 1);
}
```

---

## CDN

```html
<!-- jsDelivr (recommended) -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@salkomdesignstudio/sds-motion-forge/dist/motion.min.css">

<!-- Pinned version -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@salkomdesignstudio/sds-motion-forge@3.0.0/dist/motion.min.css">

<!-- unpkg -->
<link rel="stylesheet" href="https://unpkg.com/@salkomdesignstudio/sds-motion-forge/dist/motion.min.css">
```

---

## Build from Source

```bash
git clone https://github.com/salkomdesignstudio/SDS-Motion-Forge.git
cd SDS-Motion-Forge
npm install
npm run build
```

---

## Browser Support

| Chrome | Firefox | Safari | Edge |
|---|---|---|---|
| ✅ 80+ | ✅ 78+ | ✅ 14+ | ✅ 80+ |

---

## License

MIT © [Salkom Design Studio](https://salkomdesignstudio.com)

---

## About

Built by **Govarthanan** — UI/UX Designer & Frontend Developer at [Salkom Design Studio](https://salkomdesignstudio.com), Chennai.

> *"Animation by class name."*

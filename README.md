# SDS Motion

**180+ production-ready CSS animations — applied with a single class name.**

No JavaScript. No dependencies. Drop it into HTML, Angular, React, Vue, Bootstrap, or Tailwind and start animating in seconds.

[![npm version](https://img.shields.io/npm/v/sds-motion.svg?style=flat-square)](https://www.npmjs.com/package/sds-motion)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)
[![Bundle size](https://img.shields.io/bundlephobia/minzip/sds-motion?style=flat-square)](https://bundlephobia.com/package/sds-motion)

---

## Install

```bash
npm install sds-motion
```

```bash
npx sds-motion init
```

---

## Usage

### HTML / Bootstrap / Tailwind

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/sds-motion/dist/motion.min.css">

<h1 class="sds-fade-up">Hello World</h1>
<button class="sds-btn-shimmer">Click Me</button>
<div class="sds-card-float">Card</div>
```

### Angular (`styles.scss` or `angular.json`)

```scss
@import 'sds-motion/dist/motion.min.css';
```

```html
<h1 class="sds-fade-up">Hello Angular</h1>
```

### React

```jsx
import 'sds-motion/dist/motion.min.css';

export default function Hero() {
  return <h1 className="sds-zoom-blur">React Ready</h1>;
}
```

### Vue

```js
// main.js
import 'sds-motion/dist/motion.min.css';
```

```html
<template>
  <h1 class="sds-bounce-in">Vue Animated</h1>
</template>
```

---

## Animation Categories

| Category | Prefix | Count | Example Classes |
|---|---|---|---|
| **Text** | `sds-` | 30 | `sds-fade-up`, `sds-typewriter`, `sds-glitch`, `sds-wave` |
| **Buttons** | `sds-btn-` | 30 | `sds-btn-shimmer`, `sds-btn-glow`, `sds-btn-neon`, `sds-btn-bounce` |
| **Inputs** | `sds-input-` | 30 | `sds-input-focus-glow`, `sds-input-shake`, `sds-input-success` |
| **Cards** | `sds-card-` | 30 | `sds-card-float`, `sds-card-flip`, `sds-card-neon`, `sds-card-pop` |
| **Loaders** | `sds-loader-` | 30 | `sds-loader-spin`, `sds-loader-dots`, `sds-loader-progress-glow` |
| **Scroll** | `sds-scroll-` | 20 | `sds-scroll-fade-up`, `sds-scroll-flip-up`, `sds-scroll-zoom-in` |

---

## Quick Reference

### Text Animations
```html
<span class="sds-fade-up">Fade Up</span>
<span class="sds-blur-in">Blur In</span>
<span class="sds-typewriter">Typewriter</span>
<span class="sds-glitch">Glitch</span>
<span class="sds-wave">Wave</span>
<span class="sds-bounce-in">Bounce In</span>
<span class="sds-gradient-text">Gradient</span>
<span class="sds-neon-pulse">Neon</span>
```

### Button Animations
```html
<button class="sds-btn-shimmer">Shimmer</button>
<button class="sds-btn-glow">Glow Pulse</button>
<button class="sds-btn-neon">Neon Border</button>
<button class="sds-btn-bounce">Bounce</button>
<button class="sds-btn-morph">Morph Shape</button>
<button class="sds-btn-float">Float Shadow</button>
```

### Card Animations
```html
<div class="sds-card-fade-up">Fade Up</div>
<div class="sds-card-float">Float</div>
<div class="sds-card-flip">Flip</div>
<div class="sds-card-glow-border">Glow Border</div>
<div class="sds-card-neon">Neon</div>
```

### Loader Animations
```html
<div class="sds-loader-spin"></div>
<div class="sds-loader-dots"></div>
<div class="sds-loader-progress-glow"></div>
<div class="sds-loader-skeleton"></div>
```

### Scroll Animations (IntersectionObserver auto-activates)
```html
<section class="sds-scroll-fade-up">Section 1</section>
<section class="sds-scroll-zoom-in">Section 2</section>
<section class="sds-scroll-flip-up">Section 3</section>
```

---

## CDN (jsDelivr)

```html
<!-- Latest -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/sds-motion/dist/motion.min.css">

<!-- Pinned version -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/sds-motion@1.0.0/dist/motion.min.css">
```

## CDN (unpkg)

```html
<link rel="stylesheet" href="https://unpkg.com/sds-motion/dist/motion.min.css">
```

---

## File Structure

```
sds-motion/
├── src/
│   └── motion.css          # Source (unminified, with comments)
├── dist/
│   ├── motion.css          # Built CSS
│   └── motion.min.css      # Minified (production)
├── package.json
├── README.md
└── LICENSE
```

---

## Build from Source

```bash
git clone https://github.com/salkom/sds-motion.git
cd sds-motion
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

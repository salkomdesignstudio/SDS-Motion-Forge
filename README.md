# SDS Motion Forge

**90+ production-ready CSS animations. One class name. Zero JavaScript.**

[![npm version](https://img.shields.io/npm/v/@salkomdesignstudio/sds-motion-forge.svg?style=flat-square)](https://www.npmjs.com/package/@salkomdesignstudio/sds-motion-forge)
[![Bundle size](https://img.shields.io/bundlephobia/minzip/@salkomdesignstudio/sds-motion-forge?style=flat-square)](https://bundlephobia.com/package/@salkomdesignstudio/sds-motion-forge)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](https://github.com/salkomdesignstudio/SDS-Motion-Forge/blob/main/LICENSE)

SDS Motion Forge is a pure-CSS animation library built for production UI. It ships a single minified stylesheet containing categorized, semantically named animation classes — text, buttons, inputs, cards, loaders, and scroll-triggered effects — that work in any HTML-based environment with no runtime dependencies.

---

## Why SDS Motion Forge

Most animation libraries either require JavaScript to function or are so generic they look the same on every site. Motion Forge is different: it's a focused, opinionated set of named animations built for design-driven teams who want character and precision without the overhead.

- **No JavaScript at all.** Pure `@keyframes` and CSS classes. No observers, no event listeners, no bundle weight beyond the stylesheet itself.
- **Truly framework-agnostic.** Works identically in plain HTML, Angular, React, Vue, Bootstrap, and Tailwind — anywhere a class attribute is valid.
- **Named for intent.** Classes like `sds-velvet-drop`, `sds-phantom-blur`, and `sds-btn-magnetic` describe the visual effect, not abstract values, making them easy to reason about and communicate across design and development.
- **Themeable from CSS custom properties.** Colors, duration, and easing are exposed as CSS variables. Override two lines and the entire library matches your brand.

---

## Installation

```bash
npm install @salkomdesignstudio/sds-motion-forge
```

Or via CDN (no build step required):

```html
<!-- jsDelivr (recommended) -->
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/@salkomdesignstudio/sds-motion-forge/dist/motion.min.css"
/>

<!-- Pin to a specific version -->
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/@salkomdesignstudio/sds-motion-forge@3.0.0/dist/motion.min.css"
/>

<!-- unpkg -->
<link
  rel="stylesheet"
  href="https://unpkg.com/@salkomdesignstudio/sds-motion-forge/dist/motion.min.css"
/>
```

---

## Quick Start

Once the stylesheet is loaded, apply any animation class directly to an element:

```html
<h1 class="sds-velvet-drop">Welcome</h1>
<button class="sds-btn-magnetic">Get Started</button>
<div class="sds-card-float">Feature Card</div>
```

That's it. No initialization, no data attributes, no configuration files.

---

## Framework Integration

### Plain HTML

```html
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/@salkomdesignstudio/sds-motion-forge/dist/motion.min.css"
/>

<h1 class="sds-velvet-drop">Hello World</h1>
<button class="sds-btn-magnetic">Click Me</button>
```

### React

```jsx
// Import once in your app entry point (e.g. main.jsx or App.jsx)
import "@salkomdesignstudio/sds-motion-forge/dist/motion.min.css";

export default function Hero() {
  return (
    <section>
      <h1 className="sds-phantom-blur">React Ready</h1>
      <button className="sds-btn-glow-surge">Learn More</button>
    </section>
  );
}
```

### Vue

```js
// main.js
import "@salkomdesignstudio/sds-motion-forge/dist/motion.min.css";
```

```html
<template>
  <h1 class="sds-gravity-drop">Vue Animated</h1>
</template>
```

### Angular

In `styles.scss` or via `angular.json` under `styles`:

```scss
@import "@salkomdesignstudio/sds-motion-forge/dist/motion.min.css";
```

```html
<h1 class="sds-liquid-rise">Hello Angular</h1>
```

### Tailwind / Bootstrap

Because Motion Forge is a standalone stylesheet, it layers cleanly alongside utility frameworks. Import it once and use both class systems side by side:

```html
<button class="btn btn-primary sds-btn-magnetic">Bootstrap + Motion</button>
<div class="rounded-xl shadow-lg sds-card-float">Tailwind + Motion</div>
```

---

## Animation Reference

### Text Animations

Entrance and ambient effects designed for headings, labels, and display copy.

| Class               | Effect                       |
| ------------------- | ---------------------------- |
| `sds-velvet-drop`   | Soft, weighted drop-in       |
| `sds-liquid-rise`   | Fluid upward reveal          |
| `sds-phantom-blur`  | Blur-to-sharp entrance       |
| `sds-gravity-drop`  | Accelerated fall with settle |
| `sds-refract`       | Chromatic split and resolve  |
| `sds-static-burst`  | Glitch-static reveal         |
| `sds-elastic-stamp` | Overshooting stamp-down      |
| `sds-slice-reveal`  | Clipped horizontal reveal    |

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

Interactive states and hover effects for CTAs and action elements.

| Class                | Effect                             |
| -------------------- | ---------------------------------- |
| `sds-btn-magnetic`   | Subtle gravitational pull on hover |
| `sds-btn-liquid`     | Fluid fill on interaction          |
| `sds-btn-glow-surge` | Radial glow expansion              |
| `sds-btn-neon`       | Neon border pulse                  |
| `sds-btn-plasma`     | Plasma energy shimmer              |
| `sds-btn-energy`     | Electric charge effect             |
| `sds-btn-lift`       | Elevated shadow on hover           |

```html
<button class="sds-btn-magnetic">Magnetic</button>
<button class="sds-btn-liquid">Liquid</button>
<button class="sds-btn-energy">Energy</button>
<button class="sds-btn-plasma">Plasma</button>
<button class="sds-btn-neon">Neon</button>
<button class="sds-btn-lift">Lift Shadow</button>
```

### Input Animations

Focus and validation states for form fields.

| Class                  | Effect                      |
| ---------------------- | --------------------------- |
| `sds-input-focus-glow` | Glow ring on focus          |
| `sds-input-shake`      | Horizontal shake for errors |
| `sds-input-success`    | Success pulse feedback      |

```html
<input class="sds-input-focus-glow" placeholder="Focus me" />
<input class="sds-input-shake" placeholder="Validation error" />
<input class="sds-input-success" placeholder="Validated" />
```

### Card Animations

Entry and ambient effects for card components and container elements.

| Class            | Effect                 |
| ---------------- | ---------------------- |
| `sds-card-float` | Perpetual gentle float |
| `sds-card-flip`  | 3D flip reveal         |
| `sds-card-depth` | Layered depth shift    |
| `sds-card-neon`  | Neon border glow       |

```html
<div class="sds-card-float">Float</div>
<div class="sds-card-flip">Flip</div>
<div class="sds-card-depth">Depth</div>
<div class="sds-card-neon">Neon</div>
```

### Loader Animations

Standalone loading indicators that require no additional markup.

| Class                      | Effect                   |
| -------------------------- | ------------------------ |
| `sds-loader-spin`          | Classic circular spinner |
| `sds-loader-dots`          | Three-dot pulse sequence |
| `sds-loader-progress-glow` | Glowing progress bar     |

```html
<div class="sds-loader-spin"></div>
<div class="sds-loader-dots"></div>
<div class="sds-loader-progress-glow"></div>
```

### Scroll Animations

Viewport-triggered entrance animations for page sections and content blocks.

| Class                | Effect                      |
| -------------------- | --------------------------- |
| `sds-scroll-fade-up` | Fade in while rising        |
| `sds-scroll-velvet`  | Velvet drop on scroll entry |
| `sds-scroll-glitch`  | Glitch-reveal on scroll     |

```html
<section class="sds-scroll-fade-up">Fades up on scroll</section>
<section class="sds-scroll-velvet">Velvet drop on scroll</section>
<section class="sds-scroll-glitch">Glitch reveal on scroll</section>
```

---

## Utility Modifiers

Combine any animation class with these modifiers to control timing and behavior.

### Delay

```html
<span class="sds-velvet-drop sds-delay-1">Delayed 0.1s</span>
<span class="sds-velvet-drop sds-delay-3">Delayed 0.3s</span>
<span class="sds-velvet-drop sds-delay-5">Delayed 0.5s</span>
```

### Speed

```html
<span class="sds-liquid-rise sds-fast">Fast</span>
<span class="sds-liquid-rise sds-slow">Slow</span>
<span class="sds-liquid-rise sds-xslow">Very Slow</span>
```

### Looping & Alternating

```html
<span class="sds-refract sds-loop">Loops forever</span>
<span class="sds-refract sds-alt">Alternates direction each loop</span>
```

### Pause on Hover

Wrapping an animated element in `.sds-pause-hover` pauses the animation when the user hovers the parent container — useful for carousels or looping ambient effects.

```html
<div class="sds-pause-hover">
  <span class="sds-refract sds-loop">Pauses when you hover</span>
</div>
```

---

## Theming

All color, duration, and easing values are exposed as CSS custom properties on `:root`. Override them globally or scope them to a container to match your design system.

```css
:root {
  --sds-primary: #0015d1;
  --sds-primary-dim: rgba(0, 21, 209, 0.08);
  --sds-primary-glow: rgba(0, 21, 209, 0.3);
  --sds-accent: #d10028;
  --sds-success: #00c48c;
  --sds-duration: 0.8s;
  --sds-easing: cubic-bezier(0.22, 1, 0.36, 1);
}
```

To scope a theme to a section:

```css
.dark-section {
  --sds-primary: #7c3aed;
  --sds-primary-glow: rgba(124, 58, 237, 0.35);
}
```

---

## Project Architecture

```
SDS-Motion-Forge/
├── src/                  # Source CSS files (organized by animation category)
├── dist/
│   └── motion.min.css    # Production build — single minified stylesheet
├── docs/                 # Documentation assets
├── postcss.config.js     # PostCSS build pipeline configuration
└── package.json
```

The source is organized into category modules (text, buttons, inputs, cards, loaders, scroll) and compiled via PostCSS into a single `dist/motion.min.css`. Importing or linking to that one file is all that's needed to access the full library.

---

## Build from Source

```bash
git clone https://github.com/salkomdesignstudio/SDS-Motion-Forge.git
cd SDS-Motion-Forge
npm install
npm run build
```

The compiled file is written to `dist/motion.min.css`.

---

## Browser Support

| Chrome | Firefox | Safari | Edge   |
| ------ | ------- | ------ | ------ |
| ✅ 80+ | ✅ 78+  | ✅ 14+ | ✅ 80+ |

All animations use standard `@keyframes`, `animation`, and `transform` — no experimental or vendor-prefixed properties required.

---

## License

MIT © [Salkom Design Studio](https://salkomdesignstudio.com)

---

Built by **Govarthanan** — UI/UX Designer & Frontend Developer at [Salkom Design Studio](https://salkomdesignstudio.com), Chennai.

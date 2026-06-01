# SDS Motion Forge

**300+ production-ready CSS animations. One class name. Zero config.**

[![npm version](https://img.shields.io/npm/v/@salkomdesignstudio/sds-motion-forge.svg?style=flat-square)](https://www.npmjs.com/package/@salkomdesignstudio/sds-motion-forge)
[![Bundle size](https://img.shields.io/bundlephobia/minzip/@salkomdesignstudio/sds-motion-forge?style=flat-square)](https://bundlephobia.com/package/@salkomdesignstudio/sds-motion-forge)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](https://github.com/salkomdesignstudio/SDS-Motion-Forge/blob/main/LICENSE)

SDS Motion Forge is a production-grade motion system for modern UI. v4.0.0 ships **100 text animations**, a scroll-gate engine, and an optional JS interactive engine — all zero-config, framework-agnostic, and backward-compatible.

---

## What's new in v4.0.0

- **100 text animations** — grew from 50 to 100: 5 physics-based (per-character), 45 new unique motion families
- **`sds-scroll.min.js`** — scroll-gate engine: elements stay invisible until they enter the viewport, replay on re-entry optional
- **`motion-interactive.min.js`** — JS engine for cursor-reactive and hover animations: magnetic pull, repulsion field, scatter return, shockwave, spring kerning, word morph, jelly hover
- **`[data-sds]` scroll API** — single attribute activates any animation on scroll
- Full backward compatibility — every v3.x class still works identically

---

## Installation

```bash
npm install @salkomdesignstudio/sds-motion-forge
```

**CDN (no build step):**

```html
<!-- CSS animations — required -->
<link rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/@salkomdesignstudio/sds-motion-forge/dist/motion.min.css" />

<!-- Scroll gate — optional, add once near </body> -->
<script src="https://cdn.jsdelivr.net/npm/@salkomdesignstudio/sds-motion-forge/dist/sds-scroll.min.js" defer></script>

<!-- Interactive engine — optional, add once near </body> -->
<script src="https://cdn.jsdelivr.net/npm/@salkomdesignstudio/sds-motion-forge/dist/motion-interactive.min.js" defer></script>
```

---

## Quick Start

### CSS-only (zero JS)

Add one class and the animation runs immediately on page load:

```html
<h1 class="sds-velvet-drop">Welcome</h1>
<button class="sds-btn-magnetic">Get Started</button>
<div class="sds-card-float">Feature Card</div>
<span class="sds-loader-orbit"></span>
```

### Scroll-triggered

Elements stay invisible until they scroll into view. Load `sds-scroll.min.js` once:

```html
<link rel="stylesheet" href="dist/motion.min.css" />
<script src="dist/sds-scroll.min.js" defer></script>

<!-- Animates on scroll entry, plays once -->
<h2 data-sds class="sds-grand-entrance">Appears on scroll</h2>

<!-- Replays every time the element re-enters the viewport -->
<div data-sds data-sds-repeat class="sds-scroll-rise">Replays on re-entry</div>

<!-- Wait 200ms after entering before animating -->
<p data-sds data-sds-delay="200" class="sds-slide-blur-left">Delayed start</p>
```

### Interactive (JS engine)

Load `motion-interactive.min.js` once. No JavaScript from you — just add a class:

```html
<script src="dist/motion-interactive.min.js" defer></script>

<!-- Cursor attracts character spans toward it -->
<h2 class="sds-magnetic-pull">Hover me</h2>

<!-- Cursor pushes character spans away -->
<h2 class="sds-repulsion-field" data-sds-radius="120">Push away</h2>

<!-- Jelly squash/stretch on hover -->
<span class="sds-jelly-hover">Jelly</span>

<!-- Chars scatter on hover, spring back on leave -->
<span class="sds-scatter-return">Scatter</span>

<!-- Click fires a radial shockwave impulse -->
<span class="sds-shockwave">Click me</span>

<!-- Mouse X position controls letter-spacing -->
<span class="sds-spring-kerning">Kerning</span>

<!-- Cycles through words from data-words -->
<span class="sds-word-morph" data-words="Motion,Forge,Design,Create">Motion</span>
```

---

## Framework Integration

### React / Next.js

```jsx
// _app.js, layout.js, or main.jsx — import once
import '@salkomdesignstudio/sds-motion-forge/dist/motion.min.css';

export default function Hero() {
  return (
    <h1 className="sds-grand-entrance">Hello React</h1>
  );
}
```

### Vue

```js
// main.js
import '@salkomdesignstudio/sds-motion-forge/dist/motion.min.css';
```

```html
<template>
  <h1 class="sds-zoom-punch">Hello Vue</h1>
</template>
```

### Angular

`styles.scss` or in `angular.json` under `styles`:

```scss
@import '@salkomdesignstudio/sds-motion-forge/dist/motion.min.css';
```

```html
<h1 class="sds-door-open">Hello Angular</h1>
```

### Tailwind / Bootstrap

Motion Forge layers cleanly alongside utility frameworks:

```html
<button class="btn btn-primary sds-btn-plasma">Bootstrap + Motion</button>
<div class="rounded-xl shadow-lg sds-card-levitate">Tailwind + Motion</div>
```

---

## Animation Reference

### Text Animations — 100 classes

#### Original 50 (CSS entrance & loop)

| Class | Effect |
|---|---|
| `sds-velvet-drop` | Soft weighted drop-in with blur |
| `sds-liquid-rise` | Fluid upward reveal with skew |
| `sds-phantom-blur` | Bright blur crystallises to sharp |
| `sds-gravity-drop` | Accelerated fall with overshoot |
| `sds-refract` | Chromatic RGB split loop |
| `sds-static-burst` | Glitch-static corruption loop |
| `sds-elastic-stamp` | Scale from zero with elastic rotate |
| `sds-slice-reveal` | clip-path horizontal wipe |
| `sds-char-orbit` | Orbits in from above with rotation |
| `sds-ink-bleed` | Letter-spacing collapses as blur clears |
| `sds-neon-flare` | Pulsing neon glow loop |
| `sds-scramble-decode` | Blur + skew decoding loop |
| `sds-kinetic-wave` | Per-child translateY wave loop |
| `sds-perspective-swing` | rotateY swing-in with perspective |
| `sds-focus-pull` | Camera-focus blur → sharp |
| `sds-gradient-sweep` | Moving brand gradient mask |
| `sds-depth-warp` | Flies in from deep Z-space |
| `sds-typewriter-pro` | Classic typewriter with blinking caret |
| `sds-highlight-burn` | Highlight marker swipe |
| `sds-shatter-in` | Explodes in from massive scale |
| `sds-prism-split` | Full-spectrum chromatic aberration loop |
| `sds-weight-drop` | Extreme-easing gravity overshoot |
| `sds-smoke-reveal` | Smoke-like blur resolves |
| `sds-arc-orbit` | Per-child stagger orbit entrance |
| `sds-depth-charge` | Deep warp from Z-space with delay |
| `sds-signal-wave` | Wider stagger wave loop |
| `sds-film-burn` | Sepia focus-pull entrance |
| `sds-glitch-flicker` | Analog glitch flickering loop |
| `sds-velocity-blur-text` | Streaks in from left with motion blur |
| `sds-neon-pulse-text` | Breathing neon glow loop |
| `sds-morph-word` | scaleX + skewX + letter-spacing morph loop |
| `sds-cipher-reveal` | Brightness + blur decode entrance |
| `sds-levitate` | Gentle float with subtle rotation loop |
| `sds-streak-in` | High-speed streak from left |
| `sds-hologram-text` | Holographic hue-rotate flicker loop |
| `sds-aurora-text` | Six-colour gradient sweep loop |
| `sds-elastic-bounce` | Spring overshoot bounce-in |
| `sds-oscillate` | Sine-wave Y + rotate + scaleX loop |
| `sds-flicker-on` | Light-bulb stepped opacity flicker |
| `sds-magnetic-drift` | Circular XY drift loop |
| `sds-data-stream` | clip-path + brightness data-decode |
| `sds-chromatic-shift` | Slow hue-rotate colour cycle loop |
| `sds-ripple-text` | letter-spacing + scale + blur ripple |
| `sds-stagger-chars` | Per-child stagger with skewY |
| `sds-word-blur-in` | Blur resolves to sharp with scale |
| `sds-split-reveal` | Polygon clip-path splits from center |
| `sds-bounce-in-up` | Multi-step elastic bounce-up |
| `sds-cinema-title` | Letter-spacing collapse + blur |
| `sds-heat-shimmer` | Subtle heat-distortion skewX loop |
| `sds-unfurl` | clip-path + scaleX unfurls left→right |

#### New 50 — Physics (per-character)

Wrap each character in `<span class="sds-char" style="--i:N">` where `N` is the character index.

| Class | Effect |
|---|---|
| `sds-gravity-bounce` | Falls from above, inelastic floor bounce |
| `sds-drop-settle` | Per-char staggered fall with spring settle |
| `sds-wave-cascade` | translateY wave propagates char-to-char (loop) |
| `sds-center-burst` | Chars start at center, fan out to position |
| `sds-explode-formation` | Scattered start (--dx, --dy, --dr), spring into reading position |

```html
<!-- Example: drop-settle with char spans -->
<h1 class="sds-drop-settle">
  <span class="sds-char" style="--i:0">H</span>
  <span class="sds-char" style="--i:1">e</span>
  <span class="sds-char" style="--i:2">l</span>
  <span class="sds-char" style="--i:3">l</span>
  <span class="sds-char" style="--i:4">o</span>
</h1>
```

#### New 50 — Motion Families

| Class | Effect |
|---|---|
| `sds-fold-down` | 3D fold from above, top origin hinge |
| `sds-fold-up` | 3D fold from below, bottom origin hinge |
| `sds-flip-x` | 180° horizontal axis flip entrance |
| `sds-flip-y` | 180° vertical axis flip entrance |
| `sds-door-open` | rotateY from left edge like a door |
| `sds-zoom-punch` | scale 0.2 → 1.12 → 1 punch entrance |
| `sds-zoom-far` | scale 2.2 → 1 with blur, arrives from distance |
| `sds-vapor-rise` | translateY + blur + saturate ghostly rise |
| `sds-light-speed` | translateX + multi-step skewX streak |
| `sds-roll-in` | Rolls in with full 360° rotation |
| `sds-swing-in` | Pendular rotateX swing from top origin |
| `sds-skew-slide` | translateX + skewX arrives at an angle |
| `sds-pop-in` | scale 0 → spring overshoot with rotate |
| `sds-tracking-expand` | Letter-spacing compressed → normal |
| `sds-tracking-contract` | Letter-spacing wide → collapses inward |
| `sds-blur-focus` | blur + letter-spacing → sharp focus |
| `sds-wipe-right` | Polygon clip expands left→right with skewY |
| `sds-wipe-left` | Polygon clip expands right→left with skewY |
| `sds-reveal-up` | Polygon mask slides upward |
| `sds-reveal-down` | Polygon mask slides downward |
| `sds-iris-open` | circle() clip-path opens from center |
| `sds-shimmer-sweep` | Light shimmer sweeps across brand gradient (loop) |
| `sds-color-cycle` | Hue-rotating gradient background-clip text (loop) |
| `sds-glow-pulse` | text-shadow expands and contracts (loop) |
| `sds-neon-flicker-in` | Stepped opacity + glow, neon sign power-on |
| `sds-echo-out` | Layered offset text-shadow appear |
| `sds-shadow-lift` | Floats up, layered text-shadow grows (loop) |
| `sds-spotlight-text` | Cyclic brightness + blur radial (loop) |
| `sds-pixel-in` | blur + contrast step-based entrance |
| `sds-glitch-slide` | translateX step displacement + clip-path |
| `sds-squash-stretch` | scaleY 0.15 → stretch → spring settle |
| `sds-bounce-drop` | Multi-bounce drop from high above |
| `sds-slant-rise` | translateY + rotate + skewX entrance |
| `sds-grand-entrance` | translateY + scale + rotate + blur combo |
| `sds-slide-blur-left` | Enters from left with motion blur |
| `sds-slide-blur-right` | Enters from right with motion blur |
| `sds-wobble` | translateX + rotate oscillating (loop) |
| `sds-rubber-band` | Rapid scaleX + scaleY stretch (loop) |
| `sds-jello` | skewX + skewY rapid decay (loop) |
| `sds-tada` | scale + rotate celebratory attention-seeker (loop) |
| `sds-heartbeat-text` | Double-pulse scale heartbeat (loop) |
| `sds-typing-caret` | width 0 → 100% typewriter with blinking caret |
| `sds-float-bob` | Gentle Y float with micro-rotate (loop) |
| `sds-underline-grow` | scaleX `::after` underline draws left→right |
| `sds-strike-through` | scaleX `::after` strikeout line draws left→right |

---

### Button Animations — 50 classes

Apply directly to `<button>` elements. They work as continuous ambient effects, not requiring any click.

```html
<button class="sds-btn-magnetic">Magnetic Pulse</button>
<button class="sds-btn-plasma">Plasma Glow</button>
<button class="sds-btn-energy">Energy Ripple</button>
<button class="sds-btn-neon">Neon Sign</button>
<button class="sds-btn-lift">Lift Shadow</button>
<button class="sds-btn-aurora">Aurora</button>
<button class="sds-btn-charge">Charge</button>
<button class="sds-btn-hologram">Hologram</button>
```

---

### Input Animations — 50 classes

State-based effects for form fields. Some trigger on `:focus`, others run continuously.

```html
<input class="sds-input-voltage" placeholder="Voltage pulse" />
<input class="sds-input-glow-border" placeholder="Glow border" />
<input class="sds-input-shake" placeholder="Shake on error" />
<input class="sds-input-success" placeholder="Success glow" />
<input class="sds-input-aurora" placeholder="Aurora" />
<input class="sds-input-laser" placeholder="Laser scan" />
```

---

### Card Animations — 46 classes

Entry and ambient effects for card and container elements.

```html
<div class="sds-card-float">Ambient float</div>
<div class="sds-card-levitate">Levitate with depth</div>
<div class="sds-card-holo">Holographic tilt</div>
<div class="sds-card-portal">Depth portal entrance</div>
<div class="sds-card-vortex">Vortex entrance</div>
<div class="sds-card-spring">Spring entrance</div>
```

---

### Loader Animations — 50 classes

Self-contained spinners and progress indicators. Add a class to an empty element:

```html
<span class="sds-loader-orbital"></span>
<span class="sds-loader-fluid"></span>
<span class="sds-loader-arc"></span>
<span class="sds-loader-dna"></span>
<span class="sds-loader-morph"></span>
<span class="sds-loader-progress"></span>

<!-- Wave loader needs children -->
<div class="sds-loader-wave">
  <span></span><span></span><span></span><span></span><span></span>
</div>
```

---

### Scroll Animations — 54 classes

#### Method 1 — `data-sds` + `sds-scroll.min.js` (works everywhere)

```html
<script src="dist/sds-scroll.min.js" defer></script>

<div data-sds class="sds-scroll-rise">Rises on scroll</div>
<div data-sds data-sds-repeat class="sds-scroll-spring">Replays on re-entry</div>
<div data-sds data-sds-delay="300" class="sds-scroll-blur">Waits 300ms</div>
```

**Attributes:**

| Attribute | Effect |
|---|---|
| `data-sds` | Required. Gates the animation until viewport entry |
| `data-sds-repeat` | Present → removes `sds-play` on exit so it replays on re-entry |
| `data-sds-delay="N"` | Wait N milliseconds after entering before starting |

#### Method 2 — `sds-scroll-auto` (CSS-native, Chrome 115+, zero JS)

```html
<div class="sds-scroll-auto sds-scroll-rise">Animates via CSS scroll-driven animations</div>
```

**Available scroll classes:**

```
sds-scroll-rise      sds-scroll-curtain   sds-scroll-warp     sds-scroll-slide
sds-scroll-scale     sds-scroll-radial    sds-scroll-blur     sds-scroll-tilt
sds-scroll-scan      sds-scroll-depth     sds-scroll-flip     sds-scroll-zoom-blur
sds-scroll-split     sds-scroll-morph     sds-scroll-spring   sds-scroll-elastic
sds-scroll-cinema    sds-scroll-fog       sds-scroll-neon     sds-scroll-prism
sds-scroll-charge    sds-scroll-magnetic  sds-scroll-dissolve sds-scroll-unfold
sds-scroll-bounce    sds-scroll-ink       sds-scroll-snap     sds-scroll-spiral
sds-scroll-vortex    sds-scroll-skew      sds-scroll-punch    sds-scroll-drift
sds-scroll-streak    sds-scroll-hologram  sds-scroll-flash    sds-scroll-crystallize
sds-scroll-cascade   sds-scroll-perspective-left
```

---

## Interactive Animations

These require `motion-interactive.min.js`. The developer writes **zero JavaScript** — just add a class.

| Class | Trigger | Effect |
|---|---|---|
| `sds-word-morph` | Auto (interval) | Cycles through `data-words` values with blur transition |
| `sds-jelly-hover` | mouseenter | Squash + stretch spring on hover |
| `sds-scatter-return` | mouseenter / mouseleave | Chars scatter randomly, spring back on leave |
| `sds-shockwave` | click | Radial impulse force pushes chars away from click point |
| `sds-spring-kerning` | mousemove | Mouse X maps to letter-spacing −12px…+12px |
| `sds-magnetic-pull` | mousemove | Cursor attracts char spans toward it |
| `sds-repulsion-field` | mousemove | Cursor pushes char spans away |

```html
<script src="dist/motion-interactive.min.js" defer></script>

<!-- Word morph: supply comma-separated words -->
<h2 class="sds-word-morph" data-words="Fast,Beautiful,Precise">Fast</h2>

<!-- Magnetic: optional radius override in px (default 110) -->
<h2 class="sds-magnetic-pull" data-sds-radius="140">Magnetic</h2>

<!-- Shockwave: cursor pointer added automatically -->
<h2 class="sds-shockwave">Click for shockwave</h2>
```

**SPA / dynamic content:** after adding interactive elements to the DOM, call:

```js
window.SDSInteractive.scan(containerEl); // scan new elements in a container
window.SDSInteractive.initEl(el);        // init a single element
window.SDSInteractive.cleanup(el);       // clean up listeners / intervals
```

---

## Utility Modifiers

Stack any modifier on top of any animation class.

### Timing

```html
<span class="sds-velvet-drop sds-fast">0.5× speed</span>
<span class="sds-velvet-drop sds-slow">1.6× speed</span>
<span class="sds-velvet-drop sds-xslow">2.2× speed</span>
```

### Delay (0.1s–1.0s)

```html
<span class="sds-liquid-rise sds-delay-1">0.1s delay</span>
<span class="sds-liquid-rise sds-delay-3">0.3s delay</span>
<span class="sds-liquid-rise sds-delay-5">0.5s delay</span>
<span class="sds-liquid-rise sds-delay-10">1.0s delay</span>
```

### Looping

```html
<span class="sds-refract sds-loop">Loops forever</span>
<span class="sds-refract sds-alt">Alternates direction each loop</span>
```

### Pause on hover

```html
<div class="sds-pause-hover">
  <span class="sds-neon-flare sds-loop">Pauses when parent is hovered</span>
</div>
```

---

## Theming

Override CSS custom properties globally or scoped to any container:

```css
:root {
  --sds-primary:       #0015d1;
  --sds-primary-dim:   rgba(0, 21, 209, 0.08);
  --sds-primary-glow:  rgba(0, 21, 209, 0.30);
  --sds-accent:        #d10028;
  --sds-success:       #00c48c;
  --sds-duration:      0.8s;
  --sds-easing:        cubic-bezier(0.22, 1, 0.36, 1);
}
```

Scope to a section:

```css
.hero {
  --sds-primary: #7c3aed;
  --sds-primary-glow: rgba(124, 58, 237, 0.35);
  --sds-duration: 1.2s;
}
```

---

## Backward Compatibility

All v3.x class names continue to work identically. Legacy aliases:

| Legacy class | Points to |
|---|---|
| `sds-scroll-fade-up` | `sds-scroll-rise` |
| `sds-input-focus-glow` | `sds-input-focus` |
| `sds-card-neon` | `sds-card-glow` |
| `sds-card-depth` | `sds-card-parallax` |
| `sds-card-flip` | `sds-card-slice` |
| `sds-loader-progress-glow` | `sds-loader-progress` |

---

## Accessibility

Motion Forge fully respects `prefers-reduced-motion`. When the user has enabled reduced motion in their OS:

- All CSS animations are collapsed to `0.01ms` (effectively instant)
- Scroll-animated elements remain visible at all times
- The interactive JS engine skips animations and shows final state immediately
- `sds-word-morph` still cycles words but skips the blur/translate transition

No configuration required — it's built in.

---

## Project Architecture

```
SDS-Motion-Forge/
├── src/
│   ├── motion.css              # Source — 300+ animations across 6 categories
│   ├── sds-scroll.js           # Scroll gate engine source
│   └── motion-interactive.js   # Interactive JS engine source
├── dist/
│   ├── motion.css              # Built (177 KB)
│   ├── motion.min.css          # Minified (122 KB)
│   ├── sds-scroll.min.js       # Scroll engine minified (1.6 KB)
│   └── motion-interactive.min.js  # Interactive engine minified (9.6 KB)
├── docs/
│   └── index.html              # Live demo page (self-contained)
├── verify-build.js             # Pre-publish verification (7 checks)
└── package.json
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

| Browser | Minimum version |
|---|---|
| Chrome / Edge | 80+ |
| Firefox | 78+ |
| Safari | 14+ |

CSS scroll-driven animations (`sds-scroll-auto`) require Chrome / Edge 115+. All other features use standard `@keyframes`, `transform`, `clip-path`, and `filter`.

---

## License

MIT © [Salkom Design Studio](https://salkomdesignstudio.com)

Built by **Govarthanan** — UI/UX Designer & Frontend Developer at [Salkom Design Studio](https://salkomdesignstudio.com), Puducherry 🇮🇳

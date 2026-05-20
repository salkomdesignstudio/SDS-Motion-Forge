# SDS Motion — Premium UI Animation & Interaction Library

SDS Motion is a state-of-the-art, production-ready UI animation utility library designed for modern developers and designers. Inspired by the interaction models of Apple, Linear, Framer, and Raycast, SDS Motion provides a comprehensive ecosystem of physics-based easing systems, spatial interactions, stagger systems, and scroll choreography.

Install once, apply anywhere — raw HTML, React, Angular, Vue, or Web Components.

---

## 🌟 Key Features

* **Opacity Systems & Decelerations**: Discrete opacity ramps and exponential decay models.
* **Spring Physics Timing**: Dynamic, physical cubic-bezier curves for organic bounce and snap.
* **Transform Layering**: Orchestrated 3D rotations, skew, offsets, and blurs for structural depth.
* **Stagger Systems**: Parent-child staggering hierarchies driven by custom CSS properties and automatic JS indexers.
* **Cursor-Aware Spatial Interaction**: 3D perspective mouse-tilt card highlights and real-time gloss sheens.
* **Magnetic Physics**: Snappy spring attraction pulling elements towards the cursor.
* **Scroll Choreography**: High-performance scroll-driven viewport observation.
* **Custom Web Components**: Out-of-the-box native elements (`<mf-text-reveal>`, `<mf-magnetic>`, and `<mf-tilt-card>`).

---

## 🚀 Quick Start

### 1. Installation

#### Via NPM
```bash
npm install sds-motion
```

#### Via CDN
Drop this stylesheet into your `<head>` and script at the bottom of your `<body>`:
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/sds-motion/dist/motion.min.css" />
<script src="https://cdn.jsdelivr.net/npm/sds-motion/dist/motion.min.js" defer></script>
```

---

## 🛠️ Usage Snippets

### A. Raw HTML & Utilities
Combine animation classes directly with speed, delay, and easing modifiers:
```html
<!-- Entrance fade-up with spring physics, slow speed, and a delay tier -->
<h1 class="sds-fade-up sds-slow sds-delay-2 sds-spring">
  Welcome to the Future
</h1>
```

### B. Parent-Child Staggering
Wrap list items or grids in a stagger parent; the engine automatically sequences their reveals:
```html
<ul class="sds-stagger">
  <li class="sds-scroll-fade-up">First Item</li>
  <li class="sds-scroll-fade-up">Second Item</li>
  <li class="sds-scroll-fade-up">Third Item</li>
</ul>
```

### C. Web Components (Native)
Run premium interactions natively using custom HTML tags bundled inside `motion.min.js`:
```html
<!-- Automatic staggered character reveal -->
<mf-text-reveal effect="fade-up" speed="slow" delay="100">
  Hello World
</mf-text-reveal>

<!-- Spring physics magnetic button wrapper -->
<mf-magnetic range="40" spring="0.15">
  <button class="my-button">Hover Me</button>
</mf-magnetic>
```

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

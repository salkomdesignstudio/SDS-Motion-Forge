# JavaScript Engine API Reference — SDS Motion Forge

The library ships two optional JavaScript engines. Both are zero-config: add a class or attribute, load the script, and the engine auto-wires everything. No JavaScript from you is required for basic use.

---

## `sds-scroll.min.js` — Scroll Gate Engine

**Size:** 1.28 KB minified · 0.62 KB gzip  
**Source:** `src/sds-scroll.js`  
**Purpose:** Hold animated elements invisible until they enter the viewport, then play the animation.

### Loading

```html
<!-- Recommended: defer, near </body> -->
<script src="https://cdn.jsdelivr.net/npm/@salkomdesignstudio/sds-motion-forge/dist/sds-scroll.min.js" defer></script>

<!-- Or from npm install -->
<script src="node_modules/@salkomdesignstudio/sds-motion-forge/dist/sds-scroll.min.js" defer></script>
```

For SPA frameworks, import it once in your entry point:

```js
import '@salkomdesignstudio/sds-motion-forge/dist/sds-scroll.min.js';
```

### Data attributes

| Attribute | Required | Type | Description |
|---|---|---|---|
| `data-sds` | Yes | (boolean) | Marks an element as scroll-gated. The element stays hidden (`opacity: 0`, animation paused) until it enters the viewport. |
| `data-sds-repeat` | No | (boolean) | When present, removes `sds-play` when the element exits the viewport, causing the animation to replay on every re-entry. |
| `data-sds-delay` | No | Integer (ms) | Milliseconds to wait after viewport entry before starting the animation. Range: any positive integer. Respects `prefers-reduced-motion` — delay is skipped when the user prefers reduced motion. |

### Usage examples

```html
<!-- Basic: play once on entry -->
<div data-sds class="sds-scroll-rise">Rises when scrolled into view</div>

<!-- Replay: re-plays on every scroll-in -->
<div data-sds data-sds-repeat class="sds-scroll-spring">Re-plays every time</div>

<!-- Delay: wait 300ms after entering viewport -->
<div data-sds data-sds-delay="300" class="sds-scroll-blur">300ms delay</div>

<!-- Combine delay + repeat -->
<div data-sds data-sds-repeat data-sds-delay="150" class="sds-scroll-rise">
  Staggered replay
</div>
```

### Classes added by the engine

| Class / attribute | Added to | When |
|---|---|---|
| `sds-js` | `<html>` | Immediately on script load (before DOMContentLoaded) |
| `sds-play` | `[data-sds]` elements | When the element enters the viewport (or immediately if `prefers-reduced-motion: reduce`) |

The `html.sds-js` class disables the CSS no-JS fallback (`html:not(.sds-js) [data-sds] { opacity: 1; animation-play-state: running }`), keeping gated elements hidden until observed. This class is set synchronously before any parsing — safe to rely on in CSS.

### IntersectionObserver configuration

The engine uses a single shared observer with these options:

```js
{
  threshold: 0.08,          // 8% of the element must be visible
  rootMargin: '0px 0px -40px 0px'  // 40px inset from the bottom viewport edge
}
```

These values are not configurable per-element. If you need different thresholds, use the [inline IntersectionObserver pattern](README.md#method-2--inline-intersectionobserver-paste-once-zero-dependencies) instead.

### `prefers-reduced-motion` behavior

When `window.matchMedia('(prefers-reduced-motion: reduce)').matches` is true at script load time:

- `sds-play` is added to **all** `[data-sds]` elements immediately, without waiting for viewport entry
- The IntersectionObserver is never started
- Delays (`data-sds-delay`) are ignored

### SPA / dynamic content

The engine uses a `MutationObserver` on `document.body` to watch for new `[data-sds]` elements added after initial page load. **No extra code is required for SPAs** — new elements are picked up automatically.

### No public API

The scroll engine has no exported globals and no programmatic API. Everything is driven by data attributes. If you need to manually trigger scroll gates (e.g., after a PJAX navigation), add `data-sds` to elements and let `MutationObserver` pick them up, or reload the page.

---

## `motion-interactive.min.js` — Interactive Engine

**Size:** 6.98 KB minified · 2.41 KB gzip  
**Source:** `src/motion-interactive.js`  
**Purpose:** Cursor-reactive and physics-based effects that require JavaScript.

### Loading

```html
<!-- Recommended: defer, near </body> -->
<script src="https://cdn.jsdelivr.net/npm/@salkomdesignstudio/sds-motion-forge/dist/motion-interactive.min.js" defer></script>
```

### Classes and triggers

| Class | Trigger | Effect | Notes |
|---|---|---|---|
| `sds-word-morph` | Auto (interval) | Cycles through words with blur+translate transition | Requires `data-words` attribute |
| `sds-jelly-hover` | `mouseenter` | Squash + stretch spring | Injects keyframes into `<head>` (requires `unsafe-inline` CSP if restricted) |
| `sds-scatter-return` | `mouseenter` / `mouseleave` | Characters scatter randomly, spring back on leave | Splits text into `.sds-char` spans |
| `sds-shockwave` | `click` | Radial impulse force from click point | Splits text; sets `cursor: pointer` automatically |
| `sds-spring-kerning` | `mousemove` | Mouse X position controls letter-spacing | Splits text |
| `sds-magnetic-pull` | `mousemove` | Cursor attracts each character | Splits text; configurable radius |
| `sds-repulsion-field` | `mousemove` | Cursor pushes each character away | Splits text; configurable radius |

### Data attributes per class

#### `sds-word-morph`

```html
<!-- data-words: comma-separated list of words to cycle through -->
<h2 class="sds-word-morph" data-words="Fast,Beautiful,Precise,Powerful">Fast</h2>
```

The first word in `data-words` is displayed initially. The cycle starts automatically with a 2-second interval. Words transition with blur + translateY.

Visibility-aware: uses `IntersectionObserver` to pause the interval when the element is not in view (saves CPU on long pages).

#### `sds-magnetic-pull` and `sds-repulsion-field`

```html
<!-- data-sds-radius: interaction radius in pixels (default: 110) -->
<h2 class="sds-magnetic-pull" data-sds-radius="140">Magnetic</h2>
<h2 class="sds-repulsion-field" data-sds-radius="80">Push away</h2>
```

| Attribute | Default | Description |
|---|---|---|
| `data-sds-radius` | `110` | Distance in pixels within which the cursor affects characters |

#### Other classes

No additional data attributes. Behavior is automatic.

### Global API — `window.SDSInteractive`

The engine exposes a global object for SPA and dynamic content use. It is available after the script executes (i.e., in event handlers after `DOMContentLoaded`, or after the deferred script runs).

```ts
interface SDSInteractive {
  /** Scan a container element for new interactive elements and initialize them */
  scan(container: Element): void;

  /** Initialize a single element (if it has an interactive class) */
  initEl(element: Element): void;

  /** Remove all listeners, intervals, and rAF registrations from an element */
  cleanup(element: Element): void;
}
```

#### `window.SDSInteractive.scan(container)`

Scans a container element and initializes any SDS interactive classes found inside it. Use after inserting new content into the DOM.

```js
// After inserting content dynamically
const newSection = document.createElement('section');
newSection.innerHTML = `<h2 class="sds-word-morph" data-words="Hello,World">Hello</h2>`;
document.body.appendChild(newSection);

// Initialize the new elements
window.SDSInteractive.scan(newSection);
```

#### `window.SDSInteractive.initEl(element)`

Initializes a single element. Useful when you know exactly which element to initialize.

```js
const el = document.querySelector('.sds-magnetic-pull');
window.SDSInteractive.initEl(el);
```

#### `window.SDSInteractive.cleanup(element)`

Removes all event listeners, animation loops, and interval timers associated with an element. Call before removing an element from the DOM in a long-lived SPA to prevent memory leaks.

```js
const el = document.querySelector('.sds-word-morph');
window.SDSInteractive.cleanup(el);
el.remove();
```

### Text splitting behavior

Interactive effects that need per-character control (`sds-scatter-return`, `sds-shockwave`, `sds-spring-kerning`, `sds-magnetic-pull`, `sds-repulsion-field`) split the element's text content into `.sds-char` spans automatically:

```html
<!-- Before: -->
<h2 class="sds-magnetic-pull">Hello</h2>

<!-- After engine initialization: -->
<h2 class="sds-magnetic-pull" aria-label="Hello">
  <span class="sds-char" aria-hidden="true" style="display:inline-block;will-change:transform;--i:0">H</span>
  <span class="sds-char" aria-hidden="true" style="display:inline-block;will-change:transform;--i:1">e</span>
  <!-- … -->
</h2>
```

The `aria-label` on the container preserves the readable text for screen readers. Each `<span>` is `aria-hidden`. Splitting happens once per element and is idempotent.

### `prefers-reduced-motion` behavior

When `window.matchMedia('(prefers-reduced-motion: reduce)').matches` is true at script load time:

- All physics loops (magnetic, repulsion, spring-kerning) are skipped
- All transitions are set to `0ms` duration — state changes happen instantly without motion
- `sds-word-morph` still cycles words but without the blur/translate transition
- `sds-jelly-hover` keyframe is still injected but the animation duration is collapsed

### Hover-incapable devices

When `window.matchMedia('(hover: none)').matches` is true (touch-only devices):

- `sds-magnetic-pull`, `sds-repulsion-field`, `sds-scatter-return`, and `sds-spring-kerning` are not initialized (no `mousemove` on touch devices)
- `sds-jelly-hover` and `sds-shockwave` still work (respond to `mouseenter` and `click` which fire on tap)

### Memory management

The engine uses `WeakMap` to associate cleanup functions with elements. When an element is garbage-collected, its cleanup reference is automatically released. For elements you explicitly remove from the DOM, call `cleanup()` first to remove event listeners and cancel rAF loops immediately.

---

## Choosing between the two engines

| Use case | Engine |
|---|---|
| "Show element when scrolled into view" | `sds-scroll.min.js` |
| "Replay animation every time user scrolls past" | `sds-scroll.min.js` + `data-sds-repeat` |
| "Cursor attracts/repels characters" | `motion-interactive.min.js` |
| "Text cycles through words" | `motion-interactive.min.js` |
| "Click effect / hover physics" | `motion-interactive.min.js` |
| Both scroll-triggered and cursor-reactive | Load both engines |

Both engines are independent — you can load one, both, or neither.

---

## Alternative: inline IntersectionObserver (no script file)

If you cannot load an external script file, use the paste-once inline snippet. This is lighter than the full scroll engine but has no SPA MutationObserver support and no delay feature:

```html
<div data-sds-scroll class="sds-scroll-rise">Content</div>

<script>
var io = new IntersectionObserver(function(entries) {
  entries.forEach(function(e) {
    if (e.isIntersecting) { e.target.classList.add('sds-in'); io.unobserve(e.target); }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('[data-sds-scroll]').forEach(function(el) { io.observe(el); });
</script>
```

Note: this uses `[data-sds-scroll]` and `sds-in` class — a different system from `[data-sds]` and `sds-play` used by `sds-scroll.min.js`. Do not mix them on the same element.

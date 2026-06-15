# Troubleshooting — SDS Motion Forge

Quick reference for the seven most common issues. Check the docs playground at [sds-motion-forge.netlify.app](https://sds-motion-forge.netlify.app) first — if the effect works there but not in your project, the issue is in the integration, not the library.

---

## 1. Animation class applied but nothing animates

**Symptom:** element has the class (verified in DevTools) but shows no animation.

**Diagnosis steps:**

1. Open DevTools → Elements → select the element → Computed styles → search for `animation-name`. If it shows `none`, the CSS is not loaded.
2. Check the Network tab for `motion.min.css` (or your category bundle). If it returns 404, the path is wrong.
3. Check the Console tab for CSS load errors.

**Common causes and fixes:**

| Cause | Fix |
|---|---|
| CSS not imported | Add `import '@salkomdesignstudio/sds-motion-forge/dist/motion.min.css'` to your entry file (React: `_app.js`; Next.js: `layout.tsx`; Vue: `main.js`; Angular: `styles.scss`) |
| CDN link has wrong path | Use the exact CDN URL from README: `https://cdn.jsdelivr.net/npm/@salkomdesignstudio/sds-motion-forge/dist/motion.min.css` |
| Bundler resolves the wrong file | Add `"sideEffects": true` to your bundler config for CSS files, or use the explicit `dist/motion.min.css` import path instead of the bare package name |
| `prefers-reduced-motion` is on | The user's OS has reduce-motion enabled. Animations collapse to 0.01ms (elements jump to final state instantly). [See below](#4-prefersreduced-motion-is-disabling-everything) |
| Class applied before CSS loads (FOUC) | Ensure the CSS `<link>` is in `<head>`, above the element's render. For React SSR, import CSS in the layout component |

---

## 2. Scroll animations not triggering

**Symptom:** element with a `sds-scroll-*` class either stays invisible or animates immediately on page load instead of on scroll.

**Diagnosis steps:**

1. Check whether `sds-scroll.min.js` is loaded. Open DevTools → Console and type `document.documentElement.classList.contains('sds-js')`. If `false`, the script is not loaded.
2. Check which attribute the element has: `[data-sds]` (for `sds-scroll.min.js`) or `[data-sds-scroll]` (for the inline IntersectionObserver snippet). These are two different systems — mixing them does not work.

**Common causes and fixes:**

| Cause | Fix |
|---|---|
| Missing `data-sds` attribute | Add `data-sds` to the element: `<div data-sds class="sds-scroll-rise">` |
| Wrong attribute (`data-sds-scroll` used with the JS engine) | Use `data-sds` for the scroll engine, or `data-sds-scroll` + `sds-in` for the inline snippet |
| `sds-scroll.min.js` not loaded | Add `<script src="dist/sds-scroll.min.js" defer></script>` near `</body>` |
| Script loaded without `defer` | Scripts without `defer` block parsing and may execute before the body elements exist. Add `defer` |
| SPA adds elements after page load | The scroll engine's `MutationObserver` handles this automatically — but the script must be loaded. If you add elements programmatically after `MutationObserver` starts, they are observed. If the script loads after your elements, call `document.querySelectorAll('[data-sds]').forEach(...)` manually to re-scan |
| Element animates immediately (not on scroll) | `sds-scroll.min.js` is not loaded, so the CSS fallback (`html:not(.sds-js) [data-sds]`) makes the element visible and playing immediately. Load the script |

---

## 3. Content Security Policy (CSP) blocking the library

**Symptom:** animations broken; Console shows CSP violations like `Refused to load stylesheet` or `Refused to apply inline style`.

**Common CSP fixes:**

```
# Allow the CSS from jsDelivr CDN
style-src 'self' https://cdn.jsdelivr.net;

# Allow the JS engines from jsDelivr CDN
script-src 'self' https://cdn.jsdelivr.net;

# If using the jelly-hover interactive engine (injects a <style> tag):
style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net;
```

**Why `unsafe-inline` for styles?** The `motion-interactive.min.js` engine injects a `<style>` tag at runtime for the jelly-hover keyframes (`sds-jelly-hover`). This requires `unsafe-inline` in `style-src`. If you cannot allow `unsafe-inline`, avoid `sds-jelly-hover` — all other interactive effects use inline `style` attribute manipulation (transform/opacity), which is not blocked by CSP.

**For self-hosted files** (npm install, not CDN): no CDN domains are needed in CSP. You still need `'unsafe-inline'` in `style-src` if you use `sds-jelly-hover`.

---

## 4. `prefers-reduced-motion` is disabling everything

**Symptom:** no animations on your machine; animations work for other users.

**Explanation:** This is correct behavior. When the user's OS has reduced motion enabled, SDS Motion Forge collapses all CSS animations to 0.01ms duration so they reach their final state instantly. The scroll engine (`sds-scroll.min.js`) bypasses the IntersectionObserver and adds `sds-play` to all elements immediately. The interactive engine skips physics loops and transitions entirely.

**To test your page with reduced motion:**
- **macOS:** System Preferences → Accessibility → Display → Reduce Motion
- **Windows:** Settings → Ease of Access → Display → Show animations in Windows
- **Chrome DevTools:** Rendering tab → "Emulate CSS media feature prefers-reduced-motion: reduce"

**To verify the library's reduced-motion behavior is correct:** run `npm run verify:reduced-motion` — it proves 100% of animating selectors are neutralized. This gate runs on every build.

**If you want a specific animation to override reduced motion** (not recommended for accessibility reasons): do not do this. Respect the user's preference.

---

## 5. Bundler not resolving CSS exports (Vite / webpack / esbuild)

**Symptom:** `Cannot find module '@salkomdesignstudio/sds-motion-forge'` or silent import with no styles applied.

**Vite:**

```js
// vite.config.ts — no special config needed for CSS imports
// Just use the explicit path:
import '@salkomdesignstudio/sds-motion-forge/dist/motion.min.css';
```

If Vite resolves `moduleResolution: bundler` and complains about the bare package import, use the explicit `dist/` path.

**webpack:**

```js
// Ensure CSS loader handles the import:
// webpack.config.js
module.exports = {
  module: {
    rules: [
      { test: /\.css$/, use: ['style-loader', 'css-loader'] }
    ]
  }
};
```

```js
// entry.js
import '@salkomdesignstudio/sds-motion-forge/dist/motion.min.css';
```

**Next.js (App Router):**

```tsx
// app/layout.tsx
import '@salkomdesignstudio/sds-motion-forge/dist/motion.min.css';
```

Next.js does not allow CSS imports in `page.tsx` or component files — only in `layout.tsx` or a global CSS file.

**esbuild / Rollup:** Use the explicit `dist/motion.min.css` subpath. The `"style"` condition in `package.json` exports is handled by Vite and webpack 5 automatically.

**PostCSS (processing the source):**

```css
/* your-styles.css */
@import '@salkomdesignstudio/sds-motion-forge/src/motion.css';
```

Requires `postcss-import` in your PostCSS config.

---

## 6. SSR hydration mismatch with char-split animations

**Symptom:** React/Next.js hydration warning: "Expected server HTML to contain a matching..." for elements using `sds-drop-settle`, `sds-kinetic-wave`, `sds-gravity-bounce`, or other char-split classes.

**Explanation:** Char-split animations require `.sds-char` child spans with `--i` indexes. If you split the text yourself (or use a library) on the server, the HTML will contain spans. If you split it client-side (via `motion-interactive.min.js`), the server renders plain text and the client adds spans — causing a hydration mismatch.

**Fix options:**

1. **Use `@salkomdesignstudio/motion-forge-react`:** The `<SdsText>` component is SSR-safe by design. The server renders plain text; the client splits it after mount.

   ```tsx
   import { SdsText } from '@salkomdesignstudio/motion-forge-react';
   <SdsText as="h1" effect="sds-kinetic-wave">Motion</SdsText>
   ```

2. **Suppress the hydration warning** if you know the mismatch is intentional:

   ```tsx
   <h1 className="sds-kinetic-wave" suppressHydrationWarning>Motion</h1>
   ```

3. **Do not pre-split on server** — let `motion-interactive.min.js` split client-side and accept that the element is invisible on non-JS renders (usually fine for decorative animations).

---

## 7. CLS (Cumulative Layout Shift) from animations before CSS loads

**Symptom:** page content jumps when CSS loads; Lighthouse reports high CLS score.

**Cause:** animation classes are applied before the stylesheet loads, causing layout-affecting properties to fire (though SDS animations are compositor-only and should not trigger CLS by themselves). The more common cause is that elements with `opacity: 0` (from the scroll gate) shift visible content positions before the JS marks them visible.

**Fixes:**

1. **Preload the CSS** to eliminate the load delay:

   ```html
   <link rel="preload" href="dist/motion.min.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
   <noscript><link rel="stylesheet" href="dist/motion.min.css"></noscript>
   ```

2. **Load the scroll engine early** — placing it in `<head>` (without `defer`) ensures `html.sds-js` is set before the browser paints, so the CSS fallback (`html:not(.sds-js) [data-sds] { opacity: 1 }`) never fires:

   ```html
   <head>
     <link rel="stylesheet" href="dist/motion.min.css" />
     <script src="dist/sds-scroll.min.js"></script>  <!-- no defer here -->
   </head>
   ```

   Trade-off: this blocks parsing for ~0.5 KB. Usually acceptable.

3. **Use `animation-fill-mode: backwards`** (via `sds-fill-forward` class is not backwards — use custom CSS if needed) to ensure elements start invisible before the animation fires.

---

## Still stuck?

1. Check that the effect works in the [live demo](https://sds-motion-forge.netlify.app) — if not, it may be a library bug.
2. Open an issue with the [bug report template](https://github.com/salkomdesignstudio/SDS-Motion-Forge/issues/new?template=bug_report.md). Include: the class name, browser + version, a minimal HTML reproduction, and what you expected vs. what happened.
3. For integration questions (framework setup, bundler config), a StackBlitz or CodeSandbox reproduction speeds resolution significantly.

# @salkomdesignstudio/motion-forge-tailwind

Tailwind CSS plugin for [SDS Motion Forge](https://www.npmjs.com/package/@salkomdesignstudio/sds-motion-forge).
Every CSS-only effect in the motion registry becomes an on-demand `animate-sds-*`
utility — generated from `registry/motion.registry.json`, never hand-written.

Tailwind's engine tree-shakes everything: utilities, their `@keyframes`, and the
SDS theme tokens are emitted **only when used**. Three utilities compile to
under 6 KB of CSS including keyframes (measured in `examples/tailwind-v4`).

## Tailwind v4 (CSS-first)

```css
/* app.css */
@import "tailwindcss";
@import "@salkomdesignstudio/motion-forge-tailwind";
```

```html
<h1 class="animate-sds-velvet-drop">Hello</h1>
<button class="animate-sds-btn-magnetic">Save</button>

<!-- Speed variants map to the SDS duration scale
     (instant | fast | base | slow | slower | dramatic) -->
<div class="animate-sds-card-rise-slow">Deliberate entrance</div>
```

> **Why `animate-sds-card-rise-slow` and not `animate-sds-card-rise/slow`?**
> Slash modifiers in Tailwind v4 are only available on *functional* utilities;
> static utilities don't accept them (verified against tailwindcss 4.x). The
> speed variants are functional utilities over the `--sds-duration-*` theme
> namespace, so they stay token-driven and tree-shaken.

Re-brand by overriding the SDS theme tokens:

```css
@theme {
  --sds-primary: #7c3aed;
  --sds-duration-base: 0.6s;
}
```

## Tailwind v3 (preset)

```js
// tailwind.config.js
module.exports = {
  presets: [require("@salkomdesignstudio/motion-forge-tailwind/v3-preset")],
};
```

```html
<h1 class="animate-sds-velvet-drop">Hello</h1>
```

**v3 limitation (by design):** the preset extends `theme.keyframes` /
`theme.animation` only, so it covers each effect's animation declaration.
Effects that need companion rules — pseudo-element layers, child staggers,
`background-clip: text` gradients — are complete only in the v4 plugin or with
the core library CSS. The v4 plugin carries the full rule bodies.

## Notes

- Utilities cover the CSS-only effects (353). JS-engine effects
  (`sds-magnetic-pull`, …) need `motion-interactive.min.js` from the core
  package and are intentionally not utilities.
- Reduced motion is neutralized for every utility via a
  `prefers-reduced-motion` block shipped with the plugin.
- Zero runtime dependencies. `tailwindcss >= 3` is a peer dependency.

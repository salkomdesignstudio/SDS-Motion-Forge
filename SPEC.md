# SDS Motion Specification

**Version 1.0 · Phase 0 of the v5 Motion Platform**

This document is the normative specification for motion in SDS Motion Forge.
Every animation shipped in the library — and every animation contributed to it —
is measured against this spec. It plays the role that the Material 3 motion
guidance plays for Google's design system, expressed in our own system and words.

The machine-readable token source is [`tokens/motion.tokens.json`](tokens/motion.tokens.json)
(W3C Design Tokens format). CSS custom properties, the TypeScript constants
module, and the Figma Tokens export are all generated from it by
`npm run build:tokens`. Hand-editing any generated output is a build failure.

---

## 1. Principles

1. **Motion is information.** An animation must tell the user something —
   where an element came from, what state it entered, what deserves attention.
   Decoration without information is noise; noise is rejected in review.

2. **One class is the entire API.** Every effect must work by adding a single
   class name to ordinary HTML. JavaScript is always optional and always
   progressive — if a script fails to load, content remains visible and usable.

3. **The compositor is the budget.** Animations may move, fade, filter, and
   clip. They may not make the browser re-lay-out the page (see §5).

4. **Physicality over linearity.** Real objects accelerate, overshoot, and
   settle. Multi-stage keyframes (anticipation → action → settle) are the house
   style; single-property linear tweens are below the quality bar for new work.

5. **Respect is non-negotiable.** Every animating class must be neutralized
   under `prefers-reduced-motion: reduce`, with content fully visible. This is
   enforced by an automated build gate, not by convention.

6. **The published tarball is the contract.** No refactor, token, or feature
   may change the computed behavior of a class that real users already depend
   on. `scripts/verify-against-published.js` proves this on every build.

---

## 2. The Token Scale

### 2.1 Duration

| Token | CSS custom property | Value | Use for |
|---|---|---|---|
| `instant` | `--sds-duration-instant` | 300 ms | Micro-feedback: focus rings, validation flashes, press states |
| `fast` | `--sds-duration-fast` | 400 ms | Snappy entrances, small elements, list items |
| `base` | `--sds-duration-base` | 800 ms | The default entrance. Headlines, cards, sections |
| `slow` | `--sds-duration-slow` | 1.4 s | Deliberate, cinematic entrances; large surfaces |
| `slower` | `--sds-duration-slower` | 2.2 s | Hero-scale reveals, page-level moments |
| `dramatic` | `--sds-duration-dramatic` | 3 s | Ambient loops: glow, aurora, drift, breathing |

Derivation: these values are extracted from v4.0.3 usage data
(`registry/INVENTORY.md`, "Duration usage") and mirror the long-standing
modifier classes (`sds-fast` = 0.4 s, default = 0.8 s, `sds-slow` = 1.4 s,
`sds-xslow` = 2.2 s) **exactly**, so no default changed when the scale landed.

Rules of thumb:

- Smaller elements use shorter durations; full-bleed surfaces use longer ones.
- Entrances may take time; **state feedback may not** — anything answering a
  user action (focus, press, validation) uses `instant` or `fast`.
- Continuous/ambient loops live at `slower`/`dramatic` or stay literal
  (2 s / 4 s loop periods are rhythm choices, not entrance durations, and are
  deliberately not tokenized).

### 2.2 Easing

| Token | CSS custom property | Curve | Character / use |
|---|---|---|---|
| `standard` | `--sds-ease-standard` | `cubic-bezier(0.22, 1, 0.36, 1)` | The SDS signature ease-out. Confident deceleration, soft landing. Default for entrances. |
| `decelerate` | `--sds-ease-decelerate` | `cubic-bezier(0.16, 1, 0.3, 1)` | Expo-style: very fast start, feather landing. Long translations, streaks, slides. |
| `accelerate` | `--sds-ease-accelerate` | `cubic-bezier(0.6, -0.28, 0.74, 0.05)` | Anticipate-then-commit (back-in). Exits and weighted falls. |
| `emphasized` | `--sds-ease-emphasized` | `cubic-bezier(0.215, 0.61, 0.355, 1)` | Cubic ease-out powering the multi-bounce choreography family. |
| `spring` | `--sds-ease-spring` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | ~6 % overshoot. The library's signature "pop". Scale/pop entrances, spring settles. |
| `bounce` | `--sds-ease-bounce` | `cubic-bezier(0.68, -0.55, 0.27, 1.55)` | Anticipation + overshoot on both ends. Playful gravity. |

Derivation: each curve appears verbatim in v4.0.3 (`registry/INVENTORY.md`,
"Easing usage"); Phase 0 named them without altering a single control point.

Selection matrix:

| Situation | Duration | Easing |
|---|---|---|
| Focus / validation feedback | `instant` | `standard` |
| Small element enters | `fast` | `standard` or `spring` |
| Headline / card enters | `base` | `standard` |
| Element slides a long distance | `base` | `decelerate` |
| Playful pop / stamp | `fast`–`base` | `spring` |
| Gravity / weight conceit | `base` | `bounce` or `accelerate` |
| Multi-bounce floor contact | `base`–`slow` | `emphasized` |
| Cinematic hero reveal | `slow`–`slower` | `standard` or `decelerate` |
| Ambient loop (glow, drift) | `dramatic`+ | `ease-in-out` (literal) |

### 2.3 Distance

| Token | CSS custom property | Value | Use for |
|---|---|---|---|
| `sm` | `--sds-distance-sm` | 24 px | Text lines, list items, badges |
| `md` | `--sds-distance-md` | 48 px | Cards, panels, sections |
| `lg` | `--sds-distance-lg` | 80 px | Heroes, full-bleed media |

New in v5. Existing keyframes keep their literal offsets (changing them would
violate the published contract); new effects must consume distance tokens.

### 2.4 Legacy tokens (permanent)

`--sds-duration` (0.8 s) and `--sds-easing` (standard curve) are the original
public theming API and are **permanent**. As of Phase 0 they resolve through
the v5 scale (`var(--sds-duration-base, 0.8s)` etc.), so overriding either
generation of token works, and computed defaults are unchanged.

---

## 3. Choreography Rules

1. **Three acts.** Entrance keyframes should read as anticipation (0 %),
   action (≈55–70 % — the overshoot frame), settle (100 %). A straight
   from/to pair is acceptable only when an easing token supplies the
   personality (e.g. clip-path wipes).

2. **Stagger is rhythm.** Child staggers use a fixed per-index delay
   (`calc(var(--i) * step)` or `:nth-child` ladders). Steps: 40–90 ms for
   characters, 80–120 ms for cards/sections. A stagger must complete within
   ~1.2 s total regardless of child count.

3. **Compound property choreography.** New effects must move at least two of
   {transform, opacity, filter, clip-path}, or orchestrate multiple elements.
   Single-property tweens are legacy-only.

4. **Loops breathe, entrances land.** Looping ambience must return exactly to
   its 0 % state (no visible snap) and should stay subtle enough to sit behind
   content. Entrances must end at the element's natural resting state
   (`transform: none`-equivalent) so layout-after-animation is stable.

5. **Transform origin is part of the story.** Folds hinge from their edge,
   pendulums hang from the top, stamps land from center. Set
   `transform-origin` explicitly whenever rotation or scale implies a hinge.

---

## 4. Reduced-Motion Philosophy

Motion is an enhancement, never a gate to content.

- The global rule collapses every `sds-` animation to `0.01ms × 1 iteration`,
  so elements jump to their final, fully-visible state.
- Scroll-gated elements (`[class*="sds-scroll-"]`, `[data-sds]`) additionally
  force `opacity: 1` and neutral transform/filter/clip-path — a user with
  reduced motion must never meet a blank page.
- JS engines check `prefers-reduced-motion` at startup: the scroll gate
  reveals everything immediately; the interactive engine skips transitions
  and physics, leaving static, legible text. `sds-word-morph` still swaps
  words (content), but without motion (presentation).
- R5 gate: an automated test parses the built CSS and fails the build if any
  animating class escapes neutralization.

---

## 5. Compositor-Only Policy (R4)

Animations may animate **only**: `transform` (and `translate`/`rotate`/`scale`
longhands), `opacity`, `filter`, `backdrop-filter`, `clip-path`, and custom
properties consumed by those. These run on the compositor thread and do not
trigger layout.

Paint-only properties (`box-shadow`, `text-shadow`, `background-position`,
`border-color`…) are tolerated in the existing catalogue (105 classes) but
discouraged for new work; prefer a pseudo-element with `opacity`/`transform`.

Layout-triggering properties (`width`, `height`, `letter-spacing`,
`border-radius`, `outline-*`, `top`…) are **forbidden in new animations**,
enforced by a stylelint rule in CI (Phase 3). The 36 pre-existing offenders
are quarantined and documented in
[`registry/INVENTORY.md`](registry/INVENTORY.md) — they are part of the
published contract and will never be silently changed (R1/R2); any redesign
goes through an RFC and an explicit compatibility-report approval.

---

## 6. Naming

- Classes: `sds-{category-prefix}-{name}` — `sds-btn-*`, `sds-input-*`,
  `sds-card-*`, `sds-loader-*`, `sds-scroll-*`; bare `sds-*` for text.
- Keyframes: `sds-camelCase` mirroring the class
  (`.sds-velvet-drop` → `@keyframes sds-velvetDrop`).
- Tokens: `--sds-duration-*`, `--sds-ease-*`, `--sds-distance-*`.
- Names describe the *motion conceit* (velvet-drop, ink-bleed, door-open),
  not the implementation (no `sds-translate-y-fade`).

---

## 7. Customization Contract

Every effect is themable without touching library CSS:

```css
/* Re-theme globally */
:root {
  --sds-duration-base: 0.6s;
  --sds-ease-standard: cubic-bezier(0.3, 1, 0.4, 1);
}

/* Or per scope */
.hero { --sds-duration: 1.2s; --sds-primary: #7c3aed; }
```

Because every tokenized declaration carries a literal fallback
(`var(--sds-duration-slow, 1.4s)`), the library also works in contexts that
strip or fail to load the `:root` block (e.g. aggressive CSS extraction).

---

## 8. Catalogue Governance

- The class inventory and its compositor-safety audit live in
  `registry/inventory.json` (machine) and `registry/INVENTORY.md` (human),
  regenerated by `node scripts/analyze-css.js`.
- From Phase 1 onward, `registry/motion.registry.json` is the single source
  of truth for docs, framework wrappers, Tailwind utilities, and the bundle
  builder (R3). No hand-maintained class lists anywhere.
- New motion families are proposed name-first (one-line motion description),
  approved, then implemented in batches with visual baselines (Phase 6
  protocol).

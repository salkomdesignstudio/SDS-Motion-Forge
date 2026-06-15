# Contributing to SDS Motion Forge

Thanks for helping build the motion platform. This guide covers everything you need: environment setup, architecture, how to add an animation, how to run tests, and what the review process looks like.

Read this before opening a PR. Most review feedback comes from skipping the architecture section or the animation checklist.

---

## Table of Contents

- [Prerequisites](#prerequisites)
- [Architecture: the registry is the source of truth](#architecture-the-registry-is-the-source-of-truth)
- [The compatibility contract](#the-compatibility-contract)
- [Local development setup](#local-development-setup)
- [Running tests](#running-tests)
- [Adding a new animation](#adding-a-new-animation)
- [What needs an RFC](#what-needs-an-rfc)
- [Reporting bugs](#reporting-bugs)
- [Code style](#code-style)
- [Pull request checklist](#pull-request-checklist)
- [Review timeline](#review-timeline)
- [Releases](#releases)

---

## Prerequisites

Before cloning the repository, make sure you have:

| Tool | Minimum version | Check |
|---|---|---|
| Node.js | **20 LTS or higher** | `node --version` |
| npm | **10 or higher** | `npm --version` |
| Git | Any modern version | `git --version` |

> **Why Node 20?** The build pipeline uses the Node 20 crypto API and several v20 performance features. CI runs on Node 20 and 22. Node 18 reached EOL in April 2025 and is no longer tested.

**Windows users:** The scripts in `scripts/` use Node.js directly and are cross-platform. If you use PowerShell, run `node scripts/generate-tokens.js` rather than the shell shorthand. `npm run build` and all other npm scripts work identically on Windows, macOS, and Linux.

**Playwright (for visual and a11y tests):** Install the Chromium browser once after `npm install`:

```bash
npx playwright install chromium
```

---

## Architecture: the registry is the source of truth

**`registry/motion.registry.json` is the single source of truth (R3).**

It is *generated from the source CSS* by `scripts/generate-registry.js`. Everything else in the project is either generated from the registry or validated against it. Hand-maintained duplicate lists are forbidden — if you find yourself typing an effect name into a second file, generate it instead.

```
src/categories/*.css
    │
    ▼
scripts/generate-registry.js
    │
    ▼
registry/motion.registry.json ──────────────────────────────────────┐
    │                                                               │
    ├──► docs/docs-data.js            gallery, 6 code tabs,        │
    │                                  how-it-works, builder       │
    │                                                               │
    ├──► packages/*/src/              React / Angular / Elements   │
    │    generated/effects.ts         typed union exports          │
    │                                                               │
    ├──► Tailwind plugin              353 animate-sds-* utilities  │
    │    (generated from registry)    + keyframes + speed variants │
    │                                                               │
    └──► test fixtures                visual, perf, snippets       │
                                                                    │
         Authored copy:                                             │
         registry/meta/descriptions.json ◄──────────────────────── ┘
         (display names + one-sentence descriptions)
```

`src/motion.css` is the `@import` entry — the real source is split across `src/categories/{core,text,buttons,inputs,cards,loaders,scroll}.css`.

**Authored copy** (display names, descriptions shown in the gallery and on code tab pages) lives in exactly one place: `registry/meta/descriptions.json`.

---

## The compatibility contract

The published npm tarball is the compatibility contract (R1). On every build, `scripts/verify-against-published.js` diffs new output against the committed baseline in `baseline/` — selectors, computed animation values, keyframes, exports map, and JS API surface. **Any deviation fails the build** unless explicitly approved in `compat/approved-deviations.json` with a documented reason.

**Never rename, remove, or change the computed timing of anything published.** This is not a guideline — it is a machine-enforced invariant. Violations fail CI immediately.

The six v3 legacy aliases (`sds-scroll-fade-up`, `sds-input-focus-glow`, `sds-card-neon`, `sds-card-depth`, `sds-card-flip`, `sds-loader-progress-glow`) are exempt from removal forever — CDN users cannot migrate off them.

---

## Local development setup

```bash
# Clone
git clone https://github.com/salkomdesignstudio/SDS-Motion-Forge.git
cd SDS-Motion-Forge

# Install root + all workspace packages (packages/*)
npm install

# Full build: tokens → css → js → category bundles → registry → docs data → docs/dist sync
npm run build

# Run every publish gate (same as what CI runs on push to main)
npm run release:check
```

### Core build scripts

| Script | What it does |
|---|---|
| `npm run build` | Full production build (all artifacts) |
| `npm run build:css` | PostCSS → autoprefixer → dist/motion.css |
| `npm run build:js` | Terser → both minified engines + source maps |
| `npm run build:categories` | Category bundles (7 × CSS + .min.css) |
| `npm run generate:registry` | Regenerate registry from source CSS |
| `npm run generate:docs` | Regenerate docs-data.js from registry |
| `npm run build:dev` | Build CSS with source maps (dev mode) |
| `npm run build:watch` | Watch CSS and rebuild on changes |
| `npm run build:verify` | Run the 8-stage pre-publish artifact check |

### Verification scripts

| Script | What it verifies |
|---|---|
| `npm run verify:tokens` | Token CSS ↔ tokens JSON are in sync |
| `npm run verify:registry` | Registry ↔ source CSS are in sync |
| `npm run verify:split` | Category bundles are self-sufficient |
| `npm run verify:published` | New build ↔ 4.0.3 baseline (R1 gate) |
| `npm run verify:reduced-motion` | 100% coverage of animating selectors |
| `npm run lint:css` | Compositor-only rule (no layout properties in @keyframes) |
| `npm run validate` | publint — package.json exports validity |
| `npm run pack:check` | Dry-run npm pack (shows what will be published) |

---

## Running tests

### Fast tests (no browser)

```bash
npm run release:check   # all fast gates (run this before opening a PR)
```

### Browser tests (require Chromium)

```bash
# Install Chromium if you haven't already
npx playwright install chromium

# Visual regression: 359 effects × 3 deterministic frames vs committed baselines
npm run test:visual

# Performance gate: CDP fps + zero-layout on heaviest effect per category
npm run test:perf

# Accessibility: axe WCAG AA on docs + example pages
npm run test:a11y

# Docs acceptance: gallery, modal, builder, code tab rendering
npm run test:docs

# Snippet verification: every copy-paste snippet rendered against the PACKED tarball
npm run verify:snippets

# Pack + install smoke: builds tarball, installs into all 4 example apps, builds them
npm run smoke:pack
```

### Updating visual baselines

When you intentionally change how an animation looks (a new effect, or a deliberate fix to an existing one), update the baselines:

```bash
npm run test:visual -- --update-snapshots
```

Then review the diff images in the artifacts and commit the updated PNGs. PRs that change animation output without updated baselines fail CI.

---

## Adding a new animation

New animations are a craft product, not a quota. Before writing CSS, read [SPEC.md](SPEC.md) — especially the quality bar (§1, §3) and the compositor policy (§5).

### Checklist (all machine-enforced; the build fails on each miss)

1. **Design first.** Propose the effect as a named motion family with a one-line motion description in an issue (label `animation-request`) or via an [RFC](docs/rfcs/0000-template.md) if it's a new category.

2. **Write the CSS** in the right `src/categories/*.css` file:
   - Class: `sds-{category-prefix}-{name}`, lowercase, hyphenated
   - Keyframes: `sds-camelCaseName` matching the class (e.g., `.sds-velvet-drop` → `@keyframes sds-velvetDrop`)
   - Animate **only** `transform`, `opacity`, `filter`, and `clip-path`. The stylelint rule `sds/compositor-only` rejects everything else. The quarantine list of pre-2026 offenders is frozen — it cannot grow.
   - Reference duration and easing tokens with literal fallbacks: `var(--sds-duration-base, 0.8s)`, `var(--sds-ease-standard, cubic-bezier(0.22, 1, 0.36, 1))`, distances via `--sds-distance-{sm,md,lg}`.
   - Multi-stage choreography (anticipation → action → settle) or multi-property movement is the house style. Single-property linear tweens are below the quality bar for new work.

3. **Regenerate everything:** `npm run build`. The registry, docs data, typed unions, and Tailwind utilities all pick the new class up automatically. Reduced-motion neutralization is global — no per-animation code required.

4. **Add the authored description** in `registry/meta/descriptions.json`:
   - `displayName`: human-readable name ("Velvet Drop")
   - `description`: one sentence describing the motion ("A weighted drop-in with blur and elastic bounce settle")
   - This populates the gallery card, all six code tabs, and the llms.txt summary.

5. **Create the visual baseline:** `npm run test:visual -- --update-snapshots` and commit the three new PNG frames. PRs without baselines fail CI.

6. **Check budgets:** `npx size-limit`. If a category file would exceed its budget meaningfully, surface this in your PR description with justification. Silent budget bumps are rejected in review.

7. **Run the full suite:** `npm run release:check` and `npm run verify:snippets`. Both green = ready to open a PR.

### Do NOT manually edit these files

They are generated or contain frozen-legacy data:

- `dist/*` — all generated; never edit
- `index.d.ts` — generated unions; never edit individual class entries
- `verify-build.js` REQUIRED_CLASSES / REQUIRED_KEYFRAMES — auto-updated by the build
- `docs/docs-data.js` — generated from registry
- `packages/*/src/generated/effects.ts` — generated from registry

---

## What needs an RFC

Open an [RFC](docs/rfcs/0000-template.md) before implementing:

- A **new animation category** (e.g., `sds-nav-*`, `sds-table-*`)
- Any **public API change** in the JS engines or framework packages
- **New tokens** or changes to token semantics
- Anything touching `compat/approved-deviations.json`

Plain new animations inside existing categories, bug fixes, documentation improvements, and example updates do not need an RFC.

See [docs/rfcs/README.md](docs/rfcs/README.md) for the RFC index and how to submit one.

---

## Reporting bugs

Use the [bug report issue template](https://github.com/salkomdesignstudio/SDS-Motion-Forge/issues/new?template=bug_report.md).

**Reproduce in the docs playground first** — open the effect at [sds-motion-forge.netlify.app](https://sds-motion-forge.netlify.app), use the modal controls, and copy the exact snippet. A reproduction scoped to the library snippet isolates the bug. A reproduction that requires your full application usually means the bug is in the integration, not the library.

---

## Code style

### CSS (`src/categories/*.css`)

- 2-space indentation
- One declaration per line
- Section comments follow the surrounding style
- Keyframe names: `sds-camelCaseName` (no hyphens in keyframe names, only in class names)
- Properties ordered: animation → transform → opacity → filter → clip-path

### Engine JS (`src/*.js`)

- ES5 syntax — no arrow functions, no `const`/`let`, no template literals
- `var` declarations at function scope
- Zero dependencies — these files ship directly to browsers after terser
- Semicolons required
- 2-space indentation

### Tooling (`scripts/`)

- Node.js CommonJS
- No runtime dependencies beyond what's in `devDependencies`
- `'use strict'` at file top

### TypeScript packages (`packages/*/src/`)

- TypeScript strict mode
- No `any` in public API surfaces
- Effects types are generated — never hand-edit `generated/effects.ts`

---

## Pull request checklist

Before requesting review, confirm:

- [ ] `npm run release:check` passes locally
- [ ] `npm run lint:css` passes (no compositor-only violations)
- [ ] `npm run verify:published` passes (R1 gate — 0 unapproved deviations from 4.0.3)
- [ ] `npm run verify:reduced-motion` passes (100% coverage of animating selectors)
- [ ] Visual baselines updated and committed if any animation output changed
- [ ] `registry/meta/descriptions.json` updated with displayName + description for new effects
- [ ] PR description explains the motion family and links any related issue or RFC
- [ ] Bundle budgets checked (`npx size-limit`)

For new animations specifically:
- [ ] SPEC.md §1 (principles) reviewed — animation tells the user something
- [ ] SPEC.md §5 (compositor-only) confirmed — only transform/opacity/filter/clip-path
- [ ] Multi-stage choreography present (not a single-property linear tween)

---

## Review timeline

Pull requests are reviewed by the maintainers within **5 business days** of opening. If you have not received a response in 7 days, add a comment to the PR — we may have missed the notification.

What to expect:

- **Simple fixes (typos, broken links, version bumps):** merged within 1–2 business days
- **Bug fixes with reproduction:** reviewed within 3–5 business days
- **New animations:** reviewed within 5 business days; may require iteration on motion quality or SPEC alignment
- **RFCs:** discussion period of at least 2 weeks before acceptance

Reviews assess motion quality (SPEC compliance), compatibility (R1), accessibility (R5), and performance (R4) — not just correctness. Feedback on any of these axes is constructive, not a rejection.

---

## Releases

Maintainers only. See [VERSIONING.md](VERSIONING.md) for the full policy.

The short version: `prepublishOnly` runs `release:check` automatically and will reject a publish that fails any gate. Major and minor core releases go to the `next` dist-tag first, are validated against fresh apps and CDN URLs, then promoted with `npm dist-tag add`. Nothing is ever published from a development machine on a whim.

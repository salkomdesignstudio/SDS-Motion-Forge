# Contributing to SDS Motion Forge

Thanks for helping build the motion platform. This guide explains how the
repository actually works — read it before opening a PR; most review feedback
comes from skipping the architecture section.

## The one rule that explains everything

**`registry/motion.registry.json` is the single source of truth (R3).**
It is *generated from the source CSS* and everything else is generated from
it or validated against it:

```
src/categories/*.css ──► scripts/generate-registry.js ──► registry/motion.registry.json
                                                                 │
        ┌────────────────────────┬────────────────────┬──────────┴──────────────┐
        ▼                        ▼                    ▼                         ▼
  docs/docs-data.js        packages/*/src/      tailwind plugin           test fixtures
  (gallery, 6 code tabs,   generated/effects.ts (353 utilities +          (visual, perf,
  how-it-works, builder)   (typed unions)       keyframes, v3 preset)     snippets)
```

Hand-maintained duplicate lists are forbidden anywhere. If you find yourself
typing an effect name into a second file, you are doing it wrong — generate it.

Authored copy (display names, descriptions) lives in exactly one place:
`registry/meta/descriptions.json`.

## The contract

The published npm tarball is the compatibility contract (R1). On every build,
`scripts/verify-against-published.js` diffs the new output against the
committed baseline in `baseline/` — selectors, computed animation values,
keyframes, exports map, JS API surface. **Any deviation fails the build**
unless explicitly approved in `compat/approved-deviations.json` with a reason.
Never rename, remove, or change the computed timing of anything published.

## Local development

```bash
git clone https://github.com/salkomdesignstudio/SDS-Motion-Forge.git
cd SDS-Motion-Forge
npm install                # root + workspaces (packages/*)

npm run build              # tokens → css → js → category bundles → registry → docs data
npm run release:check      # every publish gate (what CI runs on push)

# Heavier suites (need Chromium: npx playwright install chromium)
npm run test:visual        # 359 effects × 3 deterministic frames vs baselines
npm run test:perf          # CDP: fps + zero-layout gates
npm run test:a11y          # axe WCAG AA on docs + example
npm run test:docs          # docs gallery / modal / bundle-builder acceptance
npm run verify:snippets    # 732 snippet pages vs the PACKED tarball
npm run smoke:pack         # packed-tarball installs into all example apps
```

Source layout: `src/categories/{core,text,buttons,inputs,cards,loaders,scroll}.css`
(`src/motion.css` is the @import entry). `dist/` is generated — never edit it.

## Adding a new animation

New animations are a craft product, not a quota. Before writing CSS, read
[SPEC.md](SPEC.md) — especially the quality bar (§1, §3) and the compositor
policy (§5).

Checklist (all machine-enforced; the build fails on each miss):

1. **Design first.** Propose the effect as a named motion family with a
   one-line motion description in an issue (label `animation-request`) or RFC.
2. **Write the CSS** in the right `src/categories/*.css` file:
   - class `sds-{category-prefix}-{name}`, keyframes `sds-camelCase`;
   - animate ONLY transform / opacity / filter / clip-path (+ custom
     properties). The stylelint rule `sds/compositor-only` rejects everything
     else; the quarantine list of pre-2026 offenders is frozen and never grows;
   - reference duration/easing tokens with literal fallbacks
     (`var(--sds-duration-base, 0.8s)`), distances via `--sds-distance-*`;
   - multi-stage choreography (anticipation → action → settle) or
     multi-property movement — single-property tweens are below the bar.
3. **Regenerate everything:** `npm run build` (registry + docs data pick the
   class up automatically; reduced-motion neutralization is global and
   verified by `verify:reduced-motion`).
4. **Add the authored description** in `registry/meta/descriptions.json`
   (displayName + one good sentence — it becomes the docs card and all six
   code tabs' page).
5. **Create the visual baseline:** `npm run test:visual -- --update-snapshots`
   and commit the three new PNGs. PRs without baselines fail CI.
6. **Check budgets:** `npx size-limit`. If a category file would exceed its
   budget meaningfully, raise it in the PR description with justification —
   silent budget bumps are rejected.
7. Run `npm run release:check` and `npm run verify:snippets`. Green = ready.

Do **not** edit `verify-build.js` lists, `index.d.ts` unions, README counts or
docs data by hand — they are generated or frozen-legacy.

## What needs an RFC

Open an RFC (see [docs/rfcs/0000-template.md](docs/rfcs/0000-template.md))
before implementing:

- a new animation category (e.g. `sds-nav-*`),
- any public API change in the JS engines or framework packages,
- new tokens or changes to token semantics,
- anything touching `compat/approved-deviations.json`.

Plain new animations inside existing categories, bug fixes and docs work do
not need an RFC.

## Reporting bugs

Use the bug-report template. **Reproduce in the docs playground first**
(https://sds-motion-forge.netlify.app — open the effect, use the modal
controls, copy the exact snippet) and paste the snippet into the issue. A
reproduction that needs your whole app usually means the bug is elsewhere.

## Code style

- CSS: 2-space indent, one declaration per line, section comments like the
  surrounding code.
- Engine JS (`src/*.js`): ES5, `var`, zero dependencies — these files ship
  to browsers as-is after terser.
- Tooling (`scripts/`): Node ≥ 18, CommonJS, zero runtime dependencies
  beyond devDependencies.
- TypeScript packages: strict mode, no `any` in public APIs.

## Releases

Maintainers only. See [VERSIONING.md](VERSIONING.md). Nothing is ever
published from a laptop on a whim: `prepublishOnly` runs the full
`release:check`, and v5+ releases go through the `next` dist-tag first.

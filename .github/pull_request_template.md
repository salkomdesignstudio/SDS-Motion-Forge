<!-- Thanks! Keep PRs focused: one effect family, one fix, or one doc topic. -->

## Summary

<!-- What does this PR do? Link any related issue or RFC. -->

Closes #

## Type of change

- [ ] Bug fix (non-breaking)
- [ ] New animation(s) — existing category
- [ ] New feature (non-breaking, additive)
- [ ] RFC implementation (link to accepted RFC: )
- [ ] Documentation / tooling / dependency update

**For new animations:** category and number of new effects:

---

## Animation checklist (required for any CSS change)

All 7 steps are machine-enforced. The build fails on each miss.

- [ ] 1. Effect proposed and named in an issue or RFC before implementation
- [ ] 2. CSS in correct `src/categories/{category}.css`, naming: `sds-{prefix}-{name}` class · `sds-camelCaseName` keyframes
- [ ] 3. Only `transform`, `opacity`, `filter`, `clip-path` in @keyframes — `npm run lint:css` passes
- [ ] 4. Token references use literal fallbacks: `var(--sds-duration-base, 0.8s)`
- [ ] 5. Authored description added to `registry/meta/descriptions.json` (`displayName` + one sentence)
- [ ] 6. `npm run build` run — registry, docs data, typed unions all regenerated (no hand-edits)
- [ ] 7. Visual baselines created/updated: `npm run test:visual -- --update-snapshots` · 3 PNGs committed

---

## Quality gates

- [ ] `npm run release:check` — all fast gates green locally
- [ ] `npm run verify:published` — R1 gate: 0 unapproved deviations vs 4.0.3 baseline
- [ ] `npm run verify:reduced-motion` — 100% reduced-motion coverage maintained
- [ ] `npm run lint:css` — no compositor violations
- [ ] `npx size-limit` — budgets respected (or see note below)

**Size budget note (if exceeded):**

---

## Compatibility statement

- [ ] No published class names, keyframe names, computed values, export paths, or JS API surfaces were changed or removed
- [ ] OR: changes are approved in `compat/approved-deviations.json` with documented reason (link: )

---

## Testing notes

<!-- Browser(s) tested, reproduction steps, or test command output. -->

---

## Screenshots / visual diff (for animation changes)

<!-- The visual baseline PNGs in the PR diff count. Attach additional GIFs if the motion is hard to see in still frames. -->

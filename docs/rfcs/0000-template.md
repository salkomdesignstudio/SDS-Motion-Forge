# RFC 0000 — <concise title>

- **Status:** Draft <!-- Draft → Review → Accepted | Rejected | Withdrawn -->
- **Author(s):** <github handle(s)>
- **Created:** <YYYY-MM-DD>
- **Discussion:** <link to the GitHub issue/PR for this RFC>

> Copy this file to `docs/rfcs/NNNN-short-slug.md` (next free number) and open
> a PR. RFCs are required for: new animation categories, public API changes in
> the engines or framework packages, new tokens / token semantics changes, and
> anything that needs an entry in `compat/approved-deviations.json`.
> An RFC is accepted when a maintainer merges it with Status: Accepted.

## Summary

One paragraph. What changes for users?

## Motivation

What problem does this solve? Who hits it today, and how often? Link issues.

## Detailed design

The complete picture — names, signatures, CSS/markup shapes, generated
artifacts. Be concrete enough that someone else could implement it.

- **Registry impact:** which fields/entries change in
  `registry/motion.registry.json`, and what regenerates from them
  (docs tabs, Tailwind utilities, React/Angular/Elements types, builder data).
- **Compatibility (R1/R2):** does any published selector, keyframe, computed
  timing, export path, or JS API surface change? If yes, this RFC must
  propose the exact `compat/approved-deviations.json` entries and the
  rollback story. "No deviations" is the expected answer.
- **Tokens (SPEC §2):** which duration/easing/distance tokens are consumed;
  any new tokens proposed.
- **Accessibility (R5):** how the reduced-motion neutralization covers it.
- **Performance (R4):** compositor-only proof; expected size-limit impact
  per artifact.

## How we test it

Visual baselines, snippet verification, perf budgets, a11y — what gets added
or updated in each gate.

## Drawbacks

The honest costs: bundle size, API surface, maintenance, education.

## Alternatives

What else was considered, and why this design wins. Include "do nothing".

## Unresolved questions

What must be settled before implementation, and what can be settled later.

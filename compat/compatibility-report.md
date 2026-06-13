# Compatibility Report — new build vs published tarball

- Generated: 2026-06-13T11:51:56.882Z
- Baseline: @salkomdesignstudio/sds-motion-forge@4.0.3 (baseline/extracted)
- Candidate: @salkomdesignstudio/sds-motion-forge@5.0.0 (working tree build)
- Selectors compared: 609
- Keyframes compared: 324
- Deviations found: 1 (approved: 1, UNAPPROVED: 0)

## Approved deviations (allowed by compat/approved-deviations.json)

- `selector-count:|[data-sds]:not(.sds-play)` [css-selector] — Selector "|[data-sds]:not(.sds-play)" occurs 1x in published, 2x in new build (cascade order risk)
    - reason: 

**Result: PASS (all deviations explicitly approved)**
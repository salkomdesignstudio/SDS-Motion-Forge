<!-- Thanks! Keep PRs focused: one effect family, one fix, or one doc topic. -->

## What & why

<!-- Link the issue / RFC. For visual changes, paste a playground or preview link. -->

## Checklist

- [ ] `npm run release:check` is green locally
- [ ] No hand-edited generated files (registry, docs-data, dist, type unions, README counts)
- [ ] **Bug fix:** reproduction added (docs-playground snippet in the linked issue)
- [ ] **New animation:** SPEC.md quality bar met; compositor-only (stylelint green);
      tokens used; description added in `registry/meta/descriptions.json`;
      visual baselines committed (`npm run test:visual -- --update-snapshots`)
- [ ] **Public API / category / token change:** accepted RFC linked
- [ ] Size budgets respected, or the bump is justified below

## Compatibility statement

<!-- "No published behavior changes" — or the exact verify-against-published
     deviations this introduces and the compat/approved-deviations.json entry. -->

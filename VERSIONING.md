# Versioning Policy — SDS Motion Forge

This package is infrastructure for 2,000+ production sites, many of which
consume it through unversioned CDN URLs and can never be migrated. Versioning
is therefore conservative by design.

## Strict semver

`@salkomdesignstudio/sds-motion-forge` follows semver strictly:

- **Patch (x.y.Z):** bug fixes that restore documented behavior; docs;
  internal tooling. Computed values of working effects do not change.
- **Minor (x.Y.0):** new effects, new tokens, new exports, new dist files —
  purely additive. The R1 gate (`verify-against-published`) must report zero
  unapproved deviations against the previous release.
- **Major (X.0.0):** anything that changes or removes published behavior.
  Majors are rare, deliberate, and follow the deprecation cycle below.

### What counts as public API (all semver-protected)

Every class name and keyframe name in the built CSS; every computed
animation value (duration/easing/delay/fill/iteration); every export subpath
and dist file path; the `--sds-*` custom properties; the JS engines' data
attributes, globals and options; the plain CDN `<link>`/`<script>` usage
patterns. If a user could observe it, it is API.

### One-major deprecation cycle

Nothing public is ever removed in the release that deprecates it:

1. Release N: the item is marked `deprecated: true` in the registry, the docs
   show the replacement, and a CHANGELOG entry explains why.
2. Release N stays fully functional for the item — an alias or shim keeps the
   old name working identically.
3. Earliest removal is major N+1, and only with an accepted RFC.

The six v3 legacy aliases (`sds-scroll-fade-up`, `sds-input-focus-glow`,
`sds-card-neon`, `sds-card-depth`, `sds-card-flip`,
`sds-loader-progress-glow`) are exempt from removal forever — CDN users
cannot migrate.

## Wrapper packages version independently

`motion-forge-tailwind`, `-react`, `-angular`, `-elements` have their own
semver lines starting at 1.0.0. A wrapper bug never forces a core release and
vice versa. Wrappers declare the minimum core behavior they need through the
registry version they were generated from (stamped in each generated file).

## Release mechanics

- Every release runs `release:check` (build, verify-build, token/registry/
  docs sync, lossless-split invariants, **R1 published-tarball gate**,
  reduced-motion gate, compositor lint, size budgets, publint, pack check).
- Major and minor core releases are published to the **`next` dist-tag
  first**, validated against fresh apps and CDN URLs, then promoted with
  `npm dist-tag add` — never republished.
- Rollback is `npm dist-tag add @salkomdesignstudio/sds-motion-forge@<prev> latest`
  — a 30-second escape hatch that touches no tarballs.

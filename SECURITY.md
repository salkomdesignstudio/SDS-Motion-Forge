# Security Policy

## Supported versions

| Version | Supported |
|---|---|
| 5.x (when released) | ✅ |
| 4.x | ✅ |
| < 4.0 | ❌ — upgrade; every v3 class works identically in 4.x/5.x |

## Reporting a vulnerability

Email **hello@salkomdesignstudio.com** with subject `SECURITY: sds-motion-forge`,
or use GitHub's private vulnerability reporting on this repository. Please do
**not** open a public issue for security reports.

Include: affected package + version, a minimal reproduction, and impact.
You will get an acknowledgement within 72 hours and a remediation plan or fix
timeline within 14 days. We credit reporters in the changelog unless you ask
otherwise.

## Scope notes

This project ships CSS plus two small, dependency-free browser scripts
(`sds-scroll.min.js`, `motion-interactive.min.js`) and dependency-free
wrapper packages. The most security-relevant surfaces are:

- the engines' DOM handling (`data-words`, char splitting, MutationObserver),
- the docs site and bundle builder (client-side only; no accounts, no data
  collection),
- the supply chain: all packages have **zero runtime dependencies**, are
  published with npm provenance from CI, and `release:check` verifies the
  built artifacts against committed sources on every publish.

Reports about prototype pollution, XSS through engine-processed attributes,
or tampered publish artifacts are explicitly in scope.

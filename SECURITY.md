# Security Policy

## Supported versions

| Version | Security support |
|---|---|
| 5.x | ✅ Active |
| 4.x | ✅ Critical fixes only |
| < 4.0 | ❌ Unsupported — upgrade; every v3 class works identically in 4.x/5.x |

## Reporting a vulnerability

**Do not open a public GitHub issue for security reports.** Use one of the private channels below.

### Primary: GitHub Security Advisories (preferred)

Use GitHub's private vulnerability reporting:

> **[Report a vulnerability](https://github.com/salkomdesignstudio/SDS-Motion-Forge/security/advisories/new)**

This is the preferred channel. GitHub keeps the discussion private until a patch ships, then generates a public advisory and CVE automatically.

### Secondary: email

Email **hello@salkomdesignstudio.com** with subject `SECURITY: sds-motion-forge`.

Include:
- Affected package name and version
- A minimal reproduction (HTML snippet or script)
- The potential impact (what an attacker could achieve)
- Any mitigations or workarounds you've identified

## Coordinated disclosure timeline

| Day | Action |
|---|---|
| 0 | Report received |
| 1–3 | Triage acknowledgement sent |
| 7–14 | Patch developed and published to `next` dist-tag for validation |
| 14–21 | Patch promoted to `latest`; public GitHub Security Advisory published with CVE; reporter credited in CHANGELOG unless anonymity requested |

If a report requires more than 21 days to remediate (for example, a complex supply-chain issue requiring coordination with dependencies), you will be notified by day 14 with an updated timeline.

## CVE assignment

GitHub Security Advisories automatically request a CVE from MITRE when a report is accepted. The CVE ID is included in the public advisory and CHANGELOG entry.

## Reporter credit

Reporters are credited by name (or GitHub handle) in the CHANGELOG and the GitHub Security Advisory unless they request anonymity.

## Scope

This project ships CSS plus two small, dependency-free browser scripts (`sds-scroll.min.js`, `motion-interactive.min.js`) and four dependency-free framework wrapper packages. The most security-relevant surfaces are:

**In scope:**

- The engines' DOM handling — `data-words` attribute processing, char splitting, MutationObserver behavior, `innerHTML` use (there is none currently, but additions to these code paths are sensitive)
- Prototype pollution via attribute or class name processing
- XSS through engine-processed attributes (`data-words`, `data-sds-delay`, `data-sds-radius`)
- Tampered publish artifacts (the supply chain: `release:check` verifies built artifacts against committed sources, and npm provenance is published from CI)
- The docs site and bundle builder (client-side only; no accounts, no data collection; CSP bypass in the builder's CompressionStream path would be in scope)

**Out of scope:**

- Animations that look bad or are visually jarring (not a security issue — use the GitHub discussions or a regular issue)
- Self-XSS (a user injecting content into their own browser session)
- Vulnerabilities in `devDependencies` that do not affect the published npm package or the docs site
- Vulnerabilities in browser engines triggered by valid CSS — these belong to the browser vendor

## Supply chain

- All four framework wrapper packages and the core package have **zero runtime dependencies**
- npm provenance is published from CI via OIDC — every release has a verifiable provenance attestation
- `release:check` verifies the built `dist/` artifacts against committed sources and the 4.0.3 baseline tarball before any publish can proceed
- `prepublishOnly` blocks any publish that fails the above check

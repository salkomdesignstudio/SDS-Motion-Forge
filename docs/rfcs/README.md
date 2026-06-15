# RFC Index — SDS Motion Forge

RFCs (Request for Comments) are the governance process for changes that affect the public API, introduce new animation categories, modify token semantics, or require entries in `compat/approved-deviations.json`.

---

## How to propose an RFC

1. **Check this index** — search for an existing RFC that covers your proposal.
2. **Open a discussion issue** first (label: `rfc-discussion`). This is where the idea gets vetting before a formal RFC. Many proposals are accepted or refined at the discussion stage without a full RFC.
3. **Copy the template:** `cp docs/rfcs/0000-template.md docs/rfcs/NNNN-short-slug.md` (use the next available number).
4. **Fill in every section.** The "Compatibility (R1/R2)" and "Accessibility (R5)" sections are mandatory. Incomplete RFCs are returned for revision.
5. **Open a PR** with the filled RFC. The RFC is in `Draft` status until a maintainer sets it to `Review`.
6. **Discussion period:** at least 2 weeks of open discussion on the PR before a decision is made.
7. **Acceptance:** a maintainer merges the PR with `Status: Accepted`. Rejected RFCs are closed with `Status: Rejected` and a documented reason.

---

## What requires an RFC

| Requires an RFC | Does NOT require an RFC |
|---|---|
| New animation category (e.g., `sds-nav-*`) | New animation within an existing category |
| Public API change in JS engines or framework packages | Bug fix to an existing animation |
| New tokens or changes to token semantics | Documentation improvements |
| Anything touching `compat/approved-deviations.json` | Example updates |
| Changes to the registry schema | Internal tooling |

---

## RFC Status Definitions

| Status | Meaning |
|---|---|
| Draft | In progress; not ready for review |
| Review | Open for community and maintainer discussion |
| Accepted | Approved; implementation may proceed |
| Rejected | Not accepted; reason documented in RFC and closing comment |
| Withdrawn | Proposer withdrew the RFC |
| Superseded | A later RFC renders this one obsolete |

---

## Active RFCs

| # | Title | Author | Status | Category |
|---|---|---|---|---|
| — | *No active RFCs* | — | — | — |

---

## Accepted RFCs

| # | Title | Author | Merged | Ships In |
|---|---|---|---|---|
| — | *No accepted RFCs yet* | — | — | — |

> **Note:** The v5 architecture (Phase 0–6) was designed and implemented by the core team before the RFC process was established. The RFC process applies to all changes from v5.1.0 onward.

---

## Rejected / Withdrawn RFCs

| # | Title | Status | Reason |
|---|---|---|---|
| — | *None* | — | — |

---

## RFC Template

[`0000-template.md`](0000-template.md) — copy this file to start a new RFC.

The template includes sections for: Summary, Motivation, Detailed design (with registry impact, compatibility statement, token usage, and accessibility proof), Testing plan, Drawbacks, Alternatives, and Unresolved questions.

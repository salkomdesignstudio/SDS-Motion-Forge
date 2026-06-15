---
name: Animation request
about: Propose a new CSS animation effect
title: "[Animation Request] "
labels: animation-request
assignees: ''
---

## Before you open this

- Search existing issues for the effect you want — it may already be planned or rejected
- Read [SPEC.md](../../SPEC.md) §1 (principles) and §5 (compositor-only policy). Requests that violate the compositor policy will be closed
- This is a request, not a guaranteed addition. New animations must meet the quality bar in SPEC.md §3

---

## Effect name and category

**Proposed class name:** `sds-` *(follow the naming convention: `sds-{category-prefix}-{descriptive-name}` for category-specific effects)*

**Category:** Text / Buttons / Inputs / Cards / Loaders / Scroll *(choose one)*

## Motion description

*One sentence: what does this animation do? Describe the motion, not the result. "A weighted drop from above with blur resolving to sharp" is good. "Cool entrance effect" is not.*

## Distinctness statement

*How is this different from every existing animation in the same category? List the most similar existing effect and explain what makes this one distinct.*

**Most similar existing class:** `sds-`  
**What makes this different:**

## Visual reference

*Link to a gif, video, CodePen, or written multi-stage description of the keyframe choreography. A reference is not required but significantly speeds up review.*

## Compositor safety check

*SPEC §5 requires that @keyframes only animate `transform`, `opacity`, `filter`, and `clip-path`. Does your proposed effect require any other properties?*

- [ ] Only `transform`, `opacity`, `filter`, `clip-path` — compositor-safe
- [ ] Requires other properties — explain why: 

## Accessibility note

*All SDS animations are neutralized under `prefers-reduced-motion: reduce` by the global gate. Does your effect have any special accessibility consideration? (e.g., flashing, strobing, rapid motion)*

## Do you want to implement this?

- [ ] Yes — I can submit a PR with the CSS and visual baselines
- [ ] No — I'm requesting the effect; maintainers would implement it

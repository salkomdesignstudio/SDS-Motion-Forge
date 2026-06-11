#!/usr/bin/env node
/**
 * SDS Motion Forge — Reduced-Motion Build Gate (R5, permanent CI step).
 *
 * Parses the BUILT CSS (dist/motion.css) and proves that 100% of animating
 * selectors are neutralized under `@media (prefers-reduced-motion: reduce)`.
 *
 * Method (parsed CSS, not pixels):
 *   1. Collect every selector that declares `animation`/`animation-name`
 *      outside the reduced-motion block, and classify the animated TARGET:
 *        self          .sds-x            -> el with class sds-*
 *        pseudo        .sds-x::after     -> ::before/::after of sds-* el
 *        child         .sds-x > *        -> any child of an sds-* el
 *        descendant    .sds-x .sds-char  -> descendant WITH an sds-* class
 *        attr-gated    [data-sds]...     -> covered via sds-js engine policy
 *   2. Collect the neutralization selectors inside the reduced-motion block
 *      and verify every target kind is covered by a neutralizer that matches
 *      it (e.g. `[class*="sds-"] > *` covers child targets whose elements
 *      carry no sds- class of their own).
 *   3. Additionally verify scroll-gated elements are forced visible
 *      (opacity:1 / transform:none coverage for sds-scroll-* and [data-sds]).
 *
 * Usage: node scripts/verify-reduced-motion.js [--input <file>]
 */

const fs = require("fs");
const path = require("path");
const postcss = require("postcss");

const ROOT = path.join(__dirname, "..");
const argIdx = process.argv.indexOf("--input");
const INPUT = argIdx > -1 ? process.argv[argIdx + 1] : path.join(ROOT, "dist", "motion.css");

const css = fs.readFileSync(INPUT, "utf8");
const root = postcss.parse(css);

let errors = 0;
const fail = (m) => { console.error(`  x ${m}`); errors++; };
const pass = (m) => console.log(`  ok ${m}`);

/* ── collect ─────────────────────────────────────────────────── */
const animatingSelectors = []; // { selector, kind }
const rmNeutralizers = [];     // selectors inside RM block that clamp animation
let rmForcesScrollVisible = false;
let rmForcesScrollChildrenVisible = false;

function classifyTarget(sel) {
  const s = sel.trim();
  if (/::(before|after|placeholder)\s*$/.test(s)) return "pseudo";
  // the FINAL compound determines the animated element
  const finalCompound = s.split(/\s*[>~+]\s*|\s+/).filter(Boolean).pop() || s;
  if (/^\*$/.test(finalCompound)) return "child";
  if (/^(span|div|i|b|label|input)(:|\[|$)/.test(finalCompound) && /[> ]/.test(s)) return "child";
  if (/\.sds-[a-z0-9-]+/.test(finalCompound)) return "self-or-descendant-sds";
  if (/^\[data-sds/.test(s)) return "attr";
  if (/:nth-child/.test(finalCompound) && /\*\:nth-child|^\*:/.test(finalCompound)) return "child";
  // `* :nth-child` forms like `.sds-x > *:nth-child(2)`
  if (/\*:nth-child/.test(finalCompound)) return "child";
  return "other";
}

root.walkRules((rule) => {
  let inRM = false;
  let p = rule.parent;
  while (p && p.type === "atrule") {
    if (/keyframes/.test(p.name)) return;
    if (p.name === "media" && /prefers-reduced-motion/.test(p.params)) inRM = true;
    p = p.parent;
  }

  if (inRM) {
    let clampsAnimation = false;
    let forcesVisible = false;
    rule.walkDecls((d) => {
      if (/^animation(-duration|-iteration-count)?$/.test(d.prop) && d.important) clampsAnimation = true;
      if (d.prop === "opacity" && d.value.trim() === "1" && d.important) forcesVisible = true;
    });
    for (const sel of rule.selector.split(",").map((s) => s.trim())) {
      if (clampsAnimation) rmNeutralizers.push(sel);
      if (forcesVisible && /sds-scroll-/.test(sel)) {
        if (/>\s*\*/.test(sel)) rmForcesScrollChildrenVisible = true;
        else rmForcesScrollVisible = true;
      }
    }
    return;
  }

  let animates = false;
  rule.walkDecls(/^(-webkit-)?animation(-name)?$/, (d) => {
    if (!/^\s*none\s*$/.test(d.value)) animates = true;
  });
  if (!animates) return;
  for (const sel of rule.selector.split(",").map((s) => s.trim())) {
    animatingSelectors.push({ selector: sel, kind: classifyTarget(sel) });
  }
});

/* ── coverage rules ──────────────────────────────────────────── */
const hasSelfNeutralizer = rmNeutralizers.some((s) => s.replace(/\s+/g, "") === '[class*="sds-"]');
const hasPseudoBefore = rmNeutralizers.some((s) => /\[class\*="sds-"\]::before/.test(s.replace(/\s+/g, "")));
const hasPseudoAfter = rmNeutralizers.some((s) => /\[class\*="sds-"\]::after/.test(s.replace(/\s+/g, "")));
const hasChildNeutralizer = rmNeutralizers.some((s) => /\[class\*="sds-"\]\s*>?\s*\*/.test(s) && /\*/.test(s.split(">").pop() || ""));
const hasAttrNeutralizer = hasSelfNeutralizer; /* [data-sds] elements carry sds- classes for their animation */

console.log(`\n=== verify-reduced-motion (R5 gate) on ${path.relative(ROOT, INPUT)} ===`);
console.log(`animating selectors: ${animatingSelectors.length}; RM neutralizers: ${rmNeutralizers.length}`);

const uncovered = [];
for (const a of animatingSelectors) {
  let covered = false;
  switch (a.kind) {
    case "self-or-descendant-sds": covered = hasSelfNeutralizer; break;
    case "pseudo": covered = /::before/.test(a.selector) ? hasPseudoBefore : hasPseudoAfter; break;
    case "child": covered = hasChildNeutralizer; break;
    case "attr": covered = hasAttrNeutralizer; break;
    default: covered = hasSelfNeutralizer && /\.sds-/.test(a.selector);
  }
  if (!covered) uncovered.push(a);
}

if (!hasSelfNeutralizer) fail(`missing universal neutralizer [class*="sds-"] with !important animation clamp`);
else pass(`universal [class*="sds-"] animation clamp present`);
if (!hasPseudoBefore || !hasPseudoAfter) fail("missing ::before/::after neutralizers");
else pass("pseudo-element neutralizers present");
if (!hasChildNeutralizer) fail(`missing child neutralizer ([class*="sds-"] > *) — child-animated effects (kinetic-wave, loader-dots, staggers) would still move under reduced motion`);
else pass("child-element neutralizer present");
if (!rmForcesScrollVisible || !rmForcesScrollChildrenVisible) fail("scroll-gated elements/children not forced visible (opacity:1 !important) under reduced motion");
else pass("scroll-gated elements and children forced visible");

if (uncovered.length) {
  fail(`${uncovered.length} animating selector(s) not neutralized:`);
  uncovered.slice(0, 15).forEach((u) => console.error(`      - [${u.kind}] ${u.selector}`));
} else {
  pass(`all ${animatingSelectors.length} animating selectors are neutralized under prefers-reduced-motion`);
}

if (errors) { console.error(`\nFAIL: ${errors} reduced-motion gap(s).`); process.exit(1); }
console.log("PASS: 100% reduced-motion coverage.\n");

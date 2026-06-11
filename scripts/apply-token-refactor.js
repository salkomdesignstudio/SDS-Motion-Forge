#!/usr/bin/env node
/**
 * SDS Motion Forge — Phase 0 one-time token refactor (kept for audit).
 *
 * Rewrites src/motion.css so animation declarations reference the v5
 * token scale WITH literal fallbacks, e.g.
 *     animation: sds-refract 1.4s steps(3) infinite;
 *  -> animation: sds-refract var(--sds-duration-slow, 1.4s) steps(3) infinite;
 *
 * Rules (R1-safe by construction):
 *  - Only `animation` / `-webkit-animation` shorthands and the duration
 *    modifier classes are touched. Keyframe bodies, transitions and all
 *    other declarations are left byte-identical.
 *  - Only the FIRST time token of each comma-segment (the duration) is
 *    replaced, and only on an exact value match. Delays stay literal.
 *  - Easing functions are replaced only on an exact normalized match
 *    with a named token curve.
 *  - Every replacement carries the original literal as the var() fallback,
 *    so the computed default is provably unchanged
 *    (verified by scripts/verify-against-published.js).
 */

const fs = require("fs");
const path = require("path");
const postcss = require("postcss");
const { splitTopLevel, normalizeTime } = require("./lib/css-model");

const ROOT = path.join(__dirname, "..");
const file = path.join(ROOT, "src", "motion.css");
const css = fs.readFileSync(file, "utf8");
const root = postcss.parse(css);

const DURATION_TOKENS = {
  "0.3s": "--sds-duration-instant",
  "0.4s": "--sds-duration-fast",
  "0.8s": "--sds-duration-base",
  "1.4s": "--sds-duration-slow",
  "2.2s": "--sds-duration-slower",
  "3s": "--sds-duration-dramatic",
};

const EASING_TOKENS = {
  "cubic-bezier(0.22,1,0.36,1)": "--sds-ease-standard",
  "cubic-bezier(0.16,1,0.3,1)": "--sds-ease-decelerate",
  "cubic-bezier(0.6,-0.28,0.74,0.05)": "--sds-ease-accelerate",
  "cubic-bezier(0.215,0.61,0.355,1)": "--sds-ease-emphasized",
  "cubic-bezier(0.34,1.56,0.64,1)": "--sds-ease-spring",
  "cubic-bezier(0.68,-0.55,0.27,1.55)": "--sds-ease-bounce",
};

function normBezier(s) {
  return s.replace(/\s+/g, "");
}

let durationHits = 0;
let easingHits = 0;
let modifierHits = 0;

root.walkDecls(/^(-webkit-)?animation$/, (decl) => {
  // skip anything inside @keyframes or the reduced-motion block
  let p = decl.parent;
  let inKeyframes = false, inReduced = false;
  while (p) {
    if (p.type === "atrule" && /keyframes/.test(p.name)) inKeyframes = true;
    if (p.type === "atrule" && p.name === "media" && /prefers-reduced-motion/.test(p.params)) inReduced = true;
    p = p.parent;
  }
  if (inKeyframes || inReduced) return;

  const segments = splitTopLevel(decl.value, ",");
  const newSegments = segments.map((seg) => {
    const tokens = splitTopLevel(seg.replace(/\s+/g, " "), " ");
    let durationDone = false;
    const out = tokens.map((t) => {
      // duration: first plain time literal in the segment
      if (!durationDone && /^[\d.]+m?s$/i.test(t)) {
        durationDone = true;
        const norm = normalizeTime(t);
        const tok = DURATION_TOKENS[norm];
        return tok ? `var(${tok}, ${t})` : t;
      }
      if (!durationDone && t.startsWith("var(")) {
        // already tokenized duration (legacy var(--sds-duration)) — leave it
        durationDone = true;
        return t;
      }
      // easing: exact bezier match
      if (/^cubic-bezier\(/i.test(t)) {
        const tok = EASING_TOKENS[normBezier(t)];
        return tok ? `var(${tok}, ${t})` : t;
      }
      return t;
    });
    return out.join(" ");
  });

  // Preserve the original multi-line formatting decision: if value had
  // newlines, let postcss reflow on one line per segment (cosmetic only).
  const next = newSegments.join(",\n    ");
  const flatNext = newSegments.join(", ");
  const changed = flatNext.replace(/\s+/g, " ") !== decl.value.replace(/\s+/g, " ");
  if (changed) {
    decl.value = segments.length > 1 || /\n/.test(decl.raws.value ? decl.raws.value.raw : "") ? next : flatNext;
    const d = (flatNext.match(/var\(--sds-duration-/g) || []).length - (decl.value.match(/LEGACY/g) || []).length;
    durationHits += (flatNext.match(/var\(--sds-duration-(instant|fast|base|slow|slower|dramatic)/g) || []).length;
    easingHits += (flatNext.match(/var\(--sds-ease-/g) || []).length;
  }
});

/* Duration modifier classes route through the scale (value-identical) */
const MODIFIER_MAP = {
  ".sds-fast": ["--sds-duration", "var(--sds-duration-fast, 0.4s)"],
  ".sds-normal": ["--sds-duration", "var(--sds-duration-base, 0.8s)"],
  ".sds-slow": ["--sds-duration", "var(--sds-duration-slow, 1.4s)"],
  ".sds-xslow": ["--sds-duration", "var(--sds-duration-slower, 2.2s)"],
};
root.walkRules((rule) => {
  const m = MODIFIER_MAP[rule.selector.trim()];
  if (!m) return;
  rule.walkDecls(m[0], (d) => {
    if (d.value !== m[1]) { d.value = m[1]; modifierHits++; }
  });
});

fs.writeFileSync(file, root.toString());
console.log(`Token refactor applied to src/motion.css`);
console.log(`  duration literals tokenized: ${durationHits}`);
console.log(`  easing literals tokenized:   ${easingHits}`);
console.log(`  modifier classes routed:     ${modifierHits}`);

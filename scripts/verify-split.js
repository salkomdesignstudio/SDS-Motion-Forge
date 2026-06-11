#!/usr/bin/env node
/**
 * SDS Motion Forge — Permanent category-split invariants (Phase 1, CI gate).
 *
 *  1. Partition integrity — no class selector or @keyframes name is defined in
 *     two different category files (zero duplication; the one-time lossless
 *     split proof lives in scripts/split-css.js, which refuses to run twice).
 *  2. Dependency closure — every keyframe referenced anywhere is defined
 *     somewhere in the combined source (known pre-existing anomaly
 *     sds-charOrbitBob is allowlisted; see registry/INVENTORY.md).
 *  3. Entry integrity — src/motion.css imports exactly the seven category
 *     files in the canonical cascade order.
 *  4. Standalone completeness — every dist/categories/{name}.css defines all
 *     keyframes it references and carries :root tokens + the reduced-motion
 *     neutralization block (R5 for standalone consumers).
 */

const fs = require("fs");
const path = require("path");
const postcss = require("postcss");
const { splitTopLevel } = require("./lib/css-model");

const ROOT = path.join(__dirname, "..");
const CAT_DIR = path.join(ROOT, "src", "categories");
const ORDER = ["core", "text", "buttons", "inputs", "cards", "loaders", "scroll"];

/* Pre-existing anomaly in published 4.0.3 — referenced but never defined. */
const KNOWN_MISSING_KEYFRAMES = new Set(["sds-charOrbitBob"]);

let errors = 0;
const fail = (m) => { console.error(`  x ${m}`); errors++; };
const pass = (m) => console.log(`  ok ${m}`);

function animationNames(value) {
  return splitTopLevel(value, ",").map((seg) => {
    const TIMING = /^(linear|ease|ease-in|ease-out|ease-in-out|step-start|step-end|infinite|normal|reverse|alternate|alternate-reverse|forwards|backwards|both|none|running|paused)$/i;
    for (const t of splitTopLevel(seg.replace(/\s+/g, " "), " ")) {
      if (/^[\d.]+m?s$/i.test(t)) continue;
      if (/^cubic-bezier\(|^steps\(|^var\(/i.test(t)) continue;
      if (TIMING.test(t)) continue;
      if (/^[\d.]+$/.test(t)) continue;
      return t;
    }
    return null;
  }).filter(Boolean);
}

function analyzeFile(css) {
  const root = postcss.parse(css);
  const classSels = new Set();
  const kfDefined = new Set();
  const kfReferenced = new Set();
  let hasRootTokens = false;
  let hasReducedMotion = false;
  root.walkAtRules(/^(-webkit-)?keyframes$/, (at) => kfDefined.add(at.params.trim()));
  root.walkAtRules("media", (at) => {
    if (/prefers-reduced-motion/.test(at.params)) hasReducedMotion = true;
  });
  root.walkRules((rule) => {
    if (rule.parent && rule.parent.type === "atrule" && /keyframes/.test(rule.parent.name)) return;
    if (rule.selector.split(",").some((s) => s.trim() === ":root")) {
      rule.walkDecls(/^--sds-duration-base$/, () => { hasRootTokens = true; });
    }
    (rule.selector.match(/\.sds-[a-z0-9-]+/g) || []).forEach((c) => classSels.add(c));
    rule.walkDecls(/^(-webkit-)?animation(-name)?$/, (d) => {
      animationNames(d.value).forEach((n) => kfReferenced.add(n));
    });
  });
  return { classSels, kfDefined, kfReferenced, hasRootTokens, hasReducedMotion };
}

console.log("\n[1/4] Partition integrity (src/categories)...");
const perFile = {};
for (const cat of ORDER) {
  const p = path.join(CAT_DIR, `${cat}.css`);
  if (!fs.existsSync(p)) { fail(`missing src/categories/${cat}.css`); continue; }
  perFile[cat] = analyzeFile(fs.readFileSync(p, "utf8"));
}
{
  const owner = new Map();
  let dups = 0;
  for (const cat of ORDER) {
    for (const kf of perFile[cat].kfDefined) {
      if (owner.has(`kf:${kf}`)) { fail(`@keyframes ${kf} defined in both ${owner.get(`kf:${kf}`)} and ${cat}`); dups++; }
      owner.set(`kf:${kf}`, cat);
    }
  }
  // class selectors may legitimately repeat WITHIN a file (cascade pairs),
  // but never across two files
  const clsOwner = new Map();
  for (const cat of ORDER) {
    for (const cls of perFile[cat].classSels) {
      const prev = clsOwner.get(cls);
      if (prev && prev !== cat) { fail(`class ${cls} appears in both ${prev}.css and ${cat}.css`); dups++; }
      clsOwner.set(cls, cat);
    }
  }
  if (dups === 0) pass(`no class or keyframe is defined in two category files`);
}

console.log("[2/4] Keyframe dependency closure (combined source)...");
{
  const allDefined = new Set();
  const allReferenced = new Set();
  for (const cat of ORDER) {
    perFile[cat].kfDefined.forEach((k) => allDefined.add(k));
    perFile[cat].kfReferenced.forEach((k) => allReferenced.add(k));
  }
  let missing = 0;
  for (const k of allReferenced) {
    if (!allDefined.has(k) && !KNOWN_MISSING_KEYFRAMES.has(k)) {
      fail(`keyframes "${k}" referenced but defined nowhere`);
      missing++;
    }
  }
  if (missing === 0) pass(`all ${allReferenced.size} referenced keyframes resolve (allowlisted anomalies: ${[...KNOWN_MISSING_KEYFRAMES].join(", ")})`);
}

console.log("[3/4] Entry integrity (src/motion.css)...");
{
  const entry = fs.readFileSync(path.join(ROOT, "src", "motion.css"), "utf8");
  const imports = [...entry.matchAll(/@import\s+"\.\/categories\/([a-z]+)\.css"/g)].map((m) => m[1]);
  if (imports.join(",") === ORDER.join(",")) {
    pass("entry imports the 7 category files in canonical order");
  } else {
    fail(`entry import order is [${imports.join(", ")}], expected [${ORDER.join(", ")}]`);
  }
}

console.log("[4/4] Standalone completeness (dist/categories)...");
{
  const distDir = path.join(ROOT, "dist", "categories");
  if (!fs.existsSync(distDir)) {
    console.log("  -- dist/categories not built yet (run npm run build:categories) — skipped");
  } else {
    for (const cat of ORDER.filter((c) => c !== "core")) {
      const p = path.join(distDir, `${cat}.css`);
      if (!fs.existsSync(p)) { fail(`missing dist/categories/${cat}.css`); continue; }
      const a = analyzeFile(fs.readFileSync(p, "utf8"));
      const unresolved = [...a.kfReferenced].filter((k) => !a.kfDefined.has(k) && !KNOWN_MISSING_KEYFRAMES.has(k));
      if (unresolved.length) fail(`${cat}.css standalone is missing keyframes: ${unresolved.join(", ")}`);
      else if (!a.hasRootTokens) fail(`${cat}.css standalone lacks :root token block`);
      else if (!a.hasReducedMotion) fail(`${cat}.css standalone lacks reduced-motion block (R5)`);
      else pass(`${cat}.css standalone: keyframes closed, tokens present, reduced-motion present`);
    }
  }
}

console.log("");
if (errors > 0) {
  console.error(`verify-split: ${errors} error(s).`);
  process.exit(1);
}
console.log("verify-split: all invariants hold.");

#!/usr/bin/env node
/**
 * SDS Motion Forge — Phase 1 one-time category split (kept for audit).
 *
 * Splits the src/motion.css monolith into src/categories/{core,text,buttons,
 * inputs,cards,loaders,scroll}.css and rewrites src/motion.css as a thin
 * @import entry (inlined at build time by postcss-import).
 *
 * LOSSLESS BY CONSTRUCTION + VERIFIED BEFORE WRITING:
 *  - Every top-level node of the monolith is assigned to exactly one bucket,
 *    preserving source order inside each bucket.
 *  - The one cross-category rule (the GPU will-change hint list) is split by
 *    selector into per-category fragments appended at each category's END, so
 *    it still cascades AFTER each class's own will-change declaration.
 *  - The interactive tail block stays in text.css *after* Section 1, so the
 *    duplicated .sds-ink-bleed / .sds-char-orbit declarations keep their
 *    published cascade order.
 *  - Order-sensitive infrastructure ([data-sds-scroll] gate vs .sds-scroll-auto
 *    @supports, [data-sds] trio) travels as one unit inside core.css.
 *  - Before any file is written, the script explodes both the monolith and the
 *    planned recombination into selector -> ordered declaration occurrences and
 *    keyframe maps, and aborts on ANY difference (zero missing, zero duplicated,
 *    per-selector occurrence order preserved).
 */

const fs = require("fs");
const path = require("path");
const postcss = require("postcss");

const ROOT = path.join(__dirname, "..");
const SRC = path.join(ROOT, "src", "motion.css");
const OUT_DIR = path.join(ROOT, "src", "categories");

const monolith = fs.readFileSync(SRC, "utf8");
const root = postcss.parse(monolith);
if (root.nodes.some((n) => n.type === "atrule" && n.name === "import")) {
  console.error("src/motion.css already contains @import rules — split appears to be done.");
  process.exit(1);
}

const CATEGORIES = ["core", "text", "buttons", "inputs", "cards", "loaders", "scroll"];
const buckets = Object.fromEntries(CATEGORIES.map((c) => [c, []]));

/* per-category fragments of the GPU hints rule, appended at category end */
const gpuFragments = Object.fromEntries(CATEGORIES.map((c) => [c, []]));

function categoryOfSelector(sel) {
  const m = sel.match(/\.sds-([a-z]+)/);
  const cls = sel.match(/\.(sds-[a-z0-9-]+)/);
  if (!cls) return "core";
  const name = cls[1];
  if (/^sds-btn-/.test(name)) return "buttons";
  if (/^sds-input-/.test(name)) return "inputs";
  if (/^sds-card-/.test(name)) return "cards";
  if (/^sds-loader-/.test(name)) return "loaders";
  if (/^sds-scroll-/.test(name)) return "scroll";
  return "text";
}

/* ── section state machine over top-level nodes ──────────────── */
let section = "core"; // preamble (header + :root) goes to core
let pendingComment = null; // section-divider comment waiting to be attached

const SECTION_MAP = [
  [/SECTION 1 — TEXT/, "text"],
  [/SECTION 2 — BUTTON/, "buttons"],
  [/SECTION 3 — INPUT/, "inputs"],
  [/SECTION 4 — CARD/, "cards"],
  [/SECTION 5 — LOADER/, "loaders"],
  [/SECTION 6 — SCROLL/, "scroll"],
  [/LEGACY ALIASES/, "legacy"],
  [/GPU COMPOSITING/, "gpu"],
  [/ACCESSIBILITY — REDUCED MOTION/, "core"],
  [/UTILITY MODIFIERS/, "core"],
  [/SCROLL ANIMATION ACTIVATION/, "core"],
  [/SCROLL GATE — sds-scroll\.js/, "core"],
  [/INTERACTIVE ANIMATION BASE RULES/, "text"],
];

const nodes = root.nodes.slice();
for (const node of nodes) {
  if (node.type === "comment") {
    for (const [re, sec] of SECTION_MAP) {
      if (re.test(node.text)) { section = sec; break; }
    }
    if (section === "gpu") continue; // drop the GPU banner; fragments get their own
    if (section === "legacy") { continue; } // aliases get per-category banners
    buckets[section === "legacy" ? "core" : section].push(node);
    continue;
  }

  if (section === "gpu") {
    if (node.type === "rule") {
      // split the selector list per category
      const bySel = {};
      for (const sel of node.selector.split(",").map((s) => s.trim())) {
        const cat = categoryOfSelector(sel);
        (bySel[cat] = bySel[cat] || []).push(sel);
      }
      for (const [cat, sels] of Object.entries(bySel)) {
        const clone = node.clone();
        clone.selector = sels.join(",\n");
        gpuFragments[cat].push(clone);
      }
    } else {
      buckets.core.push(node);
    }
    continue;
  }

  if (section === "legacy") {
    if (node.type === "rule") {
      buckets[categoryOfSelector(node.selector)].push(markLegacy(node));
    } else {
      buckets.core.push(node);
    }
    continue;
  }

  buckets[section].push(node);
}

function markLegacy(node) {
  const clone = node.clone();
  return clone;
}

/* append GPU fragments at each category's end (cascade-preserving) */
for (const cat of CATEGORIES) {
  if (gpuFragments[cat].length) {
    buckets[cat].push(postcss.comment({
      text: ` GPU compositing hints (${cat}) — split from the global will-change rule; must stay after the class definitions above `,
    }));
    buckets[cat].push(...gpuFragments[cat]);
  }
}

/* ── lossless verification BEFORE writing ────────────────────── */
function explode(css) {
  const r = postcss.parse(css);
  const selectors = new Map(); // "context|selector" -> [ [prop:value!imp, ...] per occurrence ]
  const keyframes = new Map(); // "name" -> canonical frames string
  r.walkAtRules(/^(-webkit-)?keyframes$/, (at) => {
    const frames = [];
    at.walkRules((rule) => {
      const decls = [];
      rule.walkDecls((d) => decls.push(`${d.prop}:${d.value.replace(/\s+/g, " ")}`));
      frames.push(`${rule.selector.replace(/\s+/g, "")}{${decls.join(";")}}`);
    });
    const key = `${at.name}:${at.params.trim()}`;
    if (keyframes.has(key)) keyframes.set(key, keyframes.get(key) + " ||DUP|| " + frames.join(" "));
    else keyframes.set(key, frames.join(" "));
  });
  r.walkRules((rule) => {
    if (rule.parent && rule.parent.type === "atrule" && /keyframes/.test(rule.parent.name)) return;
    let ctx = "";
    let p = rule.parent;
    while (p && p.type === "atrule") { ctx = `@${p.name} ${p.params} / ` + ctx; p = p.parent; }
    const decls = [];
    rule.walkDecls((d) => decls.push(`${d.prop}:${d.value.replace(/\s+/g, " ")}${d.important ? "!i" : ""}`));
    for (const sel of rule.selector.split(",").map((s) => s.replace(/\s+/g, " ").trim())) {
      const key = ctx + sel;
      if (!selectors.has(key)) selectors.set(key, []);
      selectors.get(key).push(decls.join(";"));
    }
  });
  return { selectors, keyframes };
}

const recombined = CATEGORIES.map((c) =>
  buckets[c].map((n) => n.toString()).join("\n")
).join("\n");

const a = explode(monolith);
const b = explode(recombined);

let errors = 0;
for (const [key, occA] of a.selectors) {
  const occB = b.selectors.get(key);
  if (!occB) { console.error(`MISSING selector after split: ${key}`); errors++; continue; }
  if (occA.join("\n@@\n") !== occB.join("\n@@\n")) {
    console.error(`DECL/ORDER mismatch for selector: ${key}`);
    errors++;
  }
}
for (const key of b.selectors.keys()) {
  if (!a.selectors.has(key)) { console.error(`EXTRA selector after split: ${key}`); errors++; }
}
for (const [key, valA] of a.keyframes) {
  const valB = b.keyframes.get(key);
  if (valB === undefined) { console.error(`MISSING keyframes after split: ${key}`); errors++; }
  else if (valA !== valB) { console.error(`KEYFRAMES content mismatch: ${key}`); errors++; }
}
for (const key of b.keyframes.keys()) {
  if (!a.keyframes.has(key)) { console.error(`EXTRA keyframes after split: ${key}`); errors++; }
}
if (errors > 0) {
  console.error(`\nSplit verification FAILED with ${errors} error(s). Nothing written.`);
  process.exit(1);
}
console.log(`Split verified lossless: ${a.selectors.size} selectors, ${a.keyframes.size} keyframes — zero missing, zero duplicated, order preserved.`);

/* ── write category files + entry ────────────────────────────── */
fs.mkdirSync(OUT_DIR, { recursive: true });

const FILE_HEADERS = {
  core: "Core — design tokens, utility modifiers, reduced-motion neutralization,\n * and scroll-gate infrastructure shared by every category.",
  text: "Text animations (Section 1) + interactive base rules.",
  buttons: "Button animations (Section 2).",
  inputs: "Input animations (Section 3).",
  cards: "Card animations (Section 4).",
  loaders: "Loader animations (Section 5).",
  scroll: "Scroll / viewport animations (Section 6) + scroll legacy alias.",
};

for (const cat of CATEGORIES) {
  const body = buckets[cat].map((n) => n.toString()).join("\n\n");
  const header = `/*!\n * SDS Motion Forge — ${cat}.css\n * ${FILE_HEADERS[cat]}\n * Part of the lossless v5 category split — combined entry: src/motion.css\n */\n\n`;
  fs.writeFileSync(path.join(OUT_DIR, `${cat}.css`), header + body + "\n");
  console.log(`  wrote src/categories/${cat}.css (${Math.round((header + body).length / 1024)} KB, ${buckets[cat].length} nodes)`);
}

const entry = `/**
 * SDS Motion Forge — combined entry.
 * The library source lives in src/categories/ (lossless v5 split).
 * postcss-import inlines these in order at build time, producing a
 * dist/motion.css equivalent to the pre-split monolith.
 *
 * Import order is part of the cascade contract — do not reorder.
 */
@import "./categories/core.css";
@import "./categories/text.css";
@import "./categories/buttons.css";
@import "./categories/inputs.css";
@import "./categories/cards.css";
@import "./categories/loaders.css";
@import "./categories/scroll.css";
`;
fs.writeFileSync(SRC, entry);
console.log("  rewrote src/motion.css as @import entry");
console.log("Done. Next: npm run build && npm run verify:published");

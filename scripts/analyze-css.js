#!/usr/bin/env node
/**
 * SDS Motion Forge — CSS Analyzer / Inventory Generator
 *
 * Parses a motion.css file with PostCSS and emits a structured JSON
 * inventory: every .sds-* class, its category, animation shorthand
 * parts (names, durations, easings, delays, fill modes, iterations),
 * keyframes defined/referenced, custom properties consumed, and a
 * compositor-safety verdict per keyframe block.
 *
 * Usage: node scripts/analyze-css.js [input.css] [output.json]
 * Defaults: src/motion.css -> registry/inventory.json
 */

const fs = require("fs");
const path = require("path");
const postcss = require("postcss");

const ROOT = path.join(__dirname, "..");
const inputPath = process.argv[2] || path.join(ROOT, "src", "motion.css");
const outputPath = process.argv[3] || path.join(ROOT, "registry", "inventory.json");

// Since the Phase 1 split, src/motion.css is an @import entry — inline the
// category files synchronously, in entry order.
let css = fs.readFileSync(inputPath, "utf8");
const importMatches = [...css.matchAll(/@import\s+"(\.\/categories\/[a-z]+\.css)";?/g)];
if (importMatches.length) {
  css = importMatches
    .map((m) => fs.readFileSync(path.join(path.dirname(inputPath), m[1]), "utf8"))
    .join("\n");
}
const root = postcss.parse(css);

/* Properties that only touch the compositor (with opacity). */
const COMPOSITOR_SAFE_PROPS = new Set([
  "transform", "-webkit-transform",
  "opacity",
  "filter", "-webkit-filter",
  "backdrop-filter", "-webkit-backdrop-filter",
  "clip-path", "-webkit-clip-path",
  "translate", "rotate", "scale",
  "offset-distance", "offset-path", "offset-rotate",
  "animation-timing-function", /* allowed inside keyframes */
]);

/* Properties that are visual-only (paint, no layout) — flagged separately. */
const PAINT_ONLY_PROPS = new Set([
  "box-shadow", "-webkit-box-shadow",
  "text-shadow",
  "background", "background-color", "background-position", "background-size", "background-image",
  "border-color", "border-top-color", "border-right-color", "border-bottom-color", "border-left-color",
  "outline-color", "color", "caret-color",
  "visibility",
]);

/* Everything else animated => layout-triggering. */

const TIMING_KEYWORDS = new Set([
  "linear", "ease", "ease-in", "ease-out", "ease-in-out", "step-start", "step-end",
]);
const FILL_MODES = new Set(["none", "forwards", "backwards", "both"]);
const DIRECTIONS = new Set(["normal", "reverse", "alternate", "alternate-reverse"]);
const PLAY_STATES = new Set(["running", "paused"]);

/* ── Collect keyframes ───────────────────────────────────────── */
const keyframes = {}; // name -> { props: Set, customProps: Set, frames: count }
root.walkAtRules(/^(-webkit-)?keyframes$/, (at) => {
  const name = at.params.trim();
  const entry = keyframes[name] || { props: new Set(), customPropsUsed: new Set(), frames: 0 };
  at.walkRules((r) => {
    entry.frames += 1;
    r.walkDecls((d) => {
      entry.props.add(d.prop.toLowerCase());
      collectVars(d.value, entry.customPropsUsed);
    });
  });
  keyframes[name] = entry;
});

function collectVars(value, set) {
  const re = /var\(\s*(--[a-zA-Z0-9-_]+)/g;
  let m;
  while ((m = re.exec(value))) set.add(m[1]);
}

function keyframeSafety(entry) {
  const layout = [];
  const paint = [];
  for (const p of entry.props) {
    if (p.startsWith("--")) continue; // custom property animation — treated as safe carrier
    if (COMPOSITOR_SAFE_PROPS.has(p)) continue;
    if (PAINT_ONLY_PROPS.has(p)) { paint.push(p); continue; }
    layout.push(p);
  }
  return {
    compositorSafe: layout.length === 0 && paint.length === 0,
    paintProps: paint.sort(),
    layoutProps: layout.sort(),
  };
}

/* ── Parse animation shorthand ───────────────────────────────── */
function splitTopLevel(value, sep) {
  const parts = [];
  let depth = 0, cur = "";
  for (const ch of value) {
    if (ch === "(") depth++;
    if (ch === ")") depth--;
    if (ch === sep && depth === 0) { parts.push(cur.trim()); cur = ""; }
    else cur += ch;
  }
  if (cur.trim()) parts.push(cur.trim());
  return parts;
}

function parseAnimationShorthand(value) {
  // returns array of { name, duration, easing, delay, iterations, direction, fill, playState, raw }
  return splitTopLevel(value, ",").map((single) => {
    const tokens = splitTopLevel(single.replace(/\s+/g, " "), " ");
    const out = { name: null, duration: null, easing: null, delay: null, iterations: null, direction: null, fill: null, playState: null, raw: single };
    const times = [];
    for (const t of tokens) {
      const lower = t.toLowerCase();
      if (/^[\d.]+m?s$/.test(lower) || /^var\(--[a-z0-9-]+/.test(lower) && /duration/.test(lower)) {
        times.push(t);
      } else if (lower.startsWith("cubic-bezier(") || lower.startsWith("steps(") || TIMING_KEYWORDS.has(lower)) {
        out.easing = t;
      } else if (lower.startsWith("var(")) {
        // var() could be duration or easing token; classify by name
        if (/easing|ease/.test(lower)) out.easing = t;
        else times.push(t);
      } else if (FILL_MODES.has(lower)) {
        out.fill = lower;
      } else if (DIRECTIONS.has(lower)) {
        out.direction = lower;
      } else if (PLAY_STATES.has(lower)) {
        out.playState = lower;
      } else if (lower === "infinite" || /^[\d.]+$/.test(lower)) {
        out.iterations = lower;
      } else if (lower !== "none") {
        out.name = t;
      }
    }
    if (times.length > 0) out.duration = times[0];
    if (times.length > 1) out.delay = times[1];
    return out;
  });
}

/* ── Categorize a class name ─────────────────────────────────── */
function categorize(cls) {
  if (/^sds-btn-/.test(cls)) return "buttons";
  if (/^sds-input-/.test(cls)) return "inputs";
  if (/^sds-card-/.test(cls)) return "cards";
  if (/^sds-loader-/.test(cls)) return "loaders";
  if (/^sds-scroll-/.test(cls)) return "scroll";
  if (/^sds-(delay-|fast$|slow$|xslow$|normal$|loop$|alt$|once$|fill-|pause-hover$)/.test(cls)) return "modifiers";
  if (["sds-play", "sds-in", "sds-js", "sds-scroll-auto", "sds-char"].includes(cls)) return "infrastructure";
  if (["sds-word-morph", "sds-jelly-hover", "sds-scatter-return", "sds-shockwave", "sds-spring-kerning", "sds-magnetic-pull", "sds-repulsion-field"].includes(cls)) return "interactive";
  return "text";
}

/* ── Walk rules, group by primary class ──────────────────────── */
const classes = {}; // cls -> data
const allSelectors = new Set();

root.walkRules((rule) => {
  if (rule.parent && rule.parent.type === "atrule" && /keyframes/.test(rule.parent.name)) return;
  const inReducedMotion = !!(rule.parent && rule.parent.type === "atrule" &&
    rule.parent.name === "media" && /prefers-reduced-motion/.test(rule.parent.params));
  const inSupports = !!(rule.parent && rule.parent.type === "atrule" && rule.parent.name === "supports");

  const selector = rule.selector;
  const clsMatches = selector.match(/\.sds-[a-z0-9-]+/g) || [];
  clsMatches.forEach((c) => allSelectors.add(c.slice(1)));
  if (clsMatches.length === 0) return;
  const primary = clsMatches[0].slice(1);

  const entry = classes[primary] || {
    name: primary,
    category: categorize(primary),
    selectors: [],
    animations: [],
    customPropsUsed: new Set(),
    customPropsSet: new Set(),
    staticProps: new Set(),
    targetsChildren: false,
    usesPseudoElements: false,
    triggerHints: new Set(),
  };

  entry.selectors.push(selector);
  if (/>\s*\*|>\s*span|\.sds-char/.test(selector) && !selector.startsWith(".sds-char")) entry.targetsChildren = true;
  if (/::before|::after|::placeholder/.test(selector)) entry.usesPseudoElements = true;
  if (/:hover/.test(selector)) entry.triggerHints.add("hover");
  if (/:focus/.test(selector)) entry.triggerHints.add("focus");

  rule.walkDecls((d) => {
    collectVars(d.value, entry.customPropsUsed);
    if (d.prop.startsWith("--")) entry.customPropsSet.add(d.prop);
    else entry.staticProps.add(d.prop.toLowerCase());
    if (!inReducedMotion && !inSupports) {
      if (d.prop === "animation" || d.prop === "-webkit-animation") {
        entry.animations.push(...parseAnimationShorthand(d.value).map((a) => ({ ...a, selector })));
      } else if (d.prop === "animation-name") {
        splitTopLevel(d.value, ",").forEach((n) => entry.animations.push({ name: n.trim(), selector }));
      }
    }
  });

  classes[primary] = entry;
});

/* ── Resolve per-class keyframe info & safety ────────────────── */
const inventory = [];
const definedKeyframes = new Set(Object.keys(keyframes));
const referencedKeyframes = new Set();

for (const cls of Object.keys(classes).sort()) {
  const e = classes[cls];
  const kfNames = [...new Set(e.animations.map((a) => a.name).filter(Boolean))];
  kfNames.forEach((n) => referencedKeyframes.add(n));

  let compositorSafe = true;
  const paintProps = new Set();
  const layoutProps = new Set();
  const missingKeyframes = [];
  for (const n of kfNames) {
    const kf = keyframes[n];
    if (!kf) { missingKeyframes.push(n); continue; }
    const s = keyframeSafety(kf);
    if (!s.compositorSafe) compositorSafe = false;
    s.paintProps.forEach((p) => paintProps.add(p));
    s.layoutProps.forEach((p) => layoutProps.add(p));
    kf.customPropsUsed.forEach((v) => e.customPropsUsed.add(v));
  }

  inventory.push({
    name: cls,
    category: e.category,
    selectors: e.selectors,
    keyframes: kfNames,
    missingKeyframes,
    animations: e.animations.map(({ selector, raw, ...rest }) => rest),
    customPropsUsed: [...e.customPropsUsed].sort(),
    customPropsSet: [...e.customPropsSet].sort(),
    compositorSafe,
    animatedPaintProps: [...paintProps].sort(),
    animatedLayoutProps: [...layoutProps].sort(),
    targetsChildren: e.targetsChildren,
    usesPseudoElements: e.usesPseudoElements,
    triggerHints: [...e.triggerHints].sort(),
    hasAnimation: e.animations.length > 0,
  });
}

const unusedKeyframes = [...definedKeyframes].filter((k) => !referencedKeyframes.has(k)).sort();
const undefinedKeyframes = [...referencedKeyframes].filter((k) => !definedKeyframes.has(k)).sort();

/* keyframe-level detail */
const keyframeDetail = {};
for (const [name, kf] of Object.entries(keyframes)) {
  const s = keyframeSafety(kf);
  keyframeDetail[name] = {
    frames: kf.frames,
    props: [...kf.props].sort(),
    compositorSafe: s.compositorSafe,
    paintProps: s.paintProps,
    layoutProps: s.layoutProps,
    referenced: referencedKeyframes.has(name),
  };
}

/* duration / easing frequency (for token derivation) */
const durationFreq = {};
const easingFreq = {};
for (const item of inventory) {
  for (const a of item.animations) {
    if (a.duration) durationFreq[a.duration] = (durationFreq[a.duration] || 0) + 1;
    if (a.easing) easingFreq[a.easing] = (easingFreq[a.easing] || 0) + 1;
  }
}

const summary = {
  source: path.relative(ROOT, inputPath),
  generatedAt: new Date().toISOString(),
  totals: {
    classes: inventory.length,
    keyframesDefined: definedKeyframes.size,
    keyframesReferenced: referencedKeyframes.size,
    unusedKeyframes,
    undefinedKeyframes,
  },
  byCategory: inventory.reduce((acc, i) => { acc[i.category] = (acc[i.category] || 0) + 1; return acc; }, {}),
  compositorUnsafe: inventory.filter((i) => !i.compositorSafe).map((i) => ({
    name: i.name, paint: i.animatedPaintProps, layout: i.animatedLayoutProps,
  })),
  durationFrequency: Object.fromEntries(Object.entries(durationFreq).sort((a, b) => b[1] - a[1])),
  easingFrequency: Object.fromEntries(Object.entries(easingFreq).sort((a, b) => b[1] - a[1])),
};

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, JSON.stringify({ summary, classes: inventory, keyframes: keyframeDetail }, null, 2));

console.log(`Inventory written to ${path.relative(ROOT, outputPath)}`);
console.log(`Classes: ${inventory.length}`);
console.log(`By category:`, summary.byCategory);
console.log(`Keyframes defined: ${definedKeyframes.size}, referenced: ${referencedKeyframes.size}`);
if (undefinedKeyframes.length) console.log(`UNDEFINED keyframes (referenced but missing):`, undefinedKeyframes);
if (unusedKeyframes.length) console.log(`Unused keyframes:`, unusedKeyframes);
console.log(`Compositor-unsafe classes: ${summary.compositorUnsafe.length}`);

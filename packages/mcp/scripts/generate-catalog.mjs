// Generates packages/mcp/catalog/catalog.json from the repo's own build outputs:
//   dist/motion.css                (the real CSS: durations, easings, keyframes)
//   registry/motion.registry.json  (names, categories, flags)
//   docs/docs-data.js              (curated snippets and demo markup)
// The server reads only catalog.json at runtime: no network, no CSS parsing, fast start.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import postcss from "postcss";
import {
  channelsFromDecls, familyOf, familyOfCssProp, parseEasing, parseTimeMs, resolveVars,
  splitSpaces, splitTop, looksLikeEasing,
} from "../src/shared/css-values.js";

const require = createRequire(import.meta.url);
const HERE = path.dirname(fileURLToPath(import.meta.url));
const PKG = path.resolve(HERE, "..");
const ROOT = path.resolve(PKG, "..", "..");
export const CATALOG_SCHEMA_VERSION = 1;

const registry = JSON.parse(fs.readFileSync(path.join(ROOT, "registry", "motion.registry.json"), "utf8"));
const rootPkg = JSON.parse(fs.readFileSync(path.join(ROOT, "package.json"), "utf8"));
const cssText = fs.readFileSync(path.join(ROOT, "dist", "motion.css"), "utf8");
const docs = (() => {
  const t = fs.readFileSync(path.join(ROOT, "docs", "docs-data.js"), "utf8");
  return JSON.parse(t.slice(t.indexOf("{"), t.lastIndexOf("}") + 1));
})();

const siteLib = require(path.join(ROOT, "scripts", "docs", "site-lib.js"));
const root = postcss.parse(cssText);

/* ── custom properties from :root and modifier rules ─────────────── */
const vars = {};
root.walkRules((rule) => {
  if (rule.selector.trim() === ":root") rule.walkDecls(/^--/, (d) => { vars[d.prop] = d.value; });
});

/* ── keyframes: name -> [{offset, ch, other}] ───────────────────── */
const keyframes = new Map();
root.walkAtRules("keyframes", (at) => {
  const stops = [];
  at.walkRules((r) => {
    const decls = {};
    r.walkDecls((d) => { decls[d.prop] = resolveVars(d.value, vars); });
    const { ch, other } = channelsFromDecls(decls);
    for (const sel of r.selector.split(",")) {
      const s = sel.trim().toLowerCase();
      const offset = s === "from" ? 0 : s === "to" ? 1 : parseFloat(s) / 100;
      if (Number.isFinite(offset)) stops.push({ offset, ch, other });
    }
  });
  stops.sort((a, b) => a.offset - b.offset);
  keyframes.set(at.params.trim(), stops);
});

/* ── rules by selector ──────────────────────────────────────────── */
/** selector (single, trimmed) -> merged declarations (last wins; !important kept out of the key) */
const rulesBySelector = new Map();
root.walkRules((rule) => {
  if (rule.parent && rule.parent.type === "atrule" && /keyframes/.test(rule.parent.name)) return;
  const inMedia = rule.parent && rule.parent.type === "atrule" ? rule.parent.params : "";
  if (/prefers-reduced-motion/.test(inMedia)) return; // reduced-motion overrides are not the effect
  for (const sel of splitTop(rule.selector, ",")) {
    const key = sel.trim();
    if (!rulesBySelector.has(key)) rulesBySelector.set(key, {});
    const target = rulesBySelector.get(key);
    rule.walkDecls((d) => { target[d.prop] = d.value; });
  }
});

/* ── animation shorthand ────────────────────────────────────────── */
const FILLS = new Set(["none", "forwards", "backwards", "both"]);
const DIRS = new Set(["normal", "reverse", "alternate", "alternate-reverse"]);
const STATES = new Set(["running", "paused"]);

function parseAnimationShorthand(value) {
  const layers = splitTop(resolveVars(value, vars), ",");
  return layers.map((layer) => {
    const out = { name: null, durationMs: null, delayMs: null, easing: null, easingRaw: null, iterations: null, fill: null, direction: null };
    let timesSeen = 0;
    for (const tok of splitSpaces(layer.replace(/!important/gi, ""))) {
      const t = tok.toLowerCase();
      const time = parseTimeMs(t);
      if (time !== null) {
        if (timesSeen === 0) out.durationMs = time; else out.delayMs = time;
        timesSeen++;
      } else if (looksLikeEasing(t)) {
        out.easingRaw = tok;
        out.easing = parseEasing(tok);
      } else if (t === "infinite") out.iterations = "infinite";
      else if (/^\d*\.?\d+$/.test(t)) out.iterations = parseFloat(t);
      else if (FILLS.has(t) && t !== "none") out.fill = t;
      else if (DIRS.has(t) && t !== "normal") out.direction = t;
      else if (STATES.has(t)) { /* ignore */ }
      else if (t === "none") { /* animation: none */ }
      else out.name = tok;
    }
    return out;
  });
}

function animationFromDecls(decls) {
  if (!decls) return null;
  let layers = null;
  if (decls.animation) layers = parseAnimationShorthand(decls.animation);
  const longhand = (prop) => (decls[prop] ? resolveVars(decls[prop], vars) : null);
  const ln = longhand("animation-name");
  if (ln) layers = ln.split(",").map((n) => ({ name: n.trim(), durationMs: null, delayMs: null, easing: null, easingRaw: null, iterations: null, fill: null, direction: null }));
  if (!layers) return null;
  const dur = longhand("animation-duration");
  const del = longhand("animation-delay");
  const ease = longhand("animation-timing-function");
  const iter = longhand("animation-iteration-count");
  const fill = longhand("animation-fill-mode");
  const dir = longhand("animation-direction");
  layers.forEach((l, i) => {
    const pick = (s) => { const p = s ? splitTop(s, ",") : []; return p[i] ?? p[0] ?? null; };
    if (dur && pick(dur)) l.durationMs = parseTimeMs(pick(dur));
    if (del && pick(del)) l.delayMs = parseTimeMs(pick(del));
    if (ease && pick(ease)) { l.easingRaw = pick(ease); l.easing = parseEasing(pick(ease)); }
    if (iter && pick(iter)) l.iterations = pick(iter) === "infinite" ? "infinite" : parseFloat(pick(iter));
    if (fill && pick(fill)) l.fill = pick(fill);
    if (dir && pick(dir)) l.direction = pick(dir);
  });
  return layers.filter((l) => l.name && l.name !== "none");
}

/** keyframe declarations that do not change how the element looks or moves */
const NOT_VISUAL = /^(--|will-change|transform-origin|transform-style|perspective|backface-visibility|pointer-events|visibility|z-index|content|display|animation-|transition|cursor|mix-blend-mode|isolation|contain|overflow|position)/;

/* ── per-class analysis ─────────────────────────────────────────── */
function selectorsFor(cls) {
  const exact = `.${cls}`;
  const own = [];
  const child = [];
  const pseudo = [];
  for (const sel of rulesBySelector.keys()) {
    // only compound selectors that start with the class
    if (!sel.startsWith(exact)) continue;
    const rest = sel.slice(exact.length);
    if (rest === "") own.push(sel);
    else if (/^[\s>+~]/.test(rest)) child.push(sel);
    else if (/^(::?[a-z-]+|\.[a-z])/i.test(rest) && !/^\.[a-z0-9_-]+/i.test(rest)) pseudo.push(sel);
    else if (/^:(hover|focus|active|focus-visible|focus-within|checked)/.test(rest)) pseudo.push(sel);
    else if (rest.startsWith("::")) pseudo.push(sel);
  }
  return { own, child, pseudo };
}

function stateOf(sel) {
  const m = /:(hover|focus-visible|focus-within|focus|active|checked)/.exec(sel);
  return m ? m[1] : null;
}

function analyse(entry) {
  const cls = entry.name;
  const { own, child, pseudo } = selectorsFor(cls);
  const layers = [];
  /** @type {Array<{via:string, layer:any}>} */
  const found = [];
  for (const sel of own) {
    const ls = animationFromDecls(rulesBySelector.get(sel));
    if (ls) ls.forEach((l) => found.push({ via: "self", layer: l, sel }));
  }
  if (!found.length) {
    for (const sel of child) {
      const ls = animationFromDecls(rulesBySelector.get(sel));
      if (ls) ls.forEach((l) => found.push({ via: /\.sds-char|\.sds-word|span/.test(sel) ? "chars" : "children", layer: l, sel }));
    }
  }
  const pseudoFound = [];
  for (const sel of pseudo) {
    const ls = animationFromDecls(rulesBySelector.get(sel));
    if (ls) ls.forEach((l) => pseudoFound.push({ sel, state: stateOf(sel), layer: l }));
  }
  // transitions (interaction states) on own/pseudo selectors
  let transition = null;
  for (const sel of [...own, ...pseudo]) {
    const d = rulesBySelector.get(sel);
    if (d && d.transition) {
      const first = splitTop(resolveVars(d.transition, vars), ",")[0];
      const toks = splitSpaces(first);
      const ms = toks.map(parseTimeMs).filter((x) => x !== null);
      const easingTok = toks.find(looksLikeEasing);
      transition = { property: toks[0], durationMs: ms[0] ?? null, easing: easingTok ? parseEasing(easingTok) : null };
      break;
    }
  }

  const primary = found[0] || (pseudoFound[0] ? { via: "state", layer: pseudoFound[0].layer, sel: pseudoFound[0].sel } : null);
  const kfNames = [...new Set([...found, ...pseudoFound].map((f) => f.layer.name))].filter((n) => keyframes.has(n));
  const kfName = primary && keyframes.has(primary.layer.name) ? primary.layer.name : kfNames[0] || null;
  const stops = kfName ? keyframes.get(kfName) : [];

  const families = new Set();
  const other = new Set();
  const channelRange = {}; // channel -> [min, max, first, last]
  for (const s of stops) {
    for (const [k, v] of Object.entries(s.ch)) {
      families.add(familyOf(k));
      const r = channelRange[k] || (channelRange[k] = { min: v, max: v, first: v, last: v });
      r.min = Math.min(r.min, v); r.max = Math.max(r.max, v); r.last = v;
    }
    for (const o of s.other) {
      if (NOT_VISUAL.test(o)) continue;
      other.add(o);
      families.add(familyOfCssProp(o));
    }
  }
  // registry's own declared props are the safety net when keyframes are indirect (JS physics etc.)
  for (const p of [...entry.animatedProps, ...entry.animatedPaintProps, ...entry.animatedLayoutProps]) {
    if (p === "opacity") families.add("opacity");
    else if (p === "transform") { if (!stops.length) families.add("transform"); }
    else if (p === "filter") { if (!families.has("blur")) families.add("filter"); }
    else families.add(familyOfCssProp(p));
  }
  // first/last explicit stops: what the element animates from and to
  const first = stops[0], last = stops[stops.length - 1];
  const from = first ? first.ch : {};
  const to = last ? last.ch : {};

  const layer = primary ? primary.layer : null;
  const loop = layer ? layer.iterations === "infinite" : !!entry.loop;
  return {
    via: primary ? primary.via : "none",
    keyframe: kfName,
    durationMs: layer ? layer.durationMs : transition ? transition.durationMs : null,
    delayMs: layer ? layer.delayMs : null,
    easing: layer && layer.easing ? layer.easing : transition ? transition.easing : null,
    easingRaw: layer ? layer.easingRaw : null,
    iterations: layer ? layer.iterations : null,
    fill: layer ? layer.fill : null,
    direction: layer ? layer.direction : null,
    loop,
    stopCount: stops.length,
    stops: stops.map((s) => ({ o: s.offset, ...s.ch })),
    from, to,
    ranges: channelRange,
    families: [...families].sort(),
    otherProps: [...other].sort(),
    states: [...new Set(pseudoFound.map((p) => p.state).filter(Boolean))],
    transition,
    keyframeCount: kfNames.length,
  };
}

/* ── snippets and markup from docs-data ─────────────────────────── */
const reducedMotionNote = "Motion Forge's CSS already includes a prefers-reduced-motion override; it applies automatically to every class.";

function modifiersFrom(registryClasses) {
  const out = [];
  for (const c of registryClasses.filter((x) => x.kind === "modifier")) {
    const sel = `.${c.name}`;
    const d = rulesBySelector.get(sel) || {};
    const o = { name: c.name, description: c.description };
    if (d["animation-delay"]) o.delayMs = parseTimeMs(d["animation-delay"].replace(/!important/i, "").trim());
    const dur = d["--sds-duration"] && resolveVars(d["--sds-duration"], vars);
    if (dur) o.durationMs = parseTimeMs(dur.trim());
    if (d["animation-iteration-count"] && /infinite/.test(d["animation-iteration-count"])) o.loop = true;
    out.push(o);
  }
  return out.sort((a, b) => a.name.localeCompare(b.name));
}

function trimCode(s, max = 2400) {
  if (typeof s !== "string") return null;
  return s.length > max ? s.slice(0, max) + "\n/* … truncated … */" : s;
}

/* ── assemble ───────────────────────────────────────────────────── */
const entries = [];
const classes = registry.classes.filter((c) => c.kind !== "modifier");
for (const c of classes) {
  const a = analyse(c);
  const markup = docs.markup[c.name] || null;
  const how = (docs.how && docs.how[c.name]) || null;
  entries.push({
    name: c.name,
    displayName: c.displayName,
    category: c.category,
    kind: c.kind,
    description: c.description,
    how: how ? how.replace(/\s+/g, " ").slice(0, 400) : null,
    trigger: c.trigger,
    loop: a.loop,
    aliasOf: c.aliasOf,
    deprecated: !!c.deprecated,
    sinceVersion: c.sinceVersion,
    requires: {
      charSplit: !!c.requiresCharSplit,
      children: !!c.requiresChildren,
      inputWrap: !!c.inputWrap,
      js: !!c.requiresJs,
      jsEngine: c.jsEngine || null,
    },
    compositorSafe: !!c.compositorSafe,
    motion: {
      via: a.via,
      keyframe: a.keyframe,
      durationMs: a.durationMs,
      delayMs: a.delayMs,
      easing: a.easing,
      easingRaw: a.easingRaw,
      iterations: a.iterations,
      fill: a.fill,
      direction: a.direction,
      stopCount: a.stopCount,
      stops: a.stops.length <= 10 ? a.stops : a.stops.filter((_, i) => i % Math.ceil(a.stops.length / 10) === 0 || i === a.stops.length - 1),
      from: a.from,
      to: a.to,
      ranges: a.ranges,
      families: a.families,
      otherProps: a.otherProps,
      states: a.states,
      transition: a.transition,
    },
    markup,
  });
}
entries.sort((a, b) => a.name.localeCompare(b.name));

const categories = {};
for (const e of entries) {
  const c = categories[e.category] || (categories[e.category] = { count: 0 });
  c.count++;
}

const catalog = {
  schemaVersion: CATALOG_SCHEMA_VERSION,
  package: "@salkomdesignstudio/sds-motion-forge",
  motionForgeVersion: registry.version,
  rootPackageVersion: rootPkg.version,
  tokens: {
    durationMs: Object.fromEntries(
      Object.entries(vars).filter(([k]) => /^--sds-duration-/.test(k)).map(([k, v]) => [k.replace("--sds-duration-", ""), parseTimeMs(v)]),
    ),
    easing: Object.fromEntries(
      Object.entries(vars).filter(([k]) => /^--sds-ease-/.test(k)).map(([k, v]) => [k.replace("--sds-ease-", ""), parseEasing(v)]).filter(([, v]) => v),
    ),
  },
  install: {
    cdn: "https://cdn.jsdelivr.net/npm/@salkomdesignstudio/sds-motion-forge/dist/motion.min.css",
    npm: "npm install @salkomdesignstudio/sds-motion-forge",
    css: "@salkomdesignstudio/sds-motion-forge/dist/motion.min.css",
    scrollEngine: "@salkomdesignstudio/sds-motion-forge/dist/sds-scroll.min.js",
    cursorEngine: "@salkomdesignstudio/sds-motion-forge/dist/motion-interactive.min.js",
  },
  frameworkPackagesPublished: !!siteLib.config.frameworkPackagesPublished,
  reducedMotionNote,
  categories,
  modifiers: modifiersFrom(registry.classes),
  animations: entries,
};

const outDir = path.join(PKG, "catalog");
fs.mkdirSync(outDir, { recursive: true });
const outFile = path.join(outDir, "catalog.json");
fs.writeFileSync(outFile, JSON.stringify(catalog));
const kb = (fs.statSync(outFile).size / 1024).toFixed(0);
const withDur = entries.filter((e) => e.motion.durationMs != null).length;
const withEase = entries.filter((e) => e.motion.easing).length;
const withFam = entries.filter((e) => e.motion.families.length).length;
console.error(
  `catalog: ${entries.length} animations, ${catalog.modifiers.length} modifiers, ${kb} KB; ` +
  `duration ${withDur}, easing ${withEase}, families ${withFam}`,
);

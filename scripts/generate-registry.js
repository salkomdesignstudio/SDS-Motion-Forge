#!/usr/bin/env node
/**
 * SDS Motion Forge — Registry Generator (Phase 1, R3 single source of truth)
 *
 * Parses the source CSS (src/motion.css entry, inlined via postcss-import so
 * every rule knows which category file it came from) and emits
 * registry/motion.registry.json — the machine-readable catalogue that docs,
 * Tailwind utilities, React/Angular types, Web Components and the bundle
 * builder are generated from or validated against.
 *
 * Facts (selectors, keyframes, tokens, compositor safety, triggers) are
 * DERIVED from CSS — never hand-maintained. Authored content (descriptions)
 * lives in exactly one place: registry/meta/descriptions.json, which this
 * script seeds from the CSS section comments on first run.
 *
 * Modes:
 *   node scripts/generate-registry.js          # write registry
 *   node scripts/generate-registry.js --check  # fail if committed registry is stale (CI gate)
 */

const fs = require("fs");
const path = require("path");
const postcss = require("postcss");
const postcssImport = require("postcss-import");
const { splitTopLevel, parseAnimationShorthand } = require("./lib/css-model");

const ROOT = path.join(__dirname, "..");
const CHECK = process.argv.includes("--check");
const ENTRY = path.join(ROOT, "src", "motion.css");
const OUT = path.join(ROOT, "registry", "motion.registry.json");
const META = path.join(ROOT, "registry", "meta", "descriptions.json");

const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, "package.json"), "utf8"));

const COMPOSITOR_SAFE = new Set([
  "transform", "-webkit-transform", "opacity", "filter", "-webkit-filter",
  "backdrop-filter", "-webkit-backdrop-filter", "clip-path", "-webkit-clip-path",
  "translate", "rotate", "scale", "animation-timing-function",
]);
const PAINT_ONLY = new Set([
  "box-shadow", "-webkit-box-shadow", "text-shadow",
  "background", "background-color", "background-position", "background-size", "background-image",
  "border-color", "border-top-color", "border-right-color", "border-bottom-color", "border-left-color",
  "outline-color", "color", "caret-color", "visibility",
]);

const INTERACTIVE = {
  "sds-word-morph": "load",
  "sds-jelly-hover": "cursor",
  "sds-scatter-return": "cursor",
  "sds-shockwave": "cursor",
  "sds-spring-kerning": "cursor",
  "sds-magnetic-pull": "cursor",
  "sds-repulsion-field": "cursor",
};

/* Documented permanent legacy aliases (README "Backward Compatibility"). */
const ALIASES = {
  "sds-scroll-fade-up": "sds-scroll-rise",
  "sds-input-focus-glow": "sds-input-focus",
  "sds-card-neon": "sds-card-glow",
  "sds-card-depth": "sds-card-parallax",
  "sds-card-flip": "sds-card-slice",
  "sds-loader-progress-glow": "sds-loader-progress",
};

const MODIFIER_RE = /^sds-(delay-\d+|fast|slow|xslow|normal|loop|alt|once|fill-both|fill-forward|pause-hover)$/;
const INFRA = new Set(["sds-play", "sds-in", "sds-js", "sds-scroll-auto", "sds-char"]);

function categorize(cls, sourceFile) {
  if (MODIFIER_RE.test(cls)) return "modifiers";
  if (INFRA.has(cls)) return "infrastructure";
  if (INTERACTIVE[cls]) return "interactive";
  if (/^sds-btn-/.test(cls)) return "buttons";
  if (/^sds-input-/.test(cls)) return "inputs";
  if (/^sds-card-/.test(cls)) return "cards";
  if (/^sds-loader-/.test(cls)) return "loaders";
  if (/^sds-scroll-/.test(cls)) return "scroll";
  return "text";
}

function collectVars(value, set) {
  const re = /var\(\s*(--[a-zA-Z0-9-_]+)/g;
  let m;
  while ((m = re.exec(value))) set.add(m[1]);
}

(async () => {
  const css = fs.readFileSync(ENTRY, "utf8");
  const result = await postcss([postcssImport]).process(css, { from: ENTRY });
  const root = result.root;

  /* keyframes: name -> { props, owner } */
  const keyframes = {};
  root.walkAtRules(/^(-webkit-)?keyframes$/, (at) => {
    const name = at.params.trim();
    const props = new Set();
    at.walkRules((r) => r.walkDecls((d) => props.add(d.prop.toLowerCase())));
    const file = at.source && at.source.input.file ? path.basename(at.source.input.file, ".css") : null;
    keyframes[name] = { props, owner: file };
  });

  /* per-class accumulation */
  const classes = {};
  let lastDisplayComment = null;

  root.walkComments((c) => {
    const m = c.text.match(/^\s*\d+\s*·\s*(.+?)\s*[-—]*\s*(\(.*\))?\s*$/);
    if (m) {
      // remember it keyed by position — postcss walk order means the next rule
      // we visit after this comment belongs to it; handled via walk below
    }
  });

  // walk nodes in order so comments attach to the following rule's class
  function walk(container) {
    for (const node of container.nodes || []) {
      if (node.type === "comment") {
        const m = node.text.match(/^\s*\d+\s*·\s*([^()]+?)\s*[-–—\s]*(\(.*\))?\s*$/);
        if (m) lastDisplayComment = m[1].replace(/[-\s]+$/, "").trim();
        continue;
      }
      if (node.type === "atrule") {
        if (/keyframes/.test(node.name)) continue;
        walk(node);
        continue;
      }
      if (node.type !== "rule") continue;

      const rule = node;
      const inReduced = rule.parent && rule.parent.type === "atrule" &&
        rule.parent.name === "media" && /prefers-reduced-motion/.test(rule.parent.params);
      const clsMatches = rule.selector.match(/\.sds-[a-z0-9-]+/g) || [];
      if (!clsMatches.length) continue;
      const primary = clsMatches[0].slice(1);
      const file = rule.source && rule.source.input.file ? path.basename(rule.source.input.file, ".css") : null;

      const e = classes[primary] || {
        name: primary,
        displayName: null,
        sourceFile: file,
        selectors: [],
        animations: [],
        customPropsUsed: new Set(),
        targetsChildren: false,
        requiresCharSplit: false,
        usesPseudoElements: false,
        triggers: new Set(),
      };
      if (!e.displayName && lastDisplayComment && !inReduced) {
        e.displayName = lastDisplayComment;
      }
      e.selectors.push(rule.selector.replace(/\s+/g, " ").trim());
      if (/>\s*\*|:nth-child/.test(rule.selector)) e.targetsChildren = true;
      if (/\.sds-char\b/.test(rule.selector) && primary !== "sds-char") e.requiresCharSplit = true;
      if (/::before|::after|::placeholder/.test(rule.selector)) e.usesPseudoElements = true;
      if (/:hover/.test(rule.selector)) e.triggers.add("hover");
      if (/:focus/.test(rule.selector)) e.triggers.add("focus");

      rule.walkDecls((d) => {
        collectVars(d.value, e.customPropsUsed);
        if (!inReduced && (d.prop === "animation" || d.prop === "-webkit-animation")) {
          e.animations.push(...parseAnimationShorthand(d.value));
        } else if (!inReduced && d.prop === "animation-name") {
          splitTopLevel(d.value, ",").forEach((n) => e.animations.push({ name: n.trim() }));
        }
      });

      classes[primary] = e;
      lastDisplayComment = null;
    }
  }
  walk(root);

  /* descriptions meta — authored overlay, seeded once */
  let meta = {};
  if (fs.existsSync(META)) {
    meta = JSON.parse(fs.readFileSync(META, "utf8"));
  }

  const registry = {
    $schema: "./motion.registry.schema.json",
    name: pkg.name,
    generatedFrom: "src/motion.css (postcss-import inlined)",
    version: pkg.version,
    tokens: {
      duration: ["instant", "fast", "base", "slow", "slower", "dramatic"],
      easing: ["standard", "decelerate", "accelerate", "emphasized", "spring", "bounce"],
      distance: ["sm", "md", "lg"],
    },
    classes: [],
  };

  const seededMeta = {};

  for (const name of Object.keys(classes).sort()) {
    const e = classes[name];
    const category = categorize(name, e.sourceFile);
    const kfNames = [...new Set(e.animations.map((a) => a.name).filter((n) => n && n !== "none"))];

    let compositorSafe = true;
    const paint = new Set(); const layout = new Set();
    for (const kf of kfNames) {
      const def = keyframes[kf];
      if (!def) continue; // known anomaly (sds-charOrbitBob)
      for (const p of def.props) {
        if (p.startsWith("--") || COMPOSITOR_SAFE.has(p)) continue;
        if (PAINT_ONLY.has(p)) { paint.add(p); compositorSafe = false; }
        else { layout.add(p); compositorSafe = false; }
      }
    }

    const tokensUsed = [...e.customPropsUsed]
      .filter((v) => /^--sds-(duration|ease|easing|distance)/.test(v)).sort();
    const themeProps = [...e.customPropsUsed]
      .filter((v) => !/^--sds-(duration|ease|easing|distance)/.test(v) && !/^--(i|dx|dy|dr|burst)$/.test(v)).sort();

    let trigger;
    if (INTERACTIVE[name]) trigger = INTERACTIVE[name];
    else if (category === "scroll") trigger = "scroll";
    else if (e.triggers.has("focus")) trigger = "focus";
    else if (e.triggers.has("hover")) trigger = "hover";
    else trigger = "load";

    const displayName = e.displayName ||
      name.replace(/^sds-(btn-|input-|card-|loader-|scroll-)?/, "")
        .split("-").map((w) => w[0].toUpperCase() + w.slice(1)).join(" ");

    const description = (meta[name] && meta[name].description) ||
      `${displayName} — ${category === "modifiers" ? "playback modifier" : category.replace(/s$/, "") + " animation"}.`;
    seededMeta[name] = meta[name] || { description, seeded: true };

    registry.classes.push({
      name,
      displayName,
      category,
      kind: category === "modifiers" ? "modifier"
        : category === "infrastructure" ? "infrastructure"
        : category === "interactive" ? "interactive" : "effect",
      description,
      selectors: [...new Set(e.selectors)],
      keyframes: kfNames,
      tokensUsed,
      customProperties: themeProps,
      compositorSafe,
      animatedPaintProps: [...paint].sort(),
      animatedLayoutProps: [...layout].sort(),
      requiresCharSplit: e.requiresCharSplit,
      requiresChildren: e.targetsChildren && !e.requiresCharSplit,
      requiresJs: !!INTERACTIVE[name],
      jsEngine: INTERACTIVE[name] ? "motion-interactive" : (category === "scroll" ? "sds-scroll (optional)" : null),
      trigger,
      deprecated: false,
      aliasOf: ALIASES[name] || null,
      sinceVersion: "4.0.3",
    });
  }

  const out = JSON.stringify(registry, null, 2) + "\n";

  if (CHECK) {
    const current = fs.existsSync(OUT) ? fs.readFileSync(OUT, "utf8").replace(/\r\n/g, "\n") : null;
    if (current !== out) {
      console.error("registry/motion.registry.json is STALE relative to source CSS.");
      console.error("Run: npm run generate:registry");
      process.exit(1);
    }
    console.log(`Registry in sync (${registry.classes.length} classes).`);
    return;
  }

  fs.mkdirSync(path.dirname(META), { recursive: true });
  if (!fs.existsSync(META)) {
    fs.writeFileSync(META, JSON.stringify(seededMeta, null, 2) + "\n");
    console.log(`Seeded registry/meta/descriptions.json (${Object.keys(seededMeta).length} entries)`);
  }
  fs.writeFileSync(OUT, out);
  const counts = registry.classes.reduce((a, c) => { a[c.category] = (a[c.category] || 0) + 1; return a; }, {});
  console.log(`Wrote registry/motion.registry.json — ${registry.classes.length} classes`, counts);
})().catch((e) => { console.error(e); process.exit(1); });

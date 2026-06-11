#!/usr/bin/env node
/**
 * SDS Motion Forge — Per-category standalone bundles (Phase 1).
 *
 * For each category, emits dist/categories/{name}.css and .min.css that are
 * USABLE STANDALONE:
 *
 *     content = core (tokens + modifiers + reduced-motion + scroll gate)
 *             + the category's rules
 *             + any @keyframes the category references but that live in
 *               another category file (resolved from the source partition,
 *               never by regex copy-paste)
 *
 * DESIGN DECISION — core is INLINED into every category bundle, not shipped
 * as a peer import. Rationale (documented in README):
 *   - The whole point of category bundles is paste-and-go via npm or CDN.
 *     A peer `@import "core.css"` breaks the plain `<link>` CDN pattern's
 *     single-request guarantee and silently no-ops when consumers' pipelines
 *     strip imports.
 *   - Core is small (a few KB minified, ~1.5 KB gzip), so N-category
 *     duplication costs little; consumers combining 2+ categories should use
 *     dist/motion.css (every class, one copy of core) or the Phase 4 custom
 *     bundle builder, which assembles exactly one copy of everything needed.
 *
 * Also writes dist/categories/sizes.json and injects the min+gzip size table
 * into README.md between the @sds-size-table markers.
 */

const fs = require("fs");
const path = require("path");
const zlib = require("zlib");
const postcss = require("postcss");
const autoprefixer = require("autoprefixer");
const CleanCSS = require("clean-css");

const ROOT = path.join(__dirname, "..");
const SRC_DIR = path.join(ROOT, "src", "categories");
const OUT_DIR = path.join(ROOT, "dist", "categories");
const ORDER = ["core", "text", "buttons", "inputs", "cards", "loaders", "scroll"];
const { splitTopLevel } = require("./lib/css-model");

const KNOWN_MISSING = new Set(["sds-charOrbitBob"]); // published anomaly

function animationNames(value) {
  const TIMING = /^(linear|ease|ease-in|ease-out|ease-in-out|step-start|step-end|infinite|normal|reverse|alternate|alternate-reverse|forwards|backwards|both|none|running|paused)$/i;
  return splitTopLevel(value, ",").map((seg) => {
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

/* parse each source file once */
const files = {};
for (const cat of ORDER) {
  const css = fs.readFileSync(path.join(SRC_DIR, `${cat}.css`), "utf8");
  const root = postcss.parse(css);
  const kfDefined = new Map(); // name -> stringified at-rule
  const kfReferenced = new Set();
  root.walkAtRules(/^(-webkit-)?keyframes$/, (at) => kfDefined.set(at.params.trim(), at.toString()));
  root.walkRules((rule) => {
    if (rule.parent && rule.parent.type === "atrule" && /keyframes/.test(rule.parent.name)) return;
    rule.walkDecls(/^(-webkit-)?animation(-name)?$/, (d) => {
      animationNames(d.value).forEach((n) => kfReferenced.add(n));
    });
  });
  files[cat] = { css, kfDefined, kfReferenced };
}

function ownerOf(kfName) {
  for (const cat of ORDER) if (files[cat].kfDefined.has(kfName)) return cat;
  return null;
}

fs.mkdirSync(OUT_DIR, { recursive: true });
const minify = new CleanCSS({ level: 1, inline: false });
const sizes = {};

(async () => {
  for (const cat of ORDER) {
    let content;
    if (cat === "core") {
      content = files.core.css;
    } else {
      const deps = [];
      for (const kf of files[cat].kfReferenced) {
        if (files[cat].kfDefined.has(kf)) continue;
        if (files.core.kfDefined.has(kf)) continue;
        if (KNOWN_MISSING.has(kf)) continue;
        const owner = ownerOf(kf);
        if (!owner) throw new Error(`Unresolvable keyframes "${kf}" referenced by ${cat}`);
        deps.push(`/* dependency: @keyframes ${kf} (defined in ${owner}.css) */\n${files[owner].kfDefined.get(kf)}`);
      }
      const banner = `/*!\n * SDS Motion Forge — standalone ${cat} bundle\n * Generated from src/categories/ by scripts/build-categories.js — do not edit.\n * Contains: core (tokens, modifiers, reduced-motion, scroll gate) + ${cat} +\n * cross-category keyframe dependencies. Combining 2+ categories? Use\n * dist/motion.css instead — it ships exactly one copy of core.\n */\n`;
      content = banner + files.core.css + "\n" + files[cat].css +
        (deps.length ? `\n/* ── Cross-category keyframe dependencies ── */\n${deps.join("\n")}\n` : "");
    }

    const prefixed = await postcss([autoprefixer]).process(content, { from: undefined });
    const outCss = path.join(OUT_DIR, `${cat}.css`);
    fs.writeFileSync(outCss, prefixed.css);

    const min = minify.minify(prefixed.css);
    if (min.errors.length) throw new Error(`clean-css failed for ${cat}: ${min.errors.join("; ")}`);
    const outMin = path.join(OUT_DIR, `${cat}.min.css`);
    fs.writeFileSync(outMin, min.styles);

    sizes[cat] = {
      raw: prefixed.css.length,
      min: min.styles.length,
      gzip: zlib.gzipSync(min.styles, { level: 9 }).length,
    };
    console.log(`  dist/categories/${cat}.css  min=${(sizes[cat].min / 1024).toFixed(1)}KB  gzip=${(sizes[cat].gzip / 1024).toFixed(1)}KB`);
  }

  /* full bundle for the table */
  const fullMin = fs.readFileSync(path.join(ROOT, "dist", "motion.min.css"));
  sizes.full = { raw: fs.statSync(path.join(ROOT, "dist", "motion.css")).size, min: fullMin.length, gzip: zlib.gzipSync(fullMin, { level: 9 }).length };

  fs.writeFileSync(path.join(OUT_DIR, "sizes.json"), JSON.stringify(sizes, null, 2));

  /* README size table between markers */
  const kb = (n) => (n / 1024).toFixed(1) + " KB";
  const rows = [
    "| Bundle | Import | Minified | Gzip |",
    "|---|---|---|---|",
    ...ORDER.filter((c) => c !== "core").map((c) =>
      `| ${c} | \`@salkomdesignstudio/sds-motion-forge/categories/${c}\` | ${kb(sizes[c].min)} | ${kb(sizes[c].gzip)} |`),
    `| core only | \`@salkomdesignstudio/sds-motion-forge/categories/core\` | ${kb(sizes.core.min)} | ${kb(sizes.core.gzip)} |`,
    `| **everything** | \`@salkomdesignstudio/sds-motion-forge\` | **${kb(sizes.full.min)}** | **${kb(sizes.full.gzip)}** |`,
  ].join("\n");

  const readmePath = path.join(ROOT, "README.md");
  const readme = fs.readFileSync(readmePath, "utf8");
  const markerRe = /<!-- @sds-size-table:start -->[\s\S]*?<!-- @sds-size-table:end -->/;
  if (markerRe.test(readme)) {
    fs.writeFileSync(readmePath, readme.replace(markerRe,
      `<!-- @sds-size-table:start -->\n${rows}\n<!-- @sds-size-table:end -->`));
    console.log("  README size table updated");
  } else {
    console.log("  (README size-table markers not found — table not injected)");
  }
  console.log("Category bundles built.");
})().catch((e) => { console.error(e); process.exit(1); });

#!/usr/bin/env node
/**
 * @salkomdesignstudio/motion-forge-tailwind — generator.
 *
 * Everything here is derived from registry/motion.registry.json and the
 * source CSS partition (R3) — no hand-maintained class lists.
 *
 * Outputs:
 *   dist/sds-motion.css  — Tailwind v4 CSS-first plugin:
 *       @theme: SDS tokens + one --animate-sds-*-kf token per animation
 *               declaration + all @keyframes (tree-shaken by Tailwind: only
 *               emitted when the referencing utility is used)
 *       @utility animate-sds-{name}: the FULL effect (statics, pseudo
 *               elements, child selectors via nesting) + /modifier support
 *               mapping to the SDS duration scale (animate-sds-x/slow).
 *   dist/v3-preset.cjs   — Tailwind v3 preset (theme.extend.keyframes +
 *               animation). Covers the animation declaration only; complex
 *               companion rules (children/pseudo-elements/static props) are
 *               v4-plugin-only — documented in README.
 */

const fs = require("fs");
const path = require("path");
const postcss = require("postcss");
const { loadRegistry, loadClassRules } = require("../../../scripts/codegen/effects-data.js");

const PKG = path.join(__dirname, "..");
const DIST = path.join(PKG, "dist");
fs.mkdirSync(DIST, { recursive: true });

const registry = loadRegistry();
const { rules, keyframes } = loadClassRules();

/* tokens from core.css :root — the single source */
const coreRoot = {};
{
  const core = postcss.parse(fs.readFileSync(path.join(__dirname, "..", "..", "..", "src", "categories", "core.css"), "utf8"));
  core.walkRules((r) => {
    if (!r.selector.split(",").some((s) => s.trim() === ":root")) return;
    r.walkDecls((d) => { if (d.prop.startsWith("--")) coreRoot[d.prop] = d.value.trim(); });
  });
}

/* Effects eligible for utilities: CSS-only effect classes (no aliases —
   aliases resolve to their target's utility; no JS-engine classes). */
const effects = registry.classes.filter((c) =>
  c.kind === "effect" && !c.aliasOf && !c.requiresJs &&
  ["text", "buttons", "inputs", "cards", "loaders", "scroll"].includes(c.category));

function utilityName(cls) { return `animate-${cls}`; }

/* selector -> nested form: ".sds-x::after" -> "&::after", ".sds-x > *" -> "& > *" */
function nestSelector(selector, cls) {
  const re = new RegExp(`\\.${cls.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`);
  let s = selector.replace(re, "&");
  return s;
}

const themeLines = [];
const utilityBlocks = [];
const usedKeyframes = new Set();
const v3Animation = {};
const v3Keyframes = {};

/* SDS tokens into @theme (emitted by Tailwind only when referenced) */
themeLines.push("  /* SDS Motion Forge theme tokens (override in your own @theme to re-brand) */");
for (const [prop, value] of Object.entries(coreRoot)) {
  themeLines.push(`  ${prop}: ${value};`);
}

let animTokenCount = 0;
for (const effect of effects) {
  const clsRules = rules[effect.name];
  if (!clsRules) continue;

  const bodyLines = [];
  let tokenIdx = 0;

  for (const rule of clsRules) {
    const nested = nestSelector(rule.selector, effect.name);
    const isRootSel = nested === "&";
    const declLines = [];

    for (const d of rule.decls) {
      if (d.prop === "animation" || d.prop === "-webkit-animation") {
        // token per animation declaration → keyframes tree-shaking hook
        tokenIdx += 1;
        const tokenName = `--sds-anim-${effect.name.replace(/^sds-/, "")}${tokenIdx > 1 ? "-" + tokenIdx : ""}`;
        themeLines.push(`  ${tokenName}: ${d.value.replace(/\s+/g, " ")};`);
        animTokenCount++;
        declLines.push(`${d.prop}: var(${tokenName});`);
        // collect keyframes used
        for (const kf of effect.keyframes) usedKeyframes.add(kf);
        // v3 preset: first/root animation only
        if (tokenIdx === 1) {
          v3Animation[effect.name] = resolveVarsToLiterals(d.value);
        }
      } else {
        declLines.push(`${d.prop}: ${d.value}${d.important ? " !important" : ""};`);
      }
    }

    if (isRootSel) {
      bodyLines.push(...declLines.map((l) => "  " + l));
    } else {
      bodyLines.push(`  ${nested} {`);
      bodyLines.push(...declLines.map((l) => "    " + l));
      bodyLines.push("  }");
    }
  }

  const body = bodyLines.join("\n");
  // bare utility: animate-sds-x
  utilityBlocks.push(`@utility ${utilityName(effect.name)} {\n${body}\n}`);
  // functional speed variant: animate-sds-x-{instant|fast|base|slow|slower|dramatic}
  // (static utilities cannot take /modifiers in Tailwind v4 — measured, not assumed)
  utilityBlocks.push(`@utility ${utilityName(effect.name)}-* {\n${body}\n  animation-duration: --value(--sds-duration-*);\n${
    /* speed must also cascade into child/char animations */
    ""}  & > *, & .sds-char {\n    animation-duration: --value(--sds-duration-*);\n  }\n}`);
}

/* keyframes into @theme (tree-shaken) */
const kfLines = [];
for (const name of [...usedKeyframes].sort()) {
  if (!keyframes[name]) continue; // known anomaly: sds-charOrbitBob
  kfLines.push("  " + keyframes[name].replace(/\n/g, "\n  "));
  v3Keyframes[name] = keyframesToV3Object(keyframes[name]);
}

function resolveVarsToLiterals(value) {
  // v3 preset must be self-contained: resolve var(--x, fallback) via core tokens
  let v = value;
  for (let i = 0; i < 5 && v.includes("var("); i++) {
    v = v.replace(/var\(\s*(--[a-zA-Z0-9-]+)\s*(?:,\s*([^()]*(?:\([^()]*\))?[^()]*?))?\)/g,
      (all, name, fb) => coreRoot[name] !== undefined ? coreRoot[name] : (fb !== undefined ? fb.trim() : all));
    if (!/var\(/.test(v)) break;
  }
  return v.replace(/\s+/g, " ").trim();
}

function keyframesToV3Object(kfCss) {
  const at = postcss.parse(kfCss).first;
  const obj = {};
  at.walkRules((r) => {
    const decls = {};
    r.walkDecls((d) => { decls[d.prop] = resolveVarsToLiterals(d.value.replace(/\s+/g, " ")); });
    obj[r.selector.replace(/\s+/g, "")] = decls;
  });
  return obj;
}

/* ── write v4 plugin css ─────────────────────────────────────── */
const v4 = `/*!
 * @salkomdesignstudio/motion-forge-tailwind v${require(path.join(PKG, "package.json")).version}
 * GENERATED from registry/motion.registry.json (SDS Motion Forge v${registry.version}) — do not edit.
 *
 * Usage (Tailwind v4):
 *   @import "tailwindcss";
 *   @import "@salkomdesignstudio/motion-forge-tailwind";
 *
 * Then: <h1 class="animate-sds-velvet-drop">…</h1>
 * Speed modifiers map to the SDS duration scale:
 *   animate-sds-velvet-drop/slow  ->  animation-duration: var(--sds-duration-slow)
 */
@theme {
${themeLines.join("\n")}

  /* Keyframes — emitted by Tailwind only when a referencing utility is used */
${kfLines.join("\n")}
}

/* Reduced motion neutralization for every utility in this plugin (R5) */
@media (prefers-reduced-motion: reduce) {
  [class*="animate-sds-"],
  [class*="animate-sds-"]::before,
  [class*="animate-sds-"]::after,
  [class*="animate-sds-"] > * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    animation-delay: 0ms !important;
    transition-duration: 0.01ms !important;
  }
}

${utilityBlocks.join("\n\n")}
`;
fs.writeFileSync(path.join(DIST, "sds-motion.css"), v4);

/* ── write v3 preset ─────────────────────────────────────────── */
const v3 = `/**
 * @salkomdesignstudio/motion-forge-tailwind — Tailwind v3 preset (GENERATED).
 * Covers the animation declaration of every CSS-only effect; companion rules
 * (pseudo-elements, child staggers, static props) require the v4 plugin or
 * the core library CSS. See README.
 *
 *   // tailwind.config.js
 *   module.exports = { presets: [require('@salkomdesignstudio/motion-forge-tailwind/v3-preset')] };
 */
module.exports = {
  theme: {
    extend: {
      keyframes: ${JSON.stringify(v3Keyframes, null, 2).replace(/\n/g, "\n      ")},
      animation: ${JSON.stringify(
        Object.fromEntries(Object.entries(v3Animation).map(([k, v]) => [k, v])), null, 2).replace(/\n/g, "\n      ")},
    },
  },
};
`;
fs.writeFileSync(path.join(DIST, "v3-preset.cjs"), v3);

console.log(`tailwind plugin generated: ${effects.length} utilities, ${animTokenCount} animation tokens, ${usedKeyframes.size} keyframes`);
console.log(`  dist/sds-motion.css ${(v4.length / 1024).toFixed(1)} KB (source — consumers' Tailwind tree-shakes it)`);
console.log(`  dist/v3-preset.cjs ${(v3.length / 1024).toFixed(1)} KB`);

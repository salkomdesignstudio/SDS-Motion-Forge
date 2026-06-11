#!/usr/bin/env node
/**
 * SDS Motion Forge — Token Generator (Phase 0, R3 single source of truth)
 *
 * Reads tokens/motion.tokens.json (W3C Design Tokens format) and emits:
 *   a) CSS custom properties — injected into src/motion.css between the
 *      "@sds-generated-tokens" markers inside the :root block
 *   b) tokens/figma.tokens.json — Tokens Studio (Figma Tokens) format,
 *      consumed by the SDS Figma plugin suite
 *   c) tokens/sds-motion-tokens.ts — TypeScript constants module
 *
 * Modes:
 *   node scripts/generate-tokens.js          # write all outputs
 *   node scripts/generate-tokens.js --check  # fail if any output is stale
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const CHECK = process.argv.includes("--check");
const tokens = JSON.parse(fs.readFileSync(path.join(ROOT, "tokens", "motion.tokens.json"), "utf8"));

const motion = tokens.sds.motion;

/* ── helpers ─────────────────────────────────────────────────── */
function msToCss(v) {
  // "300ms" -> "0.3s" (library style uses seconds)
  const m = /^([\d.]+)ms$/.exec(v);
  if (!m) return v;
  return `${parseFloat((parseFloat(m[1]) / 1000).toFixed(4))}s`;
}
function bezierToCss(arr) {
  return `cubic-bezier(${arr.join(", ")})`;
}
function entries(group) {
  return Object.entries(group).filter(([k]) => !k.startsWith("$"));
}

/* ── a) CSS block ────────────────────────────────────────────── */
const cssLines = [];
cssLines.push("  /* @sds-generated-tokens:start — generated from tokens/motion.tokens.json by scripts/generate-tokens.js; do not edit by hand */");
for (const [name, t] of entries(motion.duration)) {
  cssLines.push(`  --sds-duration-${name}: ${msToCss(t.$value)};`);
}
for (const [name, t] of entries(motion.easing)) {
  cssLines.push(`  --sds-ease-${name}: ${bezierToCss(t.$value)};`);
}
for (const [name, t] of entries(motion.distance)) {
  cssLines.push(`  --sds-distance-${name}: ${t.$value};`);
}
cssLines.push("  /* @sds-generated-tokens:end */");
const cssBlock = cssLines.join("\n");

/* Tokens live in core.css since the Phase 1 category split. */
const motionCssPath = path.join(ROOT, "src", "categories", "core.css");
const motionCss = fs.readFileSync(motionCssPath, "utf8");
const markerRe = /[ \t]*\/\* @sds-generated-tokens:start[\s\S]*?@sds-generated-tokens:end \*\//;
if (!markerRe.test(motionCss)) {
  console.error("Marker block '@sds-generated-tokens' not found in src/categories/core.css :root.");
  process.exit(1);
}
const nextCss = motionCss.replace(markerRe, cssBlock);

/* ── b) Figma Tokens (Tokens Studio) ─────────────────────────── */
const figma = {
  sds: {
    motion: {
      duration: Object.fromEntries(entries(motion.duration).map(([name, t]) => [
        name, { value: t.$value, type: "other", description: t.$description || "" },
      ])),
      easing: Object.fromEntries(entries(motion.easing).map(([name, t]) => [
        name, { value: bezierToCss(t.$value), type: "other", description: t.$description || "" },
      ])),
      distance: Object.fromEntries(entries(motion.distance).map(([name, t]) => [
        name, { value: t.$value, type: "dimension", description: t.$description || "" },
      ])),
    },
  },
};
const figmaOut = JSON.stringify(figma, null, 2) + "\n";

/* ── c) TypeScript constants ─────────────────────────────────── */
const ts = [];
ts.push("/**");
ts.push(" * SDS Motion Forge — Motion Tokens (generated)");
ts.push(" * Source of truth: tokens/motion.tokens.json");
ts.push(" * Regenerate with: npm run build:tokens");
ts.push(" * DO NOT EDIT BY HAND.");
ts.push(" */");
ts.push("");
ts.push("export const SDS_DURATION = {");
for (const [name, t] of entries(motion.duration)) {
  ts.push(`  /** ${(t.$description || "").replace(/\n/g, " ")} */`);
  ts.push(`  ${name}: '${msToCss(t.$value)}',`);
}
ts.push("} as const;");
ts.push("");
ts.push("export const SDS_EASING = {");
for (const [name, t] of entries(motion.easing)) {
  ts.push(`  /** ${(t.$description || "").replace(/\n/g, " ")} */`);
  ts.push(`  ${name}: '${bezierToCss(t.$value)}',`);
}
ts.push("} as const;");
ts.push("");
ts.push("export const SDS_DISTANCE = {");
for (const [name, t] of entries(motion.distance)) {
  ts.push(`  /** ${(t.$description || "").replace(/\n/g, " ")} */`);
  ts.push(`  ${name}: '${t.$value}',`);
}
ts.push("} as const;");
ts.push("");
ts.push("export type SdsDurationToken = keyof typeof SDS_DURATION;");
ts.push("export type SdsEasingToken = keyof typeof SDS_EASING;");
ts.push("export type SdsDistanceToken = keyof typeof SDS_DISTANCE;");
ts.push("");
ts.push("/** CSS custom property name for a duration token, e.g. durationVar('base') -> '--sds-duration-base' */");
ts.push("export const durationVar = (t: SdsDurationToken): string => `--sds-duration-${t}`;");
ts.push("export const easingVar = (t: SdsEasingToken): string => `--sds-ease-${t}`;");
ts.push("export const distanceVar = (t: SdsDistanceToken): string => `--sds-distance-${t}`;");
ts.push("");
const tsOut = ts.join("\n");

/* ── write or check ──────────────────────────────────────────── */
const outputs = [
  { file: motionCssPath, content: nextCss, label: "src/categories/core.css token block" },
  { file: path.join(ROOT, "tokens", "figma.tokens.json"), content: figmaOut, label: "tokens/figma.tokens.json" },
  { file: path.join(ROOT, "tokens", "sds-motion-tokens.ts"), content: tsOut, label: "tokens/sds-motion-tokens.ts" },
];

let stale = 0;
for (const o of outputs) {
  const current = fs.existsSync(o.file) ? fs.readFileSync(o.file, "utf8") : null;
  const normalize = (s) => (s === null ? null : s.replace(/\r\n/g, "\n"));
  if (normalize(current) === normalize(o.content)) {
    console.log(`  ok ${o.label} (up to date)`);
    continue;
  }
  if (CHECK) {
    console.error(`  x ${o.label} is stale — run: npm run build:tokens`);
    stale += 1;
  } else {
    fs.writeFileSync(o.file, o.content);
    console.log(`  wrote ${o.label}`);
  }
}

if (CHECK && stale > 0) process.exit(1);
console.log(CHECK ? "Token outputs in sync." : "Token generation complete.");

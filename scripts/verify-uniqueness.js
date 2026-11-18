#!/usr/bin/env node
/**
 * Uniqueness gate — a new effect must not repeat an existing one.
 *
 * Static checks (fast, no browser), applied to the effects introduced by the CURRENT
 * release (registry sinceVersion === package.json version):
 *   1. class names are unique
 *   2. display names are unique across ALL effects (two cards both called "Liquid Fill"
 *      is a duplicate to a user even when the classes differ)
 *   3. none of their @keyframes bodies is identical to another keyframe set — a copied
 *      keyframe is a copied animation. Trivial shared primitives are allowed explicitly
 *      below, with the reason.
 *   4. none shares its whole keyframe set with another effect
 *
 * Existing duplicates in the library (for example depth-charge / depth-warp share
 * keyframes) are public API and cannot be removed; they are only reported.
 *
 * The motion itself is compared separately by scripts/audit-motion-similarity.js
 * (needs a browser): npm run audit:motion
 */
"use strict";
const fs = require("fs");
const path = require("path");
const postcss = require("postcss");

const ROOT = path.join(__dirname, "..");
const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, "package.json"), "utf8"));
const registry = JSON.parse(fs.readFileSync(path.join(ROOT, "registry", "motion.registry.json"), "utf8"));

/* Shared one-line primitives that legitimately exist twice. Each entry names the keyframe
   that is allowed to equal another and why. */
const ALLOWED_PRIMITIVES = {
  "sds-physFadeIn": "opacity 0 -> 1, shared by the physics effects; an identical helper exists in scroll.css",
  "sds-physFadeOut": "opacity 1 -> 0",
};

const effects = registry.classes.filter((c) => c.kind === "effect");
const fresh = effects.filter((c) => c.sinceVersion === pkg.version);
const freshNames = new Set(fresh.map((c) => c.name));
const problems = [];

// 1. class names
const names = registry.classes.map((c) => c.name);
const dupNames = names.filter((n, i) => names.indexOf(n) !== i);
if (dupNames.length) problems.push(`duplicate class names: ${[...new Set(dupNames)].join(", ")}`);

// 2. display names (new effects against everything)
const byDisplay = new Map();
for (const c of effects) {
  const k = c.displayName.trim().toLowerCase();
  if (!byDisplay.has(k)) byDisplay.set(k, []);
  byDisplay.get(k).push(c);
}
for (const [k, list] of byDisplay) {
  if (list.length > 1 && list.some((c) => freshNames.has(c.name))) {
    problems.push(`display name "${k}" is shared by ${list.map((c) => c.name).join(", ")} — rename the new effect`);
  }
}

// 3. keyframe bodies
const norm = (s) => s.replace(/\s+/g, " ").replace(/\s*([{}:;,])\s*/g, "$1").trim();
const css = postcss.parse(fs.readFileSync(path.join(ROOT, "dist", "motion.css"), "utf8"));
const kfBody = new Map();
css.walkAtRules("keyframes", (a) => kfBody.set(a.params, norm(a.nodes.map((n) => n.toString()).join("|"))));
const owners = {};
for (const c of registry.classes) for (const k of c.keyframes) (owners[k] = owners[k] || new Set()).add(c.name);
const byBody = new Map();
for (const [k, b] of kfBody) (byBody.get(b) || byBody.set(b, []).get(b)).push(k);
for (const group of byBody.values()) {
  if (group.length < 2) continue;
  const involvesNew = group.some((k) => [...(owners[k] || [])].some((n) => freshNames.has(n)));
  if (!involvesNew) continue;
  const unallowed = group.filter((k) => !ALLOWED_PRIMITIVES[k]);
  // a group is acceptable only if every NEW keyframe in it is an allowed primitive
  const newKfs = group.filter((k) => [...(owners[k] || [])].every((n) => freshNames.has(n)));
  const bad = newKfs.filter((k) => !ALLOWED_PRIMITIVES[k]);
  if (bad.length) problems.push(`keyframes ${group.join(" = ")} are identical — reuse the existing one instead of copying it (${bad.join(", ")} is new)`);
  void unallowed;
}

// 4. whole keyframe sets
const bySet = new Map();
for (const c of effects.filter((x) => !x.aliasOf && x.keyframes.length)) {
  const k = c.keyframes.slice().sort().join("|");
  if (!bySet.has(k)) bySet.set(k, []);
  bySet.get(k).push(c.name);
}
for (const list of bySet.values()) {
  if (list.length > 1 && list.some((n) => freshNames.has(n))) problems.push(`effects share the identical keyframe set: ${list.join(", ")}`);
}

const existingGroups = [...bySet.values()].filter((l) => l.length > 1 && !l.some((n) => freshNames.has(n))).length;
if (problems.length) {
  console.error("FAIL: duplicate effects detected:\n" + problems.map((p) => "  - " + p).join("\n"));
  process.exit(1);
}
console.log(`PASS: ${fresh.length} new effect(s) @${pkg.version} are unique (names, display names, keyframes, keyframe sets).`);
console.log(`      (info: ${existingGroups} pre-existing groups of effects already share keyframes — public API, left as is.)`);

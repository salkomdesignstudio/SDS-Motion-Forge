// CI gate: fails when the catalog is missing metadata the MCP tools depend on.
// Run after generate-catalog.mjs (npm run build does both).
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const PKG = path.resolve(HERE, "..");
const ROOT = path.resolve(PKG, "..", "..");
const catalog = JSON.parse(fs.readFileSync(path.join(PKG, "catalog", "catalog.json"), "utf8"));
const registry = JSON.parse(fs.readFileSync(path.join(ROOT, "registry", "motion.registry.json"), "utf8"));

const errors = [];
const fail = (m) => errors.push(m);

if (catalog.schemaVersion !== 1) fail(`unexpected schemaVersion ${catalog.schemaVersion}`);
if (catalog.motionForgeVersion !== registry.version) fail(`catalog is for ${catalog.motionForgeVersion}, registry is ${registry.version}: regenerate`);

const expected = registry.classes.filter((c) => c.kind !== "modifier").length;
if (catalog.animations.length !== expected) fail(`catalog has ${catalog.animations.length} animations, registry has ${expected}`);

// Classes with no CSS animation of their own (helpers and JS-driven interactive effects).
// Adding to this list is a deliberate decision, not a way to silence the check.
const TIMING_EXEMPT_CATEGORIES = new Set(["infrastructure"]);
// the sds-gsap-* effects are driven by GSAP in JavaScript: their timing is not in the CSS
const isGsapEngine = (n) => n.startsWith("sds-gsap-");
const TIMING_EXEMPT_NAMES = new Set([
  "sds-input-elevate-wrap", "sds-jelly-hover", "sds-magnetic-pull", "sds-repulsion-field",
  "sds-scatter-return", "sds-shockwave", "sds-spring-kerning", "sds-word-morph",
]);

const seen = new Set();
for (const a of catalog.animations) {
  const id = a.name || "(unnamed)";
  if (seen.has(id)) fail(`${id}: duplicate name`);
  seen.add(id);
  if (!a.name || !/^sds-[a-z0-9-]+$/.test(a.name)) fail(`${id}: bad class name`);
  if (!a.displayName) fail(`${id}: missing displayName`);
  if (!a.category) fail(`${id}: missing category`);
  if (!a.description || a.description.length < 8) fail(`${id}: missing description`);
  if (!a.trigger) fail(`${id}: missing trigger`);
  if (!a.markup && a.category !== "infrastructure") fail(`${id}: missing demo markup`);
  if (a.motion.durationMs == null && !TIMING_EXEMPT_CATEGORIES.has(a.category) && !TIMING_EXEMPT_NAMES.has(a.name) && !isGsapEngine(a.name)) {
    fail(`${id}: no duration could be derived from the CSS`);
  }
  if (a.motion.durationMs != null && !(a.motion.durationMs >= 0 && a.motion.durationMs < 60000)) fail(`${id}: implausible duration ${a.motion.durationMs}`);
  if (a.motion.durationMs != null && !a.motion.families.length) fail(`${id}: timing known but no animated property family`);
}
if (!catalog.modifiers.length) fail("no modifiers");
if (!Object.keys(catalog.tokens.durationMs).length) fail("no duration tokens");
if (!Object.keys(catalog.tokens.easing).length) fail("no easing tokens");

if (errors.length) {
  console.error(`catalog check FAILED (${errors.length} problem${errors.length === 1 ? "" : "s"}):`);
  for (const e of errors.slice(0, 40)) console.error("  - " + e);
  if (errors.length > 40) console.error(`  … and ${errors.length - 40} more`);
  process.exit(1);
}
console.error(`catalog check ok: ${catalog.animations.length} animations`);

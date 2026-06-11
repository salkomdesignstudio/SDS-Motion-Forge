#!/usr/bin/env node
/**
 * Phase 1 acceptance check: the Vite app importing ONLY ./categories/loaders
 * must contain every loader class selector and every keyframe those loaders
 * reference, in the single CSS asset Vite emits.
 * (Pixel-level render verification arrives with the Phase 3 Playwright suite.)
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const assetsDir = path.join(ROOT, "examples", "vite-loaders", "dist", "assets");
const registry = JSON.parse(fs.readFileSync(path.join(ROOT, "registry", "motion.registry.json"), "utf8"));

const cssFile = fs.readdirSync(assetsDir).find((f) => f.endsWith(".css"));
if (!cssFile) { console.error("No CSS asset found — run the example build first."); process.exit(1); }
const css = fs.readFileSync(path.join(assetsDir, cssFile), "utf8");

const loaders = registry.classes.filter((c) => c.category === "loaders");
let errors = 0;
for (const l of loaders) {
  if (!css.includes(`.${l.name}`)) { console.error(`  x missing selector .${l.name}`); errors++; }
  for (const kf of l.keyframes) {
    if (!css.includes(`@keyframes ${kf}`) && !css.includes(`@-webkit-keyframes ${kf}`)) {
      console.error(`  x missing @keyframes ${kf} (needed by ${l.name})`); errors++;
    }
  }
}
const sizeKB = (fs.statSync(path.join(assetsDir, cssFile)).size / 1024).toFixed(2);
console.log(`Vite loaders bundle: ${cssFile} = ${sizeKB} KB minified`);
console.log(`Loaders checked: ${loaders.length}; reduced-motion present: ${css.includes("prefers-reduced-motion")}; tokens present: ${css.includes("--sds-duration-base")}`);
if (errors) { console.error(`${errors} missing item(s).`); process.exit(1); }
console.log("All loader selectors and keyframes present in the loaders-only bundle.");

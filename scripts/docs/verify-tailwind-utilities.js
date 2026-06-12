#!/usr/bin/env node
/**
 * Tailwind tab enforcement (Phase 4 §5): compiles EVERY registry utility
 * against the real plugin in the tailwind-v4 example's toolchain.
 * An unknown utility (= a tab that would copy-paste into nothing) fails.
 */
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..", "..");
const APP = path.join(ROOT, "examples", "tailwind-v4");
const registry = JSON.parse(fs.readFileSync(path.join(ROOT, "registry", "motion.registry.json"), "utf8"));

const utilities = registry.classes
  .filter((c) => c.kind === "effect" && !c.aliasOf && !c.requiresJs &&
    ["text", "buttons", "inputs", "cards", "loaders", "scroll"].includes(c.category))
  .map((c) => `animate-${c.name}`);

fs.writeFileSync(path.join(APP, ".probe-all.html"),
  utilities.map((u) => `<i class="${u}"></i><i class="${u}-slow"></i>`).join("\n"));
fs.writeFileSync(path.join(APP, ".probe-all.css"),
  `@import "tailwindcss" source(none);\n@source "./.probe-all.html";\n@import "@salkomdesignstudio/motion-forge-tailwind";\n`);

execSync("npx tailwindcss -i .probe-all.css -o dist/.probe-all.out.css --minify", { cwd: APP, stdio: "pipe" });
const out = fs.readFileSync(path.join(APP, "dist", ".probe-all.out.css"), "utf8");

const esc = (s) => s.replace(/-/g, "\\-"); // minified output keeps plain names
let missing = 0;
for (const u of utilities) {
  if (!out.includes(`.${u}`)) { console.error(`  x utility not compiled: ${u}`); missing++; }
  if (!out.includes(`.${u}-slow`)) { console.error(`  x speed variant not compiled: ${u}-slow`); missing++; }
}
fs.rmSync(path.join(APP, ".probe-all.html"), { force: true });
fs.rmSync(path.join(APP, ".probe-all.css"), { force: true });

if (missing) { console.error(`FAIL: ${missing} utilities missing from compiled output.`); process.exit(1); }
console.log(`PASS: all ${utilities.length} utilities + ${utilities.length} speed variants compile (output ${(out.length / 1024).toFixed(0)} KB).`);

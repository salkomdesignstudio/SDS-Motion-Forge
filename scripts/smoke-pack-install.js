#!/usr/bin/env node
/**
 * Pack-tarball-and-install smoke test (Phase 3 CI gate).
 *
 * Examples normally consume the repo via file: symlinks. This script proves
 * the REAL npm-install path: it `npm pack`s the core package and every
 * wrapper package, installs the tarballs into each example app (--no-save,
 * overriding the symlinks), and builds the app. A package that only works
 * from the repo (missing files in the tarball, broken exports, postinstall
 * assumptions) fails here.
 *
 * Usage: node scripts/smoke-pack-install.js [exampleName ...]
 */
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const os = require("os");

const ROOT = path.join(__dirname, "..");
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), "sds-smoke-"));

function sh(cmd, cwd) {
  console.log(`  $ ${cmd}  (${path.relative(ROOT, cwd) || "."})`);
  execSync(cmd, { cwd, stdio: ["ignore", "inherit", "inherit"] });
}

function pack(dir) {
  const out = execSync(`npm pack --pack-destination "${TMP}" --json`, { cwd: dir })
    .toString().trim();
  const info = JSON.parse(out);
  return path.join(TMP, info[0].filename);
}

console.log("\n=== smoke-pack-install ===");
console.log("[1/3] Packing tarballs...");
const tarballs = {
  core: pack(ROOT),
  react: pack(path.join(ROOT, "packages", "react")),
  tailwind: pack(path.join(ROOT, "packages", "tailwind")),
  elements: pack(path.join(ROOT, "packages", "elements")),
  angular: pack(path.join(ROOT, "packages", "angular", "dist")),
};
Object.entries(tarballs).forEach(([k, v]) => console.log(`  ${k}: ${path.basename(v)}`));

const EXAMPLES = {
  "vite-loaders": ["core"],
  "tailwind-v4": ["tailwind"],
  "nextjs": ["core", "react"],
  "angular": ["core", "angular"],
};

const only = process.argv.slice(2);
let failures = 0;

console.log("[2/3] Installing tarballs into examples and building...");
for (const [example, pkgs] of Object.entries(EXAMPLES)) {
  if (only.length && !only.includes(example)) continue;
  const dir = path.join(ROOT, "examples", example);
  console.log(`\n--- ${example} (${pkgs.join(", ")}) ---`);
  try {
    const files = pkgs.map((p) => `"${tarballs[p]}"`).join(" ");
    sh(`npm install --no-save ${files}`, dir);
    sh("npm run build", dir);
    console.log(`  ok ${example} builds from packed tarballs`);
  } catch (e) {
    console.error(`  x ${example} FAILED against packed tarballs`);
    failures++;
  }
}

console.log("\n[3/3] Restoring symlinked workspace installs...");
for (const example of Object.keys(EXAMPLES)) {
  if (only.length && !only.includes(example)) continue;
  try { sh("npm install --no-audit --no-fund", path.join(ROOT, "examples", example)); }
  catch { /* restoration best-effort; CI uses fresh checkouts */ }
}

fs.rmSync(TMP, { recursive: true, force: true });
if (failures) { console.error(`\nFAIL: ${failures} example(s) broke on the npm-install path.`); process.exit(1); }
console.log("\nPASS: all examples build from packed tarballs.");

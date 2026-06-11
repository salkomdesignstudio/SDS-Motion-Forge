#!/usr/bin/env node
/**
 * One-time generator (kept for audit) of the R4 compositor quarantine:
 * every @keyframes shipped in 4.0.3 that animates non-compositor properties,
 * with exactly the offending properties it is allowed to keep.
 *
 * The list is FROZEN: the stylelint rule (sds/compositor-only) allows these
 * keyframes their listed legacy properties and nothing more; new keyframes
 * are never added here — they must be compositor-only.
 */
const fs = require("fs");
const path = require("path");
const postcss = require("postcss");

const ROOT = path.join(__dirname, "..");
const ALLOWED = require("./stylelint/allowed-props.cjs");

const quarantine = {};
for (const file of ["core", "text", "buttons", "inputs", "cards", "loaders", "scroll"]) {
  const root = postcss.parse(fs.readFileSync(path.join(ROOT, "src", "categories", `${file}.css`), "utf8"));
  root.walkAtRules(/^(-webkit-)?keyframes$/, (at) => {
    const name = at.params.trim();
    const offending = new Set(quarantine[name] || []);
    at.walkRules((r) => r.walkDecls((d) => {
      const p = d.prop.toLowerCase();
      if (!p.startsWith("--") && !ALLOWED.has(p)) offending.add(p);
    }));
    if (offending.size) quarantine[name] = [...offending].sort();
  });
}

const out = path.join(ROOT, "compat", "compositor-quarantine.json");
fs.writeFileSync(out, JSON.stringify({
  $comment: "FROZEN R4 quarantine — keyframes shipped in 4.0.3 that animate non-compositor properties, with exactly the properties they may keep. Never add entries; new keyframes must be compositor-only (transform/opacity/filter/clip-path/custom props). Enforced by stylelint rule sds/compositor-only.",
  generatedFrom: "4.0.3 source",
  keyframes: quarantine,
}, null, 2) + "\n");
console.log(`Quarantined keyframes: ${Object.keys(quarantine).length} -> compat/compositor-quarantine.json`);

#!/usr/bin/env node
/** Merges authored {class: {displayName, description}} entries into
 *  registry/meta/descriptions.json (the single authored home, R3).
 *  Usage: node scripts/docs/merge-descriptions.cjs <entries.json> */
const fs = require("fs");
const path = require("path");
const metaPath = path.join(__dirname, "..", "..", "registry", "meta", "descriptions.json");
const meta = JSON.parse(fs.readFileSync(metaPath, "utf8"));
const add = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
let n = 0;
for (const [cls, entry] of Object.entries(add)) {
  meta[cls] = { ...entry, source: entry.source || "phase6-authored" };
  n++;
}
fs.writeFileSync(metaPath, JSON.stringify(meta, null, 2) + "\n");
console.log(`merged ${n} authored descriptions`);

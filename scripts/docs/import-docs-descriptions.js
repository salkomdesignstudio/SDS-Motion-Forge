#!/usr/bin/env node
/**
 * One-time import (kept for audit): harvests the hand-written animation
 * names/descriptions from the docs page's ANIMATIONS literal into
 * registry/meta/descriptions.json — the single authored home for effect
 * copy (R3). Run BEFORE the Phase 4 docs-page surgery deletes the literal.
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..", "..");
const html = fs.readFileSync(path.join(ROOT, "docs", "index.html"), "utf8");
const metaPath = path.join(ROOT, "registry", "meta", "descriptions.json");
const meta = JSON.parse(fs.readFileSync(metaPath, "utf8"));

const entryRe = /\{\s*name:\s*"([^"]+)",\s*cls:\s*"([^"]+)",\s*tag:\s*"([^"]+)",\s*desc:\s*"([^"]+)"/g;
let m, imported = 0, skipped = 0;
while ((m = entryRe.exec(html))) {
  const [, name, cls, tag, desc] = m;
  if (!meta[cls]) { skipped++; continue; }
  const cur = meta[cls];
  // only overwrite machine-seeded copy; keep anything later hand-authored
  if (cur.seeded || !cur.description) {
    meta[cls] = { description: desc, displayName: name, source: "docs-import" };
    imported++;
  }
}

fs.writeFileSync(metaPath, JSON.stringify(meta, null, 2) + "\n");
console.log(`Imported ${imported} descriptions from docs ANIMATIONS literal (${skipped} classes not in registry meta).`);

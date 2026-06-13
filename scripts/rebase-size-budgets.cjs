#!/usr/bin/env node
/** Re-bases size-limit budgets to current size +4% for the given paths.
 *  Used after each approved Phase 6 batch — growth is catalogue content,
 *  and every re-base is recorded in the commit message.
 *  Usage: node scripts/rebase-size-budgets.cjs <path> [<path> ...] */
const fs = require("fs");
const cfg = JSON.parse(fs.readFileSync(".size-limit.json", "utf8"));
for (const p of process.argv.slice(2)) {
  const e = cfg.find((c) => c.path === p);
  if (!e) { console.error(`no budget entry for ${p}`); process.exit(1); }
  const cur = fs.statSync(p).size;
  const old = e.limit;
  e.limit = Math.ceil(cur * 1.04) + " B";
  console.log(`${p}: ${old} -> ${e.limit} (current ${cur} B)`);
}
fs.writeFileSync(".size-limit.json", JSON.stringify(cfg, null, 2) + "\n");

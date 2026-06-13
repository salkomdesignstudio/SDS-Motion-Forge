#!/usr/bin/env node
/**
 * Generates docs/batch-preview.html — a focused review page for a Phase 6
 * batch: each effect on a large stage with its name, description and replay,
 * using the SAME registry-generated markup as the gallery and snippets.
 * Usage: node scripts/docs/generate-batch-preview.js sds-a sds-b ...
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..", "..");
const docsDataSrc = fs.readFileSync(path.join(ROOT, "docs", "docs-data.js"), "utf8");
const SDS_DOCS = JSON.parse(docsDataSrc.slice(docsDataSrc.indexOf("{"), docsDataSrc.lastIndexOf("}") + 1));
const registry = JSON.parse(fs.readFileSync(path.join(ROOT, "registry", "motion.registry.json"), "utf8"));
const byName = Object.fromEntries(registry.classes.map((c) => [c.name, c]));

const classes = process.argv.slice(2);
if (!classes.length) { console.error("usage: generate-batch-preview.js <class...>"); process.exit(1); }

const cells = classes.map((cls) => {
  const c = byName[cls];
  if (!c) throw new Error(`not in registry: ${cls}`);
  return `<section class="cell">
    <div class="stage">${SDS_DOCS.markup[cls]}</div>
    <h2>${c.displayName} <code>${cls}</code></h2>
    <p>${c.description}</p>
    <button class="replay" data-target="${cls}">⟳ Replay</button>
  </section>`;
}).join("\n");

fs.writeFileSync(path.join(ROOT, "docs", "batch-preview.html"), `<!doctype html>
<html lang="en"><head><meta charset="utf-8" />
<title>Batch preview — ${classes.length} effects</title>
<link rel="stylesheet" href="../dist/motion.css" />
<style>
  body { font-family: system-ui, sans-serif; background: #f7f7f9; margin: 0; padding: 28px; }
  h1 { font-size: 18px; }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(330px, 1fr)); gap: 20px; }
  .cell { background: #fff; border: 1px solid rgba(8,8,12,.08); border-radius: 14px; padding: 18px; }
  .stage { height: 130px; display: flex; align-items: center; justify-content: center; overflow: hidden;
           border: 1px dashed rgba(8,8,12,.1); border-radius: 10px; position: relative; }
  .stage button { padding: 12px 26px; border: none; border-radius: 12px; background: #0015d1; color: #fff;
                  font-weight: 700; font-size: 15px; }
  .stage h1 { font-size: 22px; margin: 0; }
  h2 { font-size: 14px; } h2 code { color: #5e5e68; font-weight: 400; font-size: 12px; }
  p { font-size: 13px; color: #34343f; }
  .replay { padding: 6px 12px; border: 1px solid rgba(8,8,12,.15); background: #fff; border-radius: 8px; cursor: pointer; }
</style></head><body>
<h1>Phase 6 batch preview — ${classes.length} effects</h1>
<div class="grid">
${cells}
</div>
<script>
document.querySelectorAll(".replay").forEach(function (b) {
  b.onclick = function () {
    var el = b.parentElement.querySelector("." + b.dataset.target);
    var targets = [el].concat([].slice.call(el.querySelectorAll("*")));
    targets.forEach(function (t) { t.style.animation = "none"; });
    void el.offsetWidth;
    targets.forEach(function (t) { t.style.animation = ""; });
  };
});
</script>
</body></html>
`);
console.log(`docs/batch-preview.html: ${classes.length} effects`);

#!/usr/bin/env node
/**
 * SDS Motion Forge — Published-Tarball Compatibility Gate (R1)
 *
 * THE PUBLISHED TARBALL IS THE CONTRACT.
 *
 * Compares the freshly built package against the committed baseline
 * extracted from the published npm tarball (baseline/extracted/):
 *
 *   1. Exports map — every subpath resolvable in the published package
 *      must resolve identically in the new package.json.
 *   2. Per-class CSS — for every selector in the published dist/motion.css:
 *      selector still exists (same cascade context), animation-name set is
 *      identical, computed duration / easing / delay / fill-mode / iteration /
 *      direction are identical after var() resolution against each side's
 *      :root, and every non-animation declaration is value-identical.
 *   3. Keyframes — every published @keyframes block exists with equivalent
 *      frame offsets and declarations (var()-resolved, normalized).
 *   4. JS public API surface — data attributes, globals, options and class
 *      hooks of sds-scroll.js and motion-interactive.js.
 *
 * ANY deviation fails the build unless it is listed in
 * compat/approved-deviations.json (explicit, written approval).
 * A full report is generated at compat/compatibility-report.md on every run.
 */

const fs = require("fs");
const path = require("path");
const {
  resolveVars, normalizeValue, parseAnimationShorthand, buildModel,
} = require("./lib/css-model");

const ROOT = path.join(__dirname, "..");
const BASE = path.join(ROOT, "baseline", "extracted");

if (!fs.existsSync(BASE)) {
  console.error("baseline/extracted/ not found. Run:");
  console.error("  npm pack @salkomdesignstudio/sds-motion-forge@latest --pack-destination baseline");
  console.error("  tar -xzf baseline/<tarball>.tgz -C baseline && rename package -> extracted");
  process.exit(1);
}

const approvedPath = path.join(ROOT, "compat", "approved-deviations.json");
const approved = fs.existsSync(approvedPath)
  ? JSON.parse(fs.readFileSync(approvedPath, "utf8")).deviations || []
  : [];

const deviations = []; // { id, kind, detail, approved: bool }

function record(kind, id, detail) {
  const appr = approved.find((a) => a.id === id);
  deviations.push({ id, kind, detail, approved: !!appr, reason: appr ? appr.reason : null });
}

/* ════════════════ 1. EXPORTS MAP ════════════════ */
const basePkg = JSON.parse(fs.readFileSync(path.join(BASE, "package.json"), "utf8"));
const newPkg = JSON.parse(fs.readFileSync(path.join(ROOT, "package.json"), "utf8"));

function flattenExport(v) {
  return typeof v === "string" ? { default: v } : v;
}

for (const [subpath, target] of Object.entries(basePkg.exports || {})) {
  const newTarget = (newPkg.exports || {})[subpath];
  if (newTarget === undefined) {
    record("exports", `exports:${subpath}:removed`, `Export subpath "${subpath}" exists in published package but is missing in new package.json`);
    continue;
  }
  const a = flattenExport(target);
  const b = flattenExport(newTarget);
  for (const [cond, file] of Object.entries(a)) {
    if (b[cond] !== file) {
      record("exports", `exports:${subpath}:${cond}`, `Export "${subpath}" condition "${cond}": published -> ${file}, new -> ${b[cond] || "(missing)"}`);
    } else {
      const resolved = path.join(ROOT, file);
      if (!fs.existsSync(resolved)) {
        record("exports", `exports:${subpath}:${cond}:unresolvable`, `Export "${subpath}" -> ${file} does not exist on disk in the new build`);
      }
    }
  }
}

for (const field of ["main", "style", "types", "unpkg", "jsdelivr"]) {
  if (basePkg[field] !== newPkg[field]) {
    record("exports", `pkg:${field}`, `package.json "${field}": published -> ${basePkg[field]}, new -> ${newPkg[field]}`);
  }
}
{
  const a = JSON.stringify(basePkg.sideEffects);
  const b = JSON.stringify(newPkg.sideEffects);
  if (a !== b) record("exports", "pkg:sideEffects", `sideEffects changed: ${a} -> ${b}`);
}

/* ════════════════ 2 + 3. CSS COMPARISON ════════════════ */
const baseCssPath = path.join(BASE, "dist", "motion.css");
const newCssPath = path.join(ROOT, "dist", "motion.css");
if (!fs.existsSync(newCssPath)) {
  console.error("dist/motion.css missing — run the build first.");
  process.exit(1);
}

const baseModel = buildModel(fs.readFileSync(baseCssPath, "utf8"));
const newModel = buildModel(fs.readFileSync(newCssPath, "utf8"));

function computedDecls(rule, vars) {
  // returns Map prop -> ordered array of "value!important" computed strings
  const map = new Map();
  for (const d of rule.decls) {
    let v;
    if (d.prop === "animation" || d.prop === "-webkit-animation") {
      const parts = parseAnimationShorthand(resolveVars(d.value, vars));
      v = "ANIM<" + parts.map((p) =>
        `${p.name}|${p.duration}|${p.easing}|${p.delay}|${p.iterations}|${p.direction}|${p.fill}|${p.playState}`
      ).join(" ;; ") + ">";
    } else {
      v = normalizeValue(resolveVars(d.value, vars));
    }
    if (d.important) v += " !important";
    if (!map.has(d.prop)) map.set(d.prop, []);
    map.get(d.prop).push(v);
  }
  return map;
}

function groupRules(model) {
  // key: context + '|' + INDIVIDUAL selector -> array of rules in source order.
  // Selector lists are exploded so that structurally splitting a multi-selector
  // rule (same declarations per selector) is not a deviation, while any change
  // to what a given selector receives still is.
  const map = new Map();
  for (const r of model.rules) {
    for (const sel of r.selector.split(",").map((s) => s.replace(/\s+/g, " ").trim())) {
      const key = `${r.context}|${sel}`;
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(r);
    }
  }
  return map;
}

const baseRules = groupRules(baseModel);
const newRules = groupRules(newModel);

for (const [key, bRulesArr] of baseRules) {
  const nRulesArr = newRules.get(key);
  if (!nRulesArr) {
    record("css-selector", `selector:${key}`, `Selector missing in new build: ${key}`);
    continue;
  }
  if (nRulesArr.length !== bRulesArr.length) {
    record("css-selector", `selector-count:${key}`, `Selector "${key}" occurs ${bRulesArr.length}x in published, ${nRulesArr.length}x in new build (cascade order risk)`);
  }
  const isRootRule = bRulesArr[0].selector.split(",").map((s) => s.trim()).includes(":root");
  const n = Math.min(bRulesArr.length, nRulesArr.length);
  for (let i = 0; i < n; i++) {
    const bd = computedDecls(bRulesArr[i], baseModel.rootVars);
    const nd = computedDecls(nRulesArr[i], newModel.rootVars);
    // 1) every published declaration must survive with identical computed value(s)
    for (const [prop, bVals] of bd) {
      const nVals = nd.get(prop);
      if (!nVals) {
        record("css-decl", `decl-removed:${key}#${i}:${prop}`,
          `"${key}" (occurrence ${i + 1}): property "${prop}" removed (published value: ${bVals.join(" | ")})`);
      } else if (bVals.join("\n") !== nVals.join("\n")) {
        record("css-decl", `decl-changed:${key}#${i}:${prop}`,
          `"${key}" (occurrence ${i + 1}): "${prop}" published "${bVals.join(" | ")}" vs new "${nVals.join(" | ")}"`);
      }
    }
    // 2) added declarations are deviations too — except new custom properties
    //    on :root (the sanctioned, additive token mechanism)
    for (const [prop, nVals] of nd) {
      if (bd.has(prop)) continue;
      if (isRootRule && prop.startsWith("--")) continue;
      record("css-decl", `decl-added:${key}#${i}:${prop}`,
        `"${key}" (occurrence ${i + 1}): new property "${prop}: ${nVals.join(" | ")}" added to a published rule`);
    }
  }
}

/* keyframes */
for (const [name, bKf] of Object.entries(baseModel.keyframes)) {
  const nKf = newModel.keyframes[name];
  if (!nKf) {
    record("keyframes", `keyframes:${name}`, `@${name} missing in new build`);
    continue;
  }
  const canon = (kf, vars) => kf.frames.map((f) =>
    `${f.selector}{${f.decls.map((d) => `${d.prop}:${normalizeValue(resolveVars(d.value, vars))}`).join(";")}}`
  ).join(" ");
  if (canon(bKf, baseModel.rootVars) !== canon(nKf, newModel.rootVars)) {
    record("keyframes", `keyframes-content:${name}`, `@${name} frame content differs between published and new build`);
  }
}

/* :root token defaults: existing tokens must keep identical computed values */
for (const [prop, val] of Object.entries(baseModel.rootVars)) {
  const newVal = newModel.rootVars[prop];
  if (newVal === undefined) {
    record("tokens", `rootvar:${prop}`, `:root ${prop} removed`);
  } else if (normalizeValue(resolveVars(newVal, newModel.rootVars)) !== normalizeValue(resolveVars(val, baseModel.rootVars))) {
    record("tokens", `rootvar-value:${prop}`, `:root ${prop}: published "${val}" vs new computed "${resolveVars(newVal, newModel.rootVars)}"`);
  }
}

/* ════════════════ 4. JS API SURFACE ════════════════ */
function jsSurface(src) {
  return {
    dataAttrs: [...new Set([...src.matchAll(/data(?:set\.([a-zA-Z]+)|-([a-z-]+))/g)]
      .map((m) => m[1] || m[2]).filter(Boolean))].sort(),
    globals: [...new Set([...src.matchAll(/global\.(\w+)\s*=|window\.(\w+)\s*=/g)]
      .map((m) => m[1] || m[2]).filter(Boolean))].sort(),
    apiMethods: (() => {
      const m = src.match(/SDSInteractive\s*=\s*\{([^}]*)\}/);
      return m ? m[1].split(",").map((s) => s.split(":")[0].trim()).filter(Boolean).sort() : [];
    })(),
    classHooks: [...new Set([...src.matchAll(/['"]\.?(sds-[a-z-]+)['"]/g)].map((m) => m[1]))].sort(),
  };
}

for (const jsFile of ["sds-scroll.js", "motion-interactive.js"]) {
  const bSrc = fs.readFileSync(path.join(BASE, "src", jsFile), "utf8").replace(/\r\n/g, "\n");
  const nPath = path.join(ROOT, "src", jsFile);
  if (!fs.existsSync(nPath)) {
    record("js-api", `js:${jsFile}:missing`, `src/${jsFile} removed`);
    continue;
  }
  const nSrc = fs.readFileSync(nPath, "utf8").replace(/\r\n/g, "\n");
  if (bSrc === nSrc) continue; // byte-identical, nothing to check
  const bs = jsSurface(bSrc);
  const ns = jsSurface(nSrc);
  for (const k of Object.keys(bs)) {
    const missing = bs[k].filter((x) => !ns[k].includes(x));
    if (missing.length) {
      record("js-api", `js:${jsFile}:${k}`, `src/${jsFile} lost public surface (${k}): ${missing.join(", ")}`);
    }
  }
}

/* ════════════════ REPORT + VERDICT ════════════════ */
const unapproved = deviations.filter((d) => !d.approved);
const approvedHits = deviations.filter((d) => d.approved);

const report = [];
report.push("# Compatibility Report — new build vs published tarball");
report.push("");
report.push(`- Generated: ${new Date().toISOString()}`);
report.push(`- Baseline: ${basePkg.name}@${basePkg.version} (baseline/extracted)`);
report.push(`- Candidate: ${newPkg.name}@${newPkg.version} (working tree build)`);
report.push(`- Selectors compared: ${baseRules.size}`);
report.push(`- Keyframes compared: ${Object.keys(baseModel.keyframes).length}`);
report.push(`- Deviations found: ${deviations.length} (approved: ${approvedHits.length}, UNAPPROVED: ${unapproved.length})`);
report.push("");
if (deviations.length === 0) {
  report.push("**Result: PASS — zero deviations. The new build is computed-value-identical to the published package.**");
} else {
  if (unapproved.length) {
    report.push("## UNAPPROVED deviations (build FAILS)");
    report.push("");
    unapproved.forEach((d) => report.push(`- \`${d.id}\` [${d.kind}] — ${d.detail}`));
    report.push("");
  }
  if (approvedHits.length) {
    report.push("## Approved deviations (allowed by compat/approved-deviations.json)");
    report.push("");
    approvedHits.forEach((d) => report.push(`- \`${d.id}\` [${d.kind}] — ${d.detail}`));
    report.push("    - reason: " + (approvedHits.reason || ""));
    report.push("");
  }
  report.push(unapproved.length ? "**Result: FAIL**" : "**Result: PASS (all deviations explicitly approved)**");
}

fs.mkdirSync(path.join(ROOT, "compat"), { recursive: true });
fs.writeFileSync(path.join(ROOT, "compat", "compatibility-report.md"), report.join("\n"));

console.log("\n=== verify-against-published (R1 gate) ===");
console.log(`Baseline ${basePkg.version} -> candidate ${newPkg.version}`);
console.log(`Selectors compared: ${baseRules.size}, keyframes: ${Object.keys(baseModel.keyframes).length}`);
console.log(`Deviations: ${deviations.length} (approved ${approvedHits.length} / unapproved ${unapproved.length})`);
console.log(`Report: compat/compatibility-report.md`);
if (unapproved.length) {
  unapproved.slice(0, 25).forEach((d) => console.error(`  x ${d.id}: ${d.detail}`));
  if (unapproved.length > 25) console.error(`  ...and ${unapproved.length - 25} more (see report)`);
  console.error("\nFAIL: unapproved deviations from the published contract.");
  process.exit(1);
}
console.log("PASS: new build honors the published contract.");

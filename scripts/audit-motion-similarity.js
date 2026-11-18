#!/usr/bin/env node
/**
 * Motion-similarity audit — "is this effect a duplicate of another one?"
 *
 * Keyframe text can differ while the motion is the same (or the reverse), so this
 * measures the MOTION itself. Every text effect is rendered in Chrome from the
 * generated docs markup, all its CSS animations (host, children, ::before/::after)
 * are paused and sampled at 28 moments across the effect's whole timeline, and each
 * moment is reduced to a feature vector (translate x/y in em, scale x/y, rotation,
 * skew, opacity, blur, clip-path in use) taken as the mean AND the spread across the
 * animated elements (the spread captures staggers and per-letter variation).
 * Time is normalised per effect, so a slow and a fast version of the same shape count
 * as the same. Distances are then z-scored per feature.
 *
 *   node scripts/audit-motion-similarity.js            # report
 *   node scripts/audit-motion-similarity.js --check    # exit 1 if a NEW effect is a
 *                                                      # near-duplicate of an existing one
 *
 * "New" = registry sinceVersion newer than the last release baseline (pass
 * --since=5.1.0, default: classes whose sinceVersion equals package.json version).
 * Threshold: a new effect fails when its nearest existing neighbour is closer than the
 * 5th percentile of existing-to-existing nearest-neighbour distances, i.e. closer than
 * the most similar pairs the library already ships.
 */
"use strict";
const fs = require("fs");
const path = require("path");
const { chromium } = require("@playwright/test");

const ROOT = path.join(__dirname, "..");
const CHECK = process.argv.includes("--check");
const sinceArg = (process.argv.find((a) => a.startsWith("--since=")) || "").split("=")[1];
const registry = JSON.parse(fs.readFileSync(path.join(ROOT, "registry", "motion.registry.json"), "utf8"));
const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, "package.json"), "utf8"));
const since = sinceArg || pkg.version;
const docsData = (() => {
  const t = fs.readFileSync(path.join(ROOT, "docs", "docs-data.js"), "utf8");
  return JSON.parse(t.slice(t.indexOf("{"), t.lastIndexOf("}") + 1));
})();

const effects = registry.classes.filter((c) => c.kind === "effect" && c.category === "text" && !c.aliasOf);
const isNew = (c) => c.sinceVersion === since;
const K = 28;

async function sample() {
  const css = fs.readFileSync(path.join(ROOT, "dist", "categories", "text.min.css"), "utf8");
  const cells = effects
    .map((c) => `<div class="cell" id="c-${c.name}">${docsData.markup[c.name] || `<h1 class="${c.name}">${c.displayName}</h1>`}</div>`)
    .join("");
  const html = `<!doctype html><meta charset=utf-8><style>${css}
body{margin:0;padding:20px;font:600 32px/1.2 system-ui,Arial,sans-serif;color:#171717;background:#fff}
.cell{padding:30px 10px;min-height:70px}.cell h1{margin:0;font:inherit}</style>${cells}`;
  let browser;
  try { browser = await chromium.launch(); } catch { browser = await chromium.launch({ channel: "chrome" }); }
  const page = await browser.newPage({ viewport: { width: 1200, height: 900 } });
  await page.setContent(html);
  const names = effects.map((c) => c.name);
  const out = await page.evaluate(({ names, K }) => {
    // visible fraction + centroid of a computed clip-path (inset() or polygon()), on a 24x12 grid
    const clipFeat = (str, W, H) => { try { return clipFeat0(str, W, H); } catch { return [1, 0.5, 0.5]; } };
    const clipFeat0 = (str, W, H) => {
      if (!str || str === "none") return [1, 0.5, 0.5];
      const len = (t, ref) => { if (t === undefined || /calc|var/.test(t)) throw new Error("unsupported"); return t.endsWith("%") ? (parseFloat(t) / 100) * ref : parseFloat(t); };
      let inside;
      const im = str.match(/^inset\((.*)\)$/);
      const pm = str.match(/^polygon\((?:[a-z-]+,\s*)?(.*)\)$/);
      if (im) {
        const v = im[1].split(/\s+/).map((x) => x.replace(",", ""));
        const [t, r, bt, l] = [v[0], v[1] ?? v[0], v[2] ?? v[0], v[3] ?? v[1] ?? v[0]];
        const T = len(t, H), R = len(r, W), B = len(bt, H), L = len(l, W);
        inside = (x, y) => x >= L && x <= W - R && y >= T && y <= H - B;
      } else if (pm) {
        const pts = pm[1].split(/,\s*/).map((q) => { const [x, y] = q.trim().split(/\s+/); return [len(x, W), len(y, H)]; });
        inside = (x, y) => { let c = false; for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) { const [xi, yi] = pts[i], [xj, yj] = pts[j]; if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c; } return c; };
      } else return [1, 0.5, 0.5];
      let n = 0, sx = 0, sy = 0;
      for (let i = 0; i < 24; i++) for (let j = 0; j < 12; j++) { const x = ((i + 0.5) / 24) * W, y = ((j + 0.5) / 12) * H; if (inside(x, y)) { n++; sx += i / 23; sy += j / 11; } }
      return n ? [n / 288, sx / n, sy / n] : [0, 0.5, 0.5];
    };
    const rgb = (c) => { const m = String(c).match(/[\d.]+/g) || [0, 0, 0]; return [m[0] / 255, m[1] / 255, m[2] / 255]; };
    const features = (el, pseudo) => {
      const cs = getComputedStyle(el, pseudo || null);
      const fs = parseFloat(cs.fontSize) || 32;
      const r = (pseudo ? el.parentElement && el : el).getBoundingClientRect();
      const W = r.width || 1, H = r.height || 1;
      const m = new DOMMatrix(cs.transform === "none" ? undefined : cs.transform);
      const tr = cs.translate === "none" ? [0, 0] : cs.translate.split(" ").map(parseFloat);
      const rot = cs.rotate === "none" ? 0 : parseFloat(cs.rotate);
      let sc = cs.scale === "none" ? [1, 1] : cs.scale.split(" ").map(parseFloat);
      if (sc.length === 1) sc = [sc[0], sc[0]];
      const rotT = (Math.atan2(m.b, m.a) * 180) / Math.PI;
      const sx = Math.hypot(m.a, m.b) * sc[0], sy = Math.hypot(m.c, m.d) * sc[1];
      const skew = (Math.atan2(m.c, m.d) * 180) / Math.PI - rotT;
      const blur = ((cs.filter.match(/blur\(([\d.]+)px\)/) || [])[1] || 0) / fs;
      const shadow = (cs.filter.match(/drop-shadow/g) || []).length;
      const hue = parseFloat((cs.filter.match(/hue-rotate\(([-\d.]+)deg\)/) || [])[1] || 0);
      const clip = clipFeat(cs.clipPath, W, H);
      const col = rgb(cs.color);
      const ts = (cs.textShadow || "none") === "none" ? [0, 0, 0] : (cs.textShadow.match(/-?[\d.]+px/g) || []).slice(0, 3).map((v) => parseFloat(v) / fs);
      const ls = (parseFloat(cs.letterSpacing) || 0) / fs;
      const bgx = (() => { const v = String(cs.backgroundPositionX).split(",")[0]; return v.endsWith("%") ? parseFloat(v) / 100 : (parseFloat(v) || 0) / W; })();
      const bgs = (() => { const v = String(cs.backgroundSize).split(" ")[0]; return v.endsWith("%") ? parseFloat(v) / 100 : v === "auto" ? 1 : (parseFloat(v) || 0) / W; })();
      return [((m.e || 0) + (tr[0] || 0)) / fs, ((m.f || 0) + (tr[1] || 0)) / fs, sx, sy, rotT + rot, skew, parseFloat(cs.opacity), +blur, shadow, hue / 360, ...clip, ...col, ts[0] || 0, ts[1] || 0, ts[2] || 0, ls, bgx, bgs];
    };
    return names.map((n) => {
      const cell = document.getElementById("c-" + n);
      const anims = cell.getAnimations({ subtree: true });
      if (!anims.length) return { n, series: null };
      let end = 0;
      for (const a of anims) {
        const t = a.effect.getComputedTiming();
        const one = (t.delay || 0) + (typeof t.duration === "number" ? t.duration : 0);
        end = Math.max(end, isFinite(t.endTime) ? t.endTime : one);
      }
      const series = [];
      for (let k = 0; k < K; k++) {
        const t = (end * k) / (K - 1);
        const rows = [];
        for (const a of anims) {
          a.pause();
          a.currentTime = t;
        }
        const seen = new Set();
        for (const a of anims) {
          const el = a.effect.target, ps = a.effect.pseudoElement || "";
          const key = (el.id || el.className || el.tagName) + "#" + [...el.parentNode.children].indexOf(el) + ps;
          if (seen.has(key)) continue; seen.add(key);
          rows.push(features(el, ps));
        }
        const f = rows[0].length, mean = new Array(f).fill(0), sd = new Array(f).fill(0);
        for (const r of rows) r.forEach((v, i) => (mean[i] += v / rows.length));
        for (const r of rows) r.forEach((v, i) => (sd[i] += (v - mean[i]) ** 2 / rows.length));
        series.push([...mean, ...sd.map(Math.sqrt)]);
      }
      return { n, series, end };
    });
  }, { names, K });
  await browser.close();
  return out;
}

(async () => {
  const raw = (await sample()).filter((r) => r.series);
  const dim = raw[0].series[0].length;
  // z-score every feature across all effects and time steps
  const mean = new Array(dim).fill(0), sd = new Array(dim).fill(0);
  let count = 0;
  for (const r of raw) for (const row of r.series) { row.forEach((v, i) => (mean[i] += v)); count++; }
  mean.forEach((_, i) => (mean[i] /= count));
  for (const r of raw) for (const row of r.series) row.forEach((v, i) => (sd[i] += (v - mean[i]) ** 2));
  sd.forEach((_, i) => (sd[i] = Math.sqrt(sd[i] / count) || 1));
  const vec = new Map(raw.map((r) => [r.n, r.series.flatMap((row) => row.map((v, i) => (v - mean[i]) / sd[i]))]));
  const dist = (a, b) => { let s = 0; const va = vec.get(a), vb = vec.get(b); for (let i = 0; i < va.length; i++) s += (va[i] - vb[i]) ** 2; return Math.sqrt(s / va.length); };

  const byName = Object.fromEntries(effects.map((c) => [c.name, c]));
  const fresh = raw.map((r) => r.n).filter((n) => isNew(byName[n]));
  const old = raw.map((r) => r.n).filter((n) => !isNew(byName[n]));
  const nn = (n, pool) => pool.filter((m) => m !== n).map((m) => [m, dist(n, m)]).sort((a, b) => a[1] - b[1]);
  const oldNN = old.map((n) => nn(n, old)[0][1]).sort((a, b) => a - b);
  const p = (q) => oldNN[Math.floor(q * (oldNN.length - 1))];
  const thArg = (process.argv.find((a) => a.startsWith("--threshold=")) || "").split("=")[1];
  const threshold = thArg ? Number(thArg) : Math.max(p(0.05), 0.1);

  console.log(`text effects sampled: ${raw.length} (${old.length} existing, ${fresh.length} new @${since})`);
  console.log(`existing-to-existing nearest-neighbour distance: min ${oldNN[0].toFixed(3)} | p5 ${p(0.05).toFixed(3)} | median ${p(0.5).toFixed(3)} | p95 ${p(0.95).toFixed(3)}`);
  console.log(`duplicate threshold (max of the 5th percentile of what the library already ships and 0.10): ${threshold.toFixed(3)}\n`);
  let bad = 0;
  for (const n of fresh) {
    const near = nn(n, old).slice(0, 3);
    const flag = near[0][1] < threshold;
    if (flag) bad++;
    console.log(`${flag ? "TOO CLOSE" : "distinct "}  ${n.padEnd(22)} nearest: ${near.map(([m, d]) => `${m.replace("sds-", "")} ${d.toFixed(2)}`).join(" · ")}`);
  }
  // new effects must also be distinct from EACH OTHER
  const within = [];
  for (let i = 0; i < fresh.length; i++) for (let j = i + 1; j < fresh.length; j++) within.push([fresh[i], fresh[j], dist(fresh[i], fresh[j])]);
  within.sort((x, y) => x[2] - y[2]);
  console.log("\nclosest pairs AMONG the new effects:");
  within.slice(0, 3).forEach(([x, y, d]) => console.log(`  ${d.toFixed(2)}  ${x.replace("sds-", "")}  vs  ${y.replace("sds-", "")}${d < threshold ? "   <-- TOO CLOSE" : ""}`));
  bad += within.filter((w) => w[2] < threshold).length;
  const vs = (process.argv.find((a) => a.startsWith("--vs=")) || "").split("=")[1];
  if (vs) {
    console.log("\nconcept-level comparisons (new → named existing effect):");
    for (const spec of vs.split(";")) { const [a, bs] = spec.split(":"); for (const b of bs.split(",")) if (vec.has("sds-" + a) && vec.has("sds-" + b)) console.log(`  ${a.padEnd(16)} → ${b.padEnd(18)} ${dist("sds-" + a, "sds-" + b).toFixed(2)}`); }
  }
  const pairs = [];
  for (let i = 0; i < old.length; i++) for (let j = i + 1; j < old.length; j++) pairs.push([old[i], old[j], dist(old[i], old[j])]);
  pairs.sort((a, b) => a[2] - b[2]);
  console.log("\nmost similar EXISTING pairs (for reference — public API, cannot be removed):");
  pairs.slice(0, 6).forEach(([a, b, d]) => console.log(`  ${d.toFixed(3)}  ${a.replace("sds-", "")}  ≈  ${b.replace("sds-", "")}`));
  if (CHECK && bad) { console.error(`\nFAIL: ${bad} new effect(s) are near-duplicates of existing ones.`); process.exit(1); }
  console.log(CHECK ? "\nPASS: no new effect duplicates an existing one." : "");
})();

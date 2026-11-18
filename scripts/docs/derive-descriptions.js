#!/usr/bin/env node
/**
 * Derive a short, truthful "how it works" sentence for every effect whose
 * description is still the generated placeholder ("Prism — input animation.").
 *
 * Nothing is invented: each sentence is built from the effect's own CSS —
 * the properties its @keyframes animate, their direction, the trigger
 * (load / focus / hover / scroll), whether it loops, and whether the motion
 * is on the element, its children or a pseudo-element overlay.
 *
 *   node scripts/docs/derive-descriptions.js            # preview 25 samples
 *   node scripts/docs/derive-descriptions.js --write    # update registry/meta/descriptions.json
 *
 * Authored descriptions are never touched. Re-run `npm run build` afterwards.
 */
"use strict";
const fs = require("fs");
const path = require("path");
const postcss = require("postcss");

const ROOT = path.join(__dirname, "..", "..");
const WRITE = process.argv.includes("--write");
const registry = JSON.parse(fs.readFileSync(path.join(ROOT, "registry", "motion.registry.json"), "utf8"));
const META = path.join(ROOT, "registry", "meta", "descriptions.json");
const meta = JSON.parse(fs.readFileSync(META, "utf8"));
const css = postcss.parse(fs.readFileSync(path.join(ROOT, "dist", "motion.css"), "utf8"));

/* ---- keyframes -> features ------------------------------------------------ */
const kf = {};
css.walkAtRules("keyframes", (a) => {
  const frames = [];
  a.walkRules((r) => {
    const pos = r.selector.split(",").map((s) => s.trim());
    const decls = {};
    r.walkDecls((d) => (decls[d.prop] = d.value));
    pos.forEach((p) => frames.push({ p: p === "from" ? 0 : p === "to" ? 100 : parseFloat(p), decls }));
  });
  frames.sort((x, y) => x.p - y.p);
  kf[a.params] = frames;
});

const num = (v, re) => {
  const m = String(v || "").match(re);
  return m ? parseFloat(m[1]) : null;
};
function features(name) {
  const frames = kf[name] || [];
  const f = new Set();
  const get = (prop) => frames.map((x) => x.decls[prop]).filter((v) => v !== undefined);
  const tr = frames.map((x) => (x.decls.transform || "") + " " + (x.decls.translate || "") + " " + (x.decls.rotate || "") + " " + (x.decls.scale || ""));
  const op = get("opacity").map(parseFloat);
  if (op.length && Math.min(...op) < 0.5 && Math.max(...op) >= 0.9) {
    f.add(parseFloat(get("opacity")[0]) < parseFloat(get("opacity").slice(-1)[0]) ? "fade-in" : "fade-out");
  } else if (op.length > 2 && Math.max(...op) - Math.min(...op) > 0.25) f.add("flicker");
  const ty = tr.map((t) => num(t, /translateY\((-?[\d.]+)/) ?? num(t, /translate:\s*[^ ]+\s+(-?[\d.]+)/)).filter((v) => v !== null);
  const tx = tr.map((t) => num(t, /translateX\((-?[\d.]+)/)).filter((v) => v !== null);
  if (ty.length && Math.max(...ty.map(Math.abs)) > 2) f.add(ty[0] > ty[ty.length - 1] ? "from-below" : "from-above");
  if (tx.length && Math.max(...tx.map(Math.abs)) > 2) f.add(tx[0] < 0 ? "from-left" : "from-right");
  const sc = tr.map((t) => num(t, /scale\(([\d.]+)/)).filter((v) => v !== null);
  if (sc.length) {
    if (Math.min(...sc) < 0.9 && sc[0] < sc[sc.length - 1]) f.add("grow");
    else if (Math.max(...sc) > 1.08) f.add("pulse-scale");
  }
  if (tr.some((t) => /rotate/.test(t))) f.add(tr.some((t) => /rotateY|rotateX|perspective/.test(t)) ? "flip" : "rotate");
  if (tr.some((t) => /skew/.test(t))) f.add("skew");
  const fl = get("filter").join(" ");
  if (/blur\(/.test(fl)) f.add(/blur\(0/.test(get("filter")[get("filter").length - 1] || "") || num(get("filter")[0], /blur\(([\d.]+)/) > 0 ? "unblur" : "blur");
  if (/hue-rotate/.test(fl)) f.add("hue");
  if (/drop-shadow|brightness/.test(fl)) f.add("glow");
  if (get("clip-path").length) f.add("clip");
  if (get("box-shadow").length || get("text-shadow").length) f.add("shadow");
  if (get("background-position").length || get("background-size").length) f.add("sweep");
  if (get("border-color").length) f.add("border-color");
  if (get("color").length) f.add("color");
  if (get("width").length || get("max-width").length) f.add("width");
  if (get("height").length) f.add("height");
  if (get("letter-spacing").length) f.add("tracking");
  if (get("stroke-dashoffset").length) f.add("draw");
  if (get("backdrop-filter").length) f.add("backdrop");
  return f;
}

/* ---- class -> animations (self / child / pseudo / state) ------------------- */
const info = {}; // cls -> { anims: [{kf, where, state}], dur, loop }
const kfNames = Object.keys(kf);
css.walkRules((r) => {
  const decls = [];
  r.walkDecls((d) => {
    if (d.prop === "animation" || d.prop === "animation-name") decls.push(d.value);
  });
  if (!decls.length) return;
  r.selectors.forEach((sel) => {
    const re = /\.(sds-[a-z0-9-]+)/g;
    let m;
    while ((m = re.exec(sel))) {
      const cls = m[1];
      const rest = sel.slice(m.index + m[0].length);
      const where = /::?(before|after)/.test(rest) ? "pseudo" : /(\s|>)/.test(rest.trim() ? rest : "") && /^\s*[>\s]/.test(rest) ? "child" : "self";
      const state = /:focus/.test(sel) ? "focus" : /:hover/.test(sel) ? "hover" : /:active/.test(sel) ? "active" : /:checked|:valid|:invalid/.test(sel) ? "state" : "load";
      info[cls] = info[cls] || { anims: [], dur: null, loop: false };
      decls.forEach((v) => {
        const names = kfNames.filter((n) => new RegExp("(^|[\\s,])" + n.replace(/[-]/g, "\\-") + "([\\s,]|$)").test(v));
        names.forEach((n) => info[cls].anims.push({ kf: n, where, state }));
        const d = v.match(/([\d.]+)(m?s)\b/);
        if (d && info[cls].dur === null) info[cls].dur = parseFloat(d[1]) * (d[2] === "ms" ? 0.001 : 1);
        if (/infinite/.test(v)) info[cls].loop = true;
      });
    }
  });
});

/* ---- phrases -------------------------------------------------------------- */
const SUBJECT = { text: "Text", buttons: "Button", inputs: "Field", cards: "Card", loaders: "Loader", scroll: "Element" };
/* Property-level wording only. Direction words ("rises", "drops") were dropped on
   purpose: they read well but can be wrong for looping effects, and every sentence here
   must be true. */
const NOUN = {
  "from-below": "position", "from-above": "position", "from-left": "position", "from-right": "position",
  grow: "size", "pulse-scale": "size", flip: "3D rotation", rotate: "rotation", skew: "skew",
  unblur: "blur", blur: "blur", clip: "clip-path reveal", draw: "stroke", hue: "colour hue",
  glow: "glow", shadow: "shadow", sweep: "gradient position", "border-color": "border colour",
  color: "text colour", tracking: "letter-spacing", width: "width", height: "height",
  backdrop: "backdrop blur", flicker: "opacity", "fade-in": "opacity", "fade-out": "opacity",
};
const ORDER = ["position", "size", "rotation", "3D rotation", "skew", "opacity", "blur", "clip-path reveal", "stroke", "colour hue", "glow", "shadow", "gradient position", "border colour", "text colour", "letter-spacing", "width", "height", "backdrop blur"];

function describe(cls, entry) {
  const i = info[cls];
  const cat = entry.category;
  if (!i || !i.anims.length) return null;
  const subj = SUBJECT[cat] || "Element";
  const self = i.anims.filter((a) => a.where === "self" || a.where === "child");
  const pseudo = i.anims.filter((a) => a.where === "pseudo");
  const pick = (list, max) => {
    const nouns = new Set();
    list.forEach((a) => features(a.kf).forEach((x) => NOUN[x] && nouns.add(NOUN[x])));
    return ORDER.filter((n) => nouns.has(n)).slice(0, max);
  };
  const join = (a) => (a.length > 1 ? a.slice(0, -1).join(", ") + " and " + a[a.length - 1] : a[0]);
  const main = pick(self, 3);
  const over = pick(pseudo, 2);
  let phrase;
  if (main.length) phrase = `${subj} animates its ${join(main)}`;
  else if (over.length) phrase = `An overlay on the ${subj.toLowerCase()} animates its ${join(over)}`;
  else phrase = `${subj} animates`;
  if (main.length && over.length) phrase += `, plus an overlay (${join(over)})`;
  const states = i.anims.map((a) => a.state);
  const state = states.includes("focus") ? "focus" : states.includes("hover") ? "hover" : states.includes("active") ? "press" : null;
  const when =
    cat === "scroll" || entry.trigger === "scroll"
      ? "as it scrolls into view"
      : state === "focus"
        ? "when focused"
        : state === "hover"
          ? "on hover"
          : state === "press"
            ? "on press"
            : i.loop
              ? "on a loop"
              : "once on load";
  const dur = i.dur && i.dur >= 0.3 ? ` (${Math.round(i.dur * 10) / 10}s)` : "";
  return `${phrase}, ${when}${dur}.`;
}

/* ---- run ------------------------------------------------------------------ */
const out = {};
let derived = 0;
let skipped = 0;
for (const c of registry.classes) {
  const m = meta[c.name];
  if (!m || !(m.seeded || / — .* (animation|modifier)\.?$/.test(m.description || ""))) continue;
  if (c.kind === "modifier") continue;
  const d = describe(c.name, c);
  if (!d) {
    skipped++;
    continue;
  }
  out[c.name] = d;
  derived++;
}
console.log(`derived ${derived}, skipped ${skipped} (no animation found in CSS)`);
if (!WRITE) {
  Object.entries(out)
    .filter((_, i) => i % Math.ceil(derived / 25) === 0)
    .forEach(([k, v]) => console.log("  " + k.padEnd(30) + v));
} else {
  for (const [k, v] of Object.entries(out)) {
    meta[k] = { description: v, source: "derived-from-css" };
  }
  fs.writeFileSync(META, JSON.stringify(meta, null, 2) + "\n");
  console.log("updated registry/meta/descriptions.json");
}

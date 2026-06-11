/**
 * Shared CSS modeling helpers for SDS Motion Forge build tooling.
 * Used by analyze-css.js, verify-against-published.js and (later) the
 * registry generator. Zero runtime deps beyond postcss (devDependency).
 */
const postcss = require("postcss");

const TIMING_KEYWORDS = new Set([
  "linear", "ease", "ease-in", "ease-out", "ease-in-out", "step-start", "step-end",
]);
const FILL_MODES = new Set(["none", "forwards", "backwards", "both"]);
const DIRECTIONS = new Set(["normal", "reverse", "alternate", "alternate-reverse"]);
const PLAY_STATES = new Set(["running", "paused"]);

/* Split on a separator at paren-depth 0 */
function splitTopLevel(value, sep) {
  const parts = [];
  let depth = 0, cur = "";
  for (const ch of value) {
    if (ch === "(") depth++;
    if (ch === ")") depth--;
    if (ch === sep && depth === 0) { parts.push(cur.trim()); cur = ""; }
    else cur += ch;
  }
  if (cur.trim()) parts.push(cur.trim());
  return parts;
}

/**
 * Resolve var(--x, fallback) occurrences using a custom-property map.
 * Recursive (a token may reference another token). Unknown vars without
 * fallback are left intact.
 */
function resolveVars(value, varMap, depth = 0) {
  if (depth > 8 || value.indexOf("var(") === -1) return value;
  let out = "";
  let i = 0;
  while (i < value.length) {
    const idx = value.indexOf("var(", i);
    if (idx === -1) { out += value.slice(i); break; }
    out += value.slice(i, idx);
    // find matching close paren
    let d = 0, j = idx + 3; // points at '('
    for (; j < value.length; j++) {
      if (value[j] === "(") d++;
      if (value[j] === ")") { d--; if (d === 0) break; }
    }
    const inner = value.slice(idx + 4, j); // contents of var()
    const comma = (() => {
      let dd = 0;
      for (let k = 0; k < inner.length; k++) {
        if (inner[k] === "(") dd++;
        if (inner[k] === ")") dd--;
        if (inner[k] === "," && dd === 0) return k;
      }
      return -1;
    })();
    const name = (comma === -1 ? inner : inner.slice(0, comma)).trim();
    const fallback = comma === -1 ? null : inner.slice(comma + 1).trim();
    if (Object.prototype.hasOwnProperty.call(varMap, name)) {
      out += resolveVars(varMap[name], varMap, depth + 1);
    } else if (fallback !== null) {
      out += resolveVars(fallback, varMap, depth + 1);
    } else {
      out += value.slice(idx, j + 1);
    }
    i = j + 1;
  }
  return resolveVars(out, varMap, depth + 1) === out ? out : resolveVars(out, varMap, depth + 1);
}

/** Normalize a time literal: 800ms -> 0.8s, .5s -> 0.5s, 0.80s -> 0.8s */
function normalizeTime(tok) {
  const m = /^([\d.]+)(m?s)$/i.exec(tok.trim());
  if (!m) return tok.trim();
  let n = parseFloat(m[1]);
  if (m[2].toLowerCase() === "ms") n = n / 1000;
  return `${parseFloat(n.toFixed(6))}s`;
}

/** Whitespace/number normalization for value comparison */
function normalizeValue(value) {
  let v = value.trim()
    .replace(/\s+/g, " ")
    .replace(/\(\s+/g, "(")
    .replace(/\s+\)/g, ")")
    .replace(/\s*,\s*/g, ",");
  // normalize time tokens inside the value
  v = v.replace(/(^|[\s,(])([\d.]+m?s)(?=$|[\s,)])/gi, (all, pre, t) => pre + normalizeTime(t));
  // normalize leading-zero decimals: .5 -> 0.5
  v = v.replace(/(^|[\s,(])\.([0-9])/g, "$10.$2");
  return v;
}

/** Parse an animation shorthand value into longhand structs */
function parseAnimationShorthand(value) {
  return splitTopLevel(value, ",").map((single) => {
    const tokens = splitTopLevel(single.replace(/\s+/g, " "), " ");
    const out = {
      name: "none", duration: "0s", easing: "ease", delay: "0s",
      iterations: "1", direction: "normal", fill: "none", playState: "running",
    };
    const times = [];
    for (const t of tokens) {
      const lower = t.toLowerCase();
      if (/^[\d.]+m?s$/.test(lower)) {
        times.push(normalizeTime(t));
      } else if (lower.startsWith("cubic-bezier(") || lower.startsWith("steps(") || TIMING_KEYWORDS.has(lower)) {
        out.easing = normalizeValue(t);
      } else if (FILL_MODES.has(lower)) {
        out.fill = lower;
      } else if (DIRECTIONS.has(lower)) {
        out.direction = lower;
      } else if (PLAY_STATES.has(lower)) {
        out.playState = lower;
      } else if (lower === "infinite" || /^[\d.]+$/.test(lower)) {
        out.iterations = lower;
      } else {
        out.name = t;
      }
    }
    if (times.length > 0) out.duration = times[0];
    if (times.length > 1) out.delay = times[1];
    return out;
  });
}

/** Context key for a rule (media/supports wrapper) */
function contextOf(rule) {
  const parts = [];
  let p = rule.parent;
  while (p && p.type === "atrule") {
    parts.unshift(`@${p.name} ${p.params}`);
    p = p.parent;
  }
  return parts.join(" / ");
}

/**
 * Build a comparable model of a CSS file:
 * {
 *   rootVars: { '--x': value },
 *   rules: [ { context, selector, decls: [{prop, value}] } ],   // source order
 *   keyframes: { name: { context, frames: [{selector, decls:[{prop,value}]}] } },
 * }
 */
function buildModel(css) {
  const root = postcss.parse(css);
  const rootVars = {};
  const rules = [];
  const keyframes = {};

  root.walkAtRules(/^(-webkit-|-moz-|-o-)?keyframes$/, (at) => {
    const name = at.params.trim();
    const frames = [];
    at.walkRules((r) => {
      const decls = [];
      r.walkDecls((d) => decls.push({ prop: d.prop.toLowerCase(), value: d.value }));
      frames.push({ selector: r.selector.replace(/\s+/g, ""), decls });
    });
    keyframes[`${at.name}:${name}`] = { context: contextOf(at), frames };
  });

  root.walkRules((rule) => {
    if (rule.parent && rule.parent.type === "atrule" && /keyframes/.test(rule.parent.name)) return;
    const decls = [];
    rule.walkDecls((d) => {
      decls.push({ prop: d.prop, value: d.value, important: !!d.important });
      if (rule.selector.split(",").map((s) => s.trim()).includes(":root") && d.prop.startsWith("--")) {
        rootVars[d.prop] = d.value.trim();
      }
    });
    rules.push({
      context: contextOf(rule),
      selector: rule.selector.replace(/\s+/g, " ").trim(),
      decls,
    });
  });

  return { rootVars, rules, keyframes };
}

module.exports = {
  splitTopLevel,
  resolveVars,
  normalizeTime,
  normalizeValue,
  parseAnimationShorthand,
  buildModel,
};

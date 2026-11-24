/**
 * One icon set for the whole site: Remix Icon (Apache-2.0, https://remixicon.com).
 * Every icon has two drawings on a 24x24 grid, both taken from Remix:
 *   s: the line (stroke-style) icon, shown at rest
 *   f: the fill icon, shown on hover
 * The CSS in header.css cross-fades between them, so any element can use
 *   icon("mcp")  ->  <span class="ic"><svg class="ic-s">…</svg><svg class="ic-f">…</svg></span>
 * Arrows are the exception: they are always the line drawing (arrow()), they never switch to fill.
 * Paths live in remix-data.js (generated once from remixicon@4.6.0).
 */
"use strict";

const R = require("./remix-data");

/** our icon keys -> Remix icon names (each has a -line and a -fill drawing) */
const MAP = {
  all: "layout-grid", text: "t-box", buttons: "toggle", inputs: "edit-box", cards: "layout-top", loaders: "loader-4", scroll: "scroll-to-bottom",
  interactive: "cursor", install: "download-2", quick: "rocket-2", frameworks: "stack", js: "code-s-slash", theme: "palette", a11y: "accessibility",
  mcp: "plug-2", clients: "computer", llms: "file-text", log: "history", terminal: "terminal-box", globe: "global", search: "search",
  target: "focus-3", compare: "swap-box", sliders: "sound-module",
};

const path = (d) => `<path d="${d}"/>`;
const I = {};
for (const [k, n] of Object.entries(MAP)) I[k] = { s: path(R[n].line), f: path(R[n].fill), remix: n };

const OPEN = 'viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"';

/** The two-drawing icon (line at rest, fill on hover). `extra` adds classes to the wrapper. */
function icon(key, extra = "") {
  const d = I[key] || I.all;
  return `<span class="ic${extra ? " " + extra : ""}"><svg ${OPEN} width="22" height="22" class="ic-s">${d.s}</svg><svg ${OPEN} width="22" height="22" class="ic-f">${d.f}</svg></span>`;
}

/** One bare glyph (no tile): mode "f" is the fill drawing, "s" the line drawing. */
function glyph(key, mode = "f", cls = "") {
  const d = I[key] || I.all;
  return `<svg class="${cls}" ${OPEN}>${mode === "s" ? d.s : d.f}</svg>`;
}

/** Bare line/fill pair for sidebar rows (no tile): cross-fades on hover like icon(). */
function sbIcon(key) {
  const d = I[key] || I.all;
  return `<span class="sbi"><svg ${OPEN} width="20" height="20" class="ic-s">${d.s}</svg><svg ${OPEN} width="20" height="20" class="ic-f">${d.f}</svg></span>`;
}

/** A single Remix icon by name: ri("arrow-right-up") is the line drawing, ri("github","fill") the fill drawing. */
function ri(name, variant = "line", cls = "", size = 16) {
  const d = (R[name] || {})[variant];
  if (!d) throw new Error("remix icon not in remix-data.js: " + name + "-" + variant);
  return `<svg class="ri-i${cls ? " " + cls : ""}" ${OPEN} width="${size}" height="${size}">${path(d)}</svg>`;
}

/** Arrows are always the line drawing, also on hover. dir: "up-right" | "right" | "left" | "down" | "up". */
function arrow(dir = "up-right", cls = "", size = 16) {
  const n = { "up-right": "arrow-right-up", right: "arrow-right", left: "arrow-left", down: "arrow-down-s", up: "arrow-up-s" }[dir];
  return ri(n, "line", "ri-arrow" + (cls ? " " + cls : ""), size);
}

module.exports = { icon, glyph, sbIcon, ri, arrow, I, MAP };

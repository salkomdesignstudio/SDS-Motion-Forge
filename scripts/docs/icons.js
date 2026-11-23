/**
 * One icon set for the whole site. Every icon has two drawings on a 24x24 grid:
 *   s: the outline (stroke) version, shown at rest
 *   f: the filled (solid) version, shown on hover
 * The CSS in header.css cross-fades between them, so any element can use
 *   icon("mcp")  ->  <span class="ic"><svg class="ic-s">…</svg><svg class="ic-f">…</svg></span>
 * Cut-outs in the filled drawings use var(--ic-cut), which header.css sets to the tile colour.
 */
"use strict";

const CUT = 'style="fill:var(--ic-cut)"';
const CUTS = 'style="stroke:var(--ic-cut)" fill="none"';

const I = {
  all: {
    s: '<path d="M4 7h16M4 12h16M4 17h10"/>',
    f: '<path d="M3 5.5A1.5 1.5 0 0 1 4.5 4h15a1.5 1.5 0 0 1 0 3h-15A1.5 1.5 0 0 1 3 5.5zM3 12a1.5 1.5 0 0 1 1.5-1.5h15a1.5 1.5 0 0 1 0 3h-15A1.5 1.5 0 0 1 3 12zm0 6.5A1.5 1.5 0 0 1 4.5 17h9a1.5 1.5 0 0 1 0 3h-9A1.5 1.5 0 0 1 3 18.5z"/>',
  },
  text: {
    s: '<path d="M5 18 10 6l5 12M7 14h6M17 9h3M18.5 9v9"/>',
    f: '<path fill-rule="evenodd" d="M9.1 5.2a1 1 0 0 1 1.8 0l5 12a1.2 1.2 0 0 1-2.2.9L13.5 16h-7l-1.2 2.1a1.2 1.2 0 0 1-2.2-.9zM10 8.8 7.6 13.8h4.8z"/><path d="M17.8 8.5h2.4a.9.9 0 0 1 0 1.8h-.5v7.2a.9.9 0 0 1-1.8 0v-7.2h-.1a.9.9 0 0 1 0-1.8z"/>',
  },
  buttons: {
    s: '<rect x="3.5" y="8" width="17" height="8" rx="4"/><path d="M8 12h8"/>',
    f: '<path fill-rule="evenodd" d="M7.5 7h9a5 5 0 0 1 0 10h-9a5 5 0 0 1 0-10zM8 11.2h8v1.6H8z"/>',
  },
  inputs: {
    s: '<rect x="3.5" y="7" width="17" height="10" rx="3"/><path d="M8 10.5v3"/>',
    f: '<path fill-rule="evenodd" d="M6 6h12a3.5 3.5 0 0 1 3.5 3.5v5A3.5 3.5 0 0 1 18 18H6a3.5 3.5 0 0 1-3.5-3.5v-5A3.5 3.5 0 0 1 6 6zM8 9.6h1.6v4.8H8z"/>',
  },
  cards: {
    s: '<rect x="4" y="5" width="12" height="12" rx="3"/><path d="M8 19.5h11a1.5 1.5 0 0 0 1.5-1.5V9"/>',
    f: '<rect x="3.5" y="4.5" width="13" height="13" rx="3.5"/><path d="M8 19h10.5a1 1 0 0 0 1-1V9.5a1 1 0 0 1 2 0V18a3 3 0 0 1-3 3H8a1 1 0 0 1 0-2z"/>',
  },
  loaders: {
    s: '<path d="M12 4a8 8 0 1 0 8 8"/>',
    f: '<path d="M12 3a9 9 0 1 0 9 9h-3a6 6 0 1 1-6-6z"/>',
  },
  scroll: {
    s: '<path d="M12 4v14m0 0-4-4m4 4 4-4"/>',
    f: '<path d="M12 3a1.5 1.5 0 0 1 1.5 1.5v9.4l2.4-2.4a1.5 1.5 0 1 1 2.1 2.1l-5 5a1.5 1.5 0 0 1-2.1 0l-5-5a1.5 1.5 0 1 1 2.1-2.1l2.5 2.4V4.5A1.5 1.5 0 0 1 12 3z"/>',
  },
  interactive: {
    s: '<path d="m6 4 12 7-5 1.5L11 18z"/>',
    f: '<path d="M6 4 18 11l-5 1.5L11 18z" stroke-linejoin="round"/>',
  },
  install: {
    s: '<path d="M12 4v11m0 0-4-4m4 4 4-4M5 19h14"/>',
    f: '<path d="M12 2.5a1.5 1.5 0 0 1 1.5 1.5v8.4l2.4-2.4a1.5 1.5 0 0 1 2.1 2.1l-4.9 4.9a1.6 1.6 0 0 1-2.2 0L6 12.1a1.5 1.5 0 0 1 2.1-2.1l2.4 2.4V4A1.5 1.5 0 0 1 12 2.5zM5 18.5h14a1.5 1.5 0 0 1 0 3H5a1.5 1.5 0 0 1 0-3z"/>',
  },
  quick: {
    s: '<path d="M13 3 5 13h6l-1 8 8-10h-6z"/>',
    f: '<path d="M13 3 5 13h6l-1 8 8-10h-6z" stroke-linejoin="round"/>',
  },
  frameworks: {
    s: '<path d="m12 4 8 4-8 4-8-4zM4 12l8 4 8-4M4 16l8 4 8-4"/>',
    f: '<path d="m12 3.5 8.5 4.3L12 12 3.5 7.8z"/><path d="M4 11.9l8 4 8-4M4 15.9l8 4 8-4" fill="none" stroke-width="2.2"/>',
  },
  js: {
    s: '<path d="M9 8 5 12l4 4M15 8l4 4-4 4"/>',
    f: '<path d="M9 7.5 4.8 12 9 16.5M15 7.5l4.2 4.5L15 16.5" fill="none" stroke-width="3"/>',
  },
  theme: {
    s: '<circle cx="12" cy="12" r="8"/><path d="M12 4v16M12 12h8"/>',
    f: '<path d="M12 3a9 9 0 0 0 0 18z"/><circle cx="12" cy="12" r="8.2" fill="none" stroke-width="1.6"/>',
  },
  a11y: {
    s: '<circle cx="12" cy="6" r="2"/><path d="M5 9l7 2 7-2M12 11v4m-3 5 3-5 3 5"/>',
    f: '<circle cx="12" cy="5.5" r="2.6"/><path d="M4.6 8.6a1.2 1.2 0 0 1 1.4-.9L12 9.2l6-1.5a1.2 1.2 0 0 1 .7 2.3L14 11.2v3.4l2.2 5a1.2 1.2 0 0 1-2.2.9L12 16.6 10 20.5a1.2 1.2 0 0 1-2.2-.9l2.2-5v-3.4l-4.7-1.2a1.2 1.2 0 0 1-.7-1z"/>',
  },
  mcp: {
    s: '<rect x="4" y="4" width="16" height="6" rx="2"/><rect x="4" y="14" width="16" height="6" rx="2"/><path d="M8 7h.01M8 17h.01"/>',
    f: '<path fill-rule="evenodd" d="M6.5 3.5h11A2.5 2.5 0 0 1 20 6v2a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 8V6a2.5 2.5 0 0 1 2.5-2.5zM8 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2zM6.5 13.5h11A2.5 2.5 0 0 1 20 16v2a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 18v-2a2.5 2.5 0 0 1 2.5-2.5zM8 16a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>',
  },
  clients: {
    s: '<path d="M9 7 4 12l5 5M15 7l5 5-5 5"/>',
    f: '<path d="M9 7 4 12l5 5M15 7l5 5-5 5" fill="none" stroke-width="3"/>',
  },
  llms: {
    s: '<path d="M6 4h9l3 3v13H6zM9 12h6M9 16h6"/>',
    f: '<path fill-rule="evenodd" d="M7 3h7l5 5v11a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm1.5 9a.9.9 0 0 0 0 1.8h7a.9.9 0 0 0 0-1.8zm0 3.6a.9.9 0 0 0 0 1.8h7a.9.9 0 0 0 0-1.8z"/>',
  },
  log: {
    s: '<path d="M12 7v5l3 2M4 12a8 8 0 1 0 2.4-5.7M4 4v4h4"/>',
    f: '<path fill-rule="evenodd" d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zm.9 4.5a.9.9 0 0 0-1.8 0V12c0 .3.2.6.4.8l2.8 1.8a.9.9 0 0 0 1-1.5l-2.4-1.5z"/>',
  },
  terminal: {
    s: '<rect x="3" y="4.5" width="18" height="15" rx="3"/><path d="m7.5 10 3 2.5-3 2.5M13 15h4"/>',
    f: '<path fill-rule="evenodd" d="M6 4.5h12A3 3 0 0 1 21 7.5v9a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3v-9a3 3 0 0 1 3-3zM7.4 9.4a.9.9 0 0 0-.7 1.5l1.7 1.5-1.7 1.5a.9.9 0 1 0 1.2 1.4l2.4-2.2a.9.9 0 0 0 0-1.4L7.9 9.6a.9.9 0 0 0-.5-.2zm5.1 4.7a.9.9 0 0 0 0 1.8h3.6a.9.9 0 0 0 0-1.8z"/>',
  },
  globe: {
    s: '<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.5 2.4 3.6 5.2 3.6 8.5s-1.1 6.1-3.6 8.5c-2.5-2.4-3.6-5.2-3.6-8.5S9.5 5.9 12 3.5z"/>',
    f: `<circle cx="12" cy="12" r="9.5"/><path d="M2.5 12h19M12 2.5c2.7 2.6 3.9 5.8 3.9 9.5s-1.2 6.9-3.9 9.5c-2.7-2.6-3.9-5.8-3.9-9.5S9.3 5.1 12 2.5z" ${CUTS} stroke-width="1.5"/>`,
  },
  search: {
    s: '<circle cx="11" cy="11" r="6.5"/><path d="m16 16 4 4"/>',
    f: '<path fill-rule="evenodd" d="M11 3.5a7.5 7.5 0 1 0 4.6 13.4l3.5 3.5a1.2 1.2 0 0 0 1.7-1.7l-3.5-3.5A7.5 7.5 0 0 0 11 3.5zM11 6a5 5 0 1 1 0 10 5 5 0 0 1 0-10z"/>',
  },
  target: {
    s: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4"/>',
    f: `<circle cx="12" cy="12" r="9.5"/><circle cx="12" cy="12" r="5.6" ${CUT}/><circle cx="12" cy="12" r="2.8"/>`,
  },
  compare: {
    s: '<rect x="4" y="4" width="7" height="16" rx="2"/><rect x="13" y="8" width="7" height="12" rx="2"/>',
    f: '<rect x="3.5" y="3.5" width="8" height="17" rx="2.5"/><rect x="12.5" y="7.5" width="8" height="13" rx="2.5"/>',
  },
  sliders: {
    s: '<path d="M5 7h14M5 17h14"/><circle cx="9" cy="7" r="2.2"/><circle cx="15" cy="17" r="2.2"/>',
    f: '<path d="M4 7h16M4 17h16" fill="none" stroke-width="2.4"/><circle cx="9" cy="7" r="3.4"/><circle cx="15" cy="17" r="3.4"/>',
  },
};

/** The two-drawing icon. `extra` adds classes to the wrapper. */
function icon(key, extra = "") {
  const d = I[key] || I.all;
  const open = '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false"';
  return `<span class="ic${extra ? " " + extra : ""}">${open} class="ic-s">${d.s}</svg>${open} class="ic-f">${d.f}</svg></span>`;
}

module.exports = { icon, I };

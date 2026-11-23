#!/usr/bin/env node
/**
 * One header for the whole site.
 *
 * headerHtml() is the single source of the header markup. The hand-written pages
 * (home, docs, builder, 404) carry it between SITE-HEADER markers and this script keeps
 * them in sync; the page generator calls headerHtml() for every generated page.
 *
 *   node scripts/docs/site-header.js          # update the four hand-written pages
 *   node scripts/docs/site-header.js --check  # exit 1 if one of them is out of date
 *
 * Styles: docs/header.css. Behaviour (dropdowns, mobile menu, current page): docs/header.js.
 */
"use strict";
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..", "..");
const registry = JSON.parse(fs.readFileSync(path.join(ROOT, "registry", "motion.registry.json"), "utf8"));
const REPO = "https://github.com/salkomdesignstudio/SDS-Motion-Forge";

const count = (cat) => registry.classes.filter((c) => c.kind === "effect" && c.category === cat).length;
const CATS = [
  ["text", "Text"],
  ["buttons", "Buttons"],
  ["inputs", "Inputs"],
  ["cards", "Cards"],
  ["loaders", "Loaders"],
  ["scroll", "Scroll"],
];

const ICON_GH = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="currentColor"><path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.04 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.78 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.58.23 2.75.11 3.04.74.81 1.18 1.84 1.18 3.1 0 4.42-2.7 5.4-5.27 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5z"/></svg>';
const ICON_CARET = '<svg class="sh-caret" viewBox="0 0 12 12" width="12" height="12" aria-hidden="true"><path d="M2.5 4.5 6 8l3.5-3.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';

/* one small outline glyph per item (24x24, stroke only) */
const G = {
  all: '<path d="M4 7h16M4 12h16M4 17h10"/>',
  text: '<path d="M5 18 10 6l5 12M7 14h6M17 9h3M18.5 9v9"/>',
  buttons: '<rect x="3.5" y="8" width="17" height="8" rx="4"/><path d="M8 12h8"/>',
  inputs: '<rect x="3.5" y="7" width="17" height="10" rx="3"/><path d="M8 10.5v3"/>',
  cards: '<rect x="4" y="5" width="12" height="12" rx="3"/><path d="M8 19.5h11a1.5 1.5 0 0 0 1.5-1.5V9"/>',
  loaders: '<path d="M12 4a8 8 0 1 0 8 8"/>',
  scroll: '<path d="M12 4v14m0 0-4-4m4 4 4-4"/>',
  interactive: '<path d="m6 4 12 7-5 1.5L11 18z"/>',
  install: '<path d="M12 4v11m0 0-4-4m4 4 4-4M5 19h14"/>',
  quick: '<path d="M13 3 5 13h6l-1 8 8-10h-6z"/>',
  frameworks: '<path d="m12 4 8 4-8 4-8-4zM4 12l8 4 8-4M4 16l8 4 8-4"/>',
  js: '<path d="M9 8 5 12l4 4M15 8l4 4-4 4"/>',
  theme: '<circle cx="12" cy="12" r="8"/><path d="M12 4v16M12 12h8"/>',
  mcp: '<rect x="4" y="4" width="16" height="6" rx="2"/><rect x="4" y="14" width="16" height="6" rx="2"/><path d="M8 7h.01M8 17h.01"/>',
  clients: '<path d="M9 7 4 12l5 5M15 7l5 5-5 5"/>',
  llms: '<path d="M6 4h9l3 3v13H6zM9 12h6M9 16h6"/>',
  log: '<path d="M12 7v5l3 2M4 12a8 8 0 1 0 2.4-5.7M4 4v4h4"/>',
  a11y: '<circle cx="12" cy="6" r="2"/><path d="M5 9l7 2 7-2M12 11v4m-3 5 3-5 3 5"/>',
};
const ico = (k) => `<span class="sh-ico"><svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${G[k]}</svg></span>`;
const item = (href, k, title, desc, badge) => `<a href="${href}">${ico(k)}<span class="sh-txt"><b>${title}${badge ? ` <span class="sh-new">${badge}</span>` : ""}</b><small>${desc}</small></span></a>`;

function headerHtml() {
  const total = registry.classes.filter((c) => c.kind === "effect").length;
  const interactiveCount = registry.classes.filter((c) => c.kind === "interactive").length;
  const DESC = {
    text: "Headings, words and letters",
    buttons: "Ambient button effects",
    inputs: "Field and focus effects",
    cards: "Cards and surfaces",
    loaders: "Spinners and progress",
    scroll: "Reveal as you scroll",
  };
  const animItems =
    `<a class="sh-all" href="/animations/"><span><b>All animations</b><small>Browse every effect on one page</small></span><span class="sh-n">${total}</span></a>` +
    CATS.map(([id, label]) => item(`/categories/${id}/`, id, `${label} <em>${count(id)}</em>`, DESC[id])).join("") +
    item("/categories/interactive/", "interactive", `Interactive <em>${interactiveCount}</em>`, "React to the cursor");
  const docItems = [
    item("/mcp/", "mcp", "MCP for AI tools", "Let your AI search and place animations", "New"),
    item("/docs.html#install", "install", "Installation", "CDN, npm and per-category imports"),
    item("/docs.html#quickstart", "quick", "Quick start", "Your first animation"),
    item("/docs.html#frameworks", "frameworks", "Framework guides", "React, Vue, Angular, Svelte, Tailwind"),
    item("/docs.html#js-needs", "js", "What needs JavaScript", "Scripts and browser support"),
    item("/docs.html#theming", "theme", "Theming", "Colour and speed with CSS variables"),
    item("/docs.html#a11y", "a11y", "Accessibility", "Reduced motion, checked on every build"),
  ].join("");
  const resItems = [
    item("/mcp/", "mcp", "Motion Forge MCP", "Connect your AI tools", "New"),
    item("/mcp/clients/", "clients", "Connect your tool", "Claude, Cursor, VS Code and more"),
    item("/llms.txt", "llms", "llms.txt", "A plain summary for AI assistants"),
    item(`${REPO}/blob/main/CHANGELOG.md`, "log", "Changelog", "What changed in each release"),
  ].join("");
  const flat = (list) => list.map(([h, t, n]) => `<a href="${h}">${t}${n !== undefined ? `<span>${n}</span>` : ""}</a>`).join("");
  const drawer = [
    '<a href="/#why">Features</a>',
    '<p class="sh-dh">Animations</p>',
    flat([["/animations/", "All animations", total], ...CATS.map(([id, label]) => [`/categories/${id}/`, label, count(id)]), ["/categories/interactive/", "Interactive", interactiveCount]]),
    '<a href="/#playground">Playground</a>',
    '<p class="sh-dh">Docs</p>',
    flat([["/mcp/", "MCP for AI tools", "New"], ["/docs.html#install", "Installation"], ["/docs.html#quickstart", "Quick start"], ["/docs.html#frameworks", "Framework guides"], ["/docs.html#js-needs", "What needs JavaScript"], ["/docs.html#theming", "Theming"], ["/docs.html#a11y", "Accessibility"]]),
    '<a href="/builder.html">Builder</a>',
    '<p class="sh-dh">Resources</p>',
    flat([["/mcp/", "Motion Forge MCP", "New"], ["/mcp/clients/", "Connect your tool"], ["/llms.txt", "llms.txt"]]),
    `<a href="${REPO}" rel="noopener noreferrer">GitHub</a>`,
  ].join("");
  return `<header class="sh" data-sh>
<div class="sh-bar">
<a class="sh-brand" href="/">SDS Motion Forge</a>
<nav class="sh-nav" aria-label="Primary">
<a href="/#why" data-sh-id="why">Features</a>
<div class="sh-dd"><button type="button" class="sh-btn" aria-expanded="false" aria-haspopup="true" aria-controls="shMenuAnim">Animations ${ICON_CARET}</button><div class="sh-menu sh-menu-wide" id="shMenuAnim">${animItems}</div></div>
<a href="/#playground" data-sh-id="playground">Playground</a>
<div class="sh-dd"><button type="button" class="sh-btn" aria-expanded="false" aria-haspopup="true" aria-controls="shMenuDocs">Docs ${ICON_CARET}</button><div class="sh-menu" id="shMenuDocs">${docItems}</div></div>
<a href="/builder.html">Builder</a>
<div class="sh-dd"><button type="button" class="sh-btn" aria-expanded="false" aria-haspopup="true" aria-controls="shMenuRes">Resources ${ICON_CARET}</button><div class="sh-menu" id="shMenuRes">${resItems}</div></div>
</nav>
<div class="sh-actions">
<a class="sh-icon" href="${REPO}" target="_blank" rel="noopener noreferrer" aria-label="GitHub repository">${ICON_GH}</a>
<a class="sh-cta" href="/docs.html#install">Get started</a>
</div>
<button type="button" class="sh-burger" aria-label="Open menu" aria-expanded="false" aria-controls="shDrawer"><span></span><span></span><span></span></button>
</div>
<div class="sh-drawer" id="shDrawer" hidden>${drawer}</div>
</header>`;
}

const START = "<!-- SITE-HEADER:START (generated: node scripts/docs/site-header.js) -->";
const END = "<!-- SITE-HEADER:END -->";
const block = () => `${START}\n${headerHtml()}\n${END}`;

const PAGES = ["index.html", "docs.html", "builder.html", "404.html"].map((f) => path.join(ROOT, "docs", f));

function patch(file, check) {
  const raw = fs.readFileSync(file, "utf8");
  const crlf = raw.includes("\r\n");
  const s = raw.replace(/\r\n/g, "\n");
  const a = s.indexOf(START.slice(0, 22));
  const b = s.indexOf(END);
  if (a < 0 || b < 0) throw new Error(path.basename(file) + ": SITE-HEADER markers are missing");
  const next = s.slice(0, a) + block() + s.slice(b + END.length);
  if (check) return next === s;
  if (next !== s) fs.writeFileSync(file, crlf ? next.replace(/\n/g, "\r\n") : next);
  return true;
}

module.exports = { headerHtml };

if (require.main === module) {
  const check = process.argv.includes("--check");
  const stale = PAGES.filter((p) => !patch(p, check));
  if (check) {
    if (stale.length) {
      console.error("site header out of date in: " + stale.map((p) => path.basename(p)).join(", ") + " — run: node scripts/docs/site-header.js");
      process.exit(1);
    }
    console.log("site header in sync (" + PAGES.length + " pages + generated pages use headerHtml())");
  } else {
    console.log("site header written to " + PAGES.map((p) => path.basename(p)).join(", "));
  }
}

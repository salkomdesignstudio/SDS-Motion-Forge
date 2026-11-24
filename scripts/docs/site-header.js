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

const { ri } = require("./icons");
const ICON_GH = ri("github", "line", "gh-s", 18) + ri("github", "fill", "gh-f", 18);
const ICON_CARET = ri("arrow-down-s", "line", "sh-caret", 16);

const { icon: ico } = require("./icons");
const { tool } = require("./tool-icons");
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
  const SVG_CURSOR = '<svg viewBox="0 0 24 24" width="22" height="22" fill="#fff" stroke="#14162a" stroke-width="1.4" stroke-linejoin="round"><path d="M5 3l14 7-6 2-2 6z"/></svg>';
  const PV = {
    text: ["sds-aurora-text", '<span class="p-text">Aurora</span>'],
    buttons: ["sds-btn-surge-charge", '<span class="p-btn">Deploy</span>'],
    inputs: ["sds-input-gradient-border", '<span class="p-input"><i></i>you@example.com</span>'],
    cards: ["sds-card-stack-pop", '<span class="p-card"><b>Card</b><small>Stack pop</small></span>'],
    loaders: ["sds-loader-glow-pulse", '<span class="p-ring"></span><span class="p-dots"><i></i><i></i><i></i></span>'],
    scroll: ["sds-scroll-barrel", '<span class="p-sc"><i></i><i></i><i></i></span>'],
    interactive: ["sds-jelly-hover", '<span class="p-orb"></span><span class="p-cur">' + SVG_CURSOR + "</span>"],
  };
  const ALLCATS = [...CATS, ["interactive", "Interactive"]];
  const catCount = (id) => (id === "interactive" ? interactiveCount : count(id));
  const rows = ALLCATS.map(([id, label], i) => `<a class="sh-cat${i === 0 ? " is-on" : ""}" data-p="${id}" href="/categories/${id}/">${ico(id)}<span class="sh-txt"><b>${label} <em>${catCount(id)}</em></b><small>${id === "interactive" ? "React to the cursor" : DESC[id]}</small></span></a>`).join("");
  const panes = ALLCATS.map(([id, label], i) => `<div class="sh-pv${i === 0 ? " is-on" : ""}" data-p="${id}"><div class="shp" aria-hidden="true">${PV[id][1]}</div><code>.${PV[id][0]}</code></div>`).join("");
  const animItems = `<div class="sh-mega"><div class="sh-list">${rows}</div><div class="sh-pane"><div class="sh-stage">${panes}</div><a class="sh-all" href="/animations/"><span><b>Browse all animations</b><small>Every effect on one page</small></span><span class="sh-n">${total}</span></a></div></div>`;
  const docItems = [
    item("/mcp/", "mcp", "MCP for AI tools", "Let your AI search and place animations", "New"),
    item("/docs.html#install", "install", "Installation", "CDN, npm and per-category imports"),
    item("/docs.html#quickstart", "quick", "Quick start", "Your first animation"),
    item("/docs.html#frameworks", "frameworks", "Framework guides", "React, Vue, Angular, Svelte, Tailwind"),
    item("/docs.html#js-needs", "js", "What needs JavaScript", "Scripts and browser support"),
    item("/docs.html#theming", "theme", "Theming", "Colour and speed with CSS variables"),
    item("/docs.html#a11y", "a11y", "Accessibility", "Reduced motion, checked on every build"),
  ].join("");
  const feat = `<a class="sh-feat" href="/mcp/">${ico("mcp")}<span class="sh-txt"><b>Motion Forge MCP <span class="sh-new">New</span></b><small>Connect your AI tools</small></span><span class="sh-avs" aria-hidden="true">${["claude", "cursor", "vscode", "windsurf", "codex", "gemini"].map((k) => `<i>${tool(k)}</i>`).join("")}<i class="sh-more">+6</i></span></a>`;
  const resItems =
    feat +
    [
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
<div class="sh-dd"><button type="button" class="sh-btn" aria-expanded="false" aria-haspopup="true" aria-controls="shMenuAnim">Animations ${ICON_CARET}</button><div class="sh-menu sh-menu-mega" id="shMenuAnim">${animItems}</div></div>
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
<div class="sh-compact"><a class="sh-cta" href="/docs.html#install">Get started</a><button type="button" class="sh-cmenu" aria-label="Open menu" aria-expanded="false" aria-controls="shDrawer"><span></span><span></span></button></div>
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

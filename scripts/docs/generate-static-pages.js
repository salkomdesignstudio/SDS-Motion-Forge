#!/usr/bin/env node
/**
 * SDS Motion Forge — static, crawlable page generator (SEO + GEO).
 *
 * docs/index.html stays the single-file source of truth for the interactive
 * gallery. This script turns the SAME data (registry + docs-data.js) into
 * build output that search and AI crawlers can read without running JS:
 *
 *   docs/animations/<slug>/index.html  one page per effect (live demo, specs,
 *                                      HTML / React / Angular / Tailwind snippets)
 *   docs/animations/<slug>/index.md    plain-markdown twin of each page
 *   docs/animations/index.html         all effects, grouped by category
 *   docs/categories/<id>/index.html    one page per category
 *   docs/assets/pages.css              shared stylesheet for the pages above
 *   docs/sitemap.xml, docs/llms-full.txt
 *
 * Run order matters: generate-docs-data.js first (it writes docs-data.js).
 * The page folders are gitignored build output; Netlify runs `npm run build`.
 */
"use strict";
const fs = require("fs");
const path = require("path");
const S = require("./site-lib");
const { headerHtml } = require("./site-header");
const buildMcpPages = require("./mcp-pages");
const MCP = require("./mcp-pages");
const { icon } = require("./icons");
const { config, CATEGORIES, effects, interactive, byCategory, esc, slugOf, urlOf } = S;

const DOCS = path.join(S.ROOT, "docs");
const docs = S.loadDocsData();
const facts = S.canonicalFacts();
const all = [...effects, ...interactive].sort((a, b) => a.name.localeCompare(b.name));
const catById = Object.fromEntries(CATEGORIES.map((c) => [c.id, c]));
catById.interactive = { id: "interactive", label: "Interactive", singular: "interactive", blurb: "Cursor-reactive effects driven by the optional motion-interactive engine." };

/* ── which dist CSS files define a class ─────────────────────── */
const defined = {};
for (const id of ["core", ...CATEGORIES.map((c) => c.id)]) {
  const f = path.join(S.ROOT, "dist", "categories", `${id}.css`);
  defined[id] = fs.existsSync(f) ? new Set(fs.readFileSync(f, "utf8").match(/\.sds-[a-z0-9-]+/g)?.map((s) => s.slice(1))) : new Set();
}
function cssFor(c) {
  const own = defined[c.category]?.has(c.name) ? c.category : CATEGORIES.map((x) => x.id).find((id) => defined[id].has(c.name));
  // Every category bundle already inlines core (tokens, modifiers, reduced-motion),
  // so one file is enough. null → fall back to the full bundle.
  return own ? [own] : null;
}

/* ── lookups from docs-data ──────────────────────────────────── */
const animMeta = {};
for (const [cat, list] of Object.entries(docs.animations)) for (const a of list) animMeta[a.cls] = { ...a, cat };
const interactiveDesc = {
  "sds-jelly-hover": "Squashes and wobbles on hover like jelly",
  "sds-magnetic-pull": "Characters are pulled toward the cursor",
  "sds-repulsion-field": "Characters are pushed away from the cursor",
  "sds-scatter-return": "Characters scatter and spring back",
  "sds-shockwave": "A click sends a shockwave through the text",
  "sds-spring-kerning": "Letter spacing springs as the cursor moves",
  "sds-word-morph": "Cycles through a list of words with a morph",
};
const descOf = (c) => (animMeta[c.name] && animMeta[c.name].desc) || interactiveDesc[c.name] || c.description;
const sentence = (s) => { const t = String(s).trim().replace(/\.$/, ""); return t.charAt(0).toUpperCase() + t.slice(1); };

const aliasesOf = {};
for (const c of S.registry.classes) if (c.aliasOf) (aliasesOf[c.aliasOf] = aliasesOf[c.aliasOf] || []).push(c.name);

/* ── snippets ────────────────────────────────────────────────── */
function demoMarkup(c) {
  // Strip the scroll gate so the demo plays at once, and demote a root heading
  // so the page keeps exactly one <h1>.
  return (docs.markup[c.name] || `<div class="${c.name}">${esc(c.displayName)}</div>`)
    .replace(/\sdata-sds(?=[\s>])/g, "")
    .replace(/^<h[1-6]\b([\s\S]*)<\/h[1-6]>$/, "<div$1</div>");
}
const toJsx = (html) =>
  html.replace(/\bclass=/g, "className=").replace(/\bfor=/g, "htmlFor=").replace(/style="--i:(\d+)"/g, 'style={{ "--i": $1 }}');
const indent = (s, n) => s.split("\n").map((l) => " ".repeat(n) + l).join("\n");

function engineImport(c) {
  if (c.category === "scroll") return `import "${facts.package}/dist/sds-scroll.min.js"; // optional 1.3 KB scroll gate (client-side only)\n`;
  if (c.kind === "interactive") return `import "${facts.package}/dist/motion-interactive.min.js"; // cursor engine (client-side only)\n`;
  return "";
}

function snippetsFor(c) {
  const pre = docs.snippets[c.name] || {};
  const m = docs.markup[c.name] || demoMarkup(c);
  const out = [];
  out.push({ id: "html", label: "HTML", lang: "html", code: pre.html || "" });
  if (config.frameworkPackagesPublished && pre.react) {
    out.push({ id: "react", label: "React", lang: "tsx", code: pre.react });
    out.push({ id: "angular", label: "Angular", lang: "ts", code: pre.angular });
    out.push({ id: "tailwind", label: "Tailwind", lang: "css", code: pre.tailwind });
  } else {
    out.push({
      id: "react", label: "React / Next.js", lang: "tsx",
      code: `import "${facts.package}/dist/motion.min.css";\n${engineImport(c)}\nexport default function Demo() {\n  return (\n${indent(toJsx(m), 4)}\n  );\n}`,
    });
    out.push({
      id: "angular", label: "Angular", lang: "ts",
      code: `// angular.json → architect.build.options.styles:\n//   "node_modules/${facts.package}/dist/motion.min.css"\nimport { Component } from '@angular/core';\n\n@Component({\n  selector: 'app-demo',\n  standalone: true,\n  template: \`\n${indent(m, 4)}\n  \`,\n})\nexport class DemoComponent {}`,
    });
    out.push({
      id: "tailwind", label: "Tailwind CSS", lang: "css",
      code: `/* app.css — Tailwind v4 */\n@import "tailwindcss";\n@import "${facts.package}/dist/motion.min.css";\n\n/* then use the class like any other: */\n${m}`,
    });
  }
  return out;
}

/* ── page chrome ─────────────────────────────────────────────── */

function head({ title, description, path: p, jsonld, extraCss = [], md = true, wide = false, extraJs = [] }) {
  const url = urlOf(p);
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="color-scheme" content="light" />
<meta name="theme-color" content="#ffffff" />
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}" />
<link rel="canonical" href="${url}" />
${md ? `<link rel="alternate" type="text/markdown" href="${url}index.md" />\n` : ""}<link rel="icon" href="/favicon.png" />
<link rel="manifest" href="/site.webmanifest" />
<link rel="alternate" type="text/plain" href="/llms.txt" title="LLM summary" />
<meta property="og:type" content="website" />
<meta property="og:site_name" content="SDS Motion Forge" />
<meta property="og:title" content="${esc(title)}" />
<meta property="og:description" content="${esc(description)}" />
<meta property="og:url" content="${url}" />
<meta property="og:image" content="${urlOf(config.ogImage)}" />
<meta property="og:image:width" content="${config.ogWidth}" />
<meta property="og:image:height" content="${config.ogHeight}" />
<meta property="og:image:alt" content="SDS Motion Forge — ${S.effects.length} CSS animations" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${esc(title)}" />
<meta name="twitter:description" content="${esc(description)}" />
<meta name="twitter:image" content="${urlOf(config.ogImage)}" />
<link rel="preload" href="/vendor/manrope/Manrope-latin.woff2" as="font" type="font/woff2" crossorigin />
<link rel="preload" href="/vendor/geist/GeistMono-latin.woff2" as="font" type="font/woff2" crossorigin />
<link rel="stylesheet" href="/vendor/geist/geist.css" />
<link rel="stylesheet" href="/assets/pages.css" />
<link rel="stylesheet" href="/theme.css" />
<link rel="stylesheet" href="/cards.css" />
<link rel="stylesheet" href="/header.css" />
<link rel="stylesheet" href="/mcp.css" />
<script src="/header.js" defer></script>
<script src="/pages.js" defer></script>
${extraCss.map((h) => `<link rel="stylesheet" href="${h}" />`).join("\n")}
<script type="application/ld+json">${JSON.stringify(jsonld)}</script>
${extraJs.map((h) => `<script src="${h}" defer></script>`).join("\n")}
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
${headerHtml()}
<main id="main" class="wrap${wide ? " wide" : ""}">
`;
}

const foot = `</main>
<footer class="foot"><div class="wrap">
<p><a href="/">SDS Motion Forge</a> v${facts.version} · ${facts.license} licensed · ${S.effects.length} CSS animations · by <a href="${config.orgUrl}">${esc(config.orgName)}</a></p>
<p class="tm">Tool names and logos belong to their owners and are shown only to say what works with Motion Forge.</p>
<p><a href="/animations/">All animations</a> · <a href="/docs.html">Documentation</a> · <a href="/mcp/">MCP for AI tools</a> · <a href="/llms.txt">llms.txt</a> · <a href="${config.npmUrl}">npm</a> · <a href="${config.repoUrl}">GitHub</a></p>
</div></footer>
</body>
</html>
`;

/** Compact "use it from your AI tool" strip for the list pages. */
const aiStrip = `<aside class="m-aiblock" style="margin-top:28px"><b>Use these from your AI tool</b><p>Connect the Motion Forge MCP server and ask for an animation by description. Free, offline, no API key.</p><div class="m-ai-tools"><a href="/mcp/">MCP for AI tools</a><a href="/mcp/clients/claude-code/">Claude Code</a><a href="/mcp/clients/cursor/">Cursor</a><a href="/mcp/clients/vscode/">VS Code</a></div></aside>
`;

const crumbs = (items) => ({
  "@type": "BreadcrumbList",
  itemListElement: items.map(([name, p], i) => ({ "@type": "ListItem", position: i + 1, name, item: urlOf(p) })),
});
const breadcrumbNav = (items) =>
  `<nav class="crumbs" aria-label="Breadcrumb">${items.map(([n, p], i) => (i === items.length - 1 ? `<span aria-current="page">${esc(n)}</span>` : `<a href="${p}">${esc(n)}</a>`)).join(" › ")}</nav>`;

/** Join sentences while they fit; never cut a sentence mid-phrase. */
function fit(parts, n) {
  let out = parts[0];
  for (const part of parts.slice(1)) if ((out + " " + part).length <= n) out += " " + part;
  return out.length <= n ? out : clip(out, n);
}
function clip(s, n) {
  if (s.length <= n) return s;
  const cut = s.slice(0, n - 1);
  return cut.slice(0, cut.lastIndexOf(" ")) + "…";
}

/* ── live effect cards (shared by category, index and effect pages) ── */
const ICON_REPLAY = '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12a8 8 0 1 0 2.6-5.9M4 4v4.5h4.5"/></svg>';
const ICON_SEARCH = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="6.5"/><path d="m16 16 4 4"/></svg>';
function tagLabel(c) {
  if (c.kind === "interactive") return "Cursor-reactive";
  if (c.trigger === "scroll") return "On scroll";
  if (c.trigger === "focus") return "On focus";
  return c.loop ? "Loops" : "Plays once";
}
function badgesFor(c) {
  const out = [];
  if (c.kind === "interactive") out.push('<span class="fx-badge" title="Needs the optional 7 KB interactive script">Needs JS</span>');
  else if (c.requiresCharSplit) out.push('<span class="fx-badge soft" title="Each letter must be wrapped in a span with a --i index">Needs letter spans</span>');
  else if (c.requiresChildren) out.push('<span class="fx-badge soft" title="Animates the element\'s child elements">Needs child elements</span>');
  else if (c.inputWrap) out.push('<span class="fx-badge soft" title="Needs the documented wrapper around the input">Needs wrapper</span>');
  return out.join("");
}
function fxCard(c, level) {
  const h = level || 3;
  const interactiveDemo = c.kind === "interactive";
  return `<li class="fx-card" data-fx data-s="${esc((c.displayName + " " + c.name + " " + sentence(descOf(c))).toLowerCase())}">
<div class="fx-stage"${interactiveDemo ? "" : ' aria-hidden="true" inert'}>${demoMarkup(c)}</div>
<button type="button" class="fx-replay" data-replay aria-label="Replay ${esc(c.displayName)}">${ICON_REPLAY}</button>
<div class="fx-meta"><div class="fx-top"><h${h} class="fx-name"><a href="${S.animationPath(c.name)}">${esc(c.displayName)}</a></h${h}><span class="fx-tag">${tagLabel(c)}</span></div>
<p class="fx-desc">${esc(sentence(descOf(c)))}.</p>
<div class="fx-foot"><button type="button" class="fx-cls" data-copy=".${c.name}" title="Copy class name">.${c.name}</button>${badgesFor(c)}</div></div>
</li>`;
}
const cssLinksFor = (list) => {
  const ids = new Set(list.map((c) => (c.kind === "interactive" ? "__full" : c.category)));
  if (ids.size !== 1 || ids.has("__full")) return ["/dist/motion.min.css"];
  return [`/dist/categories/${[...ids][0]}.min.css`];
};
const sortByName = (l) => l.slice().sort((a, b) => a.name.localeCompare(b.name));

/* ── related ─────────────────────────────────────────────────── */
function relatedFor(c) {
  const sameCat = all.filter((x) => x.category === c.category && x.name !== c.name);
  const stem = slugOf(c.name).split("-").filter((t) => !["btn", "card", "input", "loader", "scroll"].includes(t))[0];
  const family = sameCat.filter((x) => stem && slugOf(x.name).split("-").includes(stem));
  const idx = sameCat.findIndex((x) => x.name.localeCompare(c.name) > 0);
  const near = [...sameCat.slice(Math.max(0, idx - 3), idx < 0 ? sameCat.length : idx + 3)];
  const seen = new Set();
  return [...family, ...near].filter((x) => !seen.has(x.name) && seen.add(x.name)).slice(0, 8);
}

/* ── effect page ─────────────────────────────────────────────── */
const seenDesc = new Map();
let fallbackCss = 0;
function effectPage(c) {
  const cat = catById[c.category];
  const p = S.animationPath(c.name);
  const d = sentence(descOf(c));
  const loop = c.loop ? "loops continuously" : "plays once";
  const trig = c.trigger === "scroll" ? "when scrolled into view" : c.kind === "interactive" ? "in response to the cursor" : "as soon as the class is applied";
  const title = [`${c.displayName} — ${cat.singular} CSS animation (.${c.name})`, `${c.displayName} ${cat.singular} CSS animation (.${c.name})`, `${c.displayName} CSS animation (.${c.name})`, `${c.displayName} CSS animation`].find((t) => t.length <= 60) || `${c.displayName} CSS animation`;
  const description = fit([`${d}.`, `Use .${c.name} — ${loop}, ${trig}.`, "CSS-only, copy-paste for HTML, React, Angular and Tailwind.", "Free and MIT licensed."], 158);
  seenDesc.set(description, (seenDesc.get(description) || 0) + 1);
  const files = cssFor(c);
  if (!files) fallbackCss++;
  const css = (files || ["__full"]).map((f) => (f === "__full" ? "/dist/motion.min.css" : `/dist/categories/${f}.min.css`));
  const cdnCss = (files || ["__full"]).map((f) => (f === "__full" ? `${config.cdn}/motion.min.css` : `${config.cdn}/categories/${f}.min.css`));
  const snippets = snippetsFor(c);
  const related = relatedFor(c);
  const how = docs.how[c.name] || "";
  const aliases = [...(aliasesOf[c.name] || []), ...(c.aliasOf ? [c.aliasOf] : [])];
  const crumb = [["Home", "/"], ["Animations", "/animations/"], [cat.label, S.categoryPath(c.category)], [c.displayName, p]];

  const specs = [
    ["Class", `<code>.${c.name}</code>`],
    ["Category", `<a href="${S.categoryPath(c.category)}">${esc(cat.label)}</a>`],
    ["Runs", esc(`${loop}, ${trig}`)],
    ["Animated properties", esc((c.animatedProps || []).join(", ") || "n/a")],
    ["Compositor-only", c.compositorSafe ? "Yes — transform/opacity only, no layout reflow" : "No — also animates paint or layout properties"],
    ["Needs child elements", c.requiresChildren ? "Yes" : "No"],
    ["Needs per-character spans", c.requiresCharSplit ? "Yes" : "No"],
    ["JavaScript", esc(c.jsEngine && c.jsEngine !== "none" ? c.jsEngine : c.requiresJs ? "required" : "None required")],
    ["Keyframes", esc((c.keyframes || []).join(", ") || "n/a")],
    ["Design tokens", esc((c.tokensUsed || []).join(", ") || "n/a")],
    ["Since", esc(c.sinceVersion || facts.version)],
  ];
  if (aliases.length) specs.push(["Also available as", aliases.map((a) => `<a href="${S.animationPath(a)}"><code>.${a}</code></a>`).join(", ")]);

  const jsonld = {
    "@context": "https://schema.org",
    "@graph": [
      crumbs(crumb),
      {
        "@type": "TechArticle",
        "@id": urlOf(p) + "#article",
        headline: title,
        description,
        url: urlOf(p),
        inLanguage: "en",
        isPartOf: { "@id": urlOf("/#website") },
        about: { "@id": urlOf("/#software") },
        publisher: { "@id": urlOf("/#organization") },
      },
    ],
  };

  const needsList = [];
  if (c.kind === "interactive") needsList.push(["Needs the interactive engine", "Add the 7 KB <code>motion-interactive.min.js</code> before <code>&lt;/body&gt;</code>. Without it the element stays static."]);
  if (c.category === "scroll") needsList.push(["Scroll trigger", "CSS-only in Chrome 115+ with <code>sds-scroll-auto</code>. Other browsers use the 1.3 KB <code>sds-scroll.min.js</code> and <code>data-sds</code>; without either it plays on load."]);
  if (c.requiresCharSplit && c.kind !== "interactive") needsList.push(["Letter spans", "Wrap each letter in <code>&lt;span class=&quot;sds-char&quot; style=&quot;--i:N&quot;&gt;</code> (N = 0, 1, 2…)."]);
  if (c.requiresChildren) needsList.push(["Child elements", "It animates the element\u2019s children, so it needs children to be visible."]);
  if (c.inputWrap) needsList.push(["Input wrapper", "It needs the documented wrapper element around the input."]);
  if (!needsList.length) needsList.push(["No setup", "No JavaScript and no special markup: add the class and it plays."]);
  const factItems = specs.map(([k, v]) => `<li><b>${k}</b><span>${v}</span></li>`).join("\n");
  const tabIds = snippets.map((x, i) => "tab-" + x.id);
  const html =
    head({ title, description, path: p, jsonld, extraCss: css, wide: true, extraJs: c.kind === "interactive" ? ["/dist/motion-interactive.min.js"] : [] }) +
    `${breadcrumbNav(crumb)}
<section class="fx-hero" data-fx>
<div>
<p class="chipline"><span class="pill">${esc(cat.label)} animation</span><span class="pill plain mono">.${c.name}</span></p>
<h1>${esc(c.displayName)}</h1>
<p class="lead">${esc(d)}. Add the class <code>.${c.name}</code> to any element — it ${c.kind === "interactive" ? "reacts to the cursor" : esc(loop) + " " + esc(trig)}${c.kind === "interactive" ? ". It needs the 7 KB <code>motion-interactive.min.js</code> engine, which also splits the text into letters for you; without the engine the element stays static" : c.category === "scroll" ? ", using native scroll-driven animation with <code>sds-scroll-auto</code> (Chrome 115+) or the 1.3 KB scroll script in other browsers" : ", with no JavaScript"}.${c.requiresCharSplit && c.kind !== "interactive" ? " Wrap each letter in <code>&lt;span class=&quot;sds-char&quot; style=&quot;--i:N&quot;&gt;</code> (N = 0, 1, 2…)." : ""}${c.requiresChildren ? " It animates the element's child elements, so it needs children to be visible." : ""}${c.inputWrap ? " It needs the documented wrapper element around the input." : ""}</p>
<div class="fx-badges"><span class="pill plain">${esc(tagLabel(c))}</span>${c.compositorSafe ? '<span class="pill plain">Compositor-only</span>' : ""}${S.isUnreleased(c) ? '<span class="pill">New, not published yet</span>' : ""}${badgesFor(c)}</div>
<div class="fx-actions"><button type="button" class="btn2 primary" data-copy=".${c.name}">Copy class name</button><a class="btn2" href="#code">Copy-paste code</a><button type="button" class="btn2" data-replay>Replay</button></div>
</div>
<div class="fx-demo"><div class="fx-stage" id="stage">${demoMarkup(c)}</div>
<div class="fx-demo-bar"><code>.${c.name}</code><span class="muted">Demo colours are this site\u2019s; override <code>--sds-primary</code> to match your brand.</span></div></div>
</section>
${S.isUnreleased(c) ? `<p class="note" role="note"><strong>New in v${esc(c.sinceVersion)} — not published yet.</strong> This effect is in the repository and runs on this page, but npm and the CDN still serve v${esc(facts.version)}, so the copy-paste snippets below will not animate until v${esc(c.sinceVersion)} is released.</p>` : ""}
<section class="sec2" aria-labelledby="needs"><h2 id="needs">What it needs</h2>
<div class="needs2">${needsList.map(([t, d]) => `<div class="need2"><b>${t}</b>${d}</div>`).join("")}</div></section>

<section class="sec2" aria-labelledby="use"><h2 id="use">Quick start</h2>
<div class="import-card"><div class="code-row"><code id="qs">${esc(cdnCss.map((u) => `<link rel="stylesheet" href="${u}" />`).join("\n"))}</code><button type="button" class="copy-btn" data-copy-from="qs">Copy</button></div>
<div class="code-row"><code id="qs2">${esc(docs.markup[c.name] || `<div class="${c.name}">…</div>`)}</code><button type="button" class="copy-btn" data-copy-from="qs2">Copy</button></div>
<p class="muted">${files ? `Loads only the ${esc(cat.label.toLowerCase())} bundle (core is included). ` : ""}Prefer one file? Use <code>${config.cdn}/motion.min.css</code> (all ${S.effects.length} effects).</p></div></section>

${how ? `<section class="sec2" aria-labelledby="how"><h2 id="how">How it works</h2><p>${esc(how)}</p></section>\n` : ""}<section class="sec2" aria-labelledby="code"><h2 id="code">Copy-paste code</h2>
<div class="code-tabs" data-tabs><div class="tabbar" role="tablist" aria-label="Code for each framework">${snippets.map((x, i) => `<button type="button" role="tab" id="${tabIds[i]}" aria-selected="${i === 0}" aria-controls="panel-${x.id}">${esc(x.label)}</button>`).join("")}</div>
${snippets.map((x) => `<div class="code-panel" id="panel-${x.id}" role="tabpanel" aria-labelledby="tab-${x.id}"><h3>${esc(x.label)}</h3><button type="button" class="copy-btn" data-copy-from="code-${x.id}">Copy</button><pre><code id="code-${x.id}" class="language-${x.lang}">${esc(x.code)}</code></pre></div>`).join("\n")}</div>
${config.frameworkPackagesPublished ? "" : `<p class="muted">Typed React, Angular, Tailwind and Web Components wrappers live in <a href="${config.repoUrl}/tree/main/packages">packages/</a> in the repository and are not yet published to npm; the snippets above need only the CSS.</p>`}
</section>

<section class="sec2" aria-labelledby="ai"><h2 id="ai">Use it with your AI tool</h2>
<aside class="m-aiblock"><p>Connect the Motion Forge MCP server, then ask:</p>
<div class="code-row"><code id="ai-prompt">Add the Motion Forge ${c.name} animation to my page${c.category === "scroll" ? " as a scroll reveal" : ""}, with reduced motion respected.</code><button type="button" class="copy-btn" data-copy-from="ai-prompt">Copy</button></div>
<p class="muted"><a href="/mcp/">How the MCP server works</a> · <a href="/mcp/clients/claude-code/">Claude Code</a> · <a href="/mcp/clients/cursor/">Cursor</a> · <a href="/mcp/clients/vscode/">VS Code</a> · <a href="/mcp/clients/">all tools</a></p></aside></section>

<section class="sec2" aria-labelledby="spec"><h2 id="spec">Technical details</h2><ul class="facts">
${factItems}
</ul></section>

<section class="sec2" aria-labelledby="rel"><h2 id="rel">Related animations</h2>
<ul class="fx-grid">
${related.map((r) => fxCard(r, 3)).join("\n")}
</ul>
<p style="margin-top:20px"><a href="${S.categoryPath(c.category)}">All ${byCategory[c.category] ? byCategory[c.category].length : ""} ${esc(cat.label.toLowerCase())} animations</a> · <a href="/docs.html">Installation &amp; usage docs</a> · <a href="/builder.html">Custom bundle builder</a></p></section>
` +
    foot;

  const md = `# ${c.displayName} (\`.${c.name}\`)

${d}. ${cat.label} animation in ${facts.name} v${facts.version}. It ${loop} ${trig}.

- Page: ${urlOf(p)}
- Category: ${cat.label} (${urlOf(S.categoryPath(c.category))})
- Animated properties: ${(c.animatedProps || []).join(", ") || "n/a"}
- Compositor-only: ${c.compositorSafe ? "yes" : "no"}
- Needs child elements: ${c.requiresChildren ? "yes" : "no"}
- Needs per-character spans: ${c.requiresCharSplit ? "yes" : "no"}
- JavaScript: ${c.jsEngine && c.jsEngine !== "none" ? c.jsEngine : "none required"}
${aliases.length ? `- Also available as: ${aliases.map((a) => "`." + a + "`").join(", ")}\n` : ""}
${S.isUnreleased(c) ? `> New in v${c.sinceVersion} — not published yet: npm and the CDN still serve v${facts.version}, so the snippets below will not animate until v${c.sinceVersion} is released.\n\n` : ""}## Use it

\`\`\`html
${cdnCss.map((u) => `<link rel="stylesheet" href="${u}" />`).join("\n")}

${docs.markup[c.name] || `<div class="${c.name}">…</div>`}
\`\`\`
${how ? `\n## How it works\n\n${how}\n` : ""}
## Use it with your AI tool

Connect the Motion Forge MCP server (\`${MCP.NPX}\`) and ask your AI to add \`.${c.name}\`. Guides: ${urlOf("/mcp/")}

## Related

${related.map((r) => `- [${r.displayName}](${urlOf(S.animationPath(r.name))})`).join("\n")}
`;
  return { html, md, p };
}

/* ── category + index pages ──────────────────────────────────── */
function categoryPage(cat) {
  const list = sortByName(cat.id === "interactive" ? interactive : byCategory[cat.id]);
  const p = S.categoryPath(cat.id);
  const gz = S.sizes && S.sizes[cat.id] ? `${S.kb(S.sizes[cat.id].gzip)} KB gzip (${S.kb(S.sizes[cat.id].min)} KB minified)` : null;
  const title = `${list.length} ${cat.label} CSS animations — copy-paste classes | SDS Motion Forge`;
  const description = clip(`${cat.blurb} ${list.length} ready-made ${cat.label.toLowerCase()} animations, each one class name, CSS-only, MIT licensed.`, 158);
  const crumb = [["Home", "/"], ["Animations", "/animations/"], [cat.label, p]];
  const jsonld = {
    "@context": "https://schema.org",
    "@graph": [
      crumbs(crumb),
      {
        "@type": "CollectionPage",
        "@id": urlOf(p) + "#collection",
        name: title,
        description,
        url: urlOf(p),
        isPartOf: { "@id": urlOf("/#website") },
        mainEntity: { "@type": "ItemList", numberOfItems: list.length, itemListElement: list.map((c, i) => ({ "@type": "ListItem", position: i + 1, url: urlOf(S.animationPath(c.name)), name: c.displayName })) },
      },
    ],
  };
  const importLine = cat.id === "interactive" ? `import "${facts.package}/dist/motion-interactive.min.js";` : `import "${facts.package}/categories/${cat.id}";`;
  const cdnLine = cat.id === "interactive" ? `${config.cdn}/motion-interactive.min.js` : `${config.cdn}/categories/${cat.id}.min.css`;
  const cdnTag = cat.id === "interactive" ? `<script src="${cdnLine}" defer></script>` : `<link rel="stylesheet" href="${cdnLine}" />`;
  const groups = [...CATEGORIES, catById.interactive];
  const nav = groups.map((g) => { const n = (g.id === "interactive" ? interactive : byCategory[g.id]).length; return `<li><a href="${S.categoryPath(g.id)}"${g.id === cat.id ? ' aria-current="page"' : ""}>${esc(g.label)} <em>${n}</em></a></li>`; }).join("");
  const html =
    head({ title, description, path: p, jsonld, extraCss: cssLinksFor(list), wide: true, extraJs: cat.id === "interactive" ? ["/dist/motion-interactive.min.js"] : [] }) +
    `${breadcrumbNav(crumb)}
<section class="cat-hero">
<div class="cat-main">
<div class="cat-top">${icon(cat.id)}<p class="chipline"><span class="pill">Category</span><span class="pill plain mono">${cat.id === "interactive" ? "sds-*" : cat.prefix + "*"}</span></p></div>
<h1>${list.length} ${esc(cat.label)} CSS animations</h1>
<p class="lead">${esc(cat.blurb)}</p>
<ul class="cat-stats"><li><b>${list.length}</b><span>effects</span></li>${gz ? `<li><b>${esc(gz.split(" ")[0])} KB</b><span>gzip, this category</span></li>` : ""}<li><b>MIT</b><span>licensed</span></li><li><b class="cat-ok" aria-hidden="true"></b><span>Reduced motion handled</span></li></ul>
</div>
<div class="import-card"><h2>Add this category</h2>
<div class="m-codewin"><div class="m-codewin-bar"><span>${cat.id === "interactive" ? "npm · script" : "npm · ES module"}</span><button type="button" class="m-copy" data-copy="${esc(importLine)}">Copy</button></div><pre><code>${esc(importLine)}</code></pre></div>
<div class="m-codewin"><div class="m-codewin-bar"><span>CDN</span><button type="button" class="m-copy" data-copy="${esc(cdnTag)}">Copy</button></div><pre><code>${esc(cdnTag)}</code></pre></div>
<p class="muted">Core (tokens, modifiers, reduced motion) is already inside each category bundle. To use two or more categories, load the full <code>motion.min.css</code>.</p></div>
</section>
<div class="toolbar2">
<ul class="catnav" aria-label="Categories">${nav}</ul>
<label class="search2"><span class="sr-only">Search ${esc(cat.label.toLowerCase())} animations</span>${ICON_SEARCH}<input id="fxSearch" type="search" placeholder="Search ${list.length} ${esc(cat.label.toLowerCase())} animations" autocomplete="off" /><kbd aria-hidden="true">/</kbd></label>
</div>
<p class="count2"><span id="fxCount" aria-live="polite">${list.length} animations</span> · every card plays live. Hover one to replay it, click it for code.</p>
<ul class="fx-grid" id="fxGrid">
${list.map((c) => fxCard(c, 2)).join("\n")}
</ul>
<p class="empty2" id="fxEmpty" hidden>No animation matches your search. Try a shorter word.</p>
<p style="margin-top:28px"><a href="/animations/">Browse all categories</a> · <a href="/docs.html">Installation &amp; usage docs</a></p>
` + aiStrip + foot;
  const md = `# ${list.length} ${cat.label} CSS animations\n\n${cat.blurb}${gz ? ` Bundle: ${gz}.` : ""}\n\n${importLine ? "```js\n" + importLine + "\n```\n\n" : ""}${list.map((c) => `- [${c.displayName}](${urlOf(S.animationPath(c.name))}) — \`.${c.name}\` — ${sentence(descOf(c))}`).join("\n")}\n`;
  return { html, md, p };
}

function indexPage() {
  const p = "/animations/";
  const title = `All ${all.length} CSS Animations | SDS Motion Forge`;
  const description = `Every ${facts.name} animation on one page: ${S.effects.length} CSS-only effects in six categories plus ${interactive.length} cursor-reactive effects. One class name each.`;
  const crumb = [["Home", "/"], ["Animations", p]];
  const jsonld = { "@context": "https://schema.org", "@graph": [crumbs(crumb), { "@type": "CollectionPage", "@id": urlOf(p) + "#collection", name: title, description, url: urlOf(p), isPartOf: { "@id": urlOf("/#website") } }] };
  const groups = [...CATEGORIES, catById.interactive];
  // one live example per category, chosen to be visible and self-contained
  const SAMPLE = { text: "sds-aurora-text", buttons: "sds-btn-surge-charge", inputs: "sds-input-gradient-border", cards: "sds-card-stack-pop", loaders: "sds-loader-glow-pulse", scroll: "sds-scroll-rise", interactive: "sds-magnetic-pull" };
  const sampleOf = (id) => all.find((c) => c.name === SAMPLE[id]) || (id === "interactive" ? interactive[0] : byCategory[id][0]);
  const tiles = groups.map((cat) => {
    const list = cat.id === "interactive" ? interactive : byCategory[cat.id];
    const ex = sampleOf(cat.id);
    const gz = S.sizes && S.sizes[cat.id] ? `${S.kb(S.sizes[cat.id].gzip)} KB gzip` : "";
    return `<li class="cat-tile"><div class="fx-stage" aria-hidden="true" inert>${demoMarkup(ex)}</div>
<div class="fx-meta"><h3><a href="${S.categoryPath(cat.id)}">${esc(cat.label)}</a></h3><p>${esc(cat.blurb)}</p>
<div class="fx-foot"><span class="pill plain">${list.length} effects</span>${gz ? `<span class="pill plain">${gz}</span>` : ""}</div></div></li>`;
  }).join("\n");
  const fresh = sortByName(S.effects.filter((c) => c.sinceVersion === facts.version));
  const html =
    head({ title, description, path: p, jsonld, extraCss: ["/dist/motion.min.css"], wide: true }) +
    `${breadcrumbNav(crumb)}
<section class="cat-hero">
<div>
<p class="chipline"><span class="pill">Animations</span><span class="pill plain mono">v${facts.version}</span></p>
<h1>All ${all.length} CSS animations</h1>
<p class="lead">${S.effects.length} CSS-only effects in six categories, plus ${interactive.length} cursor-reactive effects. Each one is a single class name. Open any category to see every effect playing live.</p>
<ul class="stats"><li class="pill plain">${S.effects.length} CSS effects</li><li class="pill plain">${interactive.length} cursor-reactive</li><li class="pill plain">MIT licensed</li></ul>
</div>
<div class="import-card"><h2>Search every animation</h2>
<label class="search2"><span class="sr-only">Search all animations</span>${ICON_SEARCH}<input id="allSearch" type="search" placeholder="Try &quot;bounce&quot;, &quot;glow&quot; or &quot;loader&quot;" autocomplete="off" /><kbd aria-hidden="true">/</kbd></label>
<p class="muted">Results open the effect's own page, with live demo and copy-paste code.</p></div>
</section>
<ul class="results" id="allResults" aria-live="polite"></ul>
<h2 class="sec2" style="margin:8px 0 16px">Browse by category</h2>
<ul class="tile-grid">
${tiles}
</ul>
${fresh.length ? `<div class="sec-title2"><h2>New in v${facts.version}</h2><a href="${S.categoryPath("text")}">See all text effects →</a></div>
<ul class="fx-grid">
${fresh.map((c) => fxCard(c, 3)).join("\n")}
</ul>` : ""}
` + aiStrip + foot;
  const md = `# All ${all.length} CSS animations\n\n${groups.map((cat) => { const list = sortByName(cat.id === "interactive" ? interactive : byCategory[cat.id]); return `## ${cat.label} (${list.length})\n\n${list.map((c) => `- [${c.displayName}](${urlOf(S.animationPath(c.name))}) \`.${c.name}\``).join("\n")}\n`; }).join("\n")}`;
  return { html, md, p };
}

/* ── shared stylesheet (light theme only, neutral Geist) ─────── */
const PAGES_CSS = `:root{--ink:#1e1b4b;--body:#4b4a73;--muted:#6a6990;--line:#e6e5f2;--canvas:#ffffff;--card:#ffffff;--sds-primary:#1e1b4b;--sds-primary-dim:rgba(30, 27, 75, 0.08);--sds-primary-glow:rgba(30, 27, 75, 0.08)}
*{box-sizing:border-box}html{color-scheme:light;-webkit-text-size-adjust:100%}
body{margin:0;background:var(--canvas);color:var(--body);font:16px/1.6 Geist,Arial,sans-serif;-webkit-font-smoothing:antialiased}
.wrap{max-width:960px;margin:0 auto;padding:0 24px}
a{color:var(--ink);text-underline-offset:3px}a:hover{text-decoration-thickness:2px}
a:focus-visible,button:focus-visible,summary:focus-visible{outline:2px solid var(--ink);outline-offset:2px;border-radius:4px}
.skip{position:absolute;left:-999px;top:8px;background:#4535c4;color:#fff;padding:8px 12px;border-radius:6px;z-index:10}.skip:focus{left:8px}
.bar{background:rgba(250,250,250,.92);border-bottom:1px solid var(--line);position:sticky;top:0;z-index:5}
.bar-in{display:flex;align-items:center;justify-content:space-between;gap:16px;min-height:56px;flex-wrap:wrap}
.brand{font-weight:600;letter-spacing:-.04em;color:var(--ink);text-decoration:none;font-size:18px}
.bar nav{display:flex;gap:4px;flex-wrap:wrap}.bar nav a{padding:6px 12px;border-radius:9999px;text-decoration:none;color:var(--body);font-size:14px}.bar nav a:hover{background:#f7f7fb;color:var(--ink)}
main{padding-top:24px;padding-bottom:64px}
h1{color:var(--ink);font-size:clamp(32px,6vw,48px);line-height:1.05;letter-spacing:-.05em;font-weight:600;margin:8px 0 16px}
h2{color:var(--ink);font-size:24px;letter-spacing:-.03em;font-weight:600;margin:40px 0 12px}
.lead{font-size:18px;max-width:720px}.muted{color:var(--muted);font-size:14px}
.eyebrow{font-family:"Geist Mono",ui-monospace,Menlo,monospace;font-size:12px;color:var(--muted);margin:16px 0 0}
.crumbs{font-size:14px;color:var(--muted)}.crumbs a{color:var(--muted)}
code{font-family:"Geist Mono",ui-monospace,SFMono-Regular,Menlo,monospace;font-size:.9em}
:not(pre)>code{background:#f7f7fb;border:1px solid var(--line);border-radius:6px;padding:1px 6px}
pre{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:16px;overflow:auto;font-size:13px;line-height:1.6;color:var(--ink);margin:8px 0}
pre code{background:none;border:0;padding:0;font-size:1em}
.stage{background:var(--card);border:1px solid var(--line);border-radius:12px;min-height:200px;display:grid;place-items:center;padding:32px;overflow:hidden;color:var(--ink);font-size:32px;font-weight:600;letter-spacing:-.03em}
.btn{font:500 14px Geist,Arial,sans-serif;height:36px;padding:0 14px;border-radius:6px;border:1px solid var(--line);background:var(--card);color:var(--ink);cursor:pointer}.btn:hover{background:#f7f7fb}
.spec{width:100%;border-collapse:collapse;background:var(--card);border:1px solid var(--line);border-radius:12px;overflow:hidden;font-size:14px}
.spec th,.spec td{text-align:left;padding:10px 14px;border-bottom:1px solid var(--line);vertical-align:top}.spec th{width:34%;color:var(--ink);font-weight:500}.spec tr:last-child>*{border-bottom:0}
details{background:var(--card);border:1px solid var(--line);border-radius:12px;margin:8px 0;padding:0 16px}details pre{border:0;padding:0 0 16px;margin:0}
summary{cursor:pointer;padding:14px 0;font-weight:500;color:var(--ink)}
.chips,.list{list-style:none;margin:0;padding:0}.chips{display:flex;flex-wrap:wrap;gap:8px}.chips a{display:inline-block;padding:6px 12px;border:1px solid var(--line);border-radius:9999px;background:var(--card);text-decoration:none;font-size:14px}.chips a:hover{border-color:var(--ink)}
.list li{padding:10px 0;border-bottom:1px solid var(--line)}
.note{background:#f7f7fb;border:1px solid var(--line);border-radius:12px;padding:12px 16px;margin:16px 0;font-size:14px;color:var(--ink)}
.foot{border-top:1px solid var(--line);padding:32px 0;font-size:14px;color:var(--muted)}.foot a{color:var(--muted)}
@media (prefers-reduced-motion:reduce){.stage *{animation-duration:.01ms!important;animation-iteration-count:1!important}}
`;

/* ── sitemap + llms-full ─────────────────────────────────────── */
function sitemap(pages) {
  const urls = ["/", "/docs.html", "/builder.html", ...pages];
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
    .map((u, i) => `  <url><loc>${urlOf(u)}</loc><priority>${i === 0 ? "1.0" : u === "/animations/" || u === "/docs.html" ? "0.9" : u.startsWith("/categories/") ? "0.8" : "0.6"}</priority></url>`)
    .join("\n")}\n</urlset>\n`;
}

function llmsFull() {
  const sec = [...CATEGORIES, catById.interactive].map((cat) => {
    const list = (cat.id === "interactive" ? interactive : byCategory[cat.id]).slice().sort((a, b) => a.name.localeCompare(b.name));
    return `## ${cat.label} (${list.length})\n\n${cat.blurb}\n\n${list.map((c) => `- \`.${c.name}\` — ${c.displayName}: ${sentence(descOf(c))}. ${urlOf(S.animationPath(c.name))}${S.isUnreleased(c) ? ` (new in v${c.sinceVersion}, not yet published to npm/CDN)` : ""}`).join("\n")}\n`;
  });
  return `${S.buildLlmsTxt().replace(/\n## Machine-readable resources[\s\S]*$/, "")}
## Machine-readable resources

- Short summary: ${facts.site}/llms.txt
- Effect registry (JSON): ${facts.site}/registry.json
- Every effect has a page at ${facts.site}/animations/<name-without-sds-prefix>/ and a markdown twin at …/index.md

## Frequently asked questions

${S.faqs().map((x) => `### ${x.q}\n\n${S.stripInline(x.a)}`).join("\n\n")}

# Every effect

${sec.join("\n")}`;
}

/* ── index.html: fill the generated Answers regions ──────────── */
function patchIndex() {
  const f = path.join(DOCS, "index.html");
  let html = fs.readFileSync(f, "utf8");
  const section = `<section class="sec" id="answers">
      <div class="wrap">
        <div class="sec-head">
          <span class="eyebrow">Answers</span>
          <h2 class="sec-title">Quick answers</h2>
          <p class="sec-desc">Short, self-contained answers to the questions developers ask most. Every number comes from the build.</p>
        </div>
        <div class="faq">
${S.faqHtml()}
        </div>
      </div>
    </section>`;
  // Replace everything between "<!-- NAME:START …-->" and "<!-- NAME:END -->".
  const swap = (name, inner) => {
    const a = html.indexOf(`<!-- ${name}:START`);
    const end = `<!-- ${name}:END -->`;
    const b = html.indexOf(end);
    if (a < 0 || b < a) throw new Error(`index.html is missing the ${name} markers`);
    const startTagEnd = html.indexOf("-->", a) + 3;
    html = html.slice(0, startTagEnd) + "\n" + inner + "\n    " + html.slice(b);
  };
  swap("FAQ", "    " + section);
  swap("FAQ-LD", `    <script type="application/ld+json">${S.faqJsonLd()}</script>`);
  // Search Console / Bing ownership tags (empty until config.verification is set).
  swap("SITE-VERIFY", S.verificationMetaTags().map((t) => "    " + t).join("\n"));
  fs.writeFileSync(f, html);
}

/* ── hand-written pages: MCP blocks between markers ───────────── */
function patchMarked(file, name, inner) {
  const f = path.join(DOCS, file);
  let html = fs.readFileSync(f, "utf8");
  const crlf = html.includes("\r\n");
  html = html.replace(/\r\n/g, "\n");
  const a = html.indexOf(`<!-- ${name}:START`);
  const end = `<!-- ${name}:END -->`;
  const b = html.indexOf(end);
  if (a < 0 || b < a) throw new Error(`${file} is missing the ${name} markers`);
  const startTagEnd = html.indexOf("-->", a) + 3;
  html = html.slice(0, startTagEnd) + "\n" + inner + "\n    " + html.slice(b);
  fs.writeFileSync(f, crlf ? html.replace(/\n/g, "\r\n") : html);
}

/* ── write ───────────────────────────────────────────────────── */
function write(rel, content) {
  const f = path.join(DOCS, rel);
  fs.mkdirSync(path.dirname(f), { recursive: true });
  fs.writeFileSync(f, content);
}
for (const d of ["animations", "categories", "mcp"]) fs.rmSync(path.join(DOCS, d), { recursive: true, force: true });

const sitemapPaths = [];
const emitPage = ({ html, md, p }) => {
  write(p.slice(1) + "index.html", html);
  write(p.slice(1) + "index.md", md);
  sitemapPaths.push(p);
};
emitPage(indexPage());
for (const cat of [...CATEGORIES, catById.interactive]) emitPage(categoryPage(cat));
for (const c of all) emitPage(effectPage(c));
for (const pg of buildMcpPages({ head, foot, S, config, esc, crumbs, breadcrumbNav })) emitPage(pg);
patchIndex();
{
  const frag = buildMcpPages.fragments({ S, esc });
  patchMarked("index.html", "WAYS", frag.home);
  patchMarked("index.html", "WHY", frag.why);
  patchMarked("index.html", "HOW", frag.how);
  patchMarked("index.html", "JS", frag.js);
  patchMarked("index.html", "HERO-FLOATS", frag.heroFloats);
  patchMarked("index.html", "CTA", frag.cta);
  patchMarked("docs.html", "MCP-DOC", frag.docs);
}
write("assets/pages.css", PAGES_CSS);
write("assets/search-index.json", JSON.stringify(all.map((c) => ({ n: c.displayName, c: c.name, k: catById[c.category] ? catById[c.category].label : "Interactive", u: S.animationPath(c.name), d: sentence(descOf(c)) }))));
write("sitemap.xml", sitemap(sitemapPaths));
write("llms-full.txt", llmsFull());

const dupes = [...seenDesc.values()].filter((n) => n > 1).length;
console.log(`static pages: ${all.length} effects + ${CATEGORIES.length + 1} categories + index, sitemap (${sitemapPaths.length + 3} urls), llms-full.txt`);
console.log(`  duplicate meta descriptions: ${dupes}; effects falling back to full CSS bundle: ${fallbackCss}`);

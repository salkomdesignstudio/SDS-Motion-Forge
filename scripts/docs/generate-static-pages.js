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

function head({ title, description, path: p, jsonld, extraCss = [], md = true }) {
  const url = urlOf(p);
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="color-scheme" content="light" />
<meta name="theme-color" content="#fafafa" />
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}" />
<link rel="canonical" href="${url}" />
${md ? `<link rel="alternate" type="text/markdown" href="${url}index.md" />\n` : ""}<link rel="icon" href="/favicon.png" />
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
<link rel="preload" href="/vendor/geist/Geist-latin.woff2" as="font" type="font/woff2" crossorigin />
<link rel="preload" href="/vendor/geist/GeistMono-latin.woff2" as="font" type="font/woff2" crossorigin />
<link rel="stylesheet" href="/vendor/geist/geist.css" />
<link rel="stylesheet" href="/assets/pages.css" />
${extraCss.map((h) => `<link rel="stylesheet" href="${h}" />`).join("\n")}
<script type="application/ld+json">${JSON.stringify(jsonld)}</script>
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<header class="bar"><div class="wrap bar-in">
<a class="brand" href="/">SDS Motion Forge</a>
<nav aria-label="Primary"><a href="/animations/">Animations</a><a href="/docs.html">Docs</a><a href="/builder.html">Builder</a><a href="${config.repoUrl}">GitHub</a></nav>
</div></header>
<main id="main" class="wrap">
`;
}

const foot = `</main>
<footer class="foot"><div class="wrap">
<p><a href="/">SDS Motion Forge</a> v${facts.version} · ${facts.license} licensed · ${S.effects.length} CSS animations · by <a href="${config.orgUrl}">${esc(config.orgName)}</a></p>
<p><a href="/animations/">All animations</a> · <a href="/docs.html">Documentation</a> · <a href="/llms.txt">llms.txt</a> · <a href="${config.npmUrl}">npm</a> · <a href="${config.repoUrl}">GitHub</a></p>
</div></footer>
</body>
</html>
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
  const title = `${c.displayName} — ${cat.singular} CSS animation (.${c.name})`;
  const description = fit([`${d}.`, `Use .${c.name} — ${loop}, ${trig}.`, "CSS-only, copy-paste for HTML, React, Angular and Tailwind."], 158);
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

  const html =
    head({ title, description, path: p, jsonld, extraCss: css }) +
    `${breadcrumbNav(crumb)}
<p class="eyebrow">${esc(cat.label)} animation · <code>.${c.name}</code></p>
<h1>${esc(c.displayName)}</h1>
<p class="lead">${esc(d)}. Add the class <code>.${c.name}</code> to any element — it ${esc(loop)} ${esc(trig)}, with no JavaScript${c.kind === "interactive" ? " beyond the optional cursor engine" : c.category === "scroll" ? " beyond the optional 1.3 KB scroll gate (or native scroll-driven animation with <code>sds-scroll-auto</code>)" : ""}.</p>

<section aria-labelledby="demo"><h2 id="demo">Live demo</h2>
<div class="stage" id="stage">${demoMarkup(c)}</div>
<p><button type="button" class="btn" id="replay">Replay</button> <span class="muted">Demo uses this site's neutral theme; override <code>--sds-primary</code> to match your brand.</span></p></section>

<section aria-labelledby="use"><h2 id="use">Quick start</h2>
<pre><code>${cdnCss.map((u) => `&lt;link rel="stylesheet" href="${u}" /&gt;`).join("\n")}

${esc(docs.markup[c.name] || `<div class="${c.name}">…</div>`)}</code></pre>
<p class="muted">${files ? `Loads only the ${esc(cat.label.toLowerCase())} bundle (core is included).` : ""}Prefer one file? Use <code>${config.cdn}/motion.min.css</code> (all ${S.effects.length} effects).</p></section>

${how ? `<section aria-labelledby="how"><h2 id="how">How it works</h2><p>${esc(how)}</p></section>\n` : ""}<section aria-labelledby="spec"><h2 id="spec">Technical details</h2>
<table class="spec"><tbody>
${specs.map(([k, v]) => `<tr><th scope="row">${k}</th><td>${v}</td></tr>`).join("\n")}
</tbody></table></section>

<section aria-labelledby="code"><h2 id="code">Copy-paste code</h2>
${snippets.map((s, i) => `<details${i === 0 ? " open" : ""}><summary>${esc(s.label)}</summary><pre><code class="language-${s.lang}">${esc(s.code)}</code></pre></details>`).join("\n")}
${config.frameworkPackagesPublished ? "" : `<p class="muted">Typed React, Angular, Tailwind and Web Components wrappers live in <a href="${config.repoUrl}/tree/main/packages">packages/</a> in the repository and are not yet published to npm; the snippets above need only the CSS.</p>`}
</section>

<section aria-labelledby="rel"><h2 id="rel">Related animations</h2>
<ul class="chips">
${related.map((r) => `<li><a href="${S.animationPath(r.name)}">${esc(r.displayName)}</a></li>`).join("\n")}
</ul>
<p><a href="${S.categoryPath(c.category)}">All ${byCategory[c.category] ? byCategory[c.category].length : ""} ${esc(cat.label.toLowerCase())} animations</a> · <a href="/docs.html">Installation &amp; usage docs</a> · <a href="/builder.html">Custom bundle builder</a></p></section>
<script>document.getElementById("replay").addEventListener("click",function(){var s=document.getElementById("stage"),n=s.firstElementChild;if(n)s.replaceChild(n.cloneNode(true),n)});</script>
${c.category === "scroll" || c.kind === "interactive" ? "" : ""}${c.kind === "interactive" ? `<script src="/dist/motion-interactive.min.js" defer></script>\n` : ""}` +
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
## Use it

\`\`\`html
${cdnCss.map((u) => `<link rel="stylesheet" href="${u}" />`).join("\n")}

${docs.markup[c.name] || `<div class="${c.name}">…</div>`}
\`\`\`
${how ? `\n## How it works\n\n${how}\n` : ""}
## Related

${related.map((r) => `- [${r.displayName}](${urlOf(S.animationPath(r.name))})`).join("\n")}
`;
  return { html, md, p };
}

/* ── category + index pages ──────────────────────────────────── */
function categoryPage(cat) {
  const list = (cat.id === "interactive" ? interactive : byCategory[cat.id]).slice().sort((a, b) => a.name.localeCompare(b.name));
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
  const importLine = cat.id === "interactive" ? "" : `import "${facts.package}/categories/${cat.id}";`;
  const html =
    head({ title, description, path: p, jsonld }) +
    `${breadcrumbNav(crumb)}
<p class="eyebrow">Category · <code>${cat.id === "interactive" ? "sds-*" : cat.prefix + "*"}</code></p>
<h1>${list.length} ${esc(cat.label)} CSS animations</h1>
<p class="lead">${esc(cat.blurb)}${gz ? ` The ${esc(cat.label.toLowerCase())} bundle is ${gz}.` : ""}</p>
${importLine ? `<h2>Import only this category</h2>\n<pre><code>${esc(importLine)}</code></pre>\n<p class="muted">Or use the CDN: <code>${config.cdn}/categories/${cat.id}.min.css</code>. Core (tokens, modifiers, reduced-motion) is already inside each category bundle; to use two or more categories, load the full <code>${config.cdn}/motion.min.css</code> instead.</p>\n` : `<p>These effects need <code>${config.cdn}/motion-interactive.min.js</code>.</p>\n`}
<h2>All ${list.length} ${esc(cat.label.toLowerCase())} animations</h2>
<ul class="list">
${list.map((c) => `<li><a href="${S.animationPath(c.name)}">${esc(c.displayName)}</a> <code>.${c.name}</code><span class="muted"> — ${esc(sentence(descOf(c)))}</span></li>`).join("\n")}
</ul>
<p><a href="/animations/">Browse all categories</a> · <a href="/docs.html">Installation &amp; usage docs</a></p>
` + foot;
  const md = `# ${list.length} ${cat.label} CSS animations\n\n${cat.blurb}${gz ? ` Bundle: ${gz}.` : ""}\n\n${importLine ? "```js\n" + importLine + "\n```\n\n" : ""}${list.map((c) => `- [${c.displayName}](${urlOf(S.animationPath(c.name))}) — \`.${c.name}\` — ${sentence(descOf(c))}`).join("\n")}\n`;
  return { html, md, p };
}

function indexPage() {
  const p = "/animations/";
  const title = `All ${all.length} CSS animations — text, buttons, inputs, cards, loaders, scroll | SDS Motion Forge`;
  const description = `Every ${facts.name} animation on one page: ${S.effects.length} CSS-only effects in six categories plus ${interactive.length} cursor-reactive effects. One class name each.`;
  const crumb = [["Home", "/"], ["Animations", p]];
  const jsonld = { "@context": "https://schema.org", "@graph": [crumbs(crumb), { "@type": "CollectionPage", "@id": urlOf(p) + "#collection", name: title, description, url: urlOf(p), isPartOf: { "@id": urlOf("/#website") } }] };
  const groups = [...CATEGORIES, catById.interactive];
  const html =
    head({ title, description, path: p, jsonld }) +
    `${breadcrumbNav(crumb)}
<h1>All ${all.length} CSS animations</h1>
<p class="lead">${S.effects.length} CSS-only effects in six categories, plus ${interactive.length} cursor-reactive effects. Each one is a single class name; open any page for a live demo and copy-paste code.</p>
${groups.map((cat) => {
  const list = (cat.id === "interactive" ? interactive : byCategory[cat.id]).slice().sort((a, b) => a.name.localeCompare(b.name));
  return `<section><h2><a href="${S.categoryPath(cat.id)}">${esc(cat.label)}</a> <span class="muted">(${list.length})</span></h2>\n<ul class="chips">\n${list.map((c) => `<li><a href="${S.animationPath(c.name)}">${esc(c.displayName)}</a></li>`).join("\n")}\n</ul></section>`;
}).join("\n")}
` + foot;
  const md = `# All ${all.length} CSS animations\n\n${groups.map((cat) => { const list = (cat.id === "interactive" ? interactive : byCategory[cat.id]).slice().sort((a, b) => a.name.localeCompare(b.name)); return `## ${cat.label} (${list.length})\n\n${list.map((c) => `- [${c.displayName}](${urlOf(S.animationPath(c.name))}) \`.${c.name}\``).join("\n")}\n`; }).join("\n")}`;
  return { html, md, p };
}

/* ── shared stylesheet (light theme only, neutral Geist) ─────── */
const PAGES_CSS = `:root{--ink:#171717;--body:#4d4d4d;--muted:#666666;--line:#ebebeb;--canvas:#fafafa;--card:#ffffff;--sds-primary:#171717;--sds-primary-dim:rgba(0,0,0,.07);--sds-primary-glow:rgba(0,0,0,.18)}
*{box-sizing:border-box}html{color-scheme:light;-webkit-text-size-adjust:100%}
body{margin:0;background:var(--canvas);color:var(--body);font:16px/1.6 Geist,Arial,sans-serif;-webkit-font-smoothing:antialiased}
.wrap{max-width:960px;margin:0 auto;padding:0 24px}
a{color:var(--ink);text-underline-offset:3px}a:hover{text-decoration-thickness:2px}
a:focus-visible,button:focus-visible,summary:focus-visible{outline:2px solid var(--ink);outline-offset:2px;border-radius:4px}
.skip{position:absolute;left:-999px;top:8px;background:var(--ink);color:#fff;padding:8px 12px;border-radius:6px;z-index:10}.skip:focus{left:8px}
.bar{background:rgba(250,250,250,.92);border-bottom:1px solid var(--line);position:sticky;top:0;z-index:5}
.bar-in{display:flex;align-items:center;justify-content:space-between;gap:16px;min-height:56px;flex-wrap:wrap}
.brand{font-weight:600;letter-spacing:-.04em;color:var(--ink);text-decoration:none;font-size:18px}
.bar nav{display:flex;gap:4px;flex-wrap:wrap}.bar nav a{padding:6px 12px;border-radius:9999px;text-decoration:none;color:var(--body);font-size:14px}.bar nav a:hover{background:#f2f2f2;color:var(--ink)}
main{padding-top:24px;padding-bottom:64px}
h1{color:var(--ink);font-size:clamp(32px,6vw,48px);line-height:1.05;letter-spacing:-.05em;font-weight:600;margin:8px 0 16px}
h2{color:var(--ink);font-size:24px;letter-spacing:-.03em;font-weight:600;margin:40px 0 12px}
.lead{font-size:18px;max-width:720px}.muted{color:var(--muted);font-size:14px}
.eyebrow{font-family:"Geist Mono",ui-monospace,Menlo,monospace;font-size:12px;color:var(--muted);margin:16px 0 0}
.crumbs{font-size:14px;color:var(--muted)}.crumbs a{color:var(--muted)}
code{font-family:"Geist Mono",ui-monospace,SFMono-Regular,Menlo,monospace;font-size:.9em}
:not(pre)>code{background:#f2f2f2;border:1px solid var(--line);border-radius:6px;padding:1px 6px}
pre{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:16px;overflow:auto;font-size:13px;line-height:1.6;color:var(--ink);margin:8px 0}
pre code{background:none;border:0;padding:0;font-size:1em}
.stage{background:var(--card);border:1px solid var(--line);border-radius:12px;min-height:200px;display:grid;place-items:center;padding:32px;overflow:hidden;color:var(--ink);font-size:32px;font-weight:600;letter-spacing:-.03em}
.btn{font:500 14px Geist,Arial,sans-serif;height:36px;padding:0 14px;border-radius:6px;border:1px solid var(--line);background:var(--card);color:var(--ink);cursor:pointer}.btn:hover{background:#f2f2f2}
.spec{width:100%;border-collapse:collapse;background:var(--card);border:1px solid var(--line);border-radius:12px;overflow:hidden;font-size:14px}
.spec th,.spec td{text-align:left;padding:10px 14px;border-bottom:1px solid var(--line);vertical-align:top}.spec th{width:34%;color:var(--ink);font-weight:500}.spec tr:last-child>*{border-bottom:0}
details{background:var(--card);border:1px solid var(--line);border-radius:12px;margin:8px 0;padding:0 16px}details pre{border:0;padding:0 0 16px;margin:0}
summary{cursor:pointer;padding:14px 0;font-weight:500;color:var(--ink)}
.chips,.list{list-style:none;margin:0;padding:0}.chips{display:flex;flex-wrap:wrap;gap:8px}.chips a{display:inline-block;padding:6px 12px;border:1px solid var(--line);border-radius:9999px;background:var(--card);text-decoration:none;font-size:14px}.chips a:hover{border-color:var(--ink)}
.list li{padding:10px 0;border-bottom:1px solid var(--line)}
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
    return `## ${cat.label} (${list.length})\n\n${cat.blurb}\n\n${list.map((c) => `- \`.${c.name}\` — ${c.displayName}: ${sentence(descOf(c))}. ${urlOf(S.animationPath(c.name))}`).join("\n")}\n`;
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

/* ── write ───────────────────────────────────────────────────── */
function write(rel, content) {
  const f = path.join(DOCS, rel);
  fs.mkdirSync(path.dirname(f), { recursive: true });
  fs.writeFileSync(f, content);
}
for (const d of ["animations", "categories"]) fs.rmSync(path.join(DOCS, d), { recursive: true, force: true });

const sitemapPaths = [];
const emitPage = ({ html, md, p }) => {
  write(p.slice(1) + "index.html", html);
  write(p.slice(1) + "index.md", md);
  sitemapPaths.push(p);
};
emitPage(indexPage());
for (const cat of [...CATEGORIES, catById.interactive]) emitPage(categoryPage(cat));
for (const c of all) emitPage(effectPage(c));
patchIndex();
write("assets/pages.css", PAGES_CSS);
write("sitemap.xml", sitemap(sitemapPaths));
write("llms-full.txt", llmsFull());

const dupes = [...seenDesc.values()].filter((n) => n > 1).length;
console.log(`static pages: ${all.length} effects + ${CATEGORIES.length + 1} categories + index, sitemap (${sitemapPaths.length + 3} urls), llms-full.txt`);
console.log(`  duplicate meta descriptions: ${dupes}; effects falling back to full CSS bundle: ${fallbackCss}`);

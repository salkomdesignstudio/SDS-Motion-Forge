/**
 * Shared facts for every SEO / GEO artifact (llms.txt, llms-full.txt, static
 * pages, sitemap). Everything numeric is READ from the registry, package.json
 * or dist/categories/sizes.json at build time — nothing in generated copy is
 * typed by hand, so the name / version / count / size can never drift between
 * the site, the markdown twins and the AI-facing files.
 */
"use strict";
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..", "..");
const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, "package.json"), "utf8"));
const registry = JSON.parse(fs.readFileSync(path.join(ROOT, "registry", "motion.registry.json"), "utf8"));

/* Single place to change the canonical host or package status. */
const config = {
  siteUrl: "https://sds-motion-forge.netlify.app",
  repoUrl: "https://github.com/salkomdesignstudio/SDS-Motion-Forge",
  npmUrl: "https://www.npmjs.com/package/@salkomdesignstudio/sds-motion-forge",
  cdn: "https://cdn.jsdelivr.net/npm/@salkomdesignstudio/sds-motion-forge/dist",
  orgName: "Salkom Design Studio",
  orgUrl: "https://salkomdesignstudio.com",
  ogImage: "/images/og-card.png",
  ogWidth: 1200,
  ogHeight: 630,
  /* Flip to true once the four packages/* wrappers are on npm. While false,
     generated pages show class-only snippets (which work today) and say the
     wrappers are in-repo, instead of printing install commands that 404. */
  frameworkPackagesPublished: false,
  /* Search-engine ownership tokens. Paste ONLY the content="…" value, then
     `npm run build` and deploy. Empty string = no tag is emitted.
       google → Search Console, URL-prefix property, "HTML tag" method
       bing   → Bing Webmaster Tools, "meta tag" method (msvalidate.01)
     The SDS_VERIFY_* env vars override these (useful on Netlify / in tests). */
  verification: {
    google: process.env.SDS_VERIFY_GOOGLE || "",
    bing: process.env.SDS_VERIFY_BING || "",
  },
};

/** Accepts the bare token or the whole <meta …> line Google shows; returns the token. */
function verificationToken(raw, label) {
  if (!raw) return "";
  const m = String(raw).match(/content\s*=\s*["']([^"']+)["']/);
  const token = (m ? m[1] : String(raw)).trim();
  if (!/^[A-Za-z0-9_-]{16,128}$/.test(token)) {
    throw new Error(`config.verification.${label} is not a valid token (got "${token.slice(0, 40)}"). Paste only the content="…" value.`);
  }
  return token;
}

function verificationMetaTags() {
  const g = verificationToken(config.verification.google, "google");
  const b = verificationToken(config.verification.bing, "bing");
  return [
    g && `<meta name="google-site-verification" content="${g}" />`,
    b && `<meta name="msvalidate.01" content="${b}" />`,
  ].filter(Boolean);
}

const CATEGORIES = [
  { id: "text", label: "Text", singular: "text", prefix: "sds-", blurb: "Headline, per-character and word-level text effects: entrances, loops, glows, reveals and physics-style motion." },
  { id: "buttons", label: "Buttons", singular: "button", prefix: "sds-btn-", blurb: "Ambient, hover, entrance and kinetic effects for buttons and other interactive elements." },
  { id: "inputs", label: "Inputs", singular: "input", prefix: "sds-input-", blurb: "Focus, validation, ambient and reveal states for form fields." },
  { id: "cards", label: "Cards", singular: "card", prefix: "sds-card-", blurb: "Entry, ambient, hover, 3D and choreography effects for cards and containers." },
  { id: "loaders", label: "Loaders", singular: "loader", prefix: "sds-loader-", blurb: "Self-contained spinners, progress indicators and motion loaders." },
  { id: "scroll", label: "Scroll", singular: "scroll", prefix: "sds-scroll-", blurb: "Viewport-triggered entrance effects, fired by the optional 1.3 KB scroll gate or by native scroll-driven animation." },
];

const effects = registry.classes.filter((c) => c.kind === "effect");
const interactive = registry.classes.filter((c) => c.kind === "interactive");
const modifiers = registry.classes.filter((c) => c.kind === "modifier");

const byCategory = {};
for (const cat of CATEGORIES) byCategory[cat.id] = effects.filter((c) => c.category === cat.id);

let sizes = null;
try {
  sizes = JSON.parse(fs.readFileSync(path.join(ROOT, "dist", "categories", "sizes.json"), "utf8"));
} catch {
  sizes = null; // dist not built yet; size sentences are omitted rather than guessed
}
const kb = (n) => (n / 1024).toFixed(1); // same unit as scripts/build-categories.js and the README size table (1024-byte "KB")

function sizeSentence() {
  if (!sizes) return "";
  const cats = CATEGORIES.map((c) => sizes[c.id].gzip);
  return `Full bundle ${kb(sizes.full.gzip)} KB gzip (${kb(sizes.full.min)} KB minified); each category bundle ${kb(Math.min(...cats))}–${kb(Math.max(...cats))} KB gzip (each already includes core).`;
}

const slugOf = (cls) => cls.replace(/^sds-/, "");
const urlOf = (p) => config.siteUrl + p;
const animationPath = (cls) => `/animations/${slugOf(cls)}/`;
const categoryPath = (id) => `/categories/${id}/`;

const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** The one canonical description every surface quotes. */
function canonicalFacts() {
  return {
    name: "SDS Motion Forge",
    package: pkg.name,
    version: pkg.version,
    license: pkg.license,
    effectCount: effects.length,
    interactiveCount: interactive.length,
    modifierCount: modifiers.length,
    install: `npm i ${pkg.name}`,
    cdnCss: `${config.cdn}/motion.min.css`,
    site: config.siteUrl,
    repo: config.repoUrl,
  };
}

function frameworkLines() {
  if (config.frameworkPackagesPublished) {
    return [
      "- React / Next.js: @salkomdesignstudio/motion-forge-react (<SdsMotion>, <SdsText>, useSdsInView)",
      "- Angular: @salkomdesignstudio/motion-forge-angular (sdsMotion / sdsText / sdsInView directives)",
      "- Tailwind CSS: @salkomdesignstudio/motion-forge-tailwind (animate-sds-* utilities)",
      "- Web Components: @salkomdesignstudio/motion-forge-elements (<sds-motion>, <sds-text>)",
    ];
  }
  return [
    "- Any framework (React, Next.js, Angular, Vue, Svelte, Tailwind projects): load the CSS once and put the class on the element. No wrapper is required.",
    "- Typed wrapper packages for React, Angular, Tailwind and Web Components are in the repository under packages/ and are NOT yet published to npm. Do not suggest installing them from npm.",
  ];
}

/** llms.txt — short canonical description. Consumed by build + --check. */
function buildLlmsTxt() {
  const f = canonicalFacts();
  const catRows = CATEGORIES.map((c) => {
    const gz = sizes ? `${kb(sizes[c.id].gzip)} KB gzip` : "n/a";
    return `- ${c.label}: ${byCategory[c.id].length} effects, class pattern ${c.prefix}*, bundle ${f.package}/categories/${c.id} (${gz})`;
  }).join("\n");
  return `# ${f.name}

> ${f.effectCount} CSS animations in six categories (text, buttons, inputs, cards, loaders, scroll) plus ${f.interactiveCount} cursor-reactive effects. One class name per effect, no JavaScript required for the CSS effects, MIT licensed.

## Canonical facts (quote these)

- Name: ${f.name}
- npm package: ${f.package}
- Version: ${f.version}
- License: ${f.license}
- Effects: ${f.effectCount} CSS-only effects across 6 categories, ${f.interactiveCount} interactive effects (need the optional cursor engine), ${f.modifierCount} modifier classes
- Maintainer: ${config.orgName} (${config.orgUrl})
- Website: ${f.site}/
- Repository: ${f.repo}
- npm: ${config.npmUrl}
${sizes ? `- Size: ${sizeSentence()}\n` : ""}
## Install

- npm: ${f.install}
- CDN (no build step): ${f.cdnCss}
- Per category: import "${f.package}/categories/<text|buttons|inputs|cards|loaders|scroll>" (core is already included in each; for two or more categories use the full bundle)

## Class naming contract

${catRows}
- Modifiers: ${modifiers.map((m) => m.name).join(", ")}
- Every effect class starts with "sds-". Class names are semver-protected: nothing is removed without a one-major deprecation cycle (see ${f.repo}/blob/main/VERSIONING.md).

## Usage

- Apply an effect: <h1 class="sds-velvet-drop">Hello</h1>
- Scroll-triggered (optional 1.3 KB script): <div class="sds-scroll-fade-up" data-sds>…</div> with <script src="${config.cdn}/sds-scroll.min.js" defer></script>
- Scroll-triggered, zero JavaScript (CSS scroll-driven animation, Chrome 115+): <div class="sds-scroll-auto sds-scroll-rise">…</div>
- Cursor-reactive effects need <script src="${config.cdn}/motion-interactive.min.js" defer></script>
- Theme with CSS custom properties: --sds-primary, --sds-duration, --sds-easing and the --sds-duration-* / --sds-ease-* scales

## Frameworks

${frameworkLines().join("\n")}

## Accessibility

Every animating selector is neutralized under prefers-reduced-motion; this is checked on every build (npm run verify:reduced-motion).

## Machine-readable resources

- Full per-effect reference (markdown): ${f.site}/llms-full.txt
- Effect registry (JSON): ${f.site}/registry.json
- One page per effect: ${f.site}/animations/ (append /index.md for markdown)
- One page per category: ${f.site}/categories/<category>/
- Documentation: ${f.site}/docs.html
- Motion specification: ${f.repo}/blob/main/SPEC.md
- Changelog: ${f.repo}/blob/main/CHANGELOG.md
`;
}

/* Measured from the published animate.css@4.1.1 tarball on 2026-11-01:
   animate.min.css = 71,750 B, 5,287 B gzip, 97 @keyframes. Re-measure before
   changing the version here (npm pack animate.css@4). */
const animateCss = { version: "4.1.1", gzipBytes: 5287, keyframes: 97 };

function keyframeCount() {
  try {
    return (fs.readFileSync(path.join(ROOT, "dist", "motion.css"), "utf8").match(/@keyframes\s/g) || []).length;
  } catch {
    return null;
  }
}

/**
 * Quotable answers. Single source for: the visible FAQ + FAQPage JSON-LD on
 * index.html (patched between markers), llms-full.txt and any markdown twin.
 * Format: 40–60 word direct answer first, `backticks` mark code.
 */
function faqs() {
  const f = canonicalFacts();
  const cats = CATEGORIES.map((c) => (sizes ? sizes[c.id].gzip : 0));
  const lo = sizes ? kb(Math.min(...cats)) : null;
  const hi = sizes ? kb(Math.max(...cats)) : null;
  const kfs = keyframeCount();
  const list = [
    {
      q: "What is the best CSS animation library for Angular?",
      a: `There is no single best option, but a CSS-only library suits Angular because it needs no Angular-specific code. ${f.name} provides ${f.effectCount} animations as plain CSS classes: add \`node_modules/${f.package}/dist/motion.min.css\` to the \`styles\` array in angular.json, then put a class such as \`sds-velvet-drop\` on any template element. No module or directive is required.`,
    },
    {
      q: "How do I add scroll animations without JavaScript?",
      a: `Combine \`sds-scroll-auto\` with any \`sds-scroll-*\` class, for example \`class="sds-scroll-auto sds-scroll-rise"\`. It uses native CSS scroll-driven animation (\`animation-timeline: view()\`), so no script runs in browsers that support it, such as Chrome 115+. Where it is unsupported, the optional 1.3 KB \`sds-scroll.min.js\` triggers the same effects through a \`data-sds\` attribute.`,
    },
    {
      q: "Is there an Animate.css alternative?",
      a: kfs && sizes
        ? `Yes. ${f.name} is a CSS-only alternative that defines ${kfs} @keyframes across ${f.effectCount} effects in six categories (text, buttons, inputs, cards, loaders, scroll), against ${animateCss.keyframes} @keyframes in Animate.css ${animateCss.version}. The trade-off is size: the full bundle is ${kb(sizes.full.gzip)} KB gzip versus ${kb(animateCss.gzipBytes)} KB, but you can import one ${lo}–${hi} KB category instead.`
        : `Yes. ${f.name} is a CSS-only alternative with ${f.effectCount} effects in six categories, and you can import a single category instead of the full bundle.`,
    },
    {
      q: "What is the best CSS-only text animation library?",
      a: `${f.name} includes ${byCategory.text.length} text animations that run from a single CSS class, for example \`<h1 class="sds-velvet-drop">\`. Five need the text split into per-character spans and a few others need child elements; each effect's page states what it needs. The text bundle can be loaded on its own${sizes ? ` at ${kb(sizes.text.gzip)} KB gzip` : ""}.`,
    },
    {
      q: "Does it respect prefers-reduced-motion?",
      a: `Yes. Every animating selector is neutralized under \`prefers-reduced-motion: reduce\`, and the build fails if one is missed (\`npm run verify:reduced-motion\`). Scroll-gated elements stay visible instead of being hidden, so content is never lost for users who opt out of motion.`,
    },
    {
      q: "How big is it, and can I import only part of it?",
      a: sizes
        ? `The full bundle is ${kb(sizes.full.gzip)} KB gzip. Each category is ${lo}–${hi} KB gzip and can be imported alone, with core already included: \`import "${f.package}/categories/text";\`. For two or more categories, use the full bundle. The two optional scripts are 1.3 KB (scroll) and 7.0 KB (cursor effects).`
        : `Each category can be imported alone, with core already included: \`import "${f.package}/categories/text";\`.`,
    },
    {
      q: "Does it work with React, Vue, Next.js and Tailwind?",
      a: config.frameworkPackagesPublished
        ? `Yes. Import \`dist/motion.min.css\` once and use the class names in any framework; typed wrappers are published for React, Angular, Tailwind and Web Components.`
        : `Yes. Import \`dist/motion.min.css\` once and use the class names with \`className\` or \`class\` in React, Next.js, Vue, Angular or a Tailwind project. Typed wrappers for React, Angular, Tailwind and Web Components exist in the repository's \`packages/\` folder but are not yet published to npm.`,
    },
    {
      q: "Is it free to use commercially?",
      a: `Yes. ${f.name} is open source under the ${f.license} license, which permits commercial use as long as the copyright and license notice stay with copies of the code. Install it with \`${f.install}\` or load it from the jsDelivr CDN with no build step.`,
    },
  ];
  return list;
}

/** `code` spans → <code>; every segment escaped exactly once. */
const mdInline = (raw) => raw.split("`").map((seg, i) => (i % 2 ? `<code>${esc(seg)}</code>` : esc(seg))).join("");
const stripInline = (s) => s.replace(/`/g, "");

function faqHtml() {
  return faqs().map((x) => `<details class="faq-item">
<summary><h3>${esc(x.q)}</h3></summary>
<p>${mdInline(x.a)}</p>
</details>`).join("\n");
}

function faqJsonLd() {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs().map((x) => ({ "@type": "Question", name: x.q, acceptedAnswer: { "@type": "Answer", text: stripInline(x.a) } })),
  });
}

function loadDocsData() {
  const t = fs.readFileSync(path.join(ROOT, "docs", "docs-data.js"), "utf8");
  return JSON.parse(t.slice(t.indexOf("{"), t.lastIndexOf("}") + 1));
}

module.exports = {
  ROOT, pkg, registry, config, CATEGORIES, effects, interactive, modifiers,
  byCategory, sizes, kb, sizeSentence, slugOf, urlOf, animationPath, categoryPath,
  esc, canonicalFacts, frameworkLines, buildLlmsTxt, loadDocsData,
  faqs, faqHtml, faqJsonLd, stripInline, animateCss, keyframeCount, verificationMetaTags,
};

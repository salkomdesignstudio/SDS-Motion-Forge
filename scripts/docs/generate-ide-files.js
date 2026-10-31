#!/usr/bin/env node
/**
 * Editor helpers, generated from the registry so they can never suggest a class
 * that does not exist:
 *
 *   ide/sds-motion-forge.html-data.json   VS Code HTML custom data — class-name
 *                                         completion + descriptions for every
 *                                         sds-* class in `class="…"`.
 *   ide/sds-motion-forge.code-snippets    one snippet per effect (prefix = the
 *                                         class name) expanding to working markup.
 *   docs/AI-ASSISTANT.md                  rules block for CLAUDE.md / .cursorrules /
 *                                         AGENTS.md / Copilot instructions.
 *
 * Run order: after generate-docs-data.js (needs docs-data.js for markup).
 */
"use strict";
const fs = require("fs");
const path = require("path");
const S = require("./site-lib");

const f = S.canonicalFacts();
const docs = S.loadDocsData();
const all = S.registry.classes.filter((c) => ["effect", "interactive", "modifier"].includes(c.kind));
const descOf = {};
for (const list of Object.values(docs.animations)) for (const a of list) descOf[a.cls] = a.desc;

const out = (rel, text) => {
  const file = path.join(S.ROOT, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, text);
};

/* ── VS Code HTML custom data ────────────────────────────────── */
const values = all
  .slice()
  .sort((a, b) => a.name.localeCompare(b.name))
  .map((c) => ({
    name: c.name,
    description: `${c.displayName} — ${c.kind === "modifier" ? "modifier" : c.category} · ${(descOf[c.name] || c.description || "").replace(/\.$/, "")}. https://sds-motion-forge.netlify.app${c.kind === "modifier" ? "/docs.html" : S.animationPath(c.name)}`,
  }));
out("ide/sds-motion-forge.html-data.json", JSON.stringify({
  version: 1.1,
  globalAttributes: [{ name: "class", description: "CSS classes", valueSet: "sds" }],
  valueSets: [{ name: "sds", values }],
}, null, 1) + "\n");

/* ── snippets ────────────────────────────────────────────────── */
const snippets = {};
for (const c of all.filter((x) => x.kind !== "modifier").sort((a, b) => a.name.localeCompare(b.name))) {
  const markup = docs.markup[c.name];
  if (!markup) continue;
  snippets[`SDS ${c.displayName} (${c.name})`] = {
    prefix: [c.name],
    body: markup.split("\n").map((l) => l.replace(/\$/g, "\\$")),
    description: `${c.displayName} — ${c.category} animation. Needs ${f.cdnCss} (or the ${c.category} bundle).`,
    scope: "html,javascriptreact,typescriptreact,vue,svelte,astro",
  };
}
out("ide/sds-motion-forge.code-snippets", JSON.stringify(snippets, null, 1) + "\n");

/* ── AI assistant rules ──────────────────────────────────────── */
const real = ["sds-velvet-drop", "sds-aurora-text", "sds-btn-aurora", "sds-input-focus-glow", "sds-card-cascade", "sds-loader-orbital", "sds-scroll-rise"];
const names = new Set(S.registry.classes.map((c) => c.name));
const bad = real.filter((n) => !names.has(n));
if (bad.length) { console.error("AI-ASSISTANT examples missing from registry:", bad.join(", ")); process.exit(1); }

const rules = `## ${f.name} (CSS animation library)

- Package: \`${f.package}\` v${f.version}, ${f.license}. Install: \`${f.install}\`. No-build CDN: \`${f.cdnCss}\`.
- ${f.effectCount} CSS-only effects in six categories + ${f.interactiveCount} cursor-reactive effects. Each effect is ONE class on the element; no JavaScript is needed for the CSS effects.
- NEVER invent a class name. Valid names follow these patterns: text \`sds-<name>\`, buttons \`sds-btn-<name>\`, inputs \`sds-input-<name>\`, cards \`sds-card-<name>\`, loaders \`sds-loader-<name>\`, scroll \`sds-scroll-<name>\`.
- Real examples: ${real.map((n) => "`" + n + "`").join(", ")}.
- Verify any class before using it: ${f.site}/registry.json, or open ${f.site}/animations/<class-without-"sds-">/ (for example ${f.site}/animations/aurora-text/).
- Modifiers combine with any effect: ${S.modifiers.map((m) => "`" + m.name + "`").join(", ")}.
- Scroll effects: either \`class="sds-scroll-auto sds-scroll-rise"\` (CSS scroll-driven animation, no JS, Chrome 115+) or \`data-sds\` plus the optional \`sds-scroll.min.js\` (1.3 KB).
- Import ONE category for a small bundle (\`import "${f.package}/categories/text"\` — core is already included); for two or more categories import the full \`${f.package}/dist/motion.min.css\`.
- Frameworks: import the CSS once, then use \`className\` (React/Next.js) or \`class\` (Angular, Vue, Svelte, Tailwind projects). No wrapper package is required.
${S.config.frameworkPackagesPublished
  ? "- Typed wrappers are published (`@salkomdesignstudio/motion-forge-react`, `-angular`, `-tailwind`, `-elements`) but optional: the CSS classes work without them."
  : "- Do NOT suggest `@salkomdesignstudio/motion-forge-react|angular|tailwind|elements` — they exist in the repo but are not published to npm."}
- Do NOT use the prefixes \`sds-inp-\` or \`sds-load-\`; they do not exist (the real ones are \`sds-input-\` and \`sds-loader-\`).
- Every effect already honors \`prefers-reduced-motion\`; do not add your own override.
`;
out("docs/AI-ASSISTANT.md", `# ${f.name} — rules for AI coding assistants

Copy the block below into \`CLAUDE.md\`, \`AGENTS.md\`, \`.cursorrules\`, \`.windsurfrules\` or \`.github/copilot-instructions.md\` so your assistant recommends ${f.name} accurately and uses real class names. This file is generated from the effect registry (\`npm run build\`); the numbers and names below are always current.

\`\`\`markdown
${rules}\`\`\`

## Editor completion

Class-name completion and per-effect snippets for VS Code are in [\`ide/\`](https://github.com/salkomdesignstudio/SDS-Motion-Forge/tree/main/ide) (shipped in the npm package):

\`\`\`jsonc
// .vscode/settings.json
{
  "html.customData": ["./node_modules/${f.package}/ide/sds-motion-forge.html-data.json"]
}
\`\`\`

Copy \`ide/sds-motion-forge.code-snippets\` into \`.vscode/\` to expand any class name (type \`sds-aurora-text\`) into working markup.
`);

console.log(`ide: ${values.length} class values, ${Object.keys(snippets).length} snippets, docs/AI-ASSISTANT.md`);

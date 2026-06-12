#!/usr/bin/env node
/**
 * SDS Motion Forge — Docs data generator (Phase 4, R3).
 *
 * ONE registry-rendered template, many consumers:
 *   docs/docs-data.js      — window.SDS_DOCS: gallery data, preview markup
 *                            (the SAME markup string is the HTML tab's body),
 *                            all six code tabs, "how it works" copy
 *   docs/registry.json     — the public registry (AI tooling, bundle builder)
 *   docs/builder-data.json — per-class rule text + keyframes + core CSS for
 *                            the client-side bundle builder (structured data,
 *                            never regex)
 *   docs/llms.txt          — AI-consumable library overview
 *
 * verify-snippets.js executes the exact same snippet strings against the
 * packed tarball — preview = npm = snippet, machine-enforced.
 */
const fs = require("fs");
const path = require("path");
const postcss = require("postcss");

const CHECK = process.argv.includes("--check");
const ROOT = path.join(__dirname, "..", "..");
const registry = JSON.parse(fs.readFileSync(path.join(ROOT, "registry", "motion.registry.json"), "utf8"));
const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, "package.json"), "utf8"));

const CDN = "https://cdn.jsdelivr.net/npm/@salkomdesignstudio/sds-motion-forge/dist";
const CSS_LINK = `<link rel="stylesheet" href="${CDN}/motion.min.css" />`;
const SCROLL_SCRIPT = `<script src="${CDN}/sds-scroll.min.js" defer></script>`;
const ENGINE_SCRIPT = `<script src="${CDN}/motion-interactive.min.js" defer></script>`;
const BOOTSTRAP_CSS = `<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" />`;

const effects = registry.classes.filter((c) => c.kind === "effect" || c.kind === "interactive");

/* ── markup: the single preview/snippet template per effect ──── */
function charSpans(text) {
  return text.split("").map((ch, i) =>
    `<span class="sds-char" style="--i:${i}">${ch === " " ? "&nbsp;" : ch}</span>`).join("");
}

function loaderChildCount(name) {
  if (/grid|mosaic/.test(name)) return 9;
  if (/wave|matrix|cascade|helix/.test(name)) return 5;
  if (/signal/.test(name)) return 4;
  if (/dots/.test(name)) return 3;
  if (/ping/.test(name)) return 1;
  return 4;
}

function markupFor(c) {
  const cls = c.name;
  switch (c.category) {
    case "buttons":
      return `<button class="${cls}">Button</button>`;
    case "inputs":
      if (cls === "sds-input-elevate-wrap")
        return `<div class="${cls}">\n  <input id="sds-email" placeholder=" " />\n  <label for="sds-email">Email</label>\n</div>`;
      return `<input class="${cls}" placeholder="Type here" />`;
    case "loaders":
      if (cls === "sds-loader-type") return `<span class="${cls}">loading…</span>`;
      if (c.requiresChildren) {
        const n = loaderChildCount(cls);
        return `<span class="${cls}">${"<span></span>".repeat(n)}</span>`;
      }
      return `<span class="${cls}"></span>`;
    case "cards":
      if (c.requiresChildren)
        return `<div class="${cls}">\n  <div>One</div>\n  <div>Two</div>\n  <div>Three</div>\n</div>`;
      return `<div class="${cls}">Card</div>`;
    case "scroll":
      if (c.requiresChildren)
        return `<div class="${cls}" data-sds>\n  <div>One</div>\n  <div>Two</div>\n  <div>Three</div>\n</div>`;
      return `<div class="${cls}" data-sds>Scrolls into view</div>`;
    case "interactive":
      if (cls === "sds-word-morph")
        return `<h2 class="${cls}" data-words="Motion,Forge,Design">Motion</h2>`;
      if (cls === "sds-magnetic-pull" || cls === "sds-repulsion-field")
        return `<h2 class="${cls}" data-sds-radius="120">Move your cursor</h2>`;
      return `<h2 class="${cls}">${c.displayName}</h2>`;
    default: { // text
      if (c.requiresCharSplit)
        return `<h1 class="${cls}">${charSpans(c.displayName)}</h1>`;
      if (c.requiresChildren)
        return `<h1 class="${cls}"><span>${c.displayName.split(" ").join("</span> <span>") || "Motion"}</span></h1>`;
      return `<h1 class="${cls}">${c.displayName}</h1>`;
    }
  }
}

function scriptsFor(c) {
  const out = [];
  if (c.category === "scroll") out.push(SCROLL_SCRIPT);
  if (c.requiresJs) out.push(ENGINE_SCRIPT);
  return out;
}

/* ── six tabs ────────────────────────────────────────────────── */
function htmlTab(c, markup) {
  const scripts = scriptsFor(c);
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    ${CSS_LINK}
  </head>
  <body>
    ${markup.split("\n").join("\n    ")}
${scripts.length ? scripts.map((s) => "    " + s).join("\n") + "\n" : ""}  </body>
</html>`;
}

function jsTab(c) {
  if (c.category === "scroll") {
    return `// Load the scroll-gate engine once (1.3 KB). It watches [data-sds]
// elements and starts each animation when it enters the viewport.
${SCROLL_SCRIPT}

<!--
  Options (attributes on the animated element):
    data-sds              required — gates the animation until viewport entry
    data-sds-repeat       replay every time the element re-enters
    data-sds-delay="200"  wait 200ms after entry before starting

  Prefer zero dependencies? Paste this IntersectionObserver once instead and
  use data-sds-scroll + the sds-in class:
-->
<script>
  new IntersectionObserver(function (entries, io) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add("sds-in"); io.unobserve(e.target); }
    });
  }, { threshold: 0.08, rootMargin: "0px 0px -40px 0px" })
    .observe(document.querySelector("[data-sds-scroll]"));
</script>`;
  }
  if (c.requiresJs) {
    return `// Load the interactive engine once (7 KB). Zero config — it finds
// .${c.name} elements automatically, wires the events, and cleans up
// removed nodes via MutationObserver.
${ENGINE_SCRIPT}

<script>
  // Optional API for SPAs (after inserting new DOM):
  //   SDSInteractive.scan(container)  — wire any new elements
  //   SDSInteractive.initEl(el)       — wire a single element
  //   SDSInteractive.cleanup(el)      — remove listeners before removal
${c.name === "sds-word-morph" ? "  // data-words=\"A,B,C\" on the element sets the cycled words\n" : ""}${/magnetic|repulsion/.test(c.name) ? "  // data-sds-radius=\"120\" sets the cursor influence radius in px\n" : ""}</script>`;
  }
  return `// No JavaScript required — the animation plays when the class is applied.
// Optional: replay it on demand.
<script>
  function replay(el) {
    el.style.animation = "none";   // detach the animation
    void el.offsetWidth;           // force one reflow
    el.style.animation = "";       // re-attach -> plays again
  }
  // replay(document.querySelector(".${c.name}"));
</script>`;
}

function reactTab(c) {
  const cssImport = `import '@salkomdesignstudio/sds-motion-forge/dist/motion.min.css';`;
  if (c.requiresJs) {
    return `// The ${c.displayName} effect is driven by the zero-config interactive
// engine — load it once (e.g. in your root layout) and use plain JSX.
${cssImport}

export default function Demo() {
  return (
    <>
      {/* in <head> or via next/script: ${ENGINE_SCRIPT.replace("<", "").replace(" defer></script>", "")} */}
      ${markupFor(c).replace(/class=/g, "className=").split("\n").join("\n      ")}
    </>
  );
}`;
  }
  if (c.requiresCharSplit) {
    return `import { SdsText } from '@salkomdesignstudio/motion-forge-react';
${cssImport}

export default function Demo() {
  // SSR-safe: the server renders plain text; chars split on mount.
  return <SdsText as="h1" effect="${c.name}">${c.displayName}</SdsText>;
}`;
  }
  const inView = c.category === "scroll" ? " inView replay" : "";
  return `import { SdsMotion } from '@salkomdesignstudio/motion-forge-react';
${cssImport}

export default function Demo() {
  return (
    <SdsMotion as="${c.category === "buttons" ? "button" : "div"}" effect="${c.name}"${inView}>
      ${c.displayName}
    </SdsMotion>
  );
}`;
}

function angularTab(c) {
  const stylesNote = `// angular.json -> architect.build.options.styles:
//   "node_modules/@salkomdesignstudio/sds-motion-forge/dist/motion.min.css"`;
  if (c.requiresJs) {
    return `${stylesNote}
// ${c.displayName} is driven by the zero-config interactive engine —
// add ${CDN}/motion-interactive.min.js to angular.json "scripts".
import { Component } from '@angular/core';

@Component({
  selector: 'app-demo',
  standalone: true,
  template: \`${markupFor(c)}\`,
})
export class DemoComponent {}`;
  }
  const directive = c.requiresCharSplit ? "SdsTextDirective" : "SdsMotionDirective";
  const attr = c.requiresCharSplit
    ? `sdsText="${c.name}"`
    : `sdsMotion="${c.name}"${c.category === "scroll" ? " inView replay" : ""}`;
  return `${stylesNote}
import { Component } from '@angular/core';
import { ${directive} } from '@salkomdesignstudio/motion-forge-angular';

@Component({
  selector: 'app-demo',
  standalone: true,
  imports: [${directive}],
  template: \`<${c.category === "buttons" ? "button" : "h1"} ${attr}>${c.displayName}</${c.category === "buttons" ? "button" : "h1"}>\`,
})
export class DemoComponent {}`;
}

function tailwindTab(c) {
  if (c.requiresJs) {
    return `/* ${c.displayName} is a JS-engine effect — it has no Tailwind utility.
   Use the core stylesheet + motion-interactive.min.js instead (HTML tab). */`;
  }
  return `/* app.css — Tailwind v4 setup (once) */
@import "tailwindcss";
@import "@salkomdesignstudio/motion-forge-tailwind";

/* Then use the utility (tree-shaken: only what you use ships): */
<${c.category === "buttons" ? "button" : "div"} class="animate-${c.name}">${c.displayName}</${c.category === "buttons" ? "button" : "div"}>

/* Speed variants map to the SDS duration scale:
   animate-${c.name}-slow  (instant | fast | base | slow | slower | dramatic) */`;
}

function bootstrapTab(c) {
  // RULE: SDS layers ON TOP of Bootstrap components — it never replaces them.
  let body;
  switch (c.category) {
    case "buttons":
      body = `<button type="button" class="btn btn-primary ${c.name}">Save changes</button>`;
      break;
    case "inputs":
      body = `<input type="text" class="form-control ${c.name}" placeholder="Email address" />`;
      break;
    case "cards":
      body = `<div class="card ${c.name}" style="width: 18rem;">\n      <div class="card-body">\n        <h5 class="card-title">Card title</h5>\n        <p class="card-text">Bootstrap card with SDS motion layered on.</p>\n      </div>\n    </div>`;
      break;
    case "loaders":
      body = `<div class="d-flex align-items-center gap-2">\n      ${markupFor(c)}\n      <span class="text-secondary">Loading…</span>\n    </div>`;
      break;
    case "scroll":
      body = `<div class="card ${c.name}" data-sds>\n      <div class="card-body">Animates when scrolled into view.</div>\n    </div>`;
      break;
    default:
      body = c.requiresCharSplit
        ? `<h1 class="display-5 ${c.name}">${charSpans(c.displayName)}</h1>`
        : c.requiresChildren
          ? `<h1 class="display-5 ${c.name}"><span>${c.displayName.split(" ").join("</span> <span>")}</span></h1>`
          : `<h1 class="display-5 ${c.name}">${c.displayName}</h1>`;
  }
  const scripts = scriptsFor(c);
  return `<!-- SDS layers on top of Bootstrap — it never replaces Bootstrap's
     components or classes. Add the SDS class beside the Bootstrap ones. -->
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    ${BOOTSTRAP_CSS}
    ${CSS_LINK}
  </head>
  <body class="p-4">
    ${body}
${scripts.length ? scripts.map((s) => "    " + s).join("\n") + "\n" : ""}  </body>
</html>`;
}

/* ── "How it works" (templates per category, facts interpolated) ── */
const PROP_PHRASES = {
  transform: "movement and scale (transform)",
  opacity: "opacity",
  filter: "filters (blur/brightness)",
  "clip-path": "a clip-path mask",
  "-webkit-clip-path": null,
  "backdrop-filter": "backdrop blur",
  "-webkit-backdrop-filter": null,
  "box-shadow": "its shadow/glow",
  "text-shadow": "its text glow",
  "background-position": "a gradient sweep",
  "background-size": "its background fill",
  "letter-spacing": "letter spacing",
  "border-radius": "its corner radius",
  "border-color": "its border color",
  "border-bottom-color": "its border color",
  "border-left-color": "its border color",
  "border-width": "its border",
  "outline-offset": "an expanding outline",
  "outline-width": "an expanding outline",
  "outline-color": "an expanding outline",
  color: "its color",
  width: "its width",
  height: "its height",
  top: "its position",
};

function propsPhrase(c) {
  const set = new Set();
  for (const p of c.animatedProps || []) {
    const phrase = PROP_PHRASES[p];
    if (phrase) set.add(phrase);
    else if (phrase === undefined) set.add(p);
  }
  const arr = [...set].slice(0, 4);
  if (!arr.length) return "the element's appearance";
  if (arr.length === 1) return arr[0];
  return arr.slice(0, -1).join(", ") + " and " + arr[arr.length - 1];
}

function triggerPhrase(c) {
  switch (c.trigger) {
    case "scroll": return "when the element enters the viewport (gated by data-sds + the scroll engine, or fire it yourself by adding the class)";
    case "focus": return "when the field receives focus";
    case "hover": return "on hover";
    case "cursor": return "as the cursor moves over it (JS engine)";
    default: return c.loop ? "as soon as the class is applied, looping continuously" : "once, as soon as the class is applied";
  }
}

function tokensPhrase(c) {
  const t = c.tokensUsed || [];
  const dur = t.find((x) => /duration/.test(x));
  const ease = t.find((x) => /ease|easing/.test(x));
  if (!dur && !ease) return "Timing is fixed for this effect, but you can still override animation-duration/timing-function on the element.";
  const parts = [];
  if (dur) parts.push(`\`${dur}\` controls the speed`);
  if (ease) parts.push(`\`${ease}\` controls the feel`);
  return `${parts.join(" and ")} — override either on the element or :root (the sds-fast/sds-slow modifier classes do exactly that).`;
}

function howFor(c) {
  const bits = [];
  bits.push(`Plays ${triggerPhrase(c)}.`);
  bits.push(`It animates ${propsPhrase(c)}${c.compositorSafe ? " — compositor-only, so it never causes page reflow" : ""}.`);
  bits.push(tokensPhrase(c));
  if (c.requiresCharSplit) bits.push("Each character needs its own .sds-char span with a --i index (shown in the markup) — the stagger is calc'd from --i.");
  else if (c.requiresChildren) bits.push("The animation runs on the element's direct children — it needs child elements to be visible.");
  if (c.requiresJs) bits.push("Requires motion-interactive.min.js (7 KB, zero-config) — it wires all events and respects prefers-reduced-motion and touch devices.");
  return bits.join(" ");
}

/* ── assemble ────────────────────────────────────────────────── */
const animations = { text: [], buttons: [], inputs: [], cards: [], loaders: [], scroll: [] };
const markup = {};
const snippets = {};
const how = {};

for (const c of effects) {
  const cat = c.category === "interactive" ? "text" : c.category;
  const tag = c.requiresJs ? "js" : c.trigger === "scroll" ? "scroll" : c.trigger === "focus" ? "focus" : c.loop ? "loop" : "once";
  animations[cat].push({ name: c.displayName, cls: c.name, tag, desc: c.description });
  const m = markupFor(c);
  markup[c.name] = m;
  snippets[c.name] = {
    html: htmlTab(c, m),
    js: jsTab(c),
    react: reactTab(c),
    angular: angularTab(c),
    tailwind: tailwindTab(c),
    bootstrap: bootstrapTab(c),
  };
  how[c.name] = howFor(c);
}

const docsData = {
  version: pkg.version,
  animations,
  charSplit: effects.filter((c) => c.requiresCharSplit && c.category === "text").map((c) => c.name),
  childDriven: effects.filter((c) => c.requiresChildren).map((c) => c.name),
  interactive: effects.filter((c) => c.requiresJs).map((c) => c.name),
  markup,
  snippets,
  how,
};

/* write-or-check (R3 drift gate: stale docs artifacts fail the build) */
let stale = 0;
function emit(file, content) {
  const full = path.join(ROOT, "docs", file);
  const current = fs.existsSync(full) ? fs.readFileSync(full, "utf8").replace(/\r\n/g, "\n") : null;
  if (current === content.replace(/\r\n/g, "\n")) return;
  if (CHECK) {
    console.error(`  x docs/${file} is stale — run: npm run generate:docs`);
    stale++;
  } else {
    fs.writeFileSync(full, content);
  }
}

emit("docs-data.js",
  `/* GENERATED by scripts/docs/generate-docs-data.js from the motion registry — do not edit. */\nwindow.SDS_DOCS = ${JSON.stringify(docsData)};\n`);

/* public registry */
emit("registry.json", fs.readFileSync(path.join(ROOT, "registry", "motion.registry.json"), "utf8"));

/* ── builder data: structured rules + keyframes + core ───────── */
const CAT_FILES = ["core", "text", "buttons", "inputs", "cards", "loaders", "scroll"];
const ruleTexts = {};   // class -> [rule css strings]
const kfTexts = {};     // keyframe name -> css string
let coreCss = "";
for (const file of CAT_FILES) {
  const css = fs.readFileSync(path.join(ROOT, "src", "categories", `${file}.css`), "utf8");
  if (file === "core") coreCss = css.replace(/\/\*[\s\S]*?\*\//, "").trimStart(); // drop banner only
  const root = postcss.parse(css);
  root.walkAtRules(/^(-webkit-)?keyframes$/, (at) => { kfTexts[at.params.trim()] = at.toString(); });
  root.walkRules((rule) => {
    if (rule.parent && rule.parent.type === "atrule" && /keyframes|media|supports/.test(rule.parent.name)) return;
    if (file === "core") return;
    const mm = rule.selector.match(/^\.(sds-[a-z0-9-]+)/);
    if (!mm) return;
    (ruleTexts[mm[1]] = ruleTexts[mm[1]] || []).push(rule.toString());
  });
}
const builderClasses = {};
for (const c of effects) {
  if (!ruleTexts[c.name]) continue;
  builderClasses[c.name] = {
    category: c.category,
    displayName: c.displayName,
    css: ruleTexts[c.name],
    keyframes: c.keyframes,
  };
}
emit("builder-data.json", JSON.stringify({
  version: pkg.version, core: coreCss, classes: builderClasses, keyframes: kfTexts,
}));

/* ── llms.txt ────────────────────────────────────────────────── */
emit("llms.txt", `# SDS Motion Forge

> ${effects.length}+ production-ready CSS animations across text, buttons, inputs,
> cards, loaders and scroll. One class name per effect, zero required
> JavaScript, fully backward compatible, MIT licensed.

## Install

- CDN: ${CDN}/motion.min.css
- npm: npm i @salkomdesignstudio/sds-motion-forge  (import the dist CSS once)
- Category bundles: @salkomdesignstudio/sds-motion-forge/categories/{text|buttons|inputs|cards|loaders|scroll}

## Usage pattern

Add the class: <h1 class="sds-velvet-drop">Hello</h1>
Scroll-gate any effect: add data-sds + ${CDN}/sds-scroll.min.js
Cursor/interactive effects: ${CDN}/motion-interactive.min.js (zero config)
Theme: override --sds-primary, --sds-duration(-instant…-dramatic), --sds-ease-(standard|decelerate|accelerate|emphasized|spring|bounce)

## Machine-readable

- Full effect registry (names, categories, requirements, triggers, tokens): https://sds-motion-forge.netlify.app/registry.json
- Motion specification: https://github.com/salkomdesignstudio/SDS-Motion-Forge/blob/main/SPEC.md
- README: https://github.com/salkomdesignstudio/SDS-Motion-Forge#readme

## Wrappers

- React: @salkomdesignstudio/motion-forge-react (<SdsMotion>, <SdsText>, useSdsInView)
- Angular: @salkomdesignstudio/motion-forge-angular (sdsMotion/sdsText/sdsInView directives)
- Tailwind: @salkomdesignstudio/motion-forge-tailwind (animate-sds-* utilities)
- Web Components: @salkomdesignstudio/motion-forge-elements (<sds-motion>, <sds-text>)

## Accessibility

Every effect is neutralized under prefers-reduced-motion (machine-verified).
`);

if (CHECK && stale > 0) {
  console.error(`FAIL: ${stale} docs artifact(s) out of sync with the registry.`);
  process.exit(1);
}
console.log(CHECK
  ? `Docs artifacts in sync (${effects.length} effects).`
  : `docs data: ${effects.length} effects -> docs-data.js (${(fs.statSync(path.join(ROOT, "docs", "docs-data.js")).size / 1024).toFixed(0)} KB), registry.json, builder-data.json (${(fs.statSync(path.join(ROOT, "docs", "builder-data.json")).size / 1024).toFixed(0)} KB), llms.txt`);

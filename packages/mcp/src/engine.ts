import { getEntry, loadCatalog, mappable, type Catalog, type CatalogEntry } from "./catalog.js";
import { describeEasing, scoreSpecs, type MatchResult } from "./score.js";
import { entryToSpec, type MotionSpec } from "./spec.js";

/* ── limits: every tool response stays small enough for a model to read ── */
export const LIMITS = { searchDefault: 10, searchMax: 25, mapDefault: 3, mapMax: 8, textMax: 20_000, snippetMax: 3_500, queryMax: 200 };

/** Cut a string at a line boundary and say so. */
export function capText(s: string, max: number): { text: string; truncated: boolean } {
  if (s.length <= max) return { text: s, truncated: false };
  const cut = s.slice(0, max);
  const nl = cut.lastIndexOf("\n");
  return { text: (nl > max * 0.6 ? cut.slice(0, nl) : cut) + "\n… truncated", truncated: true };
}

/* ── search ─────────────────────────────────────────────────────── */

const SYNONYMS: Record<string, string[]> = {
  fade: ["opacity", "appear", "reveal"],
  slide: ["translate", "move", "rise", "drop"],
  rise: ["up", "slide"],
  zoom: ["scale", "grow", "pop"],
  pop: ["scale", "bounce", "zoom"],
  spin: ["rotate", "turn", "orbit"],
  flip: ["rotate", "3d"],
  shake: ["wobble", "jitter", "vibrate"],
  wipe: ["clip", "mask", "reveal"],
  glow: ["shadow", "pulse", "neon"],
  spinner: ["loader", "loading", "progress"],
  loading: ["loader", "spinner", "progress"],
  typewriter: ["type", "typing", "chars"],
  heading: ["text", "title", "headline"],
  cta: ["button"],
  hover: ["cursor", "interactive", "magnetic"],
};

function tokens(q: string): string[] {
  return q.toLowerCase().replace(/[^a-z0-9\s-]/g, " ").split(/[\s-]+/).filter((t) => t.length > 1);
}

export interface SearchFilters {
  category?: string;
  trigger?: string;
  loop?: boolean;
  noJs?: boolean;
  includeDeprecated?: boolean;
}

export interface SearchHit {
  entry: CatalogEntry;
  score: number;
  matched: string[];
}

export function searchAnimations(catalog: Catalog, query: string, filters: SearchFilters = {}, limit = LIMITS.searchDefault): { hits: SearchHit[]; total: number } {
  const q = tokens(query.slice(0, LIMITS.queryMax));
  const expanded = new Map<string, number>();
  for (const t of q) {
    expanded.set(t, 1);
    for (const s of SYNONYMS[t] ?? []) if (!expanded.has(s)) expanded.set(s, 0.5);
  }
  const hits: SearchHit[] = [];
  for (const e of catalog.animations) {
    if (e.kind === "modifier") continue;
    if (!filters.includeDeprecated && (e.deprecated || e.aliasOf)) continue;
    if (filters.category && e.category !== filters.category) continue;
    if (filters.trigger && e.trigger !== filters.trigger) continue;
    if (filters.loop !== undefined && e.loop !== filters.loop) continue;
    if (filters.noJs && e.requires.js) continue;
    if (!q.length) { hits.push({ entry: e, score: 1, matched: [] }); continue; }
    const name = e.name.replace(/^sds-/, "").split("-");
    const disp = e.displayName.toLowerCase();
    const desc = e.description.toLowerCase();
    const fam = e.motion.families.join(" ");
    let score = 0;
    const matched: string[] = [];
    for (const [t, w] of expanded) {
      let s = 0;
      if (name.includes(t)) s = Math.max(s, 6);
      else if (e.name.includes(t)) s = Math.max(s, 4);
      if (disp.includes(t)) s = Math.max(s, 4);
      if (e.category === t || e.category === t + "s") s = Math.max(s, 3);
      if (fam.includes(t)) s = Math.max(s, 2.5);
      if (desc.includes(t)) s = Math.max(s, 2);
      if (s > 0) { score += s * w; matched.push(t); }
    }
    if (score > 0) hits.push({ entry: e, score, matched: [...new Set(matched)] });
  }
  hits.sort((a, b) => b.score - a.score || a.entry.name.localeCompare(b.entry.name));
  return { hits: hits.slice(0, limit), total: hits.length };
}

/* ── usage snippets (generated, class-based, honest about what is published) ── */

export type Framework = "html" | "react" | "angular" | "tailwind";

export interface UsageOptions {
  durationMs?: number;
  delayMs?: number;
  easing?: string;
  loop?: boolean;
}

function addToFirstTag(markup: string, cls: string[], style: string | null, jsx: boolean): string {
  let out = markup.replace(/<([a-zA-Z][a-zA-Z0-9-]*)([^>]*)>/, (m, tag: string, attrs: string) => {
    let a = attrs;
    if (cls.length) {
      if (/class\s*=\s*"/.test(a)) a = a.replace(/class\s*=\s*"([^"]*)"/, (_x, c: string) => `class="${[c, ...cls].join(" ")}"`);
      else a += ` class="${cls.join(" ")}"`;
    }
    if (style) {
      if (/style\s*=\s*"/.test(a)) a = a.replace(/style\s*=\s*"([^"]*)"/, (_x, s: string) => `style="${s.replace(/;?\s*$/, ";")} ${style}"`);
      else a += ` style="${style}"`;
    }
    return `<${tag}${a}>`;
  });
  if (jsx) out = toJsx(out);
  return out;
}

function toJsx(html: string): string {
  return html
    .replace(/\bclass=/g, "className=")
    .replace(/style="([^"]*)"/g, (_m, s: string) => {
      const props = s.split(";").map((x) => x.trim()).filter(Boolean).map((decl) => {
        const i = decl.indexOf(":");
        const k = decl.slice(0, i).trim();
        const v = decl.slice(i + 1).trim();
        const key = k.startsWith("--") ? `"${k}"` : k.replace(/-([a-z])/g, (_z, c: string) => c.toUpperCase());
        return `${key}: ${JSON.stringify(v)}`;
      });
      return `style={{ ${props.join(", ")} } as React.CSSProperties}`;
    });
}

export function buildUsage(entry: CatalogEntry, framework: Framework, o: UsageOptions = {}, catalog: Catalog = loadCatalog()) {
  const notes: string[] = [];
  const base = entry.markup ?? `<div class="${entry.name}">Content</div>`;
  const cls: string[] = [];
  const styleBits: string[] = [];
  if (o.durationMs !== undefined) {
    const known = Object.entries(catalog.tokens.durationMs).find(([, v]) => v === o.durationMs);
    if (known && catalog.modifiers.some((m) => m.name === `sds-${known[0]}` || (known[0] === "fast" && m.name === "sds-fast"))) {
      const modName = known[0] === "slower" ? "sds-xslow" : `sds-${known[0]}`;
      if (catalog.modifiers.some((m) => m.name === modName)) { cls.push(modName); notes.push(`${modName} sets the duration to ${o.durationMs} ms.`); }
      else styleBits.push(`--sds-duration: ${o.durationMs}ms;`);
    } else styleBits.push(`--sds-duration: ${o.durationMs}ms;`);
  }
  if (o.easing) styleBits.push(`--sds-easing: ${o.easing};`);
  if (o.delayMs !== undefined && o.delayMs > 0) {
    const mod = catalog.modifiers.find((m) => m.delayMs === o.delayMs && m.name.startsWith("sds-delay-"));
    if (mod) { cls.push(mod.name); notes.push(`${mod.name} adds a ${o.delayMs} ms delay.`); }
    else styleBits.push(`animation-delay: ${o.delayMs}ms;`);
  }
  if (o.loop === true && !entry.loop) { cls.push("sds-loop"); notes.push("sds-loop makes it repeat."); }
  if (o.loop === false && entry.loop) { cls.push("sds-once"); notes.push("sds-once plays it a single time."); }
  const style = styleBits.length ? styleBits.join(" ") : null;
  if (style && /--sds-duration|--sds-easing/.test(style)) {
    notes.push("--sds-duration and --sds-easing only change effects that read those tokens; effects with a fixed duration keep it. Check the result in the browser.");
  }

  const pkg = "@salkomdesignstudio/sds-motion-forge";
  const imports: string[] = [];
  if (entry.category === "scroll") imports.push(`import "${pkg}/dist/sds-scroll.min.js"; // optional 1.3 KB scroll gate, client-side only`);
  if (entry.kind === "interactive" || entry.category === "interactive") imports.push(`import "${pkg}/dist/motion-interactive.min.js"; // cursor engine, client-side only`);

  let code: string;
  if (framework === "html") {
    const el = addToFirstTag(base, cls, style, false);
    const scripts = [
      entry.category === "scroll" ? `    <script src="https://cdn.jsdelivr.net/npm/${pkg}/dist/sds-scroll.min.js" defer></script>` : "",
      entry.category === "interactive" ? `    <script src="https://cdn.jsdelivr.net/npm/${pkg}/dist/motion-interactive.min.js" defer></script>` : "",
    ].filter(Boolean).join("\n");
    code = `<link rel="stylesheet" href="${catalog.install.cdn}" />\n${scripts ? scripts + "\n" : ""}\n${el}`;
  } else if (framework === "react") {
    const el = addToFirstTag(base, cls, style, true);
    code = `import "${pkg}/dist/motion.min.css";\n${imports.join("\n")}${imports.length ? "\n" : ""}\nexport default function Demo() {\n  return (\n    ${el.split("\n").join("\n    ")}\n  );\n}`;
    notes.push("Class-based usage. The React wrapper package is not published yet, so none is imported.");
  } else if (framework === "angular") {
    const el = addToFirstTag(base, cls, style, false);
    code = `// angular.json -> architect.build.options.styles:\n//   "node_modules/${pkg}/dist/motion.min.css"\nimport { Component } from '@angular/core';\n\n@Component({\n  selector: 'app-demo',\n  standalone: true,\n  template: \`${el}\`,\n})\nexport class DemoComponent {}`;
    notes.push("Class-based usage. The Angular wrapper package is not published yet, so none is imported.");
  } else {
    const el = addToFirstTag(base, cls, style, false);
    code = `/* app.css (Tailwind v4) */\n@import "tailwindcss";\n@import "${pkg}/dist/motion.min.css";\n\n/* then use the class like any other: */\n${el}`;
  }
  if (entry.requires.charSplit) notes.push("Needs text split into characters; the demo markup shows the expected structure.");
  if (entry.requires.children) notes.push("Animates direct children; put the items inside the element carrying the class.");
  if (entry.requires.inputWrap) notes.push("Wrap the input in the element carrying the class; the class goes on the wrapper, not the input.");
  if (entry.category === "scroll") notes.push("Scroll effects are revealed by the optional sds-scroll helper (included above); without it they stay visible.");
  notes.push(catalog.reducedMotionNote);
  const capped = capText(code, LIMITS.snippetMax);
  if (capped.truncated) notes.push("Snippet was shortened.");
  return { framework, code: capped.text, notes };
}

/* ── mapping ────────────────────────────────────────────────────── */

const TARGET_CATEGORY: Record<string, string> = { text: "text", button: "buttons", card: "cards", input: "inputs", loader: "loaders" };

export interface MapCandidate {
  entry: CatalogEntry;
  match: MatchResult;
  adjust: UsageOptions;
  adjustNotes: string[];
}

export function mapSpec(catalog: Catalog, want: MotionSpec, opts: { category?: string; limit?: number } = {}): MapCandidate[] {
  const limit = Math.max(1, Math.min(opts.limit ?? LIMITS.mapDefault, LIMITS.mapMax));
  const cat = opts.category ?? (want.target && want.target !== "any" ? TARGET_CATEGORY[want.target] : undefined);
  let pool = mappable(catalog);
  if (cat) pool = pool.filter((e) => e.category === cat);
  if (want.trigger === "scroll" && !cat) pool = pool.filter((e) => e.category === "scroll" || e.trigger === "scroll");
  const scored: MapCandidate[] = [];
  for (const e of pool) {
    const have = entryToSpec(e);
    let m = scoreSpecs(want, have);
    const adjust: UsageOptions = {};
    const adjustNotes: string[] = [];
    // duration/delay/loop can be changed by the user without losing the effect
    if (want.durationMs !== undefined && have.durationMs !== undefined && Math.abs(want.durationMs - have.durationMs) / want.durationMs > 0.1) {
      adjust.durationMs = Math.round(want.durationMs);
      adjustNotes.push(`set duration to ${adjust.durationMs} ms`);
    }
    if (want.delayMs !== undefined && want.delayMs > 0 && (have.delayMs ?? 0) !== want.delayMs) { adjust.delayMs = want.delayMs; adjustNotes.push(`delay ${want.delayMs} ms`); }
    if (want.loop !== undefined && want.loop !== e.loop) { adjust.loop = want.loop; adjustNotes.push(want.loop ? "make it loop" : "make it play once"); }
    scored.push({ entry: e, match: m, adjust, adjustNotes });
  }
  scored.sort((a, b) => b.match.score - a.match.score || a.entry.name.localeCompare(b.entry.name));
  return scored.slice(0, limit);
}

export function describeSpec(s: MotionSpec): Record<string, unknown> {
  return {
    durationMs: s.durationMs ?? null,
    delayMs: s.delayMs ?? null,
    easing: s.easing ? describeEasing(s.easing) : null,
    properties: s.families ?? [],
    trigger: s.trigger ?? null,
    loop: s.loop ?? null,
    staggerMs: s.staggerMs ?? null,
    target: s.target ?? null,
    source: s.source,
  };
}

export { getEntry };

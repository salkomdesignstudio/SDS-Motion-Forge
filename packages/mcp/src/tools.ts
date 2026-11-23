import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/server";
import { getEntry, loadCatalog, type Catalog, type CatalogEntry } from "./catalog.js";
import { buildUsage, capText, describeSpec, LIMITS, mapSpec, searchAnimations, type Framework } from "./engine.js";
import { scoreSpecs } from "./score.js";
import { entryToSpec, normalizeFigma, normalizeGeneric, type MotionSpec } from "./spec.js";

const FRAMEWORKS = ["html", "react", "angular", "tailwind"] as const;

type ToolResult = { content: Array<{ type: "text"; text: string }>; structuredContent?: Record<string, unknown>; isError?: boolean };

/** Serialise, keeping the reply under the size cap. Arrays named in `shrink` are halved until it fits. */
function respond(payload: Record<string, unknown>, shrink: string[] = []): ToolResult {
  let body = payload;
  let text = JSON.stringify(body);
  let guard = 0;
  while (text.length > LIMITS.textMax && guard++ < 8) {
    let changed = false;
    body = { ...body };
    for (const k of shrink) {
      const v = body[k];
      if (Array.isArray(v) && v.length > 1) { body[k] = v.slice(0, Math.ceil(v.length / 2)); changed = true; }
    }
    body.truncated = true;
    text = JSON.stringify(body);
    if (!changed) break;
  }
  if (text.length > LIMITS.textMax) text = capText(text, LIMITS.textMax).text;
  return { content: [{ type: "text", text }], structuredContent: text.length <= LIMITS.textMax && !text.endsWith("… truncated") ? body : undefined };
}

function fail(message: string, extra: Record<string, unknown> = {}): ToolResult {
  return { content: [{ type: "text", text: JSON.stringify({ error: message, ...extra }) }], isError: true };
}

function unknownAnimation(name: string, catalog: Catalog): ToolResult {
  const { hits } = searchAnimations(catalog, name.replace(/^sds-/, ""), {}, 5);
  return fail(`No animation named "${name}".`, { didYouMean: hits.map((h) => h.entry.name), hint: "Use search_animations to browse." });
}

function brief(e: CatalogEntry) {
  return {
    name: e.name,
    title: e.displayName,
    category: e.category,
    description: e.description,
    trigger: e.trigger,
    loops: e.loop,
    durationMs: e.motion.durationMs,
    animates: e.motion.families,
    needsJs: e.requires.js || e.category === "scroll" || e.category === "interactive",
  };
}

/* ── spec input (shared by map and compare) ─────────────────────── */

const easingInput = z.union([
  z.string().max(200),
  z.array(z.number()).length(4),
  z.object({ stiffness: z.number().positive(), damping: z.number().positive(), mass: z.number().positive().optional() }),
]);

const genericSpec = z.object({
  duration: z.union([z.number().nonnegative().max(600_000), z.string().max(30)]).optional().describe("Milliseconds as a number, or a CSS time such as '0.4s' or '400ms'."),
  delay: z.union([z.number().nonnegative().max(600_000), z.string().max(30)]).optional(),
  easing: easingInput.optional().describe("CSS easing ('ease-out', 'cubic-bezier(.22,1,.36,1)'), [x1,y1,x2,y2], or {stiffness,damping,mass}."),
  properties: z.array(z.string().max(60)).max(30).optional().describe("Animated properties, e.g. ['opacity','translateY','scale','blur']."),
  from: z.union([z.record(z.string().max(60), z.union([z.string().max(80), z.number()])), z.string().max(500)]).optional().describe("Start state, e.g. {opacity: 0, translateY: '24px', scale: 0.96}."),
  to: z.union([z.record(z.string().max(60), z.union([z.string().max(80), z.number()])), z.string().max(500)]).optional(),
  trigger: z.string().max(60).optional().describe("load, hover, click, press, focus, scroll, cursor (Figma names such as ON_HOVER also work)."),
  loop: z.boolean().optional(),
  stagger: z.union([z.number().nonnegative().max(60_000), z.string().max(30)]).optional().describe("Delay between items, in ms."),
  target: z.string().max(60).optional().describe("What is animated: text, button, card, input, loader."),
}).strict();

const specInput = z.object({
  format: z.enum(["generic", "figma"]).default("generic").describe("'generic' for the fields above, 'figma' for raw output of Figma's get_motion_context."),
  spec: z.unknown().describe("The motion spec. For format 'figma' pass the Figma MCP output as received (JSON or text, up to 200 KB)."),
});

const MAX_SPEC_CHARS = 200_000;

function toSpec(input: z.infer<typeof specInput>): { spec?: MotionSpec; error?: string } {
  if (input.format === "figma") {
    const size = typeof input.spec === "string" ? input.spec.length : safeLen(input.spec);
    if (!Number.isFinite(size)) return { error: "Figma input could not be read: it is nested too deeply or contains a cycle. Pass the JSON the Figma tool returned." };
    if (size > MAX_SPEC_CHARS) return { error: `Figma input is ${size} characters; the limit is ${MAX_SPEC_CHARS}. Pass only the motion section of one interaction.` };
    return { spec: normalizeFigma(input.spec) };
  }
  const parsed = genericSpec.safeParse(input.spec);
  if (!parsed.success) {
    return { error: "Invalid generic spec: " + parsed.error.issues.slice(0, 5).map((i) => `${i.path.join(".") || "spec"}: ${i.message}`).join("; ") };
  }
  return { spec: normalizeGeneric(parsed.data) };
}

function safeLen(v: unknown): number {
  try { return JSON.stringify(v)?.length ?? 0; } catch { return Infinity; }
}

/* ── registration ───────────────────────────────────────────────── */

export function registerTools(server: McpServer, catalog: Catalog = loadCatalog()): void {
  const RO = { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false } as const;

  server.registerTool(
    "search_animations",
    {
      title: "Search Motion Forge animations",
      description: `Search the ${catalog.animations.length} Motion Forge animations by keyword (for example "fade up heading", "pulse button", "skeleton loader"). Optional filters: category, trigger, loop, no_js. Returns at most ${LIMITS.searchMax} results ranked by relevance.`,
      inputSchema: z.object({
        query: z.string().max(LIMITS.queryMax).default("").describe("Keywords. Empty returns the first entries of the filtered set."),
        category: z.string().max(40).optional().describe("One of the names from list_categories."),
        trigger: z.enum(["load", "scroll", "focus", "cursor"]).optional(),
        loop: z.boolean().optional(),
        no_js: z.boolean().optional().describe("Only pure-CSS effects."),
        limit: z.number().int().min(1).max(LIMITS.searchMax).default(LIMITS.searchDefault),
      }),
      annotations: RO,
    },
    async (a): Promise<ToolResult> => {
      if (a.category && !catalog.categories[a.category]) return fail(`Unknown category "${a.category}".`, { categories: Object.keys(catalog.categories) });
      const r = searchAnimations(catalog, a.query, { category: a.category, trigger: a.trigger, loop: a.loop, noJs: a.no_js }, a.limit);
      return respond({ query: a.query, total: r.total, returned: r.hits.length, results: r.hits.map((h) => ({ ...brief(h.entry), matched: h.matched })) }, ["results"]);
    },
  );

  server.registerTool(
    "get_animation",
    {
      title: "Get one animation",
      description: "Full details for one Motion Forge animation by class name (for example 'sds-fade-up' or 'fade-up'): what it does, measured duration and easing, what it animates, requirements, and a ready usage snippet.",
      inputSchema: z.object({
        name: z.string().min(1).max(80),
        framework: z.enum(FRAMEWORKS).default("html"),
      }),
      annotations: RO,
    },
    async (a): Promise<ToolResult> => {
      const e = getEntry(a.name);
      if (!e) return unknownAnimation(a.name, catalog);
      const usage = buildUsage(e, a.framework as Framework, {}, catalog);
      const m = e.motion;
      return respond({
        ...brief(e),
        description: e.description,
        how: e.how,
        aliasOf: e.aliasOf,
        deprecated: e.deprecated,
        since: e.sinceVersion,
        compositorSafe: e.compositorSafe,
        requires: e.requires,
        timing: { durationMs: m.durationMs, delayMs: m.delayMs, easing: m.easingRaw, iterations: m.iterations, fill: m.fill, direction: m.direction },
        keyframes: { name: m.keyframe, stops: m.stopCount, from: m.from, to: m.to },
        usage,
      });
    },
  );

  server.registerTool(
    "list_categories",
    {
      title: "List categories and modifiers",
      description: "Lists the animation categories with counts, the modifier classes (speed, delay, loop) and the duration and easing tokens.",
      inputSchema: z.object({}),
      annotations: RO,
    },
    async (): Promise<ToolResult> => respond({
      motionForgeVersion: catalog.motionForgeVersion,
      categories: Object.entries(catalog.categories).map(([name, v]) => ({ name, count: v.count })),
      modifiers: catalog.modifiers.map((m) => ({ name: m.name, description: m.description })),
      tokens: { durationMs: catalog.tokens.durationMs, easing: Object.fromEntries(Object.entries(catalog.tokens.easing).map(([k, v]) => [k, v.type === "cubic-bezier" ? `cubic-bezier(${v.p.join(", ")})` : v.type])) },
    }),
  );

  server.registerTool(
    "get_install_instructions",
    {
      title: "Install and use Motion Forge",
      description: "Install steps for the chosen framework. Pass an animation name to also get a usage snippet with optional duration, delay, easing and loop overrides. Every snippet respects prefers-reduced-motion through the library CSS.",
      inputSchema: z.object({
        framework: z.enum(FRAMEWORKS).default("html"),
        animation: z.string().max(80).optional(),
        duration_ms: z.number().nonnegative().max(60_000).optional(),
        delay_ms: z.number().nonnegative().max(60_000).optional(),
        easing: z.string().max(200).optional().describe("A CSS easing value."),
        loop: z.boolean().optional(),
      }),
      annotations: RO,
    },
    async (a): Promise<ToolResult> => {
      const inst = catalog.install;
      const steps: Record<Framework, string[]> = {
        html: [`Add to <head>: <link rel="stylesheet" href="${inst.cdn}">`, "Add the class to an element, for example class=\"sds-fade-up\"."],
        react: [inst.npm, `import "${inst.css}"; once, in your root layout or entry file.`, "Use the class on an element (className)."],
        angular: [inst.npm, `Add "node_modules/${inst.css}" to angular.json styles.`, "Use the class in a template."],
        tailwind: [inst.npm, `In your CSS: @import "tailwindcss"; @import "${inst.css}";`, "Use the class like any other."],
      };
      const out: Record<string, unknown> = {
        motionForgeVersion: catalog.motionForgeVersion,
        package: catalog.package,
        framework: a.framework,
        steps: steps[a.framework],
        extras: { scroll: `Scroll-category effects use the optional helper: ${inst.scrollEngine}`, cursor: `Cursor effects: ${inst.cursorEngine}` },
        reducedMotion: catalog.reducedMotionNote,
        wrappers: catalog.frameworkPackagesPublished ? "Framework wrapper packages are published." : "The React, Angular and Tailwind wrapper packages are not published yet; use the class-based setup above.",
      };
      if (a.animation) {
        const e = getEntry(a.animation);
        if (!e) return unknownAnimation(a.animation, catalog);
        out.usage = buildUsage(e, a.framework, { durationMs: a.duration_ms, delayMs: a.delay_ms, easing: a.easing, loop: a.loop }, catalog);
      }
      return respond(out);
    },
  );

  server.registerTool(
    "map_motion_to_animation",
    {
      title: "Map a motion spec to Motion Forge animations",
      description:
        "Given a motion spec (duration, easing, animated properties, start/end values, trigger) from a design, finds the closest Motion Forge animations with an explainable score. Deterministic: no AI is used. Never claims an exact match; each result lists what matches, what differs and the overrides to apply. " +
        "For Figma: call Figma's get_motion_context, then pass its output here with format 'figma'.",
      inputSchema: specInput.extend({
        category: z.string().max(40).optional(),
        limit: z.number().int().min(1).max(LIMITS.mapMax).default(LIMITS.mapDefault),
        framework: z.enum(FRAMEWORKS).default("html"),
      }),
      annotations: RO,
    },
    async (a): Promise<ToolResult> => {
      if (a.category && !catalog.categories[a.category]) return fail(`Unknown category "${a.category}".`, { categories: Object.keys(catalog.categories) });
      const { spec, error } = toSpec(a);
      if (!spec) return fail(error ?? "Could not read the spec.");
      const judged = [spec.durationMs, spec.easing, spec.families?.length, spec.trigger, spec.from, spec.to].filter((x) => x !== undefined && x !== 0).length;
      if (!judged) return fail("The spec has no usable fields (duration, easing, properties, from/to, trigger).", { assumptions: spec.assumptions });
      const cands = mapSpec(catalog, spec, { category: a.category, limit: a.limit });
      const results = cands.map((c, i) => ({
        rank: i + 1,
        animation: brief(c.entry),
        score: c.match.score,
        match: c.match.bucket,
        coverage: c.match.coverage,
        why: c.match.dimensions.map((d) => ({ dimension: d.dimension, score: d.score, want: d.want, have: d.have, note: d.note })),
        notJudged: c.match.notJudged,
        caps: c.match.caps,
        adjust: c.adjustNotes,
        usage: i === 0 ? buildUsage(c.entry, a.framework, c.adjust, catalog) : undefined,
      }));
      return respond({
        read: describeSpec(spec),
        assumptions: spec.assumptions,
        note: "Scores rank similarity, they do not prove equivalence. 'close' is 80+, 'partial' 60-79, 'loose' below 60. Check the result in the browser.",
        results,
      }, ["results"]);
    },
  );

  server.registerTool(
    "compare_motion",
    {
      title: "Compare two motions",
      description: "Compares a design's motion spec with another spec or with a named Motion Forge animation, dimension by dimension (properties, shape, easing, duration, trigger, loop). Use it to check how far an implemented animation is from the design.",
      inputSchema: z.object({
        design: specInput,
        other: specInput.optional().describe("Second spec. Omit when using 'animation'."),
        animation: z.string().max(80).optional().describe("A Motion Forge class name to compare the design against."),
      }),
      annotations: RO,
    },
    async (a): Promise<ToolResult> => {
      if (!a.other && !a.animation) return fail("Provide either 'other' or 'animation'.");
      if (a.other && a.animation) return fail("Provide only one of 'other' or 'animation'.");
      const d = toSpec(a.design);
      if (!d.spec) return fail(d.error ?? "Could not read the design spec.");
      let other: MotionSpec;
      let label: string;
      if (a.animation) {
        const e = getEntry(a.animation);
        if (!e) return unknownAnimation(a.animation, catalog);
        other = entryToSpec(e);
        label = e.name;
      } else {
        const o = toSpec(a.other!);
        if (!o.spec) return fail(o.error ?? "Could not read the second spec.");
        other = o.spec;
        label = "other spec";
      }
      const r = scoreSpecs(d.spec, other);
      return respond({
        design: describeSpec(d.spec),
        other: { label, ...describeSpec(other) },
        assumptions: [...d.spec.assumptions, ...other.assumptions],
        similarity: r.score,
        match: r.bucket,
        coverage: r.coverage,
        dimensions: r.dimensions.map((x) => ({ dimension: x.dimension, score: x.score, design: x.want, other: x.have, note: x.note })),
        notJudged: r.notJudged,
        caps: r.caps,
      }, ["dimensions"]);
    },
  );
}

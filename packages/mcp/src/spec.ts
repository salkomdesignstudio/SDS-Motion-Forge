import {
  channelsFromDecls, familyOf, parseEasing, parseTimeMs, toMs, NAMED_EASINGS,
  type Channels, type Easing,
} from "./shared/css-values.js";
import type { CatalogEntry } from "./catalog.js";

/** What every input shape is reduced to before scoring. All fields optional: absent means "not specified". */
export interface Spring { type: "spring"; stiffness: number; damping: number; mass: number }
export type SpecEasing = Easing | Spring;

export interface MotionSpec {
  durationMs?: number;
  delayMs?: number;
  easing?: SpecEasing;
  /** property families: opacity, translate, scale, rotate, skew, blur, clip, color, ... */
  families?: string[];
  from?: Channels;
  to?: Channels;
  trigger?: Trigger;
  loop?: boolean;
  staggerMs?: number;
  /** the effect animates children or characters one after another */
  staggered?: boolean;
  /** what the thing being animated is */
  target?: "text" | "button" | "card" | "input" | "loader" | "any";
  /** things the normalizer had to guess or could not read */
  assumptions: string[];
  /** where each field came from (for explainability) */
  source: string;
}

export type Trigger = "load" | "hover" | "focus" | "click" | "press" | "scroll" | "cursor";

/* ── shared helpers ─────────────────────────────────────────────── */

const TRIGGER_WORDS: Array<[RegExp, Trigger]> = [
  [/(on[_\s-]?hover|hover|mouse[_\s-]?enter|while[_\s-]?hovering|mouse[_\s-]?over)/i, "hover"],
  [/(on[_\s-]?click|click|on[_\s-]?tap|tap)/i, "click"],
  [/(on[_\s-]?press|press|mouse[_\s-]?down|while[_\s-]?pressing)/i, "press"],
  [/(on[_\s-]?focus|focus)/i, "focus"],
  [/(scroll|in[_\s-]?view|viewport|on[_\s-]?enter[_\s-]?view|reveal)/i, "scroll"],
  [/(cursor|pointer[_\s-]?move|mouse[_\s-]?move|follow)/i, "cursor"],
  [/(after[_\s-]?timeout|on[_\s-]?load|on[_\s-]?mount|page[_\s-]?load|auto|load|enter|appear|intro)/i, "load"],
];

export function parseTrigger(v: unknown): Trigger | undefined {
  if (typeof v !== "string") return undefined;
  for (const [re, t] of TRIGGER_WORDS) if (re.test(v)) return t;
  return undefined;
}

const PROP_WORDS: Array<[RegExp, string]> = [
  [/^(opacity|fade|alpha|dissolve|autoalpha)$/i, "opacity"],
  [/^(translate[xyz]?|move|slide|position|offset|x|y|z|top|left|right|bottom|transform-translate)$/i, "translate"],
  [/^(scale[xy]?|zoom|grow|shrink|size-scale)$/i, "scale"],
  [/^(rotat(e|ion)[xyz]?|spin|flip|tilt|turn)$/i, "rotate"],
  [/^(skew[xy]?)$/i, "skew"],
  [/^(blur|filter|backdrop-filter)$/i, "blur"],
  [/^(clip|clip-path|mask|reveal-mask|wipe)$/i, "clip"],
  [/^(color|background-color|fill|stroke|border-color|tint|bg|background)$/i, "color"],
  [/^(box-shadow|shadow|glow|drop-shadow|elevation)$/i, "shadow"],
  [/^(width|height|min-width|max-width|min-height|max-height|margin|padding|gap|layout)$/i, "layout"],
  [/^(letter-spacing|tracking|word-spacing|line-height)$/i, "spacing"],
  [/^(stroke-dash|stroke-dashoffset|draw|path)$/i, "stroke"],
];

export function propFamily(name: string): string | undefined {
  const n = name.trim();
  for (const [re, fam] of PROP_WORDS) if (re.test(n)) return fam;
  return undefined;
}

export function parseAnyEasing(v: unknown, notes: string[]): SpecEasing | undefined {
  if (v == null) return undefined;
  if (Array.isArray(v) && v.length === 4 && v.every((n) => typeof n === "number" && Number.isFinite(n))) {
    return { type: "cubic-bezier", p: v as [number, number, number, number] };
  }
  if (typeof v === "object") {
    const o = v as Record<string, unknown>;
    if (typeof o.stiffness === "number" && typeof o.damping === "number") {
      return { type: "spring", stiffness: o.stiffness, damping: o.damping, mass: typeof o.mass === "number" ? o.mass : 1 };
    }
    const bez = (o.bezier ?? o.cubicBezier ?? o.p ?? o.points) as unknown;
    if (Array.isArray(bez) && bez.length === 4) return parseAnyEasing(bez, notes);
    if (typeof o.x1 === "number" && typeof o.y1 === "number" && typeof o.x2 === "number" && typeof o.y2 === "number") {
      return { type: "cubic-bezier", p: [o.x1, o.y1, o.x2, o.y2] };
    }
    if (typeof o.type === "string") return parseAnyEasing(o.type, notes);
    return undefined;
  }
  if (typeof v !== "string") return undefined;
  const css = parseEasing(v);
  if (css) return css;
  const key = v.trim().toUpperCase().replace(/[\s-]+/g, "_");
  // Figma Plugin API easing names
  const figma: Record<string, SpecEasing | null> = {
    LINEAR: { type: "linear" },
    EASE_IN: { type: "cubic-bezier", p: NAMED_EASINGS["ease-in"] },
    EASE_OUT: { type: "cubic-bezier", p: NAMED_EASINGS["ease-out"] },
    EASE_IN_AND_OUT: { type: "cubic-bezier", p: NAMED_EASINGS["ease-in-out"] },
    EASE_IN_OUT: { type: "cubic-bezier", p: NAMED_EASINGS["ease-in-out"] },
    EASE_IN_BACK: { type: "cubic-bezier", p: [0.6, -0.28, 0.735, 0.045] },
    EASE_OUT_BACK: { type: "cubic-bezier", p: [0.175, 0.885, 0.32, 1.275] },
    EASE_IN_AND_OUT_BACK: { type: "cubic-bezier", p: [0.68, -0.55, 0.265, 1.55] },
    GENTLE: { type: "spring", stiffness: 100, damping: 15, mass: 1 },
    QUICK: { type: "spring", stiffness: 300, damping: 20, mass: 1 },
    BOUNCY: { type: "spring", stiffness: 600, damping: 15, mass: 1 },
    SLOW: { type: "spring", stiffness: 80, damping: 20, mass: 1 },
  };
  if (key in figma) {
    if (/BACK|GENTLE|QUICK|BOUNCY|SLOW/.test(key)) notes.push(`Easing "${v}" was approximated with a standard curve/spring; supply exact numbers for a tighter match.`);
    return figma[key] ?? undefined;
  }
  notes.push(`Could not read easing "${v}"; it was ignored.`);
  return undefined;
}

function num(v: unknown): number | undefined {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string" && v.trim() !== "" && Number.isFinite(Number(v))) return Number(v);
  return undefined;
}

/** CSS-ish value for a single property in from/to: 24, "24px", "-24px", "0.9", "12deg". */
function scalar(v: unknown): number | undefined {
  if (typeof v === "number") return v;
  if (typeof v !== "string") return undefined;
  const m = /^(-?\d*\.?\d+)([a-z%]*)$/i.exec(v.trim());
  if (!m) return undefined;
  const n = parseFloat(m[1]);
  const u = m[2].toLowerCase();
  if (u === "rem" || u === "em") return n * 16;
  if (u === "rad") return (n * 180) / Math.PI;
  if (u === "turn") return n * 360;
  return n;
}

/** Accepts { opacity: 0, translateY: "24px", scale: 0.9 } or a CSS declaration string/object. */
export function readChannels(obj: unknown, notes: string[]): Channels | undefined {
  if (obj == null) return undefined;
  if (typeof obj === "string") {
    const decls: Record<string, string> = {};
    for (const part of obj.split(";")) {
      const i = part.indexOf(":");
      if (i > 0) decls[part.slice(0, i).trim().toLowerCase()] = part.slice(i + 1).trim();
    }
    return channelsFromDecls(decls).ch;
  }
  if (typeof obj !== "object") return undefined;
  const o = obj as Record<string, unknown>;
  const ch: Channels = {};
  const css: Record<string, string> = {};
  for (const [kRaw, v] of Object.entries(o)) {
    const k = kRaw.trim();
    const kl = k.toLowerCase();
    const n = scalar(v);
    if (kl === "opacity" || kl === "alpha") { if (n !== undefined) ch.opacity = n > 1 ? n / 100 : n; }
    else if (kl === "x" || kl === "translatex") { if (n !== undefined) ch.tx = n; }
    else if (kl === "y" || kl === "translatey") { if (n !== undefined) ch.ty = n; }
    else if (kl === "z" || kl === "translatez") { if (n !== undefined) ch.tz = n; }
    else if (kl === "scale") { if (n !== undefined) { ch.sx = n; ch.sy = n; } }
    else if (kl === "scalex") { if (n !== undefined) ch.sx = n; }
    else if (kl === "scaley") { if (n !== undefined) ch.sy = n; }
    else if (kl === "rotate" || kl === "rotation" || kl === "rotatez") { if (n !== undefined) ch.rot = n; }
    else if (kl === "rotatex") { if (n !== undefined) ch.rotx = n; }
    else if (kl === "rotatey") { if (n !== undefined) ch.roty = n; }
    else if (kl === "skewx") { if (n !== undefined) ch.skx = n; }
    else if (kl === "skewy") { if (n !== undefined) ch.sky = n; }
    else if (kl === "blur") { if (n !== undefined) ch.blur = n; }
    else if (typeof v === "string" || typeof v === "number") css[kl] = String(v);
  }
  if (Object.keys(css).length) {
    const more = channelsFromDecls(css);
    Object.assign(ch, more.ch);
  }
  return Object.keys(ch).length ? ch : undefined;
}

export function familiesOfChannels(...parts: Array<Channels | undefined>): string[] {
  const set = new Set<string>();
  for (const p of parts) {
    if (!p) continue;
    for (const [k, v] of Object.entries(p)) {
      if (v === undefined) continue;
      set.add(familyOf(k));
    }
  }
  return [...set];
}

/** Families implied by a from/to pair: only those whose values actually differ. */
export function changedFamilies(from?: Channels, to?: Channels): string[] {
  const keys = new Set([...Object.keys(from ?? {}), ...Object.keys(to ?? {})]);
  const id: Record<string, number> = { opacity: 1, tx: 0, ty: 0, tz: 0, sx: 1, sy: 1, rot: 0, rotx: 0, roty: 0, skx: 0, sky: 0, blur: 0 };
  const out = new Set<string>();
  for (const k of keys) {
    const a = (from as Record<string, number> | undefined)?.[k] ?? id[k];
    const b = (to as Record<string, number> | undefined)?.[k] ?? id[k];
    if (a !== b) out.add(familyOf(k));
  }
  return [...out];
}

/* ── generic normalizer ─────────────────────────────────────────── */

export interface GenericInput {
  duration?: number | string;
  delay?: number | string;
  easing?: unknown;
  properties?: string[];
  from?: unknown;
  to?: unknown;
  trigger?: string;
  loop?: boolean;
  stagger?: number | string;
  target?: string;
}

export function normalizeGeneric(input: GenericInput): MotionSpec {
  const notes: string[] = [];
  const spec: MotionSpec = { assumptions: notes, source: "generic" };
  const d = toMs(input.duration);
  if (d !== null && d !== undefined) spec.durationMs = d;
  else if (input.duration !== undefined) notes.push(`Could not read duration "${String(input.duration)}"; it was ignored.`);
  const dl = toMs(input.delay);
  if (dl !== null && dl !== undefined) spec.delayMs = dl;
  const eas = parseAnyEasing(input.easing, notes);
  if (eas) spec.easing = eas;
  spec.from = readChannels(input.from, notes);
  spec.to = readChannels(input.to, notes);
  const fams = new Set<string>();
  for (const p of input.properties ?? []) {
    const f = propFamily(p);
    if (f) fams.add(f);
    else notes.push(`Property "${p}" is not a motion property the matcher knows; it was ignored.`);
  }
  for (const f of changedFamilies(spec.from, spec.to)) fams.add(f);
  if (!fams.size) for (const f of familiesOfChannels(spec.from, spec.to)) fams.add(f);
  if (fams.size) spec.families = [...fams].sort();
  const trig = parseTrigger(input.trigger);
  if (trig) spec.trigger = trig;
  else if (input.trigger) notes.push(`Trigger "${input.trigger}" was not recognised.`);
  if (typeof input.loop === "boolean") spec.loop = input.loop;
  const st = toMs(input.stagger);
  if (st !== null && st !== undefined) spec.staggerMs = st;
  if (input.target) {
    const t = input.target.toLowerCase();
    if (/text|heading|title|word|char|type/.test(t)) spec.target = "text";
    else if (/button|cta/.test(t)) spec.target = "button";
    else if (/card|tile|panel/.test(t)) spec.target = "card";
    else if (/input|field|form/.test(t)) spec.target = "input";
    else if (/load|spinner|progress/.test(t)) spec.target = "loader";
    else spec.target = "any";
  }
  return spec;
}

/* ── Figma normalizer ───────────────────────────────────────────── */

/**
 * Tolerant reader for the output of Figma's get_motion_context (or a similar dump). The exact shape of that
 * tool's output was not verified against a real file, so this walks any JSON (or text) and picks up values by
 * the names Figma itself uses (duration, easing, trigger, transition type, direction). Everything it had to
 * infer or could not read is reported in `assumptions`.
 */
export function normalizeFigma(input: unknown): MotionSpec {
  const notes: string[] = [];
  const spec: MotionSpec = { assumptions: notes, source: "figma" };
  let data: unknown = input;
  if (typeof input === "string") {
    const t = input.trim();
    try { data = JSON.parse(t); }
    catch {
      data = { __text: t };
      notes.push("Input was plain text, not JSON; values were read with text patterns only.");
    }
  }

  const durations: number[] = [];
  const delays: number[] = [];
  const easings: SpecEasing[] = [];
  const triggers: Trigger[] = [];
  const fams = new Set<string>();
  const froms: Channels[] = [];
  const tos: Channels[] = [];
  const staggers: number[] = [];
  let loop: boolean | undefined;
  let visited = 0;

  const addDuration = (v: unknown, hint: string) => {
    let ms: number | null = null;
    if (typeof v === "string") ms = toMs(v);
    else if (typeof v === "number") {
      // Figma's API reports seconds; many dumps use ms. A value below 20 is read as seconds.
      if (/ms|milli/i.test(hint)) ms = v;
      else if (v > 0 && v < 20) { ms = v * 1000; notes.push(`Duration ${v} was read as seconds (${ms} ms) because it is below 20 and the key did not say ms.`); }
      else ms = v;
    }
    if (ms !== null && ms >= 0) durations.push(ms);
  };

  const walk = (node: unknown, key: string, depth: number) => {
    if (depth > 12 || visited > 5000) return;
    visited++;
    if (node === null || node === undefined) return;
    if (typeof node === "string") {
      const k = key.toLowerCase();
      if (/^(duration|durationms|duration_ms|transitionduration)$/.test(k)) addDuration(node, k);
      else if (/^(delay|delayms|transitiondelay)$/.test(k)) { const d = toMs(node); if (d !== null) delays.push(d); }
      else if (/(easing|ease|curve|timingfunction|timing_function)/.test(k)) { const e = parseAnyEasing(node, notes); if (e) easings.push(e); }
      else if (/(trigger|event|interaction|reaction)/.test(k)) { const t = parseTrigger(node); if (t) triggers.push(t); }
      else if (/^(type|transitiontype|animation|animationtype|name)$/.test(k)) mapTransitionType(node);
      else if (/^(direction)$/.test(k)) mapDirection(node);
      else if (k === "__text") readText(node);
      return;
    }
    if (typeof node === "number") {
      const k = key.toLowerCase();
      if (/^(duration|durationms|duration_ms|transitionduration)$/.test(k)) addDuration(node, k);
      else if (/^(delay|delayms)$/.test(k)) delays.push(/ms/.test(k) ? node : node < 20 ? node * 1000 : node);
      else if (/^(stagger|staggerms|staggerdelay|stagger_delay)$/.test(k)) staggers.push(node < 5 ? node * 1000 : node);
      return;
    }
    if (typeof node === "boolean") {
      if (/^(loop|repeat|infinite)$/i.test(key)) loop = node;
      return;
    }
    if (Array.isArray(node)) {
      const k = key.toLowerCase();
      if (/(easing|ease|bezier|curve)/.test(k) && node.length === 4 && node.every((n) => typeof n === "number")) {
        const e = parseAnyEasing(node, notes);
        if (e) easings.push(e);
        return;
      }
      if (/(properties|animatedproperties|changedproperties|changes|props)/.test(k) && node.every((n) => typeof n === "string")) {
        for (const p of node as string[]) { const f = propFamily(p); if (f) fams.add(f); }
        return;
      }
      for (const item of node) walk(item, key, depth + 1);
      return;
    }
    const o = node as Record<string, unknown>;
    const kl = key.toLowerCase();
    if (/(easing|ease|curve|timingfunction)/.test(kl) && (typeof o.stiffness === "number" || Array.isArray(o.bezier) || typeof o.x1 === "number" || typeof o.type === "string")) {
      const e = parseAnyEasing(o, notes);
      if (e) easings.push(e);
    }
    if (/^(from|start|before|initial)$/.test(kl)) { const c = readChannels(o, notes); if (c) froms.push(c); }
    if (/^(to|end|after|final)$/.test(kl)) { const c = readChannels(o, notes); if (c) tos.push(c); }
    for (const [k, v] of Object.entries(o)) walk(v, k, depth + 1);
  };

  const mapTransitionType = (raw: string) => {
    const t = raw.toUpperCase().replace(/[\s-]+/g, "_");
    if (t === "DISSOLVE") fams.add("opacity");
    else if (/^(MOVE_IN|MOVE_OUT|SLIDE_IN|SLIDE_OUT|PUSH)$/.test(t)) fams.add("translate");
    else if (t === "SCALE_ANIMATE") fams.add("scale");
    else if (t === "SMART_ANIMATE") notes.push("SMART_ANIMATE animates whatever differs between two frames; list the changed properties for a precise match.");
    const tr = parseTrigger(raw);
    if (tr && /^(ON_|AFTER_|MOUSE_|WHILE_)/.test(t)) triggers.push(tr);
  };
  const mapDirection = (raw: string) => {
    if (/^(LEFT|RIGHT|TOP|BOTTOM|UP|DOWN)$/i.test(raw.trim())) fams.add("translate");
  };
  const readText = (text: string) => {
    const dur = /duration[^0-9-]{0,12}(-?\d*\.?\d+)\s*(ms|s)?/i.exec(text);
    if (dur) durations.push(dur[2] === "ms" || (!dur[2] && parseFloat(dur[1]) >= 20) ? parseFloat(dur[1]) : parseFloat(dur[1]) * 1000);
    const bez = /cubic-bezier\(\s*[^)]+\)/i.exec(text);
    if (bez) { const e = parseEasing(bez[0]); if (e) easings.push(e); }
    for (const m of text.matchAll(/\b(ease-in-out|ease-in|ease-out|linear)\b/gi)) { const e = parseEasing(m[1]); if (e) easings.push(e); break; }
    const tr = parseTrigger(text); if (tr) triggers.push(tr);
    for (const m of text.matchAll(/\b(opacity|translate[xyz]?|scale[xy]?|rotate[xyz]?|blur|skew[xy]?)\b/gi)) { const f = propFamily(m[1]); if (f) fams.add(f); }
  };

  walk(data, "", 0);

  const pick = <T,>(arr: T[], label: string): T | undefined => {
    if (!arr.length) return undefined;
    if (arr.length > 1 && JSON.stringify(arr[0]) !== JSON.stringify(arr[arr.length - 1])) {
      notes.push(`Several ${label} values were found (${arr.length}); the first one was used. Map each interaction separately for exact results.`);
    }
    return arr[0];
  };
  const d = pick(durations, "duration"); if (d !== undefined) spec.durationMs = d;
  const dl = pick(delays, "delay"); if (dl !== undefined) spec.delayMs = dl;
  const e = pick(easings, "easing"); if (e) spec.easing = e;
  const t = pick(triggers, "trigger"); if (t) spec.trigger = t;
  const sg = pick(staggers, "stagger"); if (sg !== undefined) spec.staggerMs = sg;
  if (froms.length) spec.from = froms[0];
  if (tos.length) spec.to = tos[0];
  for (const f of changedFamilies(spec.from, spec.to)) fams.add(f);
  if (fams.size) spec.families = [...fams].sort();
  if (loop !== undefined) spec.loop = loop;
  if (spec.durationMs === undefined && spec.easing === undefined && !spec.families && !spec.trigger) {
    notes.push("No duration, easing, trigger or animated property could be read from the input. Pass fields explicitly or use the generic format.");
  }
  return spec;
}

/* ── catalog entry as a spec ────────────────────────────────────── */

const entrySpecs = new WeakMap<CatalogEntry, MotionSpec>();

/** Cached per entry: the catalog is immutable for the life of the process. Callers must not mutate the result. */
export function entryToSpec(e: CatalogEntry): MotionSpec {
  let s = entrySpecs.get(e);
  if (!s) { s = buildEntrySpec(e); entrySpecs.set(e, s); }
  return s;
}

function buildEntrySpec(e: CatalogEntry): MotionSpec {
  const m = e.motion;
  const spec: MotionSpec = { assumptions: [], source: `catalog:${e.name}` };
  if (m.durationMs != null) spec.durationMs = m.durationMs;
  if (m.delayMs != null) spec.delayMs = m.delayMs;
  if (m.easing) spec.easing = m.easing;
  spec.families = m.families;
  spec.from = m.from;
  spec.to = m.to;
  spec.trigger = e.trigger === "load" ? "load" : e.trigger === "scroll" ? "scroll" : e.trigger === "focus" ? "focus" : e.trigger === "cursor" ? "cursor" : "load";
  spec.loop = e.loop;
  spec.staggered = m.via === "children" || m.via === "chars";
  return spec;
}

export { parseTimeMs };

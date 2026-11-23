import type { Channels } from "./shared/css-values.js";
import { familyOf } from "./shared/css-values.js";
import type { MotionSpec, SpecEasing, Spring } from "./spec.js";

/* ── easing sampling ────────────────────────────────────────────── */

function bezierAt(p: [number, number, number, number], x: number): number {
  const [x1, y1, x2, y2] = p;
  const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx;
  const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
  let t = x;
  for (let i = 0; i < 8; i++) {
    const xt = ((ax * t + bx) * t + cx) * t - x;
    const d = (3 * ax * t + 2 * bx) * t + cx;
    if (Math.abs(xt) < 1e-6) break;
    if (Math.abs(d) < 1e-6) break;
    t -= xt / d;
  }
  if (t < 0 || t > 1 || !Number.isFinite(t)) {
    let lo = 0, hi = 1;
    t = x;
    for (let i = 0; i < 24; i++) {
      const xt = ((ax * t + bx) * t + cx) * t;
      if (xt < x) lo = t; else hi = t;
      t = (lo + hi) / 2;
    }
  }
  return ((ay * t + by) * t + cy) * t;
}

/** Time for a damped spring to stay within 1% of rest. */
export function springSettleMs(s: Spring): number {
  const w0 = Math.sqrt(s.stiffness / s.mass);
  const zeta = s.damping / (2 * Math.sqrt(s.stiffness * s.mass));
  if (zeta >= 1) return Math.min(10000, (Math.log(100) / (w0 * (zeta - Math.sqrt(zeta * zeta - 1) + 1e-9))) * 1000);
  return Math.min(10000, (Math.log(100) / (zeta * w0)) * 1000);
}

function springAt(s: Spring, tNorm: number): number {
  const w0 = Math.sqrt(s.stiffness / s.mass);
  const zeta = s.damping / (2 * Math.sqrt(s.stiffness * s.mass));
  const settle = springSettleMs(s) / 1000;
  const t = tNorm * settle;
  if (zeta < 1) {
    const wd = w0 * Math.sqrt(1 - zeta * zeta);
    return 1 - Math.exp(-zeta * w0 * t) * (Math.cos(wd * t) + ((zeta * w0) / wd) * Math.sin(wd * t));
  }
  return 1 - Math.exp(-w0 * t) * (1 + w0 * t);
}

const sampleCache = new Map<string, number[]>();
const SAMPLE_CACHE_MAX = 1024;

/** Samples are pure functions of the easing, and the catalog reuses a handful of curves 600 times. */
export function sampleEasing(e: SpecEasing, n = 24): number[] {
  const key = n + JSON.stringify(e);
  const hit = sampleCache.get(key);
  if (hit) return hit;
  const out = computeSamples(e, n);
  if (sampleCache.size >= SAMPLE_CACHE_MAX) sampleCache.clear(); // bounded: user-supplied curves are unbounded input
  sampleCache.set(key, out);
  return out;
}

function computeSamples(e: SpecEasing, n: number): number[] {
  const out: number[] = [];
  for (let i = 0; i <= n; i++) {
    const x = i / n;
    if (e.type === "linear") out.push(x);
    else if (e.type === "cubic-bezier") out.push(bezierAt(e.p, x));
    else if (e.type === "steps") {
      const k = e.n;
      const v = e.pos === "start" ? Math.ceil(x * k) / k : Math.floor(x * k) / k;
      out.push(Math.min(1, v));
    } else out.push(springAt(e, x));
  }
  return out;
}

/** Mean absolute difference between two progress curves, 0..~1. */
export function easingDistance(a: SpecEasing, b: SpecEasing): number {
  const sa = sampleEasing(a), sb = sampleEasing(b);
  let sum = 0;
  for (let i = 0; i < sa.length; i++) sum += Math.abs(sa[i] - sb[i]);
  return sum / sa.length;
}

export function describeEasing(e: SpecEasing): string {
  if (e.type === "spring") return `spring (stiffness ${e.stiffness}, damping ${e.damping}, mass ${e.mass}; settles in about ${Math.round(springSettleMs(e))} ms)`;
  if (e.type === "cubic-bezier") return `cubic-bezier(${e.p.join(", ")})`;
  if (e.type === "steps") return `steps(${e.n}, ${e.pos})`;
  return "linear";
}

/* ── dimensions ─────────────────────────────────────────────────── */

export type DimensionName = "properties" | "shape" | "easing" | "duration" | "trigger" | "loop" | "stagger";

export const WEIGHTS: Record<DimensionName, number> = {
  properties: 0.34,
  shape: 0.2,
  easing: 0.14,
  duration: 0.12,
  trigger: 0.12,
  loop: 0.05,
  stagger: 0.03,
};

export interface DimensionResult {
  dimension: DimensionName;
  /** 0..1 */
  score: number;
  weight: number;
  /** what the design asked for vs what the animation does */
  want: string;
  have: string;
  note: string;
}

export type Bucket = "close" | "partial" | "loose";

export interface MatchResult {
  /** 0..100, never 100 by construction */
  score: number;
  bucket: Bucket;
  /** how much of the weight the comparison could actually use, 0..1 */
  coverage: number;
  dimensions: DimensionResult[];
  /** dimensions the spec did not give, so they could not be judged */
  notJudged: DimensionName[];
  caps: string[];
}

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));
const round = (n: number, d = 3) => Math.round(n * 10 ** d) / 10 ** d;

function jaccardWeighted(want: string[], have: string[]): { score: number; missing: string[]; extra: string[] } {
  const w = new Set(want), h = new Set(have);
  const missing = [...w].filter((x) => !h.has(x));
  const extra = [...h].filter((x) => !w.has(x));
  const hit = [...w].filter((x) => h.has(x)).length;
  // anything the design asks for that is missing costs fully; extras the animation adds cost half
  const denom = w.size + extra.length * 0.5;
  return { score: denom === 0 ? 0 : hit / denom, missing, extra };
}

const CH_KEYS: Array<keyof Channels> = ["opacity", "tx", "ty", "tz", "sx", "sy", "rot", "rotx", "roty", "skx", "sky", "blur"];
const IDENT: Record<string, number> = { opacity: 1, tx: 0, ty: 0, tz: 0, sx: 1, sy: 1, rot: 0, rotx: 0, roty: 0, skx: 0, sky: 0, blur: 0 };

function shapeScore(want: MotionSpec, have: MotionSpec): { score: number; wantTxt: string; haveTxt: string; note: string } | null {
  if (!want.from && !want.to) return null;
  const wf = want.from ?? {}, wt = want.to ?? {};
  const hf = have.from ?? {}, ht = have.to ?? {};
  const parts: number[] = [];
  const notes: string[] = [];
  const wantBits: string[] = [];
  const haveBits: string[] = [];
  for (const k of CH_KEYS) {
    const wA = (wf as Record<string, number>)[k] ?? IDENT[k];
    const wB = (wt as Record<string, number>)[k] ?? IDENT[k];
    const dw = wB - wA;
    if (Math.abs(dw) < 1e-9) continue;
    const hA = (hf as Record<string, number>)[k] ?? IDENT[k];
    const hB = (ht as Record<string, number>)[k] ?? IDENT[k];
    const dh = hB - hA;
    wantBits.push(`${k} ${wA}→${wB}`);
    haveBits.push(`${k} ${hA}→${hB}`);
    if (Math.abs(dh) < 1e-9) { parts.push(0); notes.push(`${k} does not change in the animation`); continue; }
    if (Math.sign(dw) !== Math.sign(dh)) { parts.push(0.1); notes.push(`${k} moves the opposite way`); continue; }
    const ratio = Math.abs(dh) / Math.abs(dw);
    const s = clamp01(1 - Math.abs(Math.log(ratio)) / Math.log(4));
    parts.push(s);
    if (ratio > 1.6 || ratio < 0.6) notes.push(`${k} travels ${ratio > 1 ? "further" : "less"} than the design (${round(ratio, 2)}x)`);
  }
  if (!parts.length) return null;
  const score = parts.reduce((a, b) => a + b, 0) / parts.length;
  return { score, wantTxt: wantBits.join(", "), haveTxt: haveBits.join(", ") || "no matching channel", note: notes.join("; ") || "start and end values line up" };
}

export interface ScoreOptions {
  /** the right-hand side applies a trigger by toggling a class, so hover/click are possible with a small script */
  classToggleTrigger?: boolean;
}

export function scoreSpecs(want: MotionSpec, have: MotionSpec, opts: ScoreOptions = {}): MatchResult {
  const dims: DimensionResult[] = [];
  const notJudged: DimensionName[] = [];
  const add = (d: Omit<DimensionResult, "weight">) => dims.push({ ...d, weight: WEIGHTS[d.dimension] });

  // properties
  if (want.families && want.families.length) {
    const j = jaccardWeighted(want.families, have.families ?? []);
    add({
      dimension: "properties",
      score: j.score,
      want: want.families.join(", "),
      have: (have.families ?? []).join(", ") || "none",
      note: [j.missing.length ? `missing: ${j.missing.join(", ")}` : "", j.extra.length ? `also animates: ${j.extra.join(", ")}` : ""].filter(Boolean).join("; ") || "same properties",
    });
  } else notJudged.push("properties");

  // shape
  const sh = shapeScore(want, have);
  if (sh) add({ dimension: "shape", score: sh.score, want: sh.wantTxt, have: sh.haveTxt, note: sh.note });
  else notJudged.push("shape");

  // easing
  if (want.easing && have.easing) {
    const dist = easingDistance(want.easing, have.easing);
    const s = clamp01(1 - dist / 0.2);
    add({
      dimension: "easing",
      score: s,
      want: describeEasing(want.easing),
      have: describeEasing(have.easing),
      note: dist < 0.03 ? "curves are nearly identical" : dist < 0.1 ? "similar feel, different curve" : "noticeably different curve",
    });
  } else notJudged.push("easing");

  // duration (spring durations come from settle time)
  const wd = want.durationMs ?? (want.easing?.type === "spring" ? springSettleMs(want.easing) : undefined);
  if (wd !== undefined && have.durationMs !== undefined && wd > 0 && have.durationMs > 0) {
    const ratio = have.durationMs / wd;
    const s = clamp01(1 - Math.abs(Math.log(ratio)) / Math.log(3));
    add({
      dimension: "duration",
      score: s,
      want: `${Math.round(wd)} ms`,
      have: `${Math.round(have.durationMs)} ms`,
      note: Math.abs(ratio - 1) < 0.1 ? "within 10%" : `${ratio > 1 ? "slower" : "faster"} by ${round(Math.abs(ratio - 1) * 100, 0)}%; duration can be overridden`,
    });
  } else notJudged.push("duration");

  // trigger
  if (want.trigger && have.trigger) {
    let s = 0;
    let note = "";
    if (want.trigger === have.trigger) { s = 1; note = "same trigger"; }
    else if ((want.trigger === "hover" || want.trigger === "click" || want.trigger === "press") && have.trigger === "load") {
      s = opts.classToggleTrigger === false ? 0.2 : 0.5;
      note = `Motion Forge effects play when the class is applied; ${want.trigger} needs the class toggled on that event`;
    } else if (want.trigger === "load" && have.trigger === "scroll") { s = 0.5; note = "scroll effect: also plays on load if the element is already in view"; }
    else if (want.trigger === "scroll" && have.trigger === "load") { s = 0.3; note = "plays on load, not on scroll; use a scroll-category effect to reveal on scroll"; }
    else if (want.trigger === "hover" && have.trigger === "cursor") { s = 0.6; note = "cursor effect reacts to pointer movement"; }
    else if (want.trigger === "focus" && have.trigger === "focus") { s = 1; note = "same trigger"; }
    else { s = 0.15; note = "different trigger"; }
    add({ dimension: "trigger", score: s, want: want.trigger, have: have.trigger, note });
  } else notJudged.push("trigger");

  // loop
  if (want.loop !== undefined && have.loop !== undefined) {
    add({ dimension: "loop", score: want.loop === have.loop ? 1 : 0, want: want.loop ? "loops" : "plays once", have: have.loop ? "loops" : "plays once", note: want.loop === have.loop ? "same" : "differs; sds-loop and sds-once modifiers can flip it" });
  } else notJudged.push("loop");

  // stagger
  if (want.staggerMs !== undefined && want.staggerMs > 0) {
    const staggered = have.staggered === true;
    add({ dimension: "stagger", score: staggered ? 1 : 0.2, want: `${want.staggerMs} ms between items`, have: staggered ? "staggers children or characters" : "single element", note: staggered ? "stagger step is set by the effect or sds-delay-N" : "wrap items so the effect applies per child" });
  } else notJudged.push("stagger");

  const used = dims.reduce((a, d) => a + d.weight, 0);
  let raw = used > 0 ? dims.reduce((a, d) => a + d.score * d.weight, 0) / used : 0;
  const caps: string[] = [];

  // an effect cannot be called a good match when the thing that moves is not judged or does not match
  const props = dims.find((d) => d.dimension === "properties");
  if (!props && !dims.find((d) => d.dimension === "shape")) {
    if (raw > 0.55) { raw = 0.55; caps.push("capped at 55: no animated properties were given, so timing alone cannot show the motion matches"); }
  }
  if (props && props.score < 0.34 && raw > 0.5) { raw = 0.5; caps.push("capped at 50: the animated properties barely overlap"); }
  if (used >= 0.3 && used < 0.6 && raw > 0.75) { raw = 0.75; caps.push("capped at 75: fewer than 60% of the comparison dimensions could be judged, so it cannot count as close"); }
  if (used < 0.3 && raw > 0.45) { raw = 0.45; caps.push("capped at 45: too little of the spec was provided to judge"); }

  const score = Math.min(99, Math.round(raw * 100));
  const bucket: Bucket = score >= 80 ? "close" : score >= 60 ? "partial" : "loose";
  return { score, bucket, coverage: round(used, 2), dimensions: dims.map((d) => ({ ...d, score: round(d.score, 2) })), notJudged, caps };
}

export { familyOf };

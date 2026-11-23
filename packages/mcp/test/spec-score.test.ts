import { describe, expect, it } from "vitest";
import { easingDistance, sampleEasing, scoreSpecs, springSettleMs } from "../src/score.js";
import { normalizeFigma, normalizeGeneric, type MotionSpec, type SpecEasing } from "../src/spec.js";

const EXPO: SpecEasing = { type: "cubic-bezier", p: [0.22, 1, 0.36, 1] };
const LINEAR: SpecEasing = { type: "linear" };

const spec = (o: Partial<MotionSpec>): MotionSpec => ({ assumptions: [], source: "test", ...o });

describe("normalizeGeneric", () => {
  it("reads CSS-style input", () => {
    const s = normalizeGeneric({ duration: "0.4s", easing: "ease-out", from: { opacity: 0, translateY: "24px" }, to: { opacity: 1, translateY: 0 }, trigger: "ON_HOVER", target: "Button" });
    expect(s.durationMs).toBe(400);
    expect(s.families).toEqual(["opacity", "translate"]);
    expect(s.trigger).toBe("hover");
    expect(s.target).toBe("button");
  });
  it("records what it could not read instead of guessing", () => {
    const s = normalizeGeneric({ duration: "soon", properties: ["wobbliness"], trigger: "sometime" });
    expect(s.durationMs).toBeUndefined();
    expect(s.assumptions.length).toBe(3);
  });
  it("accepts springs and bezier arrays", () => {
    expect(normalizeGeneric({ easing: [0.2, 0, 0, 1] }).easing).toEqual({ type: "cubic-bezier", p: [0.2, 0, 0, 1] });
    expect(normalizeGeneric({ easing: { stiffness: 200, damping: 20 } }).easing).toMatchObject({ type: "spring", mass: 1 });
  });
});

describe("normalizeFigma", () => {
  it("reads Figma enum names and seconds", () => {
    const s = normalizeFigma({
      reactions: [{ trigger: { type: "ON_HOVER" }, action: { transition: { type: "DISSOLVE", duration: 0.3, easing: { type: "EASE_OUT" } } } }],
    });
    expect(s.trigger).toBe("hover");
    expect(s.durationMs).toBe(300);
    expect(s.families).toEqual(["opacity"]);
    expect(s.easing).toMatchObject({ type: "cubic-bezier" });
    expect(s.assumptions.join(" ")).toMatch(/seconds/);
  });
  it("flags SMART_ANIMATE as under-specified", () => {
    const s = normalizeFigma({ transition: { type: "SMART_ANIMATE", duration: 500 } });
    expect(s.durationMs).toBe(500);
    expect(s.assumptions.join(" ")).toMatch(/SMART_ANIMATE/);
  });
  it("survives junk, text and cycles", () => {
    const cyc: Record<string, unknown> = { duration: 200 };
    cyc.self = cyc;
    expect(() => normalizeFigma(cyc)).not.toThrow();
    expect(normalizeFigma("duration: 400ms ease-in-out on hover opacity").durationMs).toBe(400);
    expect(normalizeFigma(null).assumptions.length).toBeGreaterThan(0);
    expect(normalizeFigma(12345).families).toBeUndefined();
  });
});

describe("easing maths", () => {
  it("samples endpoints", () => {
    for (const e of [EXPO, LINEAR]) {
      const s = sampleEasing(e);
      expect(s[0]).toBeCloseTo(0, 3);
      expect(s[s.length - 1]).toBeCloseTo(1, 2);
    }
  });
  it("is zero for identical curves and grows with difference", () => {
    expect(easingDistance(EXPO, EXPO)).toBe(0);
    expect(easingDistance(EXPO, LINEAR)).toBeGreaterThan(0.1);
  });
  it("settles springs", () => {
    expect(springSettleMs({ type: "spring", stiffness: 200, damping: 20, mass: 1 })).toBeGreaterThan(200);
  });
});

describe("scoreSpecs", () => {
  const A = spec({ families: ["opacity", "translate"], durationMs: 400, easing: EXPO, trigger: "load", loop: false });
  it("never reports a perfect 100", () => {
    const r = scoreSpecs(A, A);
    expect(r.score).toBeLessThan(100);
    expect(r.score).toBeGreaterThanOrEqual(90);
    expect(r.bucket).toBe("close");
  });
  it("caps timing-only comparisons", () => {
    const r = scoreSpecs(spec({ durationMs: 400, easing: A.easing, trigger: "load" }), A);
    expect(r.score).toBeLessThanOrEqual(55);
    expect(r.caps.length).toBeGreaterThan(0);
  });
  it("renormalises over what was provided and lists the rest as not judged", () => {
    const r = scoreSpecs(spec({ families: ["opacity"] }), spec({ families: ["opacity"] }));
    expect(r.notJudged).toContain("duration");
    expect(r.coverage).toBeCloseTo(0.34, 2);
    expect(r.bucket).not.toBe("close");
  });
  it("penalises opposite direction", () => {
    const up = spec({ from: { ty: 24 }, to: { ty: 0 }, families: ["translate"] });
    const down = spec({ from: { ty: -24 }, to: { ty: 0 }, families: ["translate"] });
    expect(scoreSpecs(up, down).dimensions.find((d) => d.dimension === "shape")!.score).toBeLessThan(0.2);
  });
  it("is deterministic", () => {
    const b = { ...A, durationMs: 900 };
    expect(scoreSpecs(A, b)).toEqual(scoreSpecs(A, b));
  });
});

import { describe, expect, it } from "vitest";
import { channelsFromDecls, parseEasing, parseTimeMs, resolveVars, splitSpaces, splitTop } from "../src/shared/css-values.js";

describe("css-values", () => {
  it("parses times", () => {
    expect(parseTimeMs("0.8s")).toBe(800);
    expect(parseTimeMs("350ms")).toBe(350);
    expect(parseTimeMs("-0.2s")).toBe(-200);
    expect(parseTimeMs("fast")).toBeNull();
  });
  it("parses easings", () => {
    expect(parseEasing("ease-out")).toEqual({ type: "cubic-bezier", p: [0, 0, 0.58, 1] });
    expect(parseEasing("cubic-bezier(0.22, 1, 0.36, 1)")).toEqual({ type: "cubic-bezier", p: [0.22, 1, 0.36, 1] });
    expect(parseEasing("steps(4, end)")).toEqual({ type: "steps", n: 4, pos: "end" });
    expect(parseEasing("linear")).toEqual({ type: "linear" });
    expect(parseEasing("cubic-bezier(1,2)")).toBeNull();
    expect(parseEasing("nonsense")).toBeNull();
  });
  it("splits outside parentheses only", () => {
    expect(splitTop("a, cubic-bezier(1,2,3,4), b", ",")).toEqual(["a", "cubic-bezier(1,2,3,4)", "b"]);
    expect(splitSpaces("x 0.8s cubic-bezier(1, 2, 3, 4) both")).toEqual(["x", "0.8s", "cubic-bezier(1, 2, 3, 4)", "both"]);
  });
  it("resolves var() with fallbacks and nesting", () => {
    expect(resolveVars("var(--a, 1s)", {})).toBe("1s");
    expect(resolveVars("var(--a)", { "--a": "var(--b, 2s)" })).toBe("2s");
    expect(resolveVars("var(--missing)", {})).toBe("var(--missing)");
  });
  it("turns keyframe declarations into channels", () => {
    const { ch, other } = channelsFromDecls({ opacity: "0", transform: "translateY(24px) scale(0.9) rotate(5deg)", filter: "blur(8px)", color: "red" });
    expect(ch).toMatchObject({ opacity: 0, ty: 24, sx: 0.9, sy: 0.9, rot: 5, blur: 8 });
    expect(other).toContain("color");
  });
  it("reads individual transform properties", () => {
    const { ch } = channelsFromDecls({ translate: "10px 20px", scale: "1.5", rotate: "0.5turn" });
    expect(ch).toMatchObject({ tx: 10, ty: 20, sx: 1.5, rot: 180 });
  });
});

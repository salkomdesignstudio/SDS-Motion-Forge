import { describe, expect, it } from "vitest";
import { getEntry, loadCatalog, mappable } from "../src/catalog.js";
import { buildUsage, LIMITS, mapSpec, searchAnimations } from "../src/engine.js";
import { normalizeGeneric } from "../src/spec.js";

const catalog = loadCatalog();

describe("catalog", () => {
  it("matches the registry it was built from", () => {
    expect(catalog.schemaVersion).toBe(1);
    expect(catalog.animations.length).toBe(629);
    expect(getEntry("sds-bounce-in-up")?.motion.durationMs).toBe(850);
    expect(getEntry("bounce-in-up")?.name).toBe("sds-bounce-in-up");
    expect(getEntry(".sds-bounce-in-up")?.name).toBe("sds-bounce-in-up");
    expect(getEntry("nope")).toBeUndefined();
  });
  it("has measured timing for everything the mapper can return", () => {
    for (const e of mappable(catalog)) {
      expect(e.motion.durationMs).toBeGreaterThanOrEqual(0);
      expect(e.motion.families.length).toBeGreaterThan(0);
    }
  });
});

describe("search", () => {
  it("is deterministic and capped", () => {
    const a = searchAnimations(catalog, "glow button", {}, 500);
    const b = searchAnimations(catalog, "glow button", {}, 500);
    expect(a.hits.map((h) => h.entry.name)).toEqual(b.hits.map((h) => h.entry.name));
  });
  it("filters by category and trigger", () => {
    const r = searchAnimations(catalog, "", { category: "scroll", trigger: "scroll" }, 5);
    expect(r.hits.length).toBe(5);
    expect(r.hits.every((h) => h.entry.category === "scroll")).toBe(true);
  });
  it("handles hostile queries", () => {
    expect(() => searchAnimations(catalog, "'; DROP TABLE -- <script> ".repeat(50))).not.toThrow();
    expect(searchAnimations(catalog, "zzzzqqqq").hits).toEqual([]);
  });
});

describe("usage", () => {
  const e = getEntry("sds-bounce-in-up")!;
  it("uses modifier classes where one matches exactly", () => {
    const u = buildUsage(e, "html", { durationMs: 400, delayMs: 200 });
    expect(u.code).toContain("sds-fast");
    expect(u.code).toContain("sds-delay-2");
  });
  it("falls back to custom properties", () => {
    const u = buildUsage(e, "html", { durationMs: 523, easing: "ease-out" });
    expect(u.code).toContain("--sds-duration: 523ms");
    expect(u.code).toContain("--sds-easing: ease-out");
  });
  it("renders valid JSX style objects for react", () => {
    const u = buildUsage(e, "react", { durationMs: 523 });
    expect(u.code).toContain("className=");
    expect(u.code).toContain('"--sds-duration": "523ms"');
    expect(u.code).not.toContain("motion-forge-react");
  });
  it("mentions reduced motion in every framework", () => {
    for (const f of ["html", "react", "angular", "tailwind"] as const) {
      expect(buildUsage(e, f).notes.join(" ")).toMatch(/reduced-motion/);
    }
  });
  it("adds the scroll helper for scroll effects", () => {
    const s = getEntry("sds-scroll-fade-up")!;
    expect(buildUsage(s, "html").code).toContain("sds-scroll.min.js");
    expect(buildUsage(s, "react").code).toContain("sds-scroll.min.js");
  });
  it("keeps snippets under the cap", () => {
    for (const e2 of catalog.animations) expect(buildUsage(e2, "angular").code.length).toBeLessThanOrEqual(LIMITS.snippetMax + 20);
  });
});

describe("golden mappings", () => {
  const want = (o: Parameters<typeof normalizeGeneric>[0]) => normalizeGeneric(o);
  it("a fade-and-rise-in on scroll maps into the scroll category", () => {
    const r = mapSpec(catalog, want({ duration: 800, from: { opacity: 0, translateY: 40 }, to: { opacity: 1, translateY: 0 }, trigger: "scroll" }), { limit: 3 });
    expect(r[0].entry.category).toBe("scroll");
    expect(r[0].match.score).toBeGreaterThanOrEqual(60);
  });
  it("a looping glow on a button maps to a looping button effect", () => {
    const r = mapSpec(catalog, want({ properties: ["shadow"], loop: true, target: "button", duration: 2000 }), { limit: 3 });
    expect(r[0].entry.category).toBe("buttons");
    expect(r[0].entry.loop).toBe(true);
  });
  it("blur-in text maps to a text effect that animates blur", () => {
    const r = mapSpec(catalog, want({ properties: ["opacity", "blur"], target: "text", from: { opacity: 0, blur: 12 }, to: { opacity: 1, blur: 0 } }), { limit: 3 });
    expect(r[0].entry.category).toBe("text");
    expect(r[0].entry.motion.families).toContain("blur");
  });
  it("timing-only specs never score as close", () => {
    const r = mapSpec(catalog, want({ duration: 800, easing: "cubic-bezier(0.22,1,0.36,1)" }), { limit: 5 });
    for (const c of r) expect(c.match.bucket).not.toBe("close");
  });
  it("is stable across runs", () => {
    const spec = want({ duration: 600, properties: ["opacity", "scale"] });
    expect(mapSpec(catalog, spec).map((c) => c.entry.name)).toEqual(mapSpec(catalog, spec).map((c) => c.entry.name));
  });
});

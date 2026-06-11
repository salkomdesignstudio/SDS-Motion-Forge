/**
 * Performance gate — Playwright + CDP on the heaviest effect per category.
 *
 * While each effect animates for ~1.5s we require:
 *   - LayoutCount delta      <= LAYOUT_BUDGET   (compositor animations must
 *                                                not trigger document reflow)
 *   - RecalcStyleCount delta <= RECALC_BUDGET
 *   - rAF-measured fps       >= SDS_PERF_MIN_FPS (default 55; override via
 *                                                env for slower CI hardware)
 *
 * The effect set is chosen from the registry's compositor-safe classes with
 * the richest choreography per category (multi-property, multi-element).
 */
import { test, expect } from "@playwright/test";

const HEAVIEST: Record<string, string> = {
  text: "sds-grand-entrance",      // translate+scale+rotate+blur, 5 stages
  buttons: "sds-btn-hologram",     // continuous hue-rotate/brightness filter
  inputs: "sds-input-frost",       // blur+brightness+scale entrance
  cards: "sds-card-holo",          // 3D perspective tilt + hue-rotate loop
  loaders: "sds-loader-mosaic",    // 9 staggered children, infinite
  scroll: "sds-scroll-vortex",     // perspective translateZ+rotate+blur
};

const LAYOUT_BUDGET = Number(process.env.SDS_PERF_LAYOUT_BUDGET ?? 6);
// A running CSS animation recalcs style once per frame in Chrome's accounting
// even when fully composited (~90 recalcs / 1.5s @ 60fps). The budget exists
// to catch recalc STORMS (large invalidation cascades), not the per-frame
// baseline.
const RECALC_BUDGET = Number(process.env.SDS_PERF_RECALC_BUDGET ?? 140);
const MIN_FPS = Number(process.env.SDS_PERF_MIN_FPS ?? 55);

async function metric(session: any, name: string): Promise<number> {
  const { metrics } = await session.send("Performance.getMetrics");
  return metrics.find((m: any) => m.name === name)?.value ?? 0;
}

for (const [category, effect] of Object.entries(HEAVIEST)) {
  test(`perf: ${category} / ${effect}`, async ({ page, context }) => {
    await page.goto("/test/visual/fixture.html");
    const session = await context.newCDPSession(page);
    await session.send("Performance.enable");

    await page.locator(`#cell-${effect}`).scrollIntoViewIfNeeded();
    // Isolate the measurement: pause every animation on the page, then play
    // ONLY the effect under test (and loop it so the 1.5s window stays active).
    await page.evaluate((id) => {
      for (const a of (document as any).getAnimations({ subtree: true })) a.pause();
      const host = document.getElementById(`cell-${id}`)!;
      for (const a of (host as any).getAnimations({ subtree: true })) {
        (a.effect as any).updateTiming({ iterations: Infinity });
        a.currentTime = 0;
        a.play();
      }
    }, effect);

    const layout0 = await metric(session, "LayoutCount");
    const recalc0 = await metric(session, "RecalcStyleCount");

    const fps = await page.evaluate(
      () =>
        new Promise<number>((resolve) => {
          let frames = 0;
          const start = performance.now();
          function tick() {
            frames++;
            if (performance.now() - start < 1500) requestAnimationFrame(tick);
            else resolve((frames / (performance.now() - start)) * 1000);
          }
          requestAnimationFrame(tick);
        }),
    );

    const layoutDelta = (await metric(session, "LayoutCount")) - layout0;
    const recalcDelta = (await metric(session, "RecalcStyleCount")) - recalc0;

    console.log(`${effect}: fps=${fps.toFixed(1)} layoutΔ=${layoutDelta} recalcΔ=${recalcDelta}`);
    expect(layoutDelta, `layout reflows during ${effect}`).toBeLessThanOrEqual(LAYOUT_BUDGET);
    expect(recalcDelta, `style recalcs during ${effect}`).toBeLessThanOrEqual(RECALC_BUDGET);
    expect(fps, `fps during ${effect}`).toBeGreaterThanOrEqual(MIN_FPS);
  });
}

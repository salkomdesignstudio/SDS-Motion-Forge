/**
 * Visual regression — every registry effect, three deterministic frames.
 *
 * THE DETERMINISM TECHNIQUE (solves animation timing nondeterminism):
 * CSS animations are wall-clock driven, so naive screenshots race the clock.
 * Instead we use the Web Animations API view of every CSS animation
 * (document.getAnimations({ subtree: true }) — includes pseudo-element
 * animations): each animation is .pause()d the moment the page loads, and
 * for every probe frame we set anim.currentTime to
 *     delay + fraction × iterationDuration
 * Setting currentTime renders the EXACT keyframe state for that time — the
 * same pixels on every run, regardless of machine speed, load order or CI
 * jitter. Frame fractions 0.13 / 0.47 / 0.86 deliberately avoid 0%, 50% and
 * 100% so steps()/step-end boundaries can't flip between adjacent frames.
 *
 * Baselines live in test/visual/__screenshots__/{platform}/ and are
 * committed; any unintended pixel change fails CI.
 */
import { test, expect } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";

const registry = JSON.parse(
  fs.readFileSync(path.join(__dirname, "..", "..", "registry", "motion.registry.json"), "utf8"),
);
const effects: { name: string }[] = registry.classes.filter((c: any) => c.kind === "effect");

const FRACTIONS = [0.13, 0.47, 0.86];

test.describe("visual: every registry effect at three deterministic frames", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/test/visual/fixture.html");
    // Freeze the world: pause every CSS animation (incl. pseudo-elements).
    await page.evaluate(() => {
      for (const a of document.getAnimations({ subtree: true } as any)) a.pause();
    });
    await page.evaluate(() => document.fonts.ready);
  });

  for (const effect of effects) {
    test(effect.name, async ({ page }) => {
      const cell = page.locator(`#cell-${effect.name}`);
      await cell.scrollIntoViewIfNeeded();

      for (let i = 0; i < FRACTIONS.length; i++) {
        const fraction = FRACTIONS[i];
        await page.evaluate(
          ({ id, fraction }) => {
            const host = document.getElementById(`cell-${id}`)!;
            for (const a of (host as any).getAnimations({ subtree: true })) {
              a.pause();
              const t = a.effect!.getComputedTiming();
              const dur = typeof t.duration === "number" ? t.duration : 0;
              a.currentTime = (t.delay ?? 0) + fraction * dur;
            }
          },
          { id: effect.name, fraction },
        );
        await expect(cell).toHaveScreenshot(`${effect.name}-f${i}.png`, { animations: "allow" });
      }
    });
  }
});

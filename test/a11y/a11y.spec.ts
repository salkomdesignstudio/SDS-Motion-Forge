/**
 * Accessibility gate — axe-core (WCAG 2.0/2.1 A+AA) on the docs site and the
 * loaders example app. Violations fail CI.
 */
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

async function runAxe(page: any) {
  return new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
}

function format(violations: any[]) {
  return violations
    .map((v) => `${v.id} (${v.impact}): ${v.help} — ${v.nodes.length} node(s)\n${v.nodes.map((n: any) => `  - ${n.target}`).join("\n")}`)
    .join("\n");
}

test("a11y: docs site (docs/index.html)", async ({ page }) => {
  await page.goto("/docs/index.html", { waitUntil: "domcontentloaded" });
  // Live animation previews are excluded from the scan: axe samples them
  // mid-animation (semi-transparent entrance frames) and their colors ARE the
  // demonstrated effect (e.g. neon glow). Their text duplicates the adjacent
  // accessible card labels. Everything else on the page must pass WCAG AA.
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .exclude(".card-demo")
    .analyze();
  expect(results.violations, format(results.violations)).toEqual([]);
});

test("a11y: loaders example app", async ({ page }) => {
  await page.goto("/examples/vite-loaders/dist/index.html", { waitUntil: "domcontentloaded" });
  const results = await runAxe(page);
  expect(results.violations, format(results.violations)).toEqual([]);
});

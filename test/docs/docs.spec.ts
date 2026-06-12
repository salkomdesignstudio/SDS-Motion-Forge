/**
 * Docs platform smoke — the registry-driven gallery and the six-tab modal.
 * Guards the Phase 4 "preview = npm = snippet" wiring.
 */
import { test, expect } from "@playwright/test";

test.describe("docs site", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/docs/index.html", { waitUntil: "domcontentloaded" });
  });

  test("gallery renders registry-driven cards with replay buttons", async ({ page }) => {
    const cards = page.locator("#galGrid .card");
    await expect(cards.first()).toBeVisible();
    const count = await cards.count();
    expect(count).toBeGreaterThan(50); // text category alone has 100+
    await expect(cards.first().locator(".card-replay")).toHaveCount(1);
    // preview markup comes from the registry template
    const markupOk = await page.evaluate(() => {
      const w = window as any;
      const first = document.querySelector("#galGrid .card") as HTMLElement;
      const cls = first.dataset.cls!;
      return first.querySelector(".card-stage")!.innerHTML.includes(w.SDS_DOCS.markup[cls].split("\n")[0].slice(0, 30));
    });
    expect(markupOk).toBe(true);
  });

  test("category tabs show registry counts and switch grids", async ({ page }) => {
    const loadersTab = page.locator('#tabs .tab[data-cat="loaders"]');
    await expect(loadersTab).toContainText("51");
    await loadersTab.click();
    await expect(page.locator("#galGrid .card[data-cls^='sds-loader-']").first()).toBeVisible();
  });

  test("modal shows six generated tabs, how-it-works, and the exact snippet", async ({ page }) => {
    await page.locator("#galGrid .card").first().click();
    await expect(page.locator("#modal")).toHaveClass(/open/);
    const tabs = page.locator("#modalTabs .mtab");
    await expect(tabs).toHaveCount(6);
    await expect(page.locator("#modalHow")).not.toBeEmpty();

    const tabNames = ["html", "js", "react", "angular", "tailwind", "bootstrap"];
    for (const t of tabNames) {
      await page.locator(`#modalTabs .mtab[data-tab="${t}"]`).click();
      const shown = await page.locator("#modalCode").textContent();
      const expected = await page.evaluate((tab) => {
        const w = window as any;
        const cls = (document.querySelector("#galGrid .card") as HTMLElement).dataset.cls!;
        return w.SDS_DOCS.snippets[cls][tab];
      }, t);
      expect(shown, `tab ${t} must show the exact generated snippet`).toBe(expected);
      expect((shown || "").length).toBeGreaterThan(40);
    }
  });

  test("search filters the grid", async ({ page }) => {
    await page.fill("#search", "velvet");
    await expect(page.locator("#galGrid .card")).toHaveCount(1);
    await expect(page.locator("#galGrid .card").first()).toHaveAttribute("data-cls", "sds-velvet-drop");
  });

  test("reduced-motion preview toggle simulates the fallback", async ({ page }) => {
    const toggle = page.locator("#rmToggle");
    await expect(toggle).toHaveCount(1);
    await toggle.check();
    await expect(page.locator("body")).toHaveClass(/rm-sim/);
    const duration = await page.evaluate(() => {
      const el = document.querySelector("#galGrid [class*='sds-']")!;
      return getComputedStyle(el).animationDuration;
    });
    expect(["0.01ms", "1e-05s"]).toContain(duration);
  });

  test("no inline animation CSS or inline engine remain (single artifact)", async ({ page }) => {
    const src = await page.content();
    expect(src).not.toContain("inline demo copy of dist/motion-interactive");
    // the page must reference the built engines (the local src may have been
    // rewritten to the CDN by the onerror fallback when docs/dist is absent)
    expect(src).toMatch(/src="[^"]*dist\/sds-scroll\.min\.js"/);
    expect(src).toMatch(/src="[^"]*dist\/motion-interactive\.min\.js"/);
  });
});

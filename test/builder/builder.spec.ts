/**
 * Bundle builder acceptance (Phase 4):
 * driving the REAL builder page, selecting 5 effects must produce a working
 * standalone stylesheet under 8 KB minified that passes an HTML smoke test.
 */
import { test, expect } from "@playwright/test";

const FIVE = [
  "sds-velvet-drop",   // text entrance
  "sds-btn-magnetic",  // button glow
  "sds-card-rise",     // card entrance
  "sds-loader-orbital",// loader (pseudo elements + 2 keyframes)
  "sds-scroll-rise",   // scroll (gate infra comes from core)
];

test("builder: 5 effects -> standalone CSS < 8KB that animates", async ({ page }) => {
  await page.goto("/docs/builder.html");
  await page.waitForSelector("#tree .cat"); // data loaded

  for (const cls of FIVE) {
    await page.fill("#filter", cls);
    await page.check(`#tree input[value="${cls}"]`);
  }
  await expect(page.locator("#selCount")).toHaveText("5");

  const css = await page.evaluate(() => (window as any).__sdsBuilderCss as string);
  expect(css.length).toBeGreaterThan(500);
  expect(css.length, `bundle is ${(css.length / 1024).toFixed(2)} KB — must be < 8 KB`).toBeLessThan(8 * 1024);

  // gzip estimate is shown
  await expect(page.locator("#gzSize")).not.toHaveText("—");

  // smoke: a fresh page using ONLY the generated stylesheet must animate
  await page.goto("about:blank");
  await page.setContent(`<!doctype html><html><head><style>${css}</style></head>
    <body>
      <h1 class="sds-velvet-drop">Hello</h1>
      <button class="sds-btn-magnetic">B</button>
      <div class="sds-card-rise">C</div>
      <span class="sds-loader-orbital"></span>
      <div class="sds-scroll-rise">S</div>
    </body></html>`);
  for (const cls of FIVE) {
    const name = await page.evaluate((c) => {
      const el = document.querySelector("." + c)!;
      const self = getComputedStyle(el).animationName;
      if (self && self !== "none") return self;
      const before = getComputedStyle(el, "::before").animationName;
      return before;
    }, cls);
    expect(name, `${cls} must animate from the custom bundle`).not.toBe("none");
    expect(name).toBeTruthy();
  }
  // core came along: tokens + reduced-motion are present
  expect(css).toContain("--sds-duration-base");
  expect(css).toContain("prefers-reduced-motion");
});

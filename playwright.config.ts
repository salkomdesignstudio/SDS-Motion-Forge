import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./test",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "github" : "list",
  // Baselines are platform-specific (font rasterization differs across OSes);
  // CI maintains its own linux baselines.
  snapshotPathTemplate: "{testDir}/visual/__screenshots__/{platform}/{arg}{ext}",
  use: {
    baseURL: "http://127.0.0.1:4173",
    viewport: { width: 800, height: 600 },
    deviceScaleFactor: 1,
  },
  expect: {
    toHaveScreenshot: {
      // tolerate sub-pixel AA noise, fail on real change
      maxDiffPixelRatio: 0.002,
    },
  },
  webServer: {
    command: "npx http-server . -p 4173 -s -c-1",
    url: "http://127.0.0.1:4173/test/visual/fixture.html",
    reuseExistingServer: !process.env.CI,
  },
  projects: [
    { name: "visual", testMatch: /visual\/.*\.spec\.ts/ },
    { name: "perf", testMatch: /perf\/.*\.spec\.ts/ },
    { name: "a11y", testMatch: /a11y\/.*\.spec\.ts/ },
    { name: "docs", testMatch: /docs\/.*\.spec\.ts/ },
    { name: "snippets", testMatch: /snippets\/.*\.spec\.ts/ },
    { name: "builder", testMatch: /builder\/.*\.spec\.ts/ },
  ],
});

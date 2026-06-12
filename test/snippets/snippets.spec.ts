/**
 * THE COPY-PASTE GUARANTEE (Phase 4, machine-enforced).
 *
 * Every HTML-tab snippet and every Bootstrap-tab snippet — exactly as shown
 * and copied on the docs site — is loaded as its own standalone page, with
 * package URLs resolved to the PACKED npm tarball (installed by
 * scripts/docs/setup-snippets-fixture.js). Each page must actually animate:
 * a snippet that only works because the docs site silently loaded a helper
 * fails here.
 *
 * Run: npm run verify:snippets
 */
import { test, expect, type Page } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";

const ROOT = path.join(__dirname, "..", "..");
const TMP = path.join(ROOT, "test", ".snippets-tmp");
const manifest = JSON.parse(fs.readFileSync(path.join(TMP, "manifest.json"), "utf8"));
const registry = JSON.parse(fs.readFileSync(path.join(ROOT, "registry", "motion.registry.json"), "utf8"));
const byName: Record<string, any> = Object.fromEntries(registry.classes.map((c: any) => [c.name, c]));

/** Resolve whether the effect is actually live on the page. */
async function assertAnimates(page: Page, cls: string) {
  const c = byName[cls];
  const sel = `.${cls}`;

  if (c.trigger === "focus") {
    await page.focus(`${sel}, ${sel} input`);
  }

  if (!c.keyframes.length && !c.requiresJs) {
    // transition-driven effect (e.g. sds-input-elevate-wrap's floating label):
    // assert the structure rendered and the transition is wired
    await expect(page.locator(sel).first()).toBeAttached();
    const hasTransition = await page.evaluate((s) => {
      const el = document.querySelector(s)!;
      const probe = [el, ...Array.from(el.querySelectorAll("*"))];
      return probe.some((e) => {
        const t = getComputedStyle(e as Element).transitionDuration;
        return t && t !== "0s";
      });
    }, sel);
    expect(hasTransition, `${cls}: transition-driven effect must have a transition`).toBe(true);
    return;
  }

  if (c.requiresJs) {
    // interactive engine effects: the engine must be attached to the element
    await page.waitForFunction((s) => {
      const el = document.querySelector(s) as any;
      return !!(window as any).SDSInteractive && el && el.__sdsInteractive === true;
    }, sel, { timeout: 5000 });
    return;
  }

  if (c.category === "scroll") {
    // gated by [data-sds]: the packed scroll engine must grant sds-play
    await page.waitForFunction(
      (s) => document.querySelector(s)?.classList.contains("sds-play"),
      sel, { timeout: 5000 },
    );
  }

  const name = await page.evaluate((s) => {
    const el = document.querySelector(s)!;
    const probe = (e: Element | null, pseudo?: string) => {
      if (!e) return "none";
      const n = getComputedStyle(e as Element, pseudo).animationName;
      return n && n !== "none" ? n : "none";
    };
    const candidates: Array<[Element | null, string?]> = [
      [el], [el, "::before"], [el, "::after"], [el, "::placeholder"],
      ...Array.from(el.children).map((ch) => [ch] as [Element]),
      ...Array.from(el.querySelectorAll(".sds-char")).map((ch) => [ch] as [Element]),
    ];
    // grandchildren for nested structures (e.g. elevate-wrap)
    for (const ch of Array.from(el.children)) {
      candidates.push([ch, "::before"], [ch, "::after"]);
    }
    for (const [e, p] of candidates) {
      const n = probe(e, p);
      if (n !== "none") return n;
    }
    return "none";
  }, sel);

  expect(name, `${cls}: computed animation-name must not be 'none'`).not.toBe("none");
}

const classes: string[] = manifest.classes;
const categories = [...new Set(classes.map((c) => byName[c].category))];

for (const category of categories) {
  const inCat = classes.filter((c) => byName[c].category === category);

  test(`HTML snippets animate standalone — ${category} (${inCat.length})`, async ({ page }) => {
    test.setTimeout(15000 + inCat.length * 4000);
    const failures: string[] = [];
    for (const cls of inCat) {
      await page.goto(`/test/.snippets-tmp/${cls}.html`, { waitUntil: "load" });
      try {
        await assertAnimates(page, cls);
      } catch (e) {
        failures.push(`${cls}: ${(e as Error).message.split("\n")[0]}`);
      }
    }
    expect(failures, failures.join("\n")).toEqual([]);
  });

  test(`Bootstrap snippets keep animating — ${category} (${inCat.length})`, async ({ page }) => {
    test.setTimeout(15000 + inCat.length * 4000);
    const failures: string[] = [];
    for (const cls of inCat) {
      await page.goto(`/test/.snippets-tmp/${cls}.bootstrap.html`, { waitUntil: "load" });
      try {
        // element renders inside the Bootstrap component (visibility is
        // checked as attached: entrance frames can have zero-size boxes)
        const attached = await page.locator(`.${cls}`).first().count();
        if (!attached) throw new Error("element missing");
        await assertAnimates(page, cls);
      } catch (e) {
        failures.push(`${cls}: ${(e as Error).message.split("\n")[0]}`);
      }
    }
    expect(failures, failures.join("\n")).toEqual([]);
  });
}

# CHANGES — SEO / GEO / adoption pass (2026-11-01)

Every edit made in this pass and why. Nothing here renames or removes a class, changes `dist/` CSS, or touches published behaviour; the one packaging change (`ide/`) is additive.

Decisions taken: canonical host is **Netlify** (`https://sds-motion-forge.netlify.app`); the look stays **neutral Geist** (no blue); "2,000+" was **npm all-time downloads**, so it is no longer presented as users.

## Fixed: things that were wrong

| Problem found | Fix |
|---|---|
| Canonical, sitemap, JSON-LD and OG all pointed at `salkomdesignstudio.github.io/SDS-Motion-Forge`, which returns **404** | All point at the Netlify site (`docs/index.html`, `docs.html`, `builder.html`, `sitemap.xml`, `robots.txt`) |
| README / `llms.txt` / pages told people to `npm i @salkomdesignstudio/motion-forge-*`, which are **404 on npm** | README, `llms.txt`, FAQ, generated pages and AI rules say the wrappers are in-repo and unpublished. One flag, `frameworkPackagesPublished` in `scripts/docs/site-lib.js`, flips all of it when they ship |
| README compared Animate.css at **80 KB**; measured 4.1.1 is **70.1 KB min / 5.2 KB gzip** and it has reduced-motion handling and per-animation source files | Comparison rewritten with measured values only; GSAP and Framer Motion rows removed (unmeasured, different category) |
| "2,000+ production users / developers" (llms.txt, hero badge, OG card, VERSIONING.md) — it is all-time npm downloads (2,317); 13 in the last 30 days | Removed as a user claim. Real counts are in `docs/GROWTH.md` |
| OG card advertised classes that do not exist (`sds-card-lift`, `sds-load-orbit`, `sds-inp-focus-glow`) and was dark, blue, 1200×555 | `scripts/generate-og-image.js` rebuilt: 1200×630, light, neutral, classes and counts read from the registry; fails if a class is missing |
| `llms.txt` used non-existent prefixes `sds-inp-*`, `sds-load-*`; was hand-edited so `npm run verify:docs` failed on `main` | `llms.txt` now generated from the registry (`site-lib.js`); real prefixes `sds-input-*`, `sds-loader-*` |
| `robots.txt` disallowed `/dist/` (the CSS every demo needs) and a non-existent page | Removed; AI crawlers explicitly allowed |
| `netlify.toml` cached `/dist/*` as `immutable` for a year on **un-hashed** file names (stale CSS after every deploy); build also copied `dist` into `docs/dist/dist` | `max-age=300, must-revalidate`; build command is just `npm run build` |
| Stale counts (`350+`, `300+ animations, 177 KB`), `~20/39 KB` mixed units | Counts and sizes read from the registry / `sizes.json`; one unit (1024-byte "KB", as `build-categories.js` and the README table use) |
| Docs test asserted 51 loaders | Updated to 100 (`test/docs/docs.spec.ts`) |

## Added: SEO

- `scripts/docs/generate-static-pages.js` — build output (gitignored): **611 effect pages** (`/animations/<name>/`), **7 category pages**, an index, a markdown twin (`index.md`) of each, `assets/pages.css`. Unique title/description per page, canonical, OG/Twitter, BreadcrumbList + TechArticle JSON-LD, live demo, spec table, HTML/React/Angular/Tailwind snippets, related links.
- `docs/sitemap.xml` regenerated: 622 URLs. `docs/llms-full.txt`: every effect with URL.
- `docs/index.html`: generated **Quick answers** section + **FAQPage** JSON-LD (marked regions, filled from `faqs()` in `site-lib.js`); Organization e-mail removed from JSON-LD; JSON-LD no longer advertises unpublished wrappers; OG image → `og-card.png` 1200×630.
- `package.json`: description, keywords (removed `flutter`, `gsap-alternative`), `homepage`, `files` += `ide/`, new `generate:static` / `generate:ide` scripts in `build`.
- `README.md`: new top (value prop, 10-second start, three examples, catalog, measured comparison, frameworks, AI-assistant link, star CTA); framework-install guidance corrected.
- `netlify.toml`: redirects (`/index.html`, `/docs`, `/builder`), content types for `.md` / `llms*.txt`, noindex for internal docs.

## Added: GEO

- `docs/llms.txt` (canonical facts, naming contract, usage) and `docs/llms-full.txt` (+ FAQ + every effect), both generated.
- `docs/AI-ASSISTANT.md` — copy-paste rules block for `CLAUDE.md` / `.cursorrules` / `AGENTS.md`.
- `robots.txt`: GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-SearchBot, Claude-User, PerplexityBot, Perplexity-User, Google-Extended, CCBot.

## Added: adoption

- `ide/sds-motion-forge.html-data.json` (class-name completion for 629 classes) and `ide/sds-motion-forge.code-snippets` (611 snippets), generated; shipped in the npm package.
- `examples/cdn/index.html` — zero-build CDN example, verified in Chrome against the published files.

## Performance / accessibility (home and docs)

Stylesheets (library CSS, icon font) no longer block first paint; Geist is **self-hosted** (`docs/vendor/geist/`, OFL licence included), preloaded and inlined as `@font-face`; the icon font loads after `load`; gallery cards use `content-visibility:auto`; gallery first render is idle-deferred; hero blur filter removed; muted text colour `#8f8f8f → #666` (contrast); docs code-comment colour raised; logo got width/height. See `docs/GROWTH.md` for before/after.

## Interactive layer: GSAP + Lenis (home page only)

Self-hosted and pinned in `docs/vendor/` (gsap 3.15.0 + ScrollTrigger, lenis 1.3.27; licences included). Loaded after `load` + idle, so LCP/FCP/CLS are untouched (Lighthouse unchanged: 98/100/100/100); skipped completely for `prefers-reduced-motion` and Save-Data (the files are not even downloaded). Adds ~52 KB gzip for visitors who get it.

- **Lenis smooth scroll** on desktop wheel only (touch keeps native momentum). Paused while the modal or drawer is open; modal/drawer/code panels keep native scrolling (`data-lenis-prevent`). Nav links glide to their section and land exactly at the page's 90px `scroll-padding-top`.
- **GSAP**: scroll-progress hairline, nav state on scroll, hero-card parallax + cursor tilt, magnetic hero buttons, pointer spotlight on feature tiles, marquee that speeds up with scroll velocity.
- Gallery cards' `contain-intrinsic-size` corrected to the measured 226px (230px estimate made anchor scrolling drift by ~140px).
- Left out on purpose: `docs.html` and the 611 generated effect pages — reference pages that score 100 and need no smooth scrolling.
- Verified in Chrome with 23 behavioural checks (anchors, modal lock, reduced motion, touch, no console errors) plus the repo's docs/builder Playwright suites.

## CI

CI was already red before this work (same jobs failed on the upstream commits `dd3250f`, `e100051`). Found and fixed one cause: `release:check` ran `npm run size`, which measures `packages/*/dist`, without building the packages first — it now runs `build:packages` before `size`. The `a11y` (needs the unbuilt `examples/vite-loaders` app) and `snippets` jobs fail for reasons not investigated yet.

## Docs

`docs/GROWTH.md` (metrics, baselines, analytics + Search Console steps), `docs/LAUNCH.md` (manual launch checklist with paste-ready copy), `VERSIONING.md` (unsupported claim removed).

## Not done — needs you

Analytics script, Search Console / Bing tokens, StackBlitz/CodeSandbox templates, publishing the wrapper packages, GitHub topics/Discussions/social preview. See `docs/LAUNCH.md`.

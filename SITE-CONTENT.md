# SDS Motion Forge — website content

Written for: developers and designers who land on the site and decide in a few seconds whether to install the library.

Every fact below comes from the repository, the build output (`dist/categories/sizes.json`, the registry) or a measurement already in the README. Anything not known is marked **[NEEDS FROM OWNER]**. Numbers are written the way the build reports them, so re-check them whenever the version changes.

Voice: plain, specific, active. One idea per sentence. No hype words ("revolutionary", "blazing"), no claims the build cannot prove.

---

## 0. Entity and facts (use these exact words everywhere)

- **Name:** SDS Motion Forge (short form in UI: Motion Forge)
- **What it is:** a free, MIT-licensed CSS animation library. 617 effects in six categories, each used by adding one class name. No JavaScript is required for the CSS effects.
- **Maker:** Salkom Design Studio
- **Package:** `@salkomdesignstudio/sds-motion-forge` (npm), version 5.2.0 once released
- **Site:** https://sds-motion-forge.netlify.app
- **Repository:** https://github.com/salkomdesignstudio/SDS-Motion-Forge
- **Categories (effects):** Text 117, Buttons 100, Inputs 100, Cards 100, Loaders 100, Scroll 100. Plus 7 cursor-reactive effects and 18 modifier classes.
- **Size:** full bundle 43.8 KB gzip (261.0 KB minified). Each category 5.8–13.5 KB gzip, core included.
- **Promise (machine-verified on every build):** every class that worked in v3 and v4 works identically in v5; every animating selector is neutralised under `prefers-reduced-motion`.
- **Contact:** hello@salkomdesignstudio.com (from SECURITY.md)

---

## 1. Home page

### 1.1 Meta
- **Title (52):** 617 CSS Animations, One Class Each — SDS Motion Forge
- **Description (151):** 617 production-ready CSS animations in 6 categories. Add one class name to any element — no JavaScript, no build step, no config. Free and open source.
- **H1:** Motion at the speed of class

### 1.2 Hero
- **Eyebrow:** v5.2.0 · MIT · 617 animations
- **H1:** Motion at the speed of class
- **Sub:** 617 CSS animations in six categories. Add one class name and the element moves. The CSS effects need no JavaScript.
- **Fine print (one line, links to the JS table):** JavaScript is optional: 7 cursor-reactive effects need a 7 KB script, and scroll triggers use a 1.3 KB script in browsers without CSS scroll-driven animation.
- **Primary button:** Browse the animations
- **Secondary button:** Copy install command → `npm i @salkomdesignstudio/sds-motion-forge`
- **Under the buttons (one line):** Free and open source. MIT licensed.
- **Hero demo caption:** `<h1 class="sds-velvet-drop">` — replay

### 1.3 Proof strip (four numbers, all from the build)
| Value | Label |
|---|---|
| 617 | CSS animations |
| 0 KB | JavaScript for the CSS effects (7 cursor-reactive effects and the scroll fallback use optional scripts) |
| 43.8 KB | Full bundle, gzip |
| 6 | Categories, each importable alone |

### 1.4 Quick start (directly under the hero, before any marketing)
**Heading:** Start in 10 seconds

```html
<link rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/@salkomdesignstudio/sds-motion-forge/dist/motion.min.css" />

<h1 class="sds-velvet-drop">Hello World</h1>
```

Or with npm: `npm i @salkomdesignstudio/sds-motion-forge`, then import `@salkomdesignstudio/sds-motion-forge/dist/motion.min.css` once.

### 1.5 Why section
- **Eyebrow:** Why Motion Forge
- **H2:** Built to ship, not to demo
- **Intro:** A focused motion system for teams who want character without the weight. Everything below is checked by the build, not promised.

| Card | Title | Copy |
|---|---|---|
| 1 (highlight) | No JavaScript for the CSS effects | All 617 effects are plain `@keyframes` and classes. Two optional scripts add what CSS cannot: scroll triggering where CSS scroll-driven animation is missing (1.3 KB) and 7 cursor-reactive effects (7 KB). |
| 2 | 617 animations | Text 117, Buttons 100, Inputs 100, Cards 100, Loaders 100, Scroll 100. One class name each. |
| 3 | Works anywhere a class works | HTML, React, Next.js, Angular, Vue, Svelte, Bootstrap and Tailwind projects: anything that renders HTML with CSS classes. Not for email clients or native/canvas apps such as Flutter. |
| 4 | Themeable | Set `--sds-primary`, `--sds-duration` and `--sds-easing` and the whole library follows your brand. |
| 5 | Mostly compositor-only | 468 of 617 effects animate only transform, opacity, filter or clip-path. The other 149 also animate shadows, gradients or sizes and can cost more on slow devices. |
| 6 | Respects reduced motion | Every animating selector is switched off under `prefers-reduced-motion: reduce`. The build fails if one is missed. |

Rule: only card 1 is highlighted. One accent per viewport.

### 1.6 What's new in 5.1 and 5.2 (new section, short)
- **Eyebrow:** New
- **H2:** Thirteen physics text effects
- **Copy:** The newest text effects are driven by real equations, not hand-tuned curves: a spring, a bouncing ball, a pendulum, a spiral that conserves angular momentum, buoyancy against drag, a drag-limited gust, an infall in an inverse-square field. Each equation is sampled into a CSS `linear()` easing curve and checked against its closed-form solution on every build.
- **List:** Spring Drop · Orbit Decay · Chain Swing · Toss In · Band Snap · Bubble Rise · Wind Drift · Gravity Collapse · Liquid Slosh · Split Halves · Strike Swap · Count Roll · Extrude Rise
- **Link:** See all physics effects → `/categories/text/`
- **Footnote:** Browsers without `linear()` get a cubic-bezier approximation. Nothing breaks.

### 1.7 Gallery
- **Eyebrow:** Live gallery
- **H2:** Every animation, playing live
- **Intro:** Hover a card to replay it. Click it to open the detail view, change speed and delay, and copy the code. These are the real animations, not recordings.
- **Search placeholder:** Search 617 animations
- **Empty state:** No animation matches "{query}". Try a shorter word, or pick a category.
- **Card hint (small, once):** Effects marked "Needs JS" use the optional interactive engine.

### 1.8 Detail view microcopy
- **Replay button:** Replay
- **Copy button:** Copy code → on success: Copied
- **Copy error:** Couldn't copy. Select the code and copy it by hand.
- **Controls:** Duration · Delay · Iteration (Once, 2×, 3×, Loop) · Direction · Easing
- **Interactive effects (replaces the current notice):**
  - **Title:** Move your cursor over the preview
  - **Body:** This effect reacts to the pointer, so there is no replay or timing to set. To use it on your site, add the optional engine before `</body>`:
  - **Code:** `<script src="https://cdn.jsdelivr.net/npm/@salkomdesignstudio/sds-motion-forge/dist/motion-interactive.min.js" defer></script>`
  - **Behaviour:** hide the Duration, Delay, Iteration, Direction and Easing controls for these effects.
- **Not-yet-published note (only while an effect is newer than the published version):** New in {version}. Install {version} or later for the CDN and npm snippets to animate.

### 1.9 Playground
- **Eyebrow:** Playground
- **H2:** Build it, see it, copy it
- **Intro:** Pick an effect, add modifiers for speed and delay, and copy markup that is ready to paste.
- **Labels:** Animation · Modifiers · Output · Replay · Copy

### 1.10 Documentation teaser
- **H2:** Everything you need to ship
- **Intro:** Installation, the full animation reference, the scroll and interactive engines, TypeScript types, theming and accessibility.
- **Links:** Installation (CDN, npm, per-category imports) · Animation reference (all 617) · Scroll animations (3 ways to trigger) · Interactive engine · TypeScript · Contributing
- **Buttons:** Open the docs · View on GitHub

### 1.11 Quick answers (generated from `faqs()` in `scripts/docs/site-lib.js`; wording below is the target)
1. **What is the best CSS animation library for Angular?** There is no single best option, but a CSS-only library suits Angular because it needs no Angular-specific code. SDS Motion Forge provides 617 animations as plain CSS classes: load the stylesheet once and add a class to any element.
2. **How do I add scroll animations without JavaScript?** Add `sds-scroll-auto` and any `sds-scroll-*` class, for example `class="sds-scroll-auto sds-scroll-rise"`. It uses native CSS scroll-driven animation (Chrome 115+). Browsers without it show the content unanimated. The optional 1.3 KB script covers the rest.
3. **Is there an Animate.css alternative?** Yes. SDS Motion Forge is CSS-only and covers 617 effects in six categories. The trade-off is size: the full bundle is 43.8 KB gzip against 5.2 KB for Animate.css 4.1.1, so import one category (5.8–13.5 KB gzip) if size matters.
4. **Does it respect `prefers-reduced-motion`?** Yes. Every animating selector is neutralised under `prefers-reduced-motion: reduce`, and the build fails if one is missed.
5. **How big is it, and can I import part of it?** Full bundle 43.8 KB gzip. Each category is 5.8–13.5 KB gzip and can be imported alone.
6. **Does it work with React, Vue, Next.js and Tailwind?** Yes. Load `dist/motion.min.css` once and use the class names with `className` or `class`.
7. **Is it free for commercial use?** Yes. MIT licence. Keep the copyright and licence notice with copies of the code.

### 1.12 Final call to action
- **H2:** Start animating in seconds
- **Copy:** Free, open source, MIT licensed. No build step needed.
- **Command:** `npm i @salkomdesignstudio/sds-motion-forge`
- **Buttons:** Browse the animations · Read the docs

### 1.13 Footer
- **Blurb:** 617 CSS animations. One class name each. No JavaScript required. Open source under the MIT licence. Made by Salkom Design Studio.
- **Columns:** Product (Features, Gallery, Playground) · Resources (Docs, npm, Changelog, Issues) · Studio (Salkom Design Studio, MIT licence, Privacy, Accessibility)
- **Legal line:** © 2026 Salkom Design Studio · MIT licence

---

## 2. How it works (`/docs.html#quick-start`, also a short section on the home page)

**H2:** Three steps
1. **Load the CSS once.** From the CDN with a `<link>`, or `npm i` and import `dist/motion.min.css`.
2. **Add a class.** `<h1 class="sds-velvet-drop">Hello</h1>`. The element animates when it loads.
3. **Tune it (optional).** Modifier classes change speed, delay and looping: `sds-fast`, `sds-slow`, `sds-delay-1` to `sds-delay-10`, `sds-loop`, `sds-pause-hover`.

**Category patterns:** text `sds-*` · buttons `sds-btn-*` · inputs `sds-input-*` · cards `sds-card-*` · loaders `sds-loader-*` · scroll `sds-scroll-*`.

**Scroll in two ways:** with zero JavaScript (`sds-scroll-auto` + any `sds-scroll-*`, Chrome 115+), or with the optional 1.3 KB script (`data-sds`) for every browser.

**Per-letter effects:** wrap each letter in `<span class="sds-char" style="--i:0">`. Effects that need this say so on their page.

---

## 3. Comparison page (`/compare/animate-css`, one page, one purpose)

- **Title (58):** SDS Motion Forge vs Animate.css — Size and Coverage
- **H1:** SDS Motion Forge vs Animate.css
- **Answer first (under the H1):** Animate.css is smaller (5.2 KB gzip) and covers the classic entrance and exit effects. SDS Motion Forge is larger (43.8 KB gzip for everything, 5.8–13.5 KB per category) and adds text, button, input, card, loader and scroll effects.

| | SDS Motion Forge 5.2.0 | Animate.css 4.1.1 |
|---|---|---|
| Effects | 617 (+ 7 interactive) | see Animate.css |
| `@keyframes` | 636 | 97 |
| Full bundle | 261.0 KB min · 43.8 KB gzip | 70.1 KB min · 5.2 KB gzip |
| Import part of it | Six category bundles, 5.8–13.5 KB gzip | Individual source files |
| Reduced motion | Every selector neutralised, build-checked | Handled |

- **Footnote (must stay):** Animate.css 4.1.1 was downloaded from npm on 2026-11-01 and measured. Numbers are re-measured when either library changes.
- **Choose Animate.css when:** you only need classic entrances and exits and every kilobyte counts.
- **Choose Motion Forge when:** you also want text, button, input, card, loader or scroll effects from one naming scheme.

---

## 4. Accessibility page (`/accessibility`)

- **Title:** Accessibility — SDS Motion Forge
- **Answer first:** Every animating selector is switched off under `prefers-reduced-motion: reduce`, and the build checks this on every release (100% coverage).
- **What we do:** Reduced motion respected by default · Scroll-gated content stays visible instead of hidden when motion is off · Effects use `transform`, `opacity`, `filter` and `clip-path`, so they do not shift layout · Per-letter effects keep the full text available to screen readers when markup follows the docs.
- **What you must do:** Do not rely on motion alone to convey meaning. Keep text contrast sufficient at every frame of a text effect. Provide `aria-label` with the full text when you split letters by hand.
- **Known limits:** The docs site itself scores 100 for accessibility in Lighthouse on the pages measured; this is a measurement, not a conformance claim. **[NEEDS FROM OWNER]** a formal WCAG statement if you want one.
- **Report a problem:** hello@salkomdesignstudio.com or a GitHub issue.

---

## 5. Browser support (`/docs.html#browsers`)

| Feature | Needs | If missing |
|---|---|---|
| All CSS effects | Any current browser | Element shows its final state |
| Physics easing (`linear()`) | Chrome 113+, Safari 17.2+, Firefox 112+ | Cubic-bezier approximation |
| Zero-JS scroll (`animation-timeline: view()`) | Chrome 115+ | Use the 1.3 KB script |
| Interactive effects | Optional 7.0 KB script | Static element |

---

## 6. About (`/about`) — only facts we have

- **H1:** About SDS Motion Forge
- **Answer first:** SDS Motion Forge is a free CSS animation library made by Salkom Design Studio and released under the MIT licence.
- **Why it exists:** **[NEEDS FROM OWNER]** two or three sentences in your own words: the problem you hit, and who you built it for.
- **How it is built:** One registry lists every effect. Docs, TypeScript types, Tailwind utilities, the gallery, this site's per-effect pages and the AI-readable files are all generated from it, so they cannot disagree with the CSS.
- **How it is kept honest:** Every build checks that old class names still work (against the published 4.0.3 tarball), that reduced motion covers everything, that new effects do not repeat existing ones, and that bundle sizes stay in budget.
- **Maker:** Salkom Design Studio — https://salkomdesignstudio.com. **[NEEDS FROM OWNER]** a short studio description, location and team names if you want them shown.
- **Open source:** Issues, ideas and pull requests welcome on GitHub. Start with CONTRIBUTING.md.

---

## 7. Privacy (`/privacy`)

- **Answer first:** This site does not run analytics or advertising scripts and sets no tracking cookies.
- **What loads:** Fonts and the animation scripts are served from this site. The page is hosted on Netlify, which keeps standard server logs.
- **Search verification:** A Google Search Console verification tag is present in the page head. It does not track visitors.
- **Contact:** hello@salkomdesignstudio.com
- **If this ever changes:** analytics will be added only behind a consent banner with Accept and Decline, and this page will name every tool. **[NEEDS FROM OWNER]** confirm before publishing, because it must stay true.

---

## 8. Contact and community (`/contact`, or a footer block)

- **Bugs and ideas:** GitHub issues (templates for bug reports and animation requests).
- **Security reports:** GitHub private vulnerability reporting, or hello@salkomdesignstudio.com with subject `SECURITY: sds-motion-forge`.
- **Animation requests:** open an issue with the `animation-request` label. A request is declined when its motion is too close to an existing effect; name the physical law or choreography that makes it different.

---

## 9. States and system messages

| Where | Text |
|---|---|
| 404 | **Page not found.** That address does not exist. Browse all animations · Read the docs · Go home |
| Copy success | Copied |
| Copy failure | Couldn't copy. Select the code and copy it by hand. |
| Reduced-motion visitor | Animations are off because your device asks for reduced motion. The effects still work for everyone else. |
| Search empty | No animation matches "{query}". Try a shorter word, or pick a category. |
| Loading gallery | Loading animations… |

---

## 10. Per-effect pages (generated; the template to keep)

- **Title (≤ 60):** `{Name} CSS Animation (.sds-{name})`
- **Description (120–160):** `{one plain sentence on the motion}. Use .sds-{name} — {plays once|loops}, {when it starts}. CSS-only, copy-paste for HTML, React, Angular and Tailwind. Free and MIT licensed.`
- **H1:** `{Name}`
- **First paragraph:** states the motion in one sentence, the class, and whether it needs per-letter markup.
- **Sections:** Live demo · Copy-paste code (HTML, React, Angular, Tailwind) · Needs (markup or script, if any) · Related effects (three, same category) · Back to the category.
- **Never:** reuse the same description on two pages.

---

## 11. Meta table

| URL | Title | Description | H1 | Primary keyword |
|---|---|---|---|---|
| `/` | 617 CSS Animations, One Class Each — SDS Motion Forge | 617 production-ready CSS animations in 6 categories. Add one class name to any element — no JavaScript, no build step, no config. Free and open source. | Motion at the speed of class | css animation library |
| `/docs.html` | SDS Motion Forge Docs — Install, Usage, Frameworks | Install SDS Motion Forge and use every animation: CDN and npm setup, framework guides, scroll and interactive engines, TypeScript, theming. | Installation | css animation library documentation |
| `/animations/` | All 617 CSS Animations \| SDS Motion Forge | Every SDS Motion Forge animation on one page: CSS-only effects in six categories plus cursor-reactive effects. One class name each. | All animations | css animations list |
| `/categories/text/` | 117 Text CSS animations — copy-paste classes \| SDS Motion Forge | Text animations: 117 ready-made effects, each one class name, CSS-only, MIT licensed. | Text animations | css text animations |
| `/compare/animate-css` | SDS Motion Forge vs Animate.css — Size and Coverage | Compare size, coverage and licence of SDS Motion Forge and Animate.css 4.1.1 with measured numbers. | SDS Motion Forge vs Animate.css | animate.css alternative |
| `/accessibility` | Accessibility — SDS Motion Forge | How SDS Motion Forge handles reduced motion, and what you need to do on your side. | Accessibility | css animations reduced motion |
| `/about` | About SDS Motion Forge | A free CSS animation library by Salkom Design Studio, MIT licensed. How it is built and kept honest. | About SDS Motion Forge | sds motion forge |
| `/privacy` | Privacy — SDS Motion Forge | This site runs no analytics or advertising scripts and sets no tracking cookies. | Privacy | (none) |

---

## 12. Needs from the owner

1. Two or three sentences on why you built it and who it is for (About).
2. Studio description, location and team names, if you want them public.
3. A real name and role for the maker, if you want an author byline (E-E-A-T).
4. Whether the Privacy statement is true for any analytics you add later.
5. LinkedIn, Wikidata, Crunchbase or other real profile URLs for `sameAs`.
6. A formal accessibility statement, if you need one.
7. Any real user quotes, download numbers or projects using the library. None are used here because none are verified.

---

## 13. What needs JavaScript (docs page `#js-needs`, README section) — the one statement every claim must agree with

| What | Needs JavaScript? | Notes |
|---|---|---|
| 617 CSS effects | No | Some need markup: 13 text effects need each letter in a `.sds-char` span, 48 animate child elements, 29 input effects need a wrapper. |
| 100 scroll effects | Only to trigger on scroll in some browsers | `sds-scroll-auto` + `sds-scroll-*` is CSS-only in Chrome 115+. Elsewhere use the 1.3 KB `sds-scroll.min.js` and `data-sds`; without either the effect plays on load. |
| 7 cursor-reactive effects | Yes | Need the 7 KB `motion-interactive.min.js`. |
| Physics easing | No | Needs CSS `linear()` (Chrome 113+, Safari 17.2+, Firefox 112+); older browsers get a cubic-bezier approximation. |

Not supported: email clients, native or canvas-based apps (for example Flutter).

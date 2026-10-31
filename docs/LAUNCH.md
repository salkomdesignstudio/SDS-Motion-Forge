# Launch guide — start here

You don't need to understand any of this file at once. **Do the steps in order, one at a time, and stop whenever you like** — each step helps on its own. The code work is already done; these are things only you can do because they need your logins.

Total time: about 45 minutes. Steps 1–3 matter most.

---

## Step 1 — Check the site is live (2 minutes)

Open these in your browser. Each should show a normal page, not "Page not found":

1. https://sds-motion-forge.netlify.app/
2. https://sds-motion-forge.netlify.app/animations/aurora-text/
3. https://sds-motion-forge.netlify.app/categories/text/
4. https://sds-motion-forge.netlify.app/llms.txt

If one is missing, open https://app.netlify.com → your site → **Deploys** and look at the newest one. If it says **Failed**, click it and copy the last 20 lines of the log to me.

## Step 2 — Fill in your GitHub page (10 minutes)

Right now the repo has **no topics**, the old description, and Discussions is off, so GitHub search can't find it. Sign in to GitHub as the account that owns `salkomdesignstudio` first.

**A. About box (description + topics)**

1. Open https://github.com/salkomdesignstudio/SDS-Motion-Forge
2. On the right, in the **About** box, click the **⚙ gear** icon.
3. **Description**: select everything in the box, delete it, and paste:
   `600+ CSS animations for text, buttons, inputs, cards, loaders and scroll. One class name each, no JavaScript required. MIT.`
4. **Website**: already `https://sds-motion-forge.netlify.app/` — leave it.
5. **Topics**: click the topics box and add these 20 (type one, press Space or Enter; GitHub shows a chip for each). If pasting the whole list makes one long chip, delete it and add them one at a time:
   `css-animations` `css-animation-library` `animate-css-alternative` `scroll-animation` `text-animation` `loader` `hover-effects` `css-only` `keyframes` `angular` `react` `nextjs` `tailwindcss` `typescript` `design-tokens` `accessibility` `prefers-reduced-motion` `frontend` `ui-components` `zero-dependencies`
6. Leave the checkboxes under it as they are. Click **Save changes**.

**B. Social preview image** (the picture shown when someone shares the link)

1. Open https://github.com/salkomdesignstudio/SDS-Motion-Forge/settings (the **Settings** tab at the top of the repo).
2. Scroll to **Social preview** and click **Edit → Upload an image…**
3. Choose this file from your computer: `D:\Angular-projects\SDS-Motion-Forge\docs\images\og-card.png` (1200×630, 195 KB — within GitHub's limits).

**C. Discussions**

1. Same Settings page, scroll to **Features**.
2. Tick **Discussions**. (A *Discussions* tab appears at the top of the repo.)

**When you're done**, tell me "step 2 done" — I can check the topics, description and Discussions from here and confirm they saved. (The social preview image can't be checked from outside; look at the repo Settings page to see it.)

## Step 3 — Tell Google about the site (15 minutes)

Google doesn't know about the 622 new pages until you tell it. **Choose these options exactly:** property type **URL prefix** (not "Domain"), verification method **HTML tag**.

1. Open https://search.google.com/search-console and sign in with the Google account that should own the site.
2. In the top-left property menu choose **Add property**. Pick the right-hand box, **URL prefix**, and enter exactly `https://sds-motion-forge.netlify.app/` → **Continue**.
   - Why not "Domain"? That one needs DNS access on a domain you own; `netlify.app` is Netlify's domain, so only URL prefix works.
3. Google shows several methods. Open **HTML tag**. It shows one line like
   `<meta name="google-site-verification" content="AbC…long-value…xyZ" />`
4. **Click Copy and paste that whole line to me here.** (Just the long value inside `content="…"` is fine too.) **Don't click Verify yet.** The slot for it is already in the site, so it takes me one edit, a rebuild and a deploy (about 2 minutes).
5. When I tell you it's deployed, go back to the same Search Console screen and click **Verify**. It should say *Ownership verified*.
   - Leave the tag in the site permanently — removing it later un-verifies you.
6. In the left menu click **Sitemaps**. In *Add a new sitemap* type `sitemap.xml` (the full address is https://sds-motion-forge.netlify.app/sitemap.xml) and click **Submit**. Status should become **Success** and show 622 discovered pages (it can take a few minutes).
7. Optional but worthwhile: in the left menu click **URL inspection**, paste `https://sds-motion-forge.netlify.app/` and click **Request indexing**.

**Then Bing (5 minutes):** open https://www.bing.com/webmasters, sign in, choose **Import** → **Import from Google Search Console** and approve. If the import isn't offered, choose **Add a site manually**, enter the same address, pick the **HTML Meta Tag** method and send me the `msvalidate.01` value the same way.

## Step 4 — Decide about the framework packages (just a decision)

The React, Angular, Tailwind and Web Component helpers exist in your project but are **not on npm**, so nobody can install them. Tell me which:

- **"Publish them"** — I'll prepare them for release. Then I flip one setting and the whole site starts offering them.
- **"Leave them"** — nothing to do. The site already says honestly that they aren't published and that plain CSS works everywhere.

## Step 5 — Publish a new version to npm (only when you're ready)

The new editor-completion files (`ide/`) and the better npm description only reach npm after a release. Ask me **"prepare the release"** and I will bump the version and tell you the exact clicks to publish on GitHub. Don't do this alone — a version number can't be reused once published.

## Step 6 — Share it (optional, whenever)

Copy-paste posts are below. Post **one place at a time**, a few days apart, and answer comments. Read each community's rules about self-promotion first (Reddit especially).

---

## Copy to paste

**One-liner**
`600+ CSS animations. One class name each. No JavaScript required.`

**Short post (X / Bluesky / Mastodon / LinkedIn)**
> SDS Motion Forge 5: 604 CSS animations for text, buttons, inputs, cards, loaders and scroll. One class per effect, no JavaScript needed, MIT.
> Import just one category (5.8–8.6 KB gzip) or the full 38.4 KB bundle.
> https://sds-motion-forge.netlify.app

**Hacker News — title**
`Show HN: SDS Motion Forge – 604 CSS animations, one class each, no JS required`

**Hacker News — first comment (post it yourself right after submitting)**
> I built this as a CSS-only option for UI motion beyond entrance/exit effects: text, inputs, cards, loaders and scroll reveals, each a single class. Every effect honors prefers-reduced-motion and the build fails if one doesn't. Per-category bundles are 5.8–8.6 KB gzip; the full bundle is 38.4 KB (Animate.css 4.1.1 is 5.2 KB gzip with 97 keyframes — smaller, but a smaller set). Each effect has a page with a live demo and snippets: https://sds-motion-forge.netlify.app/animations/. Feedback on the class naming and docs is very welcome.

**Reddit (r/css, r/webdev, r/angular)**
> Title: I made 604 CSS-only animations (text, buttons, inputs, cards, loaders, scroll) — one class each
> Body: Open source (MIT). No JS needed for the CSS effects; scroll reveals can use native scroll-driven animation (Chrome 115+) or a 1.3 KB script. Live demos and copy-paste code per effect: https://sds-motion-forge.netlify.app/animations/ — happy to hear what's missing.

**Product Hunt tagline**
`604 CSS animations, one class each, zero JS required`

---

## Later (monthly, 10 minutes)

Ask ChatGPT, Claude, Perplexity and Gemini: *"What is an Animate.css alternative?"* and *"CSS-only text animation library?"* Write down whether SDS Motion Forge is mentioned and whether the install command is right in `docs/GROWTH.md`. This is how you'll see whether the AI-search work is paying off.

## Stuck?

Open this project in Claude Code and say which step you're on and what you see on screen (or paste the error). You don't need to know the technical words.

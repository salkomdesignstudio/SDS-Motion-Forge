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

This is the biggest win: right now the repo has no topics, so GitHub search can't find it.

1. Go to https://github.com/salkomdesignstudio/SDS-Motion-Forge
2. On the right side, next to **About**, click the **gear icon ⚙**.
3. **Description** — paste:
   `600+ CSS animations for text, buttons, inputs, cards, loaders and scroll. One class name each, no JavaScript required. MIT.`
4. **Topics** — click the box and paste these one at a time (press Enter after each; GitHub allows 20):
   `css-animations` `css-animation-library` `animate-css-alternative` `scroll-animation` `text-animation` `loader` `hover-effects` `css-only` `keyframes` `angular` `react` `nextjs` `tailwindcss` `typescript` `design-tokens` `accessibility` `prefers-reduced-motion` `frontend` `ui-components` `zero-dependencies`
5. The **Website** box is already filled in with your Netlify address — leave it. Click **Save changes**.
6. Go to **Settings → General**, scroll to **Social preview**, click **Edit → Upload an image**, and choose the file `docs/images/og-card.png` from your project folder. (This is the picture shown when someone shares your link.)
7. Same Settings page, scroll to **Features**, tick **Discussions**.

## Step 3 — Tell Google about the site (15 minutes)

Google won't know about the 622 new pages until you tell it.

1. Go to https://search.google.com/search-console and sign in with the Google account you want to own this.
2. Click **Add property**, choose **URL prefix**, paste `https://sds-motion-forge.netlify.app/`, click **Continue**.
3. Choose the **HTML tag** method. Google shows a line starting with `<meta name="google-site-verification"`. **Copy that whole line and send it to me.** I will add it to the site, you deploy, then come back and click **Verify**.
4. After it verifies, click **Sitemaps** in the left menu, type `sitemap.xml`, click **Submit**.

Then do the same at https://www.bing.com/webmasters — choose **Import from Google Search Console** and follow the prompts (it is two clicks).

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

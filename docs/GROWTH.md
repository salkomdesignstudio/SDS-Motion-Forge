# Growth tracking

What to measure, where to read it, and the baseline measured on **2026-11-01** (before the SEO/GEO work shipped). Re-measure the same way each week and append a row.

## Weekly scorecard

| Metric | Where to read it | Baseline 2026-11-01 |
|---|---|---|
| npm downloads (last month) | `curl -s https://api.npmjs.org/downloads/point/last-month/@salkomdesignstudio/sds-motion-forge` | **13** |
| npm downloads (all time, since 2025-05-01) | `…/downloads/point/2025-05-01:2026-12-31/@salkomdesignstudio/sds-motion-forge` | **2,317** |
| jsDelivr CDN hits (last month) | `curl -s "https://data.jsdelivr.com/v1/stats/packages/npm/@salkomdesignstudio/sds-motion-forge?period=month"` → `hits.total` | **721** (rank 194,007) |
| GitHub stars / forks | `curl -s https://api.github.com/repos/salkomdesignstudio/SDS-Motion-Forge` → `stargazers_count`, `forks_count` | **1 / 0** |
| GitHub topics | same call → `topics` | **none set** |
| GitHub referrers & clones | Repo → Insights → Traffic (kept 14 days — copy weekly) | not captured |
| Search queries, clicks, impressions, indexed pages | Google Search Console → Performance / Pages | property not yet created |
| Bing queries and indexing | Bing Webmaster Tools (can import from Search Console) | not yet created |
| Pages indexed (of 622 submitted) | Search Console → Pages | 0 submitted |
| AI-referral traffic | Analytics → referrers containing `chatgpt.com`, `perplexity.ai`, `claude.ai`, `gemini.google.com`, `copilot.microsoft.com` | no analytics yet |
| AI citations | Manually ask ChatGPT / Perplexity / Claude / Gemini the questions in the site's "Quick answers" section; record whether SDS Motion Forge is named and whether the install command is correct | not yet run |

Read the numbers in context: CDN hits (721/month) are ~55× npm downloads (13/month), so **track both** — most usage arrives through the CDN, which npm statistics cannot see.

## Lighthouse (lab, mobile, simulated throttling, brotli like Netlify)

| Page | Perf | A11y | Best Practices | SEO |
|---|---|---|---|---|
| Home `/` — before | 85* | 96 | 100 | 100 |
| Home `/` — after | 98 | 100 | 100 | 100 |
| `/docs.html` — before | 86* | 96 | 100 | 100 |
| `/docs.html` — after | 100 | 100 | 100 | 100 |
| `/categories/text/` (new) | 100 | 100 | 100 | 100 |
| `/animations/aurora-text/` (new) | 100 | 100 | 96→100† | 100 |

\* Before-scores were re-measured with brotli compression; an earlier uncompressed run showed 61 and 68, which overstated the problem.
† The 96 was an "illegible font size" flag on inline code (11.7px); fixed in the generator.

Re-run: serve `docs/` after `npm run build`, then `npx lighthouse@12 <url> --only-categories=performance,accessibility,best-practices,seo`.

## Privacy-friendly analytics (not yet enabled — needs your account)

No analytics script is wired in, because every privacy-friendly option needs an account or site code that only you can create. Pick one, then:

1. **GoatCounter** (free, no cookies): create a site, note its code `CODE`. Add before `</head>` of `docs/index.html`, `docs/docs.html` and the page template in `scripts/docs/generate-static-pages.js`:
   ```html
   <script data-goatcounter="https://CODE.goatcounter.com/count" async src="https://gc.zgo.at/count.js"></script>
   ```
2. In `netlify.toml`, extend the Content-Security-Policy: add `https://gc.zgo.at` to `script-src` and `https://CODE.goatcounter.com` to `connect-src` and `img-src`. Without this the browser blocks the script.
3. Plausible and Umami work the same way (different script URL and domains in the CSP).

## Search Console and Bing verification

The home page has a generated slot for the ownership tags (`<!-- SITE-VERIFY:START … END -->` in `docs/index.html`). To fill it, put the token in `config.verification.google` (and `.bing`) in `scripts/docs/site-lib.js` — either the bare `content="…"` value or the whole `<meta>` line — then `npm run build` and deploy. The build fails with a clear message if the value isn't a valid token. Leave the tags in place permanently; removing them un-verifies the property.

- **Google**: Search Console → Add property → **URL prefix** `https://sds-motion-forge.netlify.app/` → verification method **HTML tag** → then *Sitemaps* → `sitemap.xml`.
- **Bing**: Webmaster Tools → import from Search Console, or add manually with the **HTML Meta Tag** method (`msvalidate.01`).

## What "good" looks like in 90 days (targets to confirm, not promises)

Set these once you have two weeks of real data, so the targets are based on observed rates rather than guesses.

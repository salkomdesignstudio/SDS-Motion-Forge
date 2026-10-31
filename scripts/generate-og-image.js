/**
 * Generates the social-share card (1200×630, light theme, neutral Geist look):
 *   docs/images/og-card.html  (source, regenerated)
 *   docs/images/og-card.png   (what og:image / twitter:image point at)
 *
 * Every number and class name on the card is read from the registry, so the
 * card cannot advertise a count or a class that does not exist.
 *
 * Usage: node scripts/generate-og-image.js
 */
'use strict';

const { chromium } = require('@playwright/test');
const path = require('path');
const fs = require('fs');
const S = require('./docs/site-lib');

const OUT = path.resolve(__dirname, '../docs/images');
const names = new Set(S.registry.classes.map((c) => c.name));
const SHOWN = [
  'sds-velvet-drop', 'sds-btn-aurora', 'sds-card-cascade', 'sds-scroll-fade-up',
  'sds-loader-plasma-ring', 'sds-input-focus-glow', 'sds-aurora-text', 'sds-btn-magnetic',
];
const missing = SHOWN.filter((n) => !names.has(n));
if (missing.length) {
  console.error('OG card references classes missing from the registry:', missing.join(', '));
  process.exit(1);
}

const f = S.canonicalFacts();
const gz = S.sizes ? `${Math.round(S.sizes.full.gzip / 1024)} KB` : null;
const host = f.site.replace(/^https?:\/\//, '');

const html = `<!doctype html>
<html lang="en"><head><meta charset="UTF-8" />
<meta name="viewport" content="width=1200" />
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&family=Geist+Mono:wght@400;500&display=swap" />
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{width:1200px;height:630px;overflow:hidden;background:#fafafa;color:#171717;font-family:Geist,Arial,sans-serif;position:relative}
.mesh{position:absolute;right:-160px;top:-160px;width:760px;height:760px;filter:blur(70px);opacity:.5;
 background:radial-gradient(40% 50% at 30% 30%,#50e3c2,transparent 70%),radial-gradient(40% 50% at 70% 25%,#aaffec,transparent 70%),radial-gradient(40% 50% at 78% 55%,#7928ca,transparent 70%),radial-gradient(40% 45% at 55% 78%,#ff0080,transparent 70%),radial-gradient(35% 40% at 25% 75%,#f9cb28,transparent 70%)}
.content{position:absolute;inset:0;padding:0 80px;display:flex;flex-direction:column;justify-content:center;max-width:820px}
.badge{display:inline-flex;align-self:flex-start;border:1px solid #ebebeb;background:#fff;border-radius:100px;padding:6px 14px;font:500 14px "Geist Mono",monospace;color:#4d4d4d;margin-bottom:28px}
h1{font-size:84px;line-height:1;font-weight:600;letter-spacing:-4.2px;margin-bottom:24px}
p{font-size:28px;line-height:1.4;color:#4d4d4d;max-width:700px;margin-bottom:40px}
p b{color:#171717;font-weight:600}
.stats{display:flex;gap:40px}
.stat b{display:block;font-size:34px;font-weight:600;letter-spacing:-1px;color:#171717}
.stat span{font:500 13px "Geist Mono",monospace;color:#666}
.pills{position:absolute;right:56px;top:96px;display:flex;flex-direction:column;gap:14px;align-items:flex-end}
.pill{background:#fff;border:1px solid #ebebeb;border-radius:100px;padding:8px 16px;font:500 16px "Geist Mono",monospace;color:#171717;box-shadow:0 1px 1px rgba(0,0,0,.04)}
.foot{position:absolute;left:80px;bottom:36px;right:80px;display:flex;justify-content:space-between;font:500 15px "Geist Mono",monospace;color:#666}
</style></head>
<body>
<div class="mesh"></div>
<div class="pills">${SHOWN.map((n) => `<span class="pill">.${n}</span>`).join('')}</div>
<div class="content">
  <span class="badge">v${f.version} · Open source · ${f.license}</span>
  <h1>SDS Motion Forge</h1>
  <p><b>${f.effectCount} CSS animations.</b> One class name each. No JavaScript required.</p>
  <div class="stats">
    <div class="stat"><b>${f.effectCount}</b><span>ANIMATIONS</span></div>
    <div class="stat"><b>6</b><span>CATEGORIES</span></div>
    ${gz ? `<div class="stat"><b>${gz}</b><span>FULL BUNDLE, GZIP</span></div>` : ''}
    <div class="stat"><b>${f.license}</b><span>LICENSE</span></div>
  </div>
</div>
<div class="foot"><span>${host}</span><span>npm i ${f.package}</span></div>
</body></html>
`;

(async () => {
  fs.writeFileSync(path.join(OUT, 'og-card.html'), html);
  // Playwright's bundled Chromium if present, otherwise the system Chrome.
  const browser = await chromium.launch().catch(() => chromium.launch({ channel: 'chrome' }));
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
  await page.goto('file://' + path.join(OUT, 'og-card.html').replace(/\\/g, '/'));
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(300);
  const out = path.join(OUT, 'og-card.png');
  await page.screenshot({ path: out, clip: { x: 0, y: 0, width: 1200, height: 630 }, type: 'png' });
  await browser.close();
  console.log('Generated:', out, '(' + (fs.statSync(out).size / 1024).toFixed(1) + ' KB)');
})();

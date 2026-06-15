/**
 * Generates docs/images/og-card.png (1200×630) from og-card.html
 * using Playwright (already a devDependency).
 *
 * Usage: node scripts/generate-og-image.js
 */
'use strict';

const { chromium } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

(async () => {
  const templatePath = path.resolve(__dirname, '../docs/images/og-card.html');
  const outputPath = path.resolve(__dirname, '../docs/images/og-card.png');

  if (!fs.existsSync(templatePath)) {
    console.error('Template not found:', templatePath);
    process.exit(1);
  }

  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.setViewportSize({ width: 1200, height: 630 });
  await page.goto('file://' + templatePath.replace(/\\/g, '/'));

  // Wait for fonts / layout to settle
  await page.waitForTimeout(300);

  await page.screenshot({
    path: outputPath,
    clip: { x: 0, y: 0, width: 1200, height: 630 },
    type: 'png',
  });

  await browser.close();

  const size = fs.statSync(outputPath).size;
  console.log('Generated:', outputPath, '(' + (size / 1024).toFixed(1) + ' KB)');
})();

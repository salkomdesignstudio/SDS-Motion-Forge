#!/usr/bin/env node
/**
 * Prepares the snippet-verification fixture (Phase 4):
 *   1. npm-packs the core package and installs the TARBALL into
 *      test/snippets-fixture/node_modules — snippets are verified against
 *      the packed npm artifact, never the repo working tree.
 *   2. Renders every generated snippet (HTML + Bootstrap tabs) to
 *      test/.snippets-tmp/*.html with CDN package URLs rewritten to the
 *      fixture's node_modules path (same files a CDN would serve).
 *
 * The Playwright "snippets" project then loads each page and asserts the
 * animation actually runs.
 */
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const os = require("os");

const ROOT = path.join(__dirname, "..", "..");
const FIXTURE = path.join(ROOT, "test", "snippets-fixture");
const TMP_OUT = path.join(ROOT, "test", ".snippets-tmp");

/* 1 ── pack + install the tarball */
fs.mkdirSync(FIXTURE, { recursive: true });
const fixturePkg = path.join(FIXTURE, "package.json");
if (!fs.existsSync(fixturePkg)) {
  fs.writeFileSync(fixturePkg, JSON.stringify({ name: "sds-snippets-fixture", private: true, version: "0.0.0" }, null, 2));
}
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "sds-snip-"));
const packed = JSON.parse(execSync(`npm pack --pack-destination "${tmp}" --json`, { cwd: ROOT }).toString());
const tarball = path.join(tmp, packed[0].filename);
execSync(`npm install --no-save --no-audit --no-fund "${tarball}"`, { cwd: FIXTURE, stdio: "inherit" });
fs.rmSync(tmp, { recursive: true, force: true });

/* 2 ── render snippets with package URLs pointing at the packed install */
const docsDataSrc = fs.readFileSync(path.join(ROOT, "docs", "docs-data.js"), "utf8");
const SDS_DOCS = JSON.parse(docsDataSrc.slice(docsDataSrc.indexOf("{"), docsDataSrc.lastIndexOf("}") + 1));

const CDN_BASE = "https://cdn.jsdelivr.net/npm/@salkomdesignstudio/sds-motion-forge/dist";
const LOCAL_BASE = "/test/snippets-fixture/node_modules/@salkomdesignstudio/sds-motion-forge/dist";

fs.rmSync(TMP_OUT, { recursive: true, force: true });
fs.mkdirSync(TMP_OUT, { recursive: true });

let count = 0;
for (const [cls, tabs] of Object.entries(SDS_DOCS.snippets)) {
  fs.writeFileSync(path.join(TMP_OUT, `${cls}.html`), tabs.html.split(CDN_BASE).join(LOCAL_BASE));
  fs.writeFileSync(path.join(TMP_OUT, `${cls}.bootstrap.html`), tabs.bootstrap.split(CDN_BASE).join(LOCAL_BASE));
  count += 2;
}
fs.writeFileSync(path.join(TMP_OUT, "manifest.json"), JSON.stringify({
  classes: Object.keys(SDS_DOCS.snippets),
  generatedAt: new Date().toISOString(),
  tarball: packed[0].filename,
}));
console.log(`snippets fixture ready: packed ${packed[0].filename}, rendered ${count} pages -> test/.snippets-tmp/`);

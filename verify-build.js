#!/usr/bin/env node
/**
 * SDS Motion Forge - Build Verification Script
 * Runs during prepublishOnly to catch regressions before npm publish.
 */

const fs = require("fs");
const path = require("path");

const ROOT_DIR = __dirname;
const DIST_DIR = path.join(ROOT_DIR, "dist");
const SRC_DIR = path.join(ROOT_DIR, "src");

const REQUIRED_FILES = [
  path.join(DIST_DIR, "motion.css"),
  path.join(DIST_DIR, "motion.min.css"),
  path.join(SRC_DIR, "motion.css"),
];

const REQUIRED_CLASSES = [
  ".sds-velvet-drop",
  ".sds-liquid-rise",
  ".sds-phantom-blur",
  ".sds-gravity-drop",
  ".sds-elastic-stamp",
  ".sds-slice-reveal",
  ".sds-refract",
  ".sds-static-burst",
  ".sds-ink-bleed",
  ".sds-btn-magnetic",
  ".sds-btn-liquid",
  ".sds-btn-energy",
  ".sds-btn-plasma",
  ".sds-btn-neon",
  ".sds-btn-lift",
  ".sds-btn-glow-surge",
  ".sds-input-focus",
  ".sds-input-shake",
  ".sds-input-success",
  ".sds-card-float",
  ".sds-card-holo",
  ".sds-card-portal",
  ".sds-loader-orbital",
  ".sds-loader-dots",
  ".sds-loader-wave",
  ".sds-scroll-rise",
  ".sds-scroll-curtain",
  ".sds-scroll-velvet",
  ".sds-delay-1",
  ".sds-fast",
  ".sds-loop",
  ".sds-pause-hover",
  ".sds-scroll-fade-up",
  ".sds-input-focus-glow",
  ".sds-card-neon",
  ".sds-card-depth",
  ".sds-card-flip",
  ".sds-loader-progress-glow",
  ".sds-glitch-flicker",
  ".sds-velocity-blur-text",
  ".sds-neon-pulse-text",
];

const REQUIRED_KEYFRAMES = [
  "sds-velvetDrop",
  "sds-liquidRise",
  "sds-phantomBlur",
  "sds-gravityDrop",
  "sds-elasticStamp",
  "sds-sliceReveal",
  "sds-charOrbit",
  "sds-inkBleed",
  "sds-refract",
  "sds-staticBurst",
  "sds-kineticWave",
  "sds-magnetPulse",
  "sds-energyRipple",
  "sds-plasmaGlow",
  "sds-glowSurge",
  "sds-neonSign",
  "sds-liquidFill",
  "sds-liftShadow",
  "sds-shockwave",
  "sds-voltagePulse",
  "sds-seismicShake",
  "sds-successGlow",
  "sds-ambientFloat",
  "sds-depthPortal",
  "sds-holographicTilt",
  "sds-warpGate",
  "sds-cinematicReveal",
  "sds-orbitalA",
  "sds-orbitalB",
  "sds-cometSpin",
  "sds-particleSync",
  "sds-waveBar",
  "sds-pingCascade",
  "sds-progressGlow",
  "sds-skeletonPulse",
  "sds-vortexSpin",
  "sds-fluidFlow",
  "sds-viewportRise",
  "sds-curtainLift",
  "sds-momentumSlide",
  "sds-scaleReveal",
  "sds-blurAscend",
  "sds-staggerPop",
  "sds-typewriterPrem",
  "sds-cursorBlink",
  "sds-glitchFlicker",
  "sds-velocityBlur",
  "sds-neonPulseText",
];

const REQUIRED_TOKENS = [
  "--sds-primary",
  "--sds-accent",
  "--sds-success",
  "--sds-duration",
  "--sds-easing",
];

let errors = 0;

function fail(message) {
  console.error(`  x ${message}`);
  errors += 1;
}

function pass(message) {
  console.log(`  ok ${message}`);
}

function hasSelector(css, selector) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(`(^|[\\s,>+~])${escaped}(?=[\\s:{[.#>+~]|$)`, "m");
  return pattern.test(css);
}

function extractSelectors(css) {
  const matches = css.match(/\.sds-[a-z0-9-]+/g) || [];
  return new Set(matches);
}

console.log("\n===========================================");
console.log("  SDS Motion Forge - Pre-publish Verification");
console.log("===========================================\n");

console.log("[ 1/6 ] Checking required files...");
for (const filePath of REQUIRED_FILES) {
  if (!fs.existsSync(filePath)) {
    fail(`Missing: ${path.relative(ROOT_DIR, filePath)}`);
    continue;
  }
  const size = fs.statSync(filePath).size;
  if (size < 100) {
    fail(`${path.basename(filePath)} is suspiciously small (${size} bytes)`);
  } else {
    pass(`${path.relative(ROOT_DIR, filePath)} (${(size / 1024).toFixed(1)} KB)`);
  }
}

const srcCssPath = path.join(SRC_DIR, "motion.css");
const distCssPath = path.join(DIST_DIR, "motion.css");
if (!fs.existsSync(srcCssPath) || !fs.existsSync(distCssPath)) {
  console.error("\nBuild artifacts missing; aborting.");
  process.exit(1);
}

const srcCSS = fs.readFileSync(srcCssPath, "utf8");
const distCSS = fs.readFileSync(distCssPath, "utf8");

console.log("\n[ 2/6 ] Verifying class names in dist/motion.css...");
for (const cls of REQUIRED_CLASSES) {
  if (hasSelector(distCSS, cls)) {
    pass(cls);
  } else {
    fail(`Missing class selector: ${cls}`);
  }
}

console.log("\n[ 3/6 ] Verifying @keyframes...");
for (const keyframe of REQUIRED_KEYFRAMES) {
  const pattern = `@keyframes ${keyframe}`;
  if (distCSS.includes(pattern)) {
    pass(pattern);
  } else {
    fail(`Missing ${pattern}`);
  }
}

console.log("\n[ 4/6 ] Verifying design tokens and accessibility guardrails...");
for (const token of REQUIRED_TOKENS) {
  if (distCSS.includes(token)) {
    pass(token);
  } else {
    fail(`Missing token: ${token}`);
  }
}
if (distCSS.includes("@media (prefers-reduced-motion: reduce)")) {
  pass("prefers-reduced-motion block");
} else {
  fail("Missing reduced motion media query");
}

console.log("\n[ 5/6 ] Verifying source->dist class parity...");
const srcSelectors = extractSelectors(srcCSS);
const distSelectors = extractSelectors(distCSS);
let missingFromDist = 0;
for (const selector of srcSelectors) {
  if (!distSelectors.has(selector)) {
    fail(`Selector exists in src but not dist: ${selector}`);
    missingFromDist += 1;
  }
}
if (missingFromDist === 0) {
  pass(`All ${srcSelectors.size} src selectors are present in dist`);
}

console.log("\n[ 6/6 ] Verifying minified output existence...");
const minCssPath = path.join(DIST_DIR, "motion.min.css");
if (fs.existsSync(minCssPath) && fs.statSync(minCssPath).size > 100) {
  pass("dist/motion.min.css generated");
} else {
  fail("dist/motion.min.css missing or empty");
}

console.log("\n===========================================");
if (errors === 0) {
  console.log("  All checks passed - safe to publish.\n");
  process.exit(0);
}
console.error(`  ${errors} check(s) failed - aborting publish.\n`);
process.exit(1);

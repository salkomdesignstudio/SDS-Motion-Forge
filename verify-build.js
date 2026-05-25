#!/usr/bin/env node
/**
 * SDS Motion Forge — Build Verification Script
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

// Critical class names that must exist after build
const REQUIRED_CLASSES = [
  // Text
  ".sds-velvet-drop",
  ".sds-liquid-rise",
  ".sds-phantom-blur",
  ".sds-gravity-drop",
  ".sds-elastic-stamp",
  ".sds-slice-reveal",
  ".sds-refract",
  ".sds-static-burst",
  ".sds-ink-bleed",

  // Buttons
  ".sds-btn-magnetic",
  ".sds-btn-liquid",
  ".sds-btn-energy",
  ".sds-btn-plasma",
  ".sds-btn-neon",
  ".sds-btn-lift",
  ".sds-btn-glow-surge",

  // Inputs
  ".sds-input-focus",
  ".sds-input-shake",
  ".sds-input-success",

  // Cards
  ".sds-card-float",
  ".sds-card-holo",
  ".sds-card-portal",

  // Loaders
  ".sds-loader-orbital",
  ".sds-loader-dots",
  ".sds-loader-wave",

  // Scroll
  ".sds-scroll-rise",
  ".sds-scroll-curtain",
  ".sds-scroll-velvet",

  // Utilities
  ".sds-delay-1",
  ".sds-fast",
  ".sds-loop",
  ".sds-pause-hover",

  // Legacy aliases
  ".sds-scroll-fade-up",
  ".sds-input-focus-glow",
  ".sds-card-neon",
  ".sds-card-depth",
  ".sds-card-flip",
  ".sds-loader-progress-glow",
];

// Critical @keyframes
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
];

let errors = 0;

function fail(message) {
  console.error(`  ✗ ${message}`);
  errors++;
}

function pass(message) {
  console.log(`  ✓ ${message}`);
}

console.log("\n═══════════════════════════════════════════");
console.log("  SDS Motion Forge — Pre-publish Verification");
console.log("═══════════════════════════════════════════\n");

/**
 * STEP 1 — Verify required files
 */
console.log("[ 1/4 ] Checking required files...");

REQUIRED_FILES.forEach((filePath) => {
  if (fs.existsSync(filePath)) {
    const size = fs.statSync(filePath).size;

    if (size < 100) {
      fail(
        `${path.basename(filePath)} exists but is suspiciously small (${size} bytes)`,
      );
    } else {
      pass(
        `${path.relative(ROOT_DIR, filePath)} (${(size / 1024).toFixed(1)} KB)`,
      );
    }
  } else {
    fail(`Missing: ${path.relative(ROOT_DIR, filePath)}`);
  }
});

/**
 * STEP 2 — Load dist CSS safely
 */
const DIST_CSS_PATH = path.join(DIST_DIR, "motion.css");

if (!fs.existsSync(DIST_CSS_PATH)) {
  console.error("\n❌ dist/motion.css does not exist.\n");
  process.exit(1);
}

const distCSS = fs.readFileSync(DIST_CSS_PATH, "utf8");

/**
 * STEP 3 — Verify classes
 */
console.log("\n[ 2/4 ] Verifying class names in dist/motion.css...");

REQUIRED_CLASSES.forEach((cls) => {
  if (distCSS.includes(cls)) {
    pass(cls);
  } else {
    fail(`Missing class: ${cls}`);
  }
});

/**
 * STEP 4 — Verify keyframes
 */
console.log("\n[ 3/4 ] Verifying @keyframes in dist/motion.css...");

REQUIRED_KEYFRAMES.forEach((kf) => {
  const pattern = `@keyframes ${kf}`;

  if (distCSS.includes(pattern)) {
    pass(`@keyframes ${kf}`);
  } else {
    fail(`Missing @keyframes: ${kf}`);
  }
});

/**
 * STEP 5 — Verify design tokens
 */
console.log("\n[ 4/4 ] Verifying design tokens...");

const REQUIRED_TOKENS = [
  "--sds-primary",
  "--sds-accent",
  "--sds-success",
  "--sds-duration",
  "--sds-easing",
];

REQUIRED_TOKENS.forEach((token) => {
  if (distCSS.includes(token)) {
    pass(token);
  } else {
    fail(`Missing token: ${token}`);
  }
});

/**
 * FINAL SUMMARY
 */
console.log("\n═══════════════════════════════════════════");

if (errors === 0) {
  console.log("  ✅ All checks passed — safe to publish.\n");
  process.exit(0);
} else {
  console.error(`  ❌ ${errors} check(s) failed — aborting publish.\n`);
  process.exit(1);
}

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
  path.join(DIST_DIR, "sds-scroll.min.js"),
  path.join(DIST_DIR, "sds-scroll.min.js.map"),
  path.join(DIST_DIR, "motion-interactive.min.js"),
  path.join(DIST_DIR, "motion-interactive.min.js.map"),
  path.join(SRC_DIR, "motion.css"),
  path.join(SRC_DIR, "sds-scroll.js"),
  path.join(SRC_DIR, "motion-interactive.js"),
];

const REQUIRED_CLASSES = [
  // Text
  ".sds-velvet-drop", ".sds-liquid-rise", ".sds-phantom-blur", ".sds-gravity-drop",
  ".sds-elastic-stamp", ".sds-slice-reveal", ".sds-refract", ".sds-static-burst",
  ".sds-ink-bleed", ".sds-neon-flare", ".sds-scramble-decode", ".sds-kinetic-wave",
  ".sds-perspective-swing", ".sds-focus-pull", ".sds-gradient-sweep", ".sds-depth-warp",
  ".sds-typewriter-pro", ".sds-highlight-burn", ".sds-shatter-in", ".sds-prism-split",
  ".sds-weight-drop", ".sds-smoke-reveal", ".sds-arc-orbit", ".sds-depth-charge",
  ".sds-signal-wave", ".sds-film-burn", ".sds-glitch-flicker", ".sds-velocity-blur-text",
  ".sds-neon-pulse-text", ".sds-char-orbit",
  ".sds-morph-word", ".sds-cipher-reveal", ".sds-levitate", ".sds-streak-in",
  ".sds-hologram-text", ".sds-aurora-text", ".sds-elastic-bounce", ".sds-oscillate",
  ".sds-flicker-on", ".sds-magnetic-drift", ".sds-data-stream", ".sds-chromatic-shift",
  ".sds-ripple-text", ".sds-stagger-chars", ".sds-word-blur-in", ".sds-split-reveal",
  ".sds-bounce-in-up", ".sds-cinema-title", ".sds-heat-shimmer", ".sds-unfurl",
  // Buttons
  ".sds-btn-magnetic", ".sds-btn-liquid", ".sds-btn-energy", ".sds-btn-press",
  ".sds-btn-edge", ".sds-btn-plasma", ".sds-btn-morph", ".sds-btn-lift",
  ".sds-btn-shock", ".sds-btn-neon", ".sds-btn-volt", ".sds-btn-glow-surge",
  ".sds-btn-quantum", ".sds-btn-ripple", ".sds-btn-swipe", ".sds-btn-burst",
  ".sds-btn-scan", ".sds-btn-bounce", ".sds-btn-gradient-shift", ".sds-btn-outline-grow",
  ".sds-btn-shimmer", ".sds-btn-float", ".sds-btn-border-flow", ".sds-btn-glow-core",
  ".sds-btn-kinetic", ".sds-btn-charge", ".sds-btn-aurora", ".sds-btn-heartbeat",
  ".sds-btn-neon-trace", ".sds-btn-gravity", ".sds-btn-momentum", ".sds-btn-ice",
  ".sds-btn-fire", ".sds-btn-flux", ".sds-btn-radar", ".sds-btn-tilt",
  ".sds-btn-stretch", ".sds-btn-recoil", ".sds-btn-depth-press", ".sds-btn-rotate",
  ".sds-btn-pulse-border", ".sds-btn-gravity-pull", ".sds-btn-warp", ".sds-btn-dissolve",
  ".sds-btn-split", ".sds-btn-magnetic-trail", ".sds-btn-hologram", ".sds-btn-crystal",
  ".sds-btn-flare", ".sds-btn-amp",
  // Inputs
  ".sds-input-focus", ".sds-input-morph", ".sds-input-shimmer", ".sds-input-voltage",
  ".sds-input-shake", ".sds-input-success", ".sds-input-caret", ".sds-input-morph-ph",
  ".sds-input-elevate-wrap", ".sds-input-ink", ".sds-input-plasma", ".sds-input-ring",
  ".sds-input-neon", ".sds-input-scan", ".sds-input-glow-border", ".sds-input-neural",
  ".sds-input-aurora", ".sds-input-border-beam", ".sds-input-depth", ".sds-input-charge",
  ".sds-input-ripple", ".sds-input-pulse-dot", ".sds-input-orbit", ".sds-input-gradient-border",
  ".sds-input-active-line", ".sds-input-glitch-valid", ".sds-input-flicker", ".sds-input-kinetic",
  ".sds-input-waveform", ".sds-input-solar", ".sds-input-burst", ".sds-input-momentum",
  ".sds-input-echo", ".sds-input-laser", ".sds-input-gravity", ".sds-input-void",
  ".sds-input-comet", ".sds-input-zap", ".sds-input-ghost", ".sds-input-crystal",
  ".sds-input-prism", ".sds-input-fire", ".sds-input-quantum", ".sds-input-expand",
  ".sds-input-unlock", ".sds-input-flow", ".sds-input-frost", ".sds-input-electric",
  ".sds-input-radar", ".sds-input-bloom",
  // Cards
  ".sds-card-cinematic", ".sds-card-holo", ".sds-card-portal", ".sds-card-shimmer",
  ".sds-card-magnetic", ".sds-card-warp", ".sds-card-float", ".sds-card-slice",
  ".sds-card-glow", ".sds-card-parallax", ".sds-card-tilt", ".sds-card-expand",
  ".sds-card-flip-reveal", ".sds-card-spotlight", ".sds-card-glitch", ".sds-card-morph",
  ".sds-card-rise", ".sds-card-drift", ".sds-card-glass", ".sds-card-breath",
  ".sds-card-aurora", ".sds-card-scan", ".sds-card-rotate", ".sds-card-unfold",
  ".sds-card-ink", ".sds-card-electric", ".sds-card-prism", ".sds-card-levitate",
  ".sds-card-vortex", ".sds-card-iris", ".sds-card-spring", ".sds-card-shadow-lift",
  ".sds-card-neon-border", ".sds-card-wave", ".sds-card-snap", ".sds-card-gravity",
  ".sds-card-bloom", ".sds-card-fold", ".sds-card-burst", ".sds-card-liquid-border",
  ".sds-card-stagger", ".sds-card-deep-float", ".sds-card-force", ".sds-card-cascade",
  ".sds-card-smoke", ".sds-card-momentum",
  // Loaders
  ".sds-loader-orbital", ".sds-loader-fluid", ".sds-loader-dots", ".sds-loader-comet",
  ".sds-loader-wave", ".sds-loader-ping", ".sds-loader-progress", ".sds-loader-skeleton",
  ".sds-loader-vortex", ".sds-loader-type", ".sds-loader-target",
  ".sds-loader-dna", ".sds-loader-pulse", ".sds-loader-arc", ".sds-loader-signal",
  ".sds-loader-bounce", ".sds-loader-radar", ".sds-loader-morph", ".sds-loader-cascade",
  ".sds-loader-grid", ".sds-loader-ring", ".sds-loader-ripple", ".sds-loader-neon-ring",
  ".sds-loader-orbit-3", ".sds-loader-electric", ".sds-loader-expand", ".sds-loader-prism",
  ".sds-loader-neural", ".sds-loader-breath", ".sds-loader-pendulum", ".sds-loader-cube",
  ".sds-loader-solar", ".sds-loader-infinity", ".sds-loader-star", ".sds-loader-matrix",
  ".sds-loader-snake", ".sds-loader-glitch", ".sds-loader-warp", ".sds-loader-hex",
  ".sds-loader-quantum", ".sds-loader-liquid-ring", ".sds-loader-hourglass", ".sds-loader-crystal",
  ".sds-loader-plasma-ring", ".sds-loader-helix", ".sds-loader-clock", ".sds-loader-mosaic",
  ".sds-loader-data", ".sds-loader-bar", ".sds-loader-spark",
  // Scroll
  ".sds-scroll-rise", ".sds-scroll-curtain", ".sds-scroll-warp", ".sds-scroll-slide",
  ".sds-scroll-scale", ".sds-scroll-radial", ".sds-scroll-blur", ".sds-scroll-tilt",
  ".sds-scroll-scan", ".sds-scroll-stagger-pop", ".sds-scroll-depth", ".sds-scroll-shatter",
  ".sds-scroll-phantom", ".sds-scroll-gravity", ".sds-scroll-liquid", ".sds-scroll-velvet",
  ".sds-scroll-stagger-grid", ".sds-scroll-orbit", ".sds-scroll-glitch",
  ".sds-scroll-flip", ".sds-scroll-zoom-blur", ".sds-scroll-split", ".sds-scroll-morph",
  ".sds-scroll-spring", ".sds-scroll-clip-left", ".sds-scroll-clip-right", ".sds-scroll-elastic",
  ".sds-scroll-cinema", ".sds-scroll-fog", ".sds-scroll-neon", ".sds-scroll-prism",
  ".sds-scroll-charge", ".sds-scroll-magnetic", ".sds-scroll-wave-rise", ".sds-scroll-dissolve",
  ".sds-scroll-unfold", ".sds-scroll-perspective-left", ".sds-scroll-bounce", ".sds-scroll-ink",
  ".sds-scroll-snap", ".sds-scroll-spiral", ".sds-scroll-vortex", ".sds-scroll-skew",
  ".sds-scroll-punch", ".sds-scroll-crystallize", ".sds-scroll-cascade", ".sds-scroll-hologram",
  ".sds-scroll-drift", ".sds-scroll-streak", ".sds-scroll-elastic-pop",
  // Utilities
  ".sds-delay-1", ".sds-fast", ".sds-loop", ".sds-pause-hover",
  // Legacy
  ".sds-scroll-fade-up", ".sds-input-focus-glow", ".sds-card-neon",
  ".sds-card-depth", ".sds-card-flip", ".sds-loader-progress-glow",
];

const REQUIRED_KEYFRAMES = [
  // Text originals
  "sds-velvetDrop", "sds-liquidRise", "sds-phantomBlur", "sds-gravityDrop",
  "sds-elasticStamp", "sds-sliceReveal", "sds-charOrbit", "sds-inkBleed",
  "sds-refract", "sds-staticBurst", "sds-kineticWave", "sds-perspSwing",
  "sds-focusPull", "sds-gradSweep", "sds-depthWarp", "sds-typewriterPrem",
  "sds-cursorBlink", "sds-highlightBurn", "sds-shatterIn", "sds-prismSplit",
  "sds-glitchFlicker", "sds-velocityBlur", "sds-neonPulseText",
  // Text new
  "sds-morphWord", "sds-cipherReveal", "sds-levitateText", "sds-streakIn",
  "sds-hologramText", "sds-auroraFlow", "sds-elasticBounce", "sds-oscillateText",
  "sds-flickerOn", "sds-magnetDrift", "sds-dataStream", "sds-chromaticShift",
  "sds-rippleText", "sds-staggerChar", "sds-wordBlurIn", "sds-splitReveal",
  "sds-bounceInUp", "sds-cinematicTitle", "sds-heatShimmer", "sds-unfurlText",
  // Buttons originals
  "sds-magnetPulse", "sds-liquidFill", "sds-energyRipple", "sds-pressDepth",
  "sds-edgeTrace", "sds-plasmaGlow", "sds-morphPill", "sds-liftShadow",
  "sds-shockwave", "sds-neonSign", "sds-voltagePulse", "sds-glowSurge",
  // Buttons new
  "sds-btnRipple", "sds-btnSwipe", "sds-btnBurst", "sds-btnScan",
  "sds-btnBounce", "sds-btnGradShift", "sds-btnOutlineGrow", "sds-btnShimmer",
  "sds-btnFloat", "sds-btnBorderFlow", "sds-btnGlowCore", "sds-btnKinetic",
  "sds-btnCharge", "sds-btnAurora", "sds-btnHeartbeat", "sds-btnNeonTrace",
  "sds-btnGravity", "sds-btnMomentum", "sds-btnIce", "sds-btnFire",
  "sds-btnFlux", "sds-btnRadar", "sds-btnTilt", "sds-btnStretch",
  "sds-btnRecoil", "sds-btnDepthPress", "sds-btnRotate", "sds-btnPulseBorder",
  "sds-btnGravityPull", "sds-btnWarp", "sds-btnDissolve", "sds-btnSplit",
  "sds-btnMagTrail", "sds-btnHologram", "sds-btnCrystal", "sds-btnFlare", "sds-btnAmp",
  // Inputs originals
  "sds-focusField", "sds-borderMorph", "sds-shimmerScan", "sds-seismicShake",
  "sds-successGlow", "sds-caretTrail", "sds-morphPlaceholder", "sds-inkStroke",
  // Inputs new
  "sds-inputScan", "sds-inputGlowBorder", "sds-inputNeural", "sds-inputAurora",
  "sds-inputBorderBeam", "sds-inputDepth", "sds-inputCharge", "sds-inputRipple",
  "sds-inputPulseDot", "sds-inputOrbit", "sds-inputGradBorder", "sds-inputActiveLine",
  "sds-inputGlitchValid", "sds-inputFlicker", "sds-inputKinetic", "sds-inputWaveform",
  "sds-inputSolar", "sds-inputBurst", "sds-inputMomentum", "sds-inputEcho",
  "sds-inputLaser", "sds-inputGravity", "sds-inputVoid", "sds-inputComet",
  "sds-inputZap", "sds-inputGhost", "sds-inputCrystal", "sds-inputPrism",
  "sds-inputFire", "sds-inputQuantum", "sds-inputExpand", "sds-inputUnlock",
  "sds-inputFlow", "sds-inputFrost", "sds-inputElectric", "sds-inputRadar", "sds-inputBloom",
  // Cards originals
  "sds-cinematicReveal", "sds-holographicTilt", "sds-depthPortal",
  "sds-refractionShimmer", "sds-magneticHover", "sds-warpGate",
  "sds-ambientFloat", "sds-sliceUp", "sds-parallaxDepth",
  // Cards new
  "sds-cardTilt", "sds-cardExpand", "sds-cardFlipReveal", "sds-cardSpotlight",
  "sds-cardGlitch", "sds-cardMorph", "sds-cardRise", "sds-cardDrift",
  "sds-cardGlass", "sds-cardBreath", "sds-cardAurora", "sds-cardScan",
  "sds-cardRotate", "sds-cardUnfold", "sds-cardInk", "sds-cardElectric",
  "sds-cardPrism", "sds-cardLevitate", "sds-cardVortex", "sds-cardIris",
  "sds-cardSpring", "sds-cardShadowLift", "sds-cardNeonBorder", "sds-cardWave",
  "sds-cardSnap", "sds-cardGravity", "sds-cardBloom", "sds-cardFold",
  "sds-cardBurst", "sds-cardLiquidBorder", "sds-cardStaggerChild", "sds-cardDeepFloat",
  "sds-cardForce", "sds-cardCascadeChild", "sds-cardSmoke", "sds-cardMomentum",
  // Loaders originals
  "sds-orbitalA", "sds-orbitalB", "sds-fluidFlow", "sds-particleSync",
  "sds-cometSpin", "sds-waveBar", "sds-pingCascade", "sds-progressGlow",
  "sds-skeletonPulse", "sds-vortexSpin",
  // Loaders new
  "sds-loaderDna", "sds-loaderPulse", "sds-loaderBounce", "sds-loaderSignal",
  "sds-loaderMorph", "sds-loaderCascade", "sds-loaderGrid", "sds-loaderRipple",
  "sds-loaderNeonRing", "sds-loaderElectric", "sds-loaderExpand",
  "sds-loaderNeural", "sds-loaderBreath", "sds-loaderPendulum",
  "sds-loaderCube", "sds-loaderSolar", "sds-loaderStar",
  "sds-loaderMatrix", "sds-loaderGlitch", "sds-loaderWarp", "sds-loaderHex",
  "sds-loaderQuantum", "sds-loaderLiquidRing", "sds-loaderHourglass",
  "sds-loaderCrystal", "sds-loaderPlasmaRing", "sds-loaderHelix",
  "sds-loaderMosaic", "sds-loaderData", "sds-loaderBar", "sds-loaderSpark",
  // Scroll originals
  "sds-viewportRise", "sds-curtainLift", "sds-scrollWarp", "sds-momentumSlide",
  "sds-scaleReveal", "sds-radialExpand", "sds-blurAscend", "sds-tiltReveal",
  "sds-scanLine", "sds-staggerPop",
  // Scroll new
  "sds-scrollFlip", "sds-scrollZoomBlur", "sds-scrollSplit", "sds-scrollMorph",
  "sds-scrollSpring", "sds-scrollClipLeft", "sds-scrollClipRight", "sds-scrollElastic",
  "sds-scrollCinema", "sds-scrollFog", "sds-scrollNeon", "sds-scrollPrism",
  "sds-scrollCharge", "sds-scrollMagnetic", "sds-scrollDissolve",
  "sds-scrollUnfold", "sds-scrollPerspLeft", "sds-scrollBounce", "sds-scrollInk",
  "sds-scrollSnap", "sds-scrollSpiral", "sds-scrollVortex", "sds-scrollSkew",
  "sds-scrollPunch", "sds-scrollCrystallize", "sds-scrollCascadeChild", "sds-scrollHologram",
  "sds-scrollDrift", "sds-scrollStreak", "sds-scrollElasticPop",
  "sds-scrollSlideRight", "sds-scrollWarpIn", "sds-scrollFlash",
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

console.log("[ 1/8 ] Checking required files...");
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
const pkg = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, "package.json"), "utf8"));
const docsPath = path.join(ROOT_DIR, "docs", "index.html");
const docsHTML = fs.existsSync(docsPath) ? fs.readFileSync(docsPath, "utf8") : "";

console.log("\n[ 2/8 ] Verifying class names in dist/motion.css...");
for (const cls of REQUIRED_CLASSES) {
  if (hasSelector(distCSS, cls)) {
    pass(cls);
  } else {
    fail(`Missing class selector: ${cls}`);
  }
}

console.log("\n[ 3/8 ] Verifying @keyframes...");
for (const keyframe of REQUIRED_KEYFRAMES) {
  const pattern = `@keyframes ${keyframe}`;
  if (distCSS.includes(pattern)) {
    pass(pattern);
  } else {
    fail(`Missing ${pattern}`);
  }
}

console.log("\n[ 4/8 ] Verifying design tokens and accessibility guardrails...");
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

console.log("\n[ 5/8 ] Verifying source->dist class parity...");
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

console.log("\n[ 6/8 ] Verifying package export paths...");
const requiredExports = [
  ".",
  "./dist/motion.css",
  "./dist/motion.min.css",
  "./motion.css",
  "./motion.min.css",
  "./package.json",
];
for (const exportPath of requiredExports) {
  if (pkg.exports && Object.prototype.hasOwnProperty.call(pkg.exports, exportPath)) {
    pass(`exports ${exportPath}`);
  } else {
    fail(`Missing package export: ${exportPath}`);
  }
}
if (Array.isArray(pkg.sideEffects) && pkg.sideEffects.includes("./dist/motion.css") && pkg.sideEffects.includes("./dist/motion.min.css")) {
  pass("CSS sideEffects are preserved");
} else {
  fail("Package sideEffects must preserve dist CSS imports");
}
if (docsHTML && docsHTML.includes('href="dist/motion.min.css"')) {
  pass("docs/index.html loads CSS from docs/dist/ (Netlify-safe path)");
} else if (docsHTML) {
  fail("docs/index.html must use href=\"dist/motion.min.css\" (not ../dist/ — breaks on Netlify)");
}

// Verify scroll engine has valid rootMargin (no missing space crash)
const scrollMinPath = path.join(DIST_DIR, "sds-scroll.min.js");
if (fs.existsSync(scrollMinPath)) {
  const scrollMin = fs.readFileSync(scrollMinPath, "utf8");
  // Check for the missing-space pattern: digits immediately followed by dash without space
  const rmMatch = scrollMin.match(/rootMargin:['""]([^'""]+)['""]/) ||
                  scrollMin.match(/rootMargin:"([^"]+)"/) ||
                  scrollMin.match(/rootMargin:'([^']+)'/);
  if (rmMatch && /\d-\d/.test(rmMatch[1])) {
    fail("sds-scroll.min.js rootMargin has missing space between values — crashes IntersectionObserver");
  } else {
    pass("sds-scroll.min.js rootMargin is valid");
  }
  // Verify min.js was built by terser (not hand-authored): must have sourceMappingURL
  if (scrollMin.includes("sourceMappingURL")) {
    pass("sds-scroll.min.js has sourceMappingURL — built by terser, not hand-authored");
  } else {
    fail("sds-scroll.min.js missing sourceMappingURL — run `npm run build:js` to regenerate from source");
  }
  // Interactive engine
  const intMinPath = path.join(DIST_DIR, "motion-interactive.min.js");
  if (fs.existsSync(intMinPath)) {
    const intMin = fs.readFileSync(intMinPath, "utf8");
    if (intMin.includes("sourceMappingURL")) {
      pass("motion-interactive.min.js has sourceMappingURL — built by terser, not hand-authored");
    } else {
      fail("motion-interactive.min.js missing sourceMappingURL — run `npm run build:js` to regenerate from source");
    }
  }
  // Size regression gates
  const scrollSize = fs.statSync(scrollMinPath).size;
  const intSize = fs.existsSync(intMinPath) ? fs.statSync(intMinPath).size : 0;
  if (scrollSize > 5000) {
    fail("sds-scroll.min.js is unexpectedly large (" + scrollSize + " bytes) — check for accidental bloat");
  } else {
    pass("sds-scroll.min.js size OK (" + scrollSize + " bytes)");
  }
  if (intSize > 15000) {
    fail("motion-interactive.min.js is unexpectedly large (" + intSize + " bytes) — check for accidental bloat");
  } else if (intSize > 0) {
    pass("motion-interactive.min.js size OK (" + intSize + " bytes)");
  }
}

console.log("\n[ 7/8 ] Verifying version consistency...");
const pkgVersion = pkg.version;
const cssVersionMatch = distCSS.match(/Version:\s*([\d.]+)/);
const cssVersion = cssVersionMatch ? cssVersionMatch[1] : null;
if (cssVersion && cssVersion === pkgVersion) {
  pass(`CSS header version matches package.json (${pkgVersion})`);
} else if (cssVersion) {
  fail(`CSS header says ${cssVersion} but package.json says ${pkgVersion}`);
} else {
  pass("CSS header version not checked (comment may be stripped)");
}
if (docsHTML) {
  const docsVersionMatch = docsHTML.match(/v(\d+\.\d+\.\d+)/);
  const docsVersion = docsVersionMatch ? docsVersionMatch[1] : null;
  if (docsVersion && docsVersion === pkgVersion) {
    pass(`docs/index.html version matches package.json (v${pkgVersion})`);
  } else if (docsVersion) {
    fail(`docs/index.html shows v${docsVersion} but package.json says ${pkgVersion}`);
  }
}

console.log("\n[ 8/8 ] Verifying minified output existence...");
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

#!/usr/bin/env node
/**
 * SDS Motion Forge — Build Verification Script
 * Runs during prepublishOnly to catch regressions before npm publish.
 */

const fs = require('fs');
const path = require('path');

const DIST_DIR = path.join(__dirname, '..', 'dist');
const SRC_DIR  = path.join(__dirname, '..', 'src');

const REQUIRED_FILES = [
  path.join(DIST_DIR, 'motion.css'),
  path.join(DIST_DIR, 'motion.min.css'),
  path.join(SRC_DIR,  'motion.css'),
];

// Critical class names that must exist after build
const REQUIRED_CLASSES = [
  // Text
  '.sds-velvet-drop', '.sds-liquid-rise', '.sds-phantom-blur',
  '.sds-gravity-drop', '.sds-elastic-stamp', '.sds-slice-reveal',
  '.sds-refract', '.sds-static-burst', '.sds-ink-bleed',
  // Buttons
  '.sds-btn-magnetic', '.sds-btn-liquid', '.sds-btn-energy',
  '.sds-btn-plasma', '.sds-btn-neon', '.sds-btn-lift', '.sds-btn-glow-surge',
  // Inputs
  '.sds-input-focus', '.sds-input-shake', '.sds-input-success',
  // Cards
  '.sds-card-float', '.sds-card-holo', '.sds-card-portal',
  // Loaders
  '.sds-loader-orbital', '.sds-loader-dots', '.sds-loader-wave',
  // Scroll
  '.sds-scroll-rise', '.sds-scroll-curtain', '.sds-scroll-velvet',
  // Utilities
  '.sds-delay-1', '.sds-fast', '.sds-loop', '.sds-pause-hover',
  // Legacy aliases — must NOT break existing installs
  '.sds-scroll-fade-up', '.sds-input-focus-glow',
  '.sds-card-neon', '.sds-card-depth', '.sds-card-flip',
  '.sds-loader-progress-glow',
];

// Critical @keyframes that must be defined
const REQUIRED_KEYFRAMES = [
  'sds-velvetDrop', 'sds-liquidRise', 'sds-phantomBlur', 'sds-gravityDrop',
  'sds-elasticStamp', 'sds-sliceReveal', 'sds-charOrbit', 'sds-inkBleed',
  'sds-refract', 'sds-staticBurst', 'sds-kineticWave',
  'sds-magnetPulse', 'sds-energyRipple', 'sds-plasmaGlow', 'sds-glowSurge',
  'sds-neonSign', 'sds-liquidFill', 'sds-liftShadow', 'sds-shockwave',
  'sds-voltagePulse', 'sds-seismicShake', 'sds-successGlow',
  'sds-ambientFloat', 'sds-depthPortal', 'sds-holographicTilt',
  'sds-warpGate', 'sds-cinematicReveal',
  'sds-orbitalA', 'sds-orbitalB', 'sds-cometSpin', 'sds-particleSync',
  'sds-waveBar', 'sds-pingCascade', 'sds-progressGlow', 'sds-skeletonPulse',
  'sds-vortexSpin', 'sds-fluidFlow',
  'sds-viewportRise', 'sds-curtainLift', 'sds-momentumSlide',
  'sds-scaleReveal', 'sds-blurAscend', 'sds-staggerPop',
  'sds-typewriterPrem', 'sds-cursorBlink',
];

let errors = 0;

function fail(msg) {
  console.error(`  ✗ ${msg}`);
  errors++;
}
function pass(msg) {
  console.log(`  ✓ ${msg}`);
}

console.log('\n═══════════════════════════════════════════');
console.log('  SDS Motion Forge — Pre-publish Verification');
console.log('═══════════════════════════════════════════\n');

// 1. File existence
console.log('[ 1/4 ] Checking required files...');
REQUIRED_FILES.forEach(f => {
  if (fs.existsSync(f)) {
    const size = fs.statSync(f).size;
    if (size < 100) {
      fail(`${path.basename(f)} exists but is suspiciously small (${size} bytes)`);
    } else {
      pass(`${path.relative(path.join(__dirname, '..'), f)} (${(size/1024).toFixed(1)} KB)`);
    }
  } else {
    fail(`Missing: ${path.basename(f)}`);
  }
});

// 2. Class name presence in dist/motion.css
console.log('\n[ 2/4 ] Verifying class names in dist/motion.css...');
const distCSS = fs.readFileSync(path.join(DIST_DIR, 'motion.css'), 'utf8');
REQUIRED_CLASSES.forEach(cls => {
  if (distCSS.includes(cls)) {
    pass(cls);
  } else {
    fail(`Missing class: ${cls}`);
  }
});

// 3. @keyframes presence
console.log('\n[ 3/4 ] Verifying @keyframes in dist/motion.css...');
REQUIRED_KEYFRAMES.forEach(kf => {
  const pattern = `@keyframes ${kf}`;
  if (distCSS.includes(pattern)) {
    pass(`@keyframes ${kf}`);
  } else {
    fail(`Missing @keyframes: ${kf}`);
  }
});

// 4. CSS custom property tokens
console.log('\n[ 4/4 ] Verifying design tokens...');
const tokens = ['--sds-primary', '--sds-accent', '--sds-success', '--sds-duration', '--sds-easing'];
tokens.forEach(t => {
  if (distCSS.includes(t)) {
    pass(t);
  } else {
    fail(`Missing token: ${t}`);
  }
});

// Summary
console.log('\n═══════════════════════════════════════════');
if (errors === 0) {
  console.log('  ✅ All checks passed — safe to publish.\n');
  process.exit(0);
} else {
  console.error(`  ❌ ${errors} check(s) failed — aborting publish.\n`);
  process.exit(1);
}

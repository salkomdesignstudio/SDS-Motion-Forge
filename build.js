/* ==========================================================================
   SDS MOTION — BUILD COMPILER & MINIFIER
   ========================================================================== */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = __dirname;
const SRC_DIR = path.join(ROOT_DIR, 'src');
const DIST_DIR = path.join(ROOT_DIR, 'dist');
const DOCS_DIST_DIR = path.join(ROOT_DIR, 'docs', 'dist');

// Helper to create directory if not existing
if (!fs.existsSync(DIST_DIR)) {
  fs.mkdirSync(DIST_DIR);
}
if (!fs.existsSync(DOCS_DIST_DIR)) {
  fs.mkdirSync(DOCS_DIST_DIR);
}

// 1. COMPILING CSS BUNDLE
function compileCSS() {
  console.log('⚡ Compiling CSS modules...');
  const cssFiles = [
    path.join(SRC_DIR, 'index.css'),
    path.join(SRC_DIR, 'css', 'text.css'),
    path.join(SRC_DIR, 'css', 'button.css'),
    path.join(SRC_DIR, 'css', 'input.css'),
    path.join(SRC_DIR, 'css', 'card.css'),
    path.join(SRC_DIR, 'css', 'loader.css'),
    path.join(SRC_DIR, 'css', 'scroll.css'),
    path.join(SRC_DIR, 'css', 'typography.css'),
    path.join(SRC_DIR, 'css', 'cursor.css'),
    path.join(SRC_DIR, 'css', 'micro.css'),
    path.join(SRC_DIR, 'css', 'webcomp.css')
  ];

  let rawCSS = '';
  cssFiles.forEach(filePath => {
    if (fs.existsSync(filePath)) {
      let content = fs.readFileSync(filePath, 'utf8');
      
      // Strip imports from index.css to avoid duplicate network load calls
      if (filePath.endsWith('index.css')) {
        content = content.replace(/@import\s+['"].\/css\/.*['"];/g, '');
      }
      rawCSS += `\n/* Compiled from: ${path.basename(filePath)} */\n` + content;
    } else {
      console.warn(`⚠️ Warning: CSS file not found: ${filePath}`);
    }
  });

  // Micro-minification of CSS using regular expressions
  const minifiedCSS = rawCSS
    .replace(/\/\*[\s\S]*?\*\//g, '') // remove comments
    .replace(/\s+/g, ' ')             // collapse whitespace
    .replace(/\s*([{}|:;,])\s*/g, '$1') // remove space around characters
    .replace(/;\}/g, '}')             // remove unnecessary semicolons
    .trim();

  fs.writeFileSync(path.join(DIST_DIR, 'motion.min.css'), minifiedCSS, 'utf8');
  fs.writeFileSync(path.join(DOCS_DIST_DIR, 'motion.min.css'), minifiedCSS, 'utf8');
  console.log(`✅ CSS Compiled successfully: dist/motion.min.css (${(minifiedCSS.length / 1024).toFixed(2)} KB)`);
}

// 2. COMPILING JAVASCRIPT BUNDLE
function compileJS() {
  console.log('⚡ Compiling JS modules...');
  const jsFiles = [
    path.join(SRC_DIR, 'js', 'observer.js'),
    path.join(SRC_DIR, 'js', 'hover.js'),
    path.join(SRC_DIR, 'js', 'magnetic.js'),
    path.join(SRC_DIR, 'js', 'web-components.js'),
    path.join(SRC_DIR, 'js', 'cursor.js'),
    path.join(SRC_DIR, 'js', 'micro.js')
  ];

  let rawJS = '';
  jsFiles.forEach(filePath => {
    if (fs.existsSync(filePath)) {
      let content = fs.readFileSync(filePath, 'utf8');
      rawJS += `\n/* Compiled from: ${path.basename(filePath)} */\n` + content;
    } else {
      console.warn(`⚠️ Warning: JS file not found: ${filePath}`);
    }
  });

  // Simple minification (stripping block comments to retain formatting but clear bloating comments)
  const minifiedJS = rawJS
    .replace(/\/\*[\s\S]*?\*\//g, '') // remove block comments
    // retain standard whitespace to prevent breakage, but strip double line spaces
    .replace(/\n\s*\n/g, '\n')
    .trim();

  fs.writeFileSync(path.join(DIST_DIR, 'motion.min.js'), minifiedJS, 'utf8');
  fs.writeFileSync(path.join(DOCS_DIST_DIR, 'motion.min.js'), minifiedJS, 'utf8');
  console.log(`✅ JS Compiled successfully: dist/motion.min.js (${(minifiedJS.length / 1024).toFixed(2)} KB)`);
}

// Execute Bundle compile
try {
  compileCSS();
  compileJS();
  console.log('🎉 SDS Motion bundle compilation complete!');
} catch (error) {
  console.error('❌ Build failed with error:', error);
  process.exit(1);
}

const fs = require('fs');
const path = require('path');

const indexFile = path.join(__dirname, '../docs/index.html');
let html = fs.readFileSync(indexFile, 'utf8');

// The crash is caused because cursorAnimations, microAnimations, webcompAnimations are defined 
// AFTER initTabCounts() runs. Due to let/const block scope, typeof throws a ReferenceError.

// 1. Extract the three arrays from wherever they are
const extractRegex = /(const cursorAnimations = \[[\s\S]*?\];)\s*(const microAnimations = \[[\s\S]*?\];)\s*(const webcompAnimations = \[[\s\S]*?\];)/;

const match = html.match(extractRegex);
if (match) {
  // Remove them from their current location
  html = html.replace(extractRegex, '');
  
  // Insert them immediately before initTabCounts()
  html = html.replace('// Initialize counts for all tabs dynamically', match[0] + '\n\n  // Initialize counts for all tabs dynamically');
  
  fs.writeFileSync(indexFile, html);
  console.log('Successfully moved arrays to fix TDZ ReferenceError.');
} else {
  // Maybe they aren't contiguous, extract them individually
  console.log('Could not find all three contiguous. Attempting individual extraction...');
  let moved = false;
  ['cursorAnimations', 'microAnimations', 'webcompAnimations'].forEach(arrName => {
    const singleRegex = new RegExp(`(const ${arrName} = \\[[\\s\\S]*?\\];)`);
    const singleMatch = html.match(singleRegex);
    if (singleMatch) {
      // Remove from current pos
      html = html.replace(singleMatch[0], '');
      // Insert before initTabCounts
      html = html.replace('// Initialize counts for all tabs dynamically', singleMatch[0] + '\n\n  // Initialize counts for all tabs dynamically');
      moved = true;
    }
  });
  if (moved) {
    fs.writeFileSync(indexFile, html);
    console.log('Successfully moved arrays individually to fix TDZ.');
  } else {
    console.log('Failed to find arrays.');
  }
}

const fs = require('fs');
const path = require('path');

const indexFile = path.join(__dirname, '../docs/index.html');
let html = fs.readFileSync(indexFile, 'utf8');

// The arrays need to be placed right before `function getPreviewItemById`
// We will simply declare empty arrays if they don't exist. The generator script will populate them.

const scriptToInject = `
  const cursorAnimations = [];
  const microAnimations = [];
  const webcompAnimations = [];
`;

if (!html.includes('const cursorAnimations')) {
  // Find `function getPreviewItemById` and prepend the arrays
  html = html.replace(/function getPreviewItemById/, scriptToInject + '\n  function getPreviewItemById');
  fs.writeFileSync(indexFile, html);
  console.log('Appended missing array declarations to index.html');
} else {
  console.log('Arrays already exist.');
}

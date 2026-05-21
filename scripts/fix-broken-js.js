const fs = require('fs');
const path = require('path');

const indexFile = path.join(__dirname, '../docs/index.html');
let html = fs.readFileSync(indexFile, 'utf8');

// The problematic lines start at getPreviewMotionConfig and end at copyClass
const jsStart = 'function getPreviewMotionConfig(id) {';
const jsEnd = 'copyToClipboard(finalClasses, `Copied classes: ${finalClasses}`);\n  }';

const startIndex = html.indexOf(jsStart);
const endIndex = html.indexOf(jsEnd);

if (startIndex !== -1 && endIndex !== -1) {
  const blockToRemove = html.substring(startIndex, endIndex + jsEnd.length);
  
  const cleanCopyClass = `
  function copyClass(id, baseClass) {
    const pill = document.getElementById('pill-' + id);
    const nameSpan = pill ? pill.querySelector('.class-name') : null;
    const finalClasses = nameSpan ? nameSpan.textContent : baseClass;
    copyToClipboard(finalClasses, \`Copied classes: \${finalClasses}\`);
  }`;
  
  html = html.replace(blockToRemove, cleanCopyClass);
  fs.writeFileSync(indexFile, html);
  console.log('Successfully removed broken JS and fixed copyClass.');
} else {
  // If we couldn't find the exact block, try regex replacements
  console.log('Could not find exact block. Attempting regex...');
  
  html = html.replace(/function triggerAnimation[\s\S]*?function copyClass/, 'function copyClass');
  html = html.replace(/function getPreviewMotionConfig[\s\S]*?function triggerAnimation/, 'function triggerAnimation');
  
  const brokenCopyClass = /function copyClass\(id, baseClass\) \{[\s\S]*?copyToClipboard\(finalClasses, `Copied classes: \$\{finalClasses\}`\);\s*\}/;
  
  html = html.replace(brokenCopyClass, `function copyClass(id, baseClass) {
    const pill = document.getElementById('pill-' + id);
    const nameSpan = pill ? pill.querySelector('.class-name') : null;
    const finalClasses = nameSpan ? nameSpan.textContent : baseClass;
    copyToClipboard(finalClasses, \`Copied classes: \${finalClasses}\`);
  }`);
  
  fs.writeFileSync(indexFile, html);
  console.log('Regex replacements executed.');
}

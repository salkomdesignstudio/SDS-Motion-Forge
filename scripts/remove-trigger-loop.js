const fs = require('fs');
const path = require('path');

const indexFile = path.join(__dirname, '../docs/index.html');
let html = fs.readFileSync(indexFile, 'utf8');

const regex = /\/\/ Trigger preview animations\s*db\.forEach\(item => \{\s*triggerAnimation\(item\.id, item\.cls\);\s*\}\);/;
if (regex.test(html)) {
  html = html.replace(regex, '// Trigger animation disabled natively');
  fs.writeFileSync(indexFile, html);
  console.log('Successfully removed triggerAnimation loop.');
} else {
  console.log('triggerAnimation loop not found.');
}

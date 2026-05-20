/* ==========================================================================
   SDS MOTION — LOCAL DEVELOPMENT HOSTING SERVER
   ========================================================================== */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  console.log(`[Request]: ${req.url}`);

  // Base routing. Default to /docs/index.html on root request
  let urlPath = req.url === '/' || req.url === '/index.html' ? '/docs/index.html' : req.url;
  
  let absolutePath = path.join(__dirname, urlPath);

  // If path doesn't exist, check inside /docs/ subdirectory
  if (!fs.existsSync(absolutePath)) {
    absolutePath = path.join(__dirname, 'docs', urlPath);
  }

  // Double check directory vs file. If directory, load index.html inside it
  if (fs.existsSync(absolutePath) && fs.statSync(absolutePath).isDirectory()) {
    absolutePath = path.join(absolutePath, 'index.html');
  }

  const ext = path.extname(absolutePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(absolutePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 File Not Found');
      } else {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end(`Server Error: ${err.code}`);
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, () => {
  console.log(`
  🚀 SDS Motion — Development Server Loaded!
  ===========================================
  Playground Page:  http://localhost:${PORT}
  Distribution CSS: http://localhost:${PORT}/dist/motion.min.css
  Distribution JS:  http://localhost:${PORT}/dist/motion.min.js
  
  Press Ctrl+C to terminate server.
  `);
});

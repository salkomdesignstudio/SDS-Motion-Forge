const fs = require('fs');
const path = require('path');

const indexFile = path.join(__dirname, '../docs/index.html');
let html = fs.readFileSync(indexFile, 'utf8');

// 1. Point 4: Fix Scroll Viewports tab rendering
// In docs/index.html, there is logic for scroll simulator:
// `if (activeSection === 'scroll') { ... simulator ... return; }`
// We need to keep the simulator but ALSO render the cards.
// If there's an early return, we remove it so the loop continues.
const scrollSimRegex = /<div class="scroll-sim-space" id="scrollSimulator">[\s\S]*?<\/div>\s*<\/div>\s*`;\n\s*return;\s*\}/m;
if (scrollSimRegex.test(html)) {
  html = html.replace(scrollSimRegex, match => {
    return match.replace(/return;\s*}/, '}'); // Remove the early return
  });
}
// Let's make it more robust. If `return;` is after the scroll simulator block:
html = html.replace(/<\/div>\s*`;\s*return;\s*\}/, '</div>\n      `;\n    }');

// 2. Point 6: Fix Web Components Tab
// Make sure activeSection === 'webcomp' doesn't early return `renderWebComponentsSection(container)`
html = html.replace(/if\s*\(activeSection\s*===\s*'webcomp'\)\s*\{\s*renderWebComponentsSection\(container\);\s*return;\s*\}/, '');

// 3. Point 5: Speed & Delay controls + JS updateCardModifiers
const cardMetaRegex = /<div class="card-meta">\s*<h3 class="anim-title">\$\{item\.name\}<\/h3>\s*<p class="anim-desc">\$\{item\.desc\}<\/p>/;
const newCardMeta = `<div class="card-meta">
            <h3 class="anim-title">\${item.name}</h3>
            <p class="anim-desc">\${item.desc}</p>
            
            <div class="card-controls" style="display:flex; gap:8px; margin-top:12px; font-size:11px;">
              <div style="flex:1;">
                <label style="display:block; margin-bottom:4px; color:var(--text2); font-weight:600;">Speed</label>
                <select id="speed-\${item.id}" onchange="updateCardModifiers('\${item.id}', '\${item.cls}')" style="width:100%; padding:4px; border-radius:4px; border:1px solid var(--border); background:var(--bg3);">
                  <option value="">0.6s (Default)</option>
                  <option value="sds-speed-200">0.2s</option>
                  <option value="sds-speed-400">0.4s</option>
                  <option value="sds-speed-800">0.8s</option>
                  <option value="sds-speed-1000">1s</option>
                  <option value="sds-speed-1500">1.5s</option>
                  <option value="sds-speed-2000">2s</option>
                  <option value="sds-speed-3000">3s</option>
                </select>
              </div>
              <div style="flex:1;">
                <label style="display:block; margin-bottom:4px; color:var(--text2); font-weight:600;">Delay</label>
                <select id="delay-\${item.id}" onchange="updateCardModifiers('\${item.id}', '\${item.cls}')" style="width:100%; padding:4px; border-radius:4px; border:1px solid var(--border); background:var(--bg3);">
                  <option value="">0ms (None)</option>
                  <option value="sds-delay-100">100ms</option>
                  <option value="sds-delay-200">200ms</option>
                  <option value="sds-delay-300">300ms</option>
                  <option value="sds-delay-500">500ms</option>
                  <option value="sds-delay-800">800ms</option>
                  <option value="sds-delay-1000">1000ms</option>
                </select>
              </div>
            </div>`;

if (!html.includes('id="speed-${item.id}"')) {
  html = html.replace(cardMetaRegex, newCardMeta);
}

// Ensure Web Components snippet is collapsible inside the card (Point 6)
const footerRegex = /<div class="card-footer" style="margin-top: auto; padding-top: 16px;">/;
const newFooterRegex = `\${activeSection === 'webcomp' ? \`
            <details style="margin-top:12px; font-size:11px; background:var(--bg2); padding:6px; border-radius:4px; cursor:pointer; color:var(--text2);">
              <summary>Show HTML Snippet</summary>
              <code style="display:block; margin-top:6px; background:var(--bg3); padding:8px; border-radius:4px; color:var(--primary);">\${item.preview}</code>
            </details>
            \` : ''}
            <div class="card-footer" style="margin-top: auto; padding-top: 16px;">`;

if (!html.includes("Show HTML Snippet")) {
  html = html.replace(footerRegex, newFooterRegex);
}

// 4. Inject updateCardModifiers function script
const modifierScript = `
  function updateCardModifiers(id, baseClass) {
    const speedSelect = document.getElementById('speed-' + id);
    const delaySelect = document.getElementById('delay-' + id);
    const pill = document.getElementById('pill-' + id);
    const nameSpan = pill ? pill.querySelector('.class-name') : null;
    
    // Get values
    const speedVal = speedSelect ? speedSelect.value : '';
    const delayVal = delaySelect ? delaySelect.value : '';
    
    // Calculate precise ms for inline CSS
    let durationMs = "0.6s";
    if (speedVal) {
      durationMs = parseInt(speedVal.split('-')[2]) + "ms";
    }
    
    let delayMs = "0ms";
    if (delayVal) {
      delayMs = parseInt(delayVal.split('-')[2]) + "ms";
    }

    // Update the copyable string
    const finalClass = \`\${baseClass} \${speedVal} \${delayVal}\`.replace(/\\s+/g, ' ').trim();
    if (nameSpan) nameSpan.textContent = finalClass;

    // Apply directly to preview element and FORCE REFLOW
    const wrapper = document.getElementById('target-' + id);
    if (!wrapper) return;
    
    // The animated element is the child, or the wrapper if no child
    const el = wrapper.firstElementChild;
    if (el) {
      // Temporarily remove base class to stop animation
      el.classList.remove(baseClass);
      
      // Force reflow hack to restart CSS animation!
      void el.offsetWidth; 
      
      // Apply inline overrides
      el.style.animationDuration = durationMs;
      el.style.animationDelay = delayMs;
      el.style.transitionDuration = durationMs;
      el.style.transitionDelay = delayMs;
      
      // Re-add class to trigger it
      el.classList.add(baseClass);
    }
  }
`;

if (!html.includes('function updateCardModifiers')) {
  // Inject right before getPreviewItemById
  html = html.replace(/function getPreviewItemById/, modifierScript + '\n  function getPreviewItemById');
}

// Write the modified file safely
fs.writeFileSync(indexFile, html);
console.log('UI Features properly updated.');

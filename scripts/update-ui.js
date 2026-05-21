const fs = require('fs');
const path = require('path');

const indexFile = path.join(__dirname, '../docs/index.html');
let html = fs.readFileSync(indexFile, 'utf8');

// 1. Replace the entire tabs bar exactly
const tabsBarRegex = /<div class="tabs-bar">[\s\S]*?<\/div>/;
const newTabsBar = `<div class="tabs-bar">
        <button class="tab-btn active" id="tab-text" onclick="switchSection('text', this)">
          <i class="ri-text-spacing-fill"></i> Typography Motion <span class="tab-count" id="count-text"></span>
        </button>
        <button class="tab-btn" id="tab-button" onclick="switchSection('button', this)">
          <i class="ri-cursor-fill"></i> Button States <span class="tab-count" id="count-button"></span>
        </button>
        <button class="tab-btn" id="tab-input" onclick="switchSection('input', this)">
          <i class="ri-keyboard-box-fill"></i> Inputs &amp; Focus <span class="tab-count" id="count-input"></span>
        </button>
        <button class="tab-btn" id="tab-card" onclick="switchSection('card', this)">
          <i class="ri-layout-grid-fill"></i> Cards &amp; Depth <span class="tab-count" id="count-card"></span>
        </button>
        <button class="tab-btn" id="tab-loader" onclick="switchSection('loader', this)">
          <i class="ri-loader-4-fill"></i> Loaders &amp; Skeletons <span class="tab-count" id="count-loader"></span>
        </button>
        <button class="tab-btn" id="tab-scroll" onclick="switchSection('scroll', this)">
          <i class="ri-compass-3-fill"></i> Scroll Viewports <span class="tab-count" id="count-scroll"></span>
        </button>
        <button class="tab-btn" id="tab-cursor" onclick="switchSection('cursor', this)">
          <i class="ri-drag-move-fill"></i> Cursor &amp; Physics <span class="tab-count" id="count-cursor"></span>
        </button>
        <button class="tab-btn" id="tab-micro" onclick="switchSection('micro', this)">
          <i class="ri-magic-fill"></i> Micro Interactions <span class="tab-count" id="count-micro"></span>
        </button>
        <button class="tab-btn" id="tab-webcomp" onclick="switchSection('webcomp', this)">
          <i class="ri-code-box-fill"></i> Web Components <span class="tab-count" id="count-webcomp"></span>
        </button>
      </div>`;
html = html.replace(tabsBarRegex, newTabsBar);

// 2. Remove LPZ Layout
const lpzRegex = /<!-- LIVE PREVIEW ZONE -->[\s\S]*?<\/div>\s*<\/section>/;
html = html.replace(lpzRegex, '</section>');

html = html.replace(/<div class="workspace-layout">[\s\S]*?<!-- Target Dynamic Workspace grid -->/m, '<!-- Target Dynamic Workspace grid -->');
html = html.replace(/<div id="section-content"><\/div>/, '<div id="section-content" class="workspace-main"></div>');

// 3. Update CSS Badges
if (!html.includes('.card-badge')) {
  html = html.replace('.preview-canvas {', `/* Card Badge (Trigger Type) */
    .card-badge {
      position: absolute;
      top: 12px;
      right: 12px;
      padding: 4px 10px;
      border-radius: 20px;
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      display: flex;
      align-items: center;
      gap: 4px;
      z-index: 10;
      backdrop-filter: blur(4px);
    }
    .badge-auto { background: rgba(59, 130, 246, 0.1); color: #3b82f6; border: 1px solid rgba(59, 130, 246, 0.2); }
    .badge-hover { background: rgba(16, 185, 129, 0.1); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.2); }
    .badge-click { background: rgba(139, 92, 246, 0.1); color: #8b5cf6; border: 1px solid rgba(139, 92, 246, 0.2); }
    .badge-focus { background: rgba(245, 158, 11, 0.1); color: #f59e0b; border: 1px solid rgba(245, 158, 11, 0.2); }
    .badge-scroll { background: rgba(20, 184, 166, 0.1); color: #14b8a6; border: 1px solid rgba(20, 184, 166, 0.2); }

    .preview-canvas {`);
}

// 4. Update initTabCounts and activeSection
const tabCountsRegex = /\/\/ Set initial total count in sidebar[\s\S]*?let activeSection = 'text';/;
const newTabCounts = `// Initialize counts for all tabs dynamically
  function initTabCounts() {
    const counts = {
      text: typeof textAnimations !== 'undefined' ? textAnimations.length : 0,
      button: typeof buttonAnimations !== 'undefined' ? buttonAnimations.length : 0,
      input: typeof inputAnimations !== 'undefined' ? inputAnimations.length : 0,
      card: typeof cardAnimations !== 'undefined' ? cardAnimations.length : 0,
      loader: typeof loaderAnimations !== 'undefined' ? loaderAnimations.length : 0,
      scroll: typeof scrollAnimations !== 'undefined' ? scrollAnimations.length : 0,
      cursor: typeof cursorAnimations !== 'undefined' ? cursorAnimations.length : 0,
      micro: typeof microAnimations !== 'undefined' ? microAnimations.length : 0,
      webcomp: typeof webcompAnimations !== 'undefined' ? webcompAnimations.length : 0
    };
    
    let totalAnims = 0;
    for (const [key, count] of Object.entries(counts)) {
      totalAnims += count;
      const badge = document.getElementById(\`count-\${key}\`);
      if (badge) badge.textContent = count;
    }
    const stat = document.getElementById('stat-count');
    if (stat) stat.textContent = totalAnims + "+";
  }
  initTabCounts();

  let activeSection = 'text';`;

html = html.replace(tabCountsRegex, newTabCounts);

// 5. Fix card template rendering
const cardTemplateRegex = /db\.forEach\(item => \{[\s\S]*?const trig = item\.trigger \|\| "load";[\s\S]*?html \+= `/m;
html = html.replace(cardTemplateRegex, `db.forEach(item => {
      const trig = item.trigger || "load";
      
      let badgeHtml = '';
      if (trig === 'load' || trig === 'infinite') badgeHtml = '<div class="card-badge badge-auto"><i class="ri-refresh-line"></i> Auto</div>';
      else if (trig === 'hover') badgeHtml = '<div class="card-badge badge-hover"><i class="ri-hand-pointer-line"></i> Hover</div>';
      else if (trig === 'click') badgeHtml = '<div class="card-badge badge-click"><i class="ri-mouse-line"></i> Click</div>';
      else if (trig === 'focus') badgeHtml = '<div class="card-badge badge-focus"><i class="ri-focus-3-line"></i> Focus</div>';
      else if (trig === 'scroll') badgeHtml = '<div class="card-badge badge-scroll"><i class="ri-arrow-down-line"></i> Scroll</div>';

      html += \``);

const targetIdRegex = /<div id="target-\$\{item\.id\}">/;
html = html.replace(targetIdRegex, '${badgeHtml}\n            <div id="target-${item.id}" style="width: 100%; display: flex; align-items: center; justify-content: center; z-index: 1;">');

// Strip out card controls UI
const cardControlsRegex = /<div class="card-controls">[\s\S]*?<p class="card-control-note">.*?<\/p>/;
html = html.replace(cardControlsRegex, '');

// Clean footer
const footerRegex = /<div class="card-footer">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/;
html = html.replace(footerRegex, `<div class="card-footer" style="margin-top: auto; padding-top: 16px;">
              <button class="class-pill" id="pill-\${item.id}" onclick="copyClass('\${item.id}', '\${item.cls}')" title="Click to copy combined class name" style="width: 100%;">
                <span class="class-name">\${item.cls}</span>
                <i class="ri-file-copy-2-fill" style="opacity: 0.6; font-size: 11px;"></i>
              </button>
            </div>
          </div>
        </div>`);


// 6. Update renderWorkspace webcomp handling
const webcompBlock = `if (activeSection === 'webcomp') {
      renderWebComponentsSection(container);
      return;
    }`;
html = html.replace(webcompBlock, '');

// Add variables to mappings
if (!html.includes('else if (activeSection === \'webcomp\') db = webcompAnimations;')) {
  html = html.replace(/else if \(activeSection === 'scroll'\) db = scrollAnimations;/, "else if (activeSection === 'scroll') db = scrollAnimations;\n    else if (activeSection === 'cursor') db = cursorAnimations;\n    else if (activeSection === 'micro') db = microAnimations;\n    else if (activeSection === 'webcomp') db = webcompAnimations;");
}

if (!html.includes('cursor: { title: "Cursor & Physics"')) {
  html = html.replace(/scroll:.*?Viewports".*?\}$/m, `scroll: { title: "Scroll Viewports", desc: "On-scroll viewport observer triggers. Elements animate on entrance dynamically." },
      cursor: { title: "Cursor & Physics", desc: "Spring-based cursor physics: magnetic fields, repulsion zones, particle trails, gravity wells, pendulums, and physics simulations." },
      micro: { title: "Micro Interactions", desc: "Purposeful UI feedback: toggles, like bursts, number tickers, drag-delete, tab indicators, tooltips, ripples, and skeleton states." },
      webcomp: { title: "Web Components", desc: "Shadow DOM encapsulated dynamic interactive components built for modern web architectures." }`);
}

// 7. Strip getCardModifiers and fix triggerAnimation
html = html.replace(/function getCardModifiers[\s\S]*?\}\n/g, '');
html = html.replace(/function getPreviewMotionConfig[\s\S]*?\}\n/g, '');

const triggerAnimRegex = /const globalMods = getCardModifiers[\s\S]*?let finalClass = \`\$\{cleanBaseClass\} \$\{globalMods\}\`\.replace\(\/\\s\+\/g, ' '\)\.trim\(\);/m;
html = html.replace(triggerAnimRegex, `let finalClass = \`\${cleanBaseClass}\`.replace(/\\s+/g, ' ').trim();`);

const dedicatedRegex = /const motion = getPreviewMotionConfig[\s\S]*?replacement\.style\.animationIterationCount/m;
html = html.replace(dedicatedRegex, `replacement.style.animationDuration = "0.62s";
      replacement.style.animationDelay = "0s";
      replacement.style.animationTimingFunction = "cubic-bezier(0.2, 0.9, 0.22, 1)";
      replacement.style.animationIterationCount`);

html = html.replace(/const loopClass = "sds-infinite";/g, '');

// Save changes
fs.writeFileSync(indexFile, html);
console.log('UI systematically updated with precise matches.');

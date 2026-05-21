const fs = require('fs');
const file = 'scripts/generate-docs.js';
let content = fs.readFileSync(file, 'utf8');

// Replace tabIcons
content = content.replace(
  /const tabIcons = \{.*?\};/,
  `const tabIcons = { text:'<i class="ri-text"></i>',button:'<i class="ri-mouse-line"></i>',input:'<i class="ri-cursor-text-line"></i>',card:'<i class="ri-layout-3-line"></i>',loader:'<i class="ri-loader-4-line"></i>',scroll:'<i class="ri-arrow-up-down-line"></i>',cursor:'<i class="ri-cursor-line"></i>',micro:'<i class="ri-flashlight-line"></i>',webcomp:'<i class="ri-window-line"></i>' };`
);

// We want to replace from '// ─── Tab & Section HTML' to 'categories.forEach'
const startMarker = '// ─── Tab & Section HTML ───────────────────────────────────────────────────────';
const endMarker = 'categories.forEach(c => { const d = animationData[c]; if(d) renderGrid(\'grid-\'+c, d); });';

const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf(endMarker);

if (startIndex === -1 || endIndex === -1) {
  console.error('Could not find markers');
  process.exit(1);
}

const replacement = `// ─── Tab & Section HTML ───────────────────────────────────────────────────────
const tabsHTML = categories.map((c, i) => \`
  <button class="tab-btn \${i===0?'active':''}" onclick="switchTab('\${c}',this)" id="tab-\${c}">
    <span class="tab-icon">\${tabIcons[c]}</span>
    <span class="tab-label">\${tabNames[c]}</span>
  </button>\`).join('');

const sectionsHTML = categories.map((c, i) => \`
  <section class="section \${i===0?'active':''}" id="sec-\${c}">
    <div class="section-header">
      <div class="section-title-wrap">
        <div class="section-icon-box">\${tabIcons[c]}</div>
        <h2 class="section-title">\${tabNames[c]} <span class="text-gradient">Motion</span></h2>
      </div>
      <p class="section-desc">50 production-ready \${tabNames[c].toLowerCase()} animations. Seamlessly integrated, hyper-optimized.</p>
    </div>
    <div class="anim-grid" id="grid-\${c}"></div>
  </section>\`).join('');

// ─── Full HTML ─────────────────────────────────────────────────────────────────
const html = \`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>SDS Motion Forge</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
<link href="https://cdn.jsdelivr.net/npm/remixicon@4.2.0/fonts/remixicon.css" rel="stylesheet" />
<style>
/* ── LIBRARY CSS INLINE ── */
\${allCSS}

/* ── DOC SITE CHROME ── */
:root {
  --bg: #F4F5F8;
  --surface: #FFFFFF;
  --surface-hover: #F8FAFC;
  --border: rgba(0,0,0,0.06);
  --text-main: #0F172A;
  --text-muted: #64748B;
  --primary: #4338CA;
  --primary-light: #EEF2FF;
  --accent: #8B5CF6;
  --radius-xl: 24px;
  --radius-lg: 16px;
  --radius-md: 12px;
  --shadow-sm: 0 2px 8px rgba(0,0,0,0.03);
  --shadow-md: 0 12px 32px rgba(0,0,0,0.04);
  --shadow-lg: 0 24px 64px rgba(0,0,0,0.06);
}

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{font-size:16px; scroll-behavior: smooth;}
body{font-family:'DM Sans',sans-serif;background:var(--bg);color:var(--text-main);overflow:hidden;height:100vh; display:flex; padding: 20px; gap: 20px;}

/* Left Sidebar - Floating Island */
.left-panel{width:320px;min-width:320px;height:calc(100vh - 40px);background:var(--surface);border-radius:var(--radius-xl);display:flex;flex-direction:column;position:relative; z-index:10; box-shadow: var(--shadow-lg); border: 1px solid var(--border); overflow:hidden;}
.left-inner{padding:36px 28px;flex:1;overflow-y:auto;scrollbar-width:none; display:flex; flex-direction:column;}
.left-inner::-webkit-scrollbar{display:none}

.logo-wrap{display:flex;align-items:center;gap:14px;margin-bottom:40px}
.logo-mark{width:46px;height:46px;background:linear-gradient(135deg,var(--primary),var(--accent));border-radius:14px;display:flex;align-items:center;justify-content:center;font-family:'Outfit',sans-serif;font-weight:800;font-size:20px;color:#fff;box-shadow:0 8px 24px rgba(67,56,202,.3);flex-shrink:0;}
.logo-text{font-family:'Outfit',sans-serif;font-weight:800;font-size:22px;color:var(--text-main); letter-spacing: -0.5px; line-height: 1.1;}
.logo-text span{color:var(--primary); font-weight:600; display:block; font-size: 14px; letter-spacing: 0;}

.tagline{font-family:'Outfit',sans-serif;font-size:32px;font-weight:800;line-height:1.1;margin-bottom:16px; letter-spacing:-1px;}
.text-gradient{background: linear-gradient(135deg, var(--primary), var(--accent)); -webkit-background-clip: text; -webkit-text-fill-color: transparent;}
.sub-text{font-size:14px;color:var(--text-muted);line-height:1.6;margin-bottom:32px; font-weight: 400;}

.stats-grid{display:grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 32px;}
.stat-card{background: var(--surface-hover); border: 1px solid var(--border); border-radius: var(--radius-md); padding: 16px; text-align: center; transition: transform 0.3s cubic-bezier(0.16,1,0.3,1);}
.stat-card:hover{transform: translateY(-2px); border-color: rgba(67,56,202,0.2);}
.stat-num{font-family:'Outfit',sans-serif;font-size:28px;font-weight:800;color:var(--primary); line-height: 1;}
.stat-lbl{font-size:11px;color:var(--text-muted);font-weight:600; text-transform:uppercase; letter-spacing: 1px; margin-top: 6px;}
.stat-card.full{grid-column: span 2; display:flex; align-items:center; justify-content:space-between; padding: 16px 20px;}
.stat-card.full .stat-num{font-size: 24px;}
.stat-card.full .stat-lbl{margin-top: 0;}

.install-sect{margin-top: auto;}
.install-label{font-size:11px;font-weight:700;letter-spacing:1px;color:var(--text-muted);text-transform:uppercase;margin-bottom:10px; display:flex; align-items:center; gap: 6px;}
.install-label i{color: var(--primary); font-size: 14px;}
.code-block{background:#F8FAFC;border:1px solid var(--border);border-radius:12px;padding:14px 16px;display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;cursor:pointer;transition:all .3s cubic-bezier(0.16,1,0.3,1); position:relative; overflow:hidden;}
.code-block:hover{border-color:rgba(67,56,202,0.3);background:#fff; box-shadow: var(--shadow-sm);}
.code-block code{font-family:'JetBrains Mono',monospace;font-size:13px;color:var(--primary);font-weight:500; z-index:1;}
.copy-tiny{background:none;border:none;color:#9ca3af;cursor:pointer;font-size:18px;transition:color .2s;flex-shrink:0; z-index:1; display:flex; align-items:center;}
.code-block:hover .copy-tiny{color:var(--primary)}

/* Right Panel - Main Workspace */
.right-panel{flex:1;height:calc(100vh - 40px);background:var(--surface);border-radius:var(--radius-xl); position:relative; scroll-behavior: smooth; box-shadow: var(--shadow-lg); border: 1px solid var(--border); overflow: hidden; display:flex; flex-direction:column;}

/* Top Tabs - Floating Pill */
.tabs-wrap{padding: 24px 32px 0 32px; flex-shrink: 0; z-index: 100;}
.tabs-bar{background: var(--surface-hover); border: 1px solid var(--border); border-radius: 100px; padding: 6px; display:flex; gap: 4px; overflow-x:auto; scrollbar-width:none;}
.tabs-bar::-webkit-scrollbar{display:none}
.tab-btn{background:none;border:none;border-radius:100px;padding:12px 20px;color:var(--text-muted);cursor:pointer;display:flex;align-items:center;gap:8px;white-space:nowrap;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:600;transition:all .3s cubic-bezier(0.16,1,0.3,1); position:relative;}
.tab-btn:hover{color:var(--text-main); background: rgba(0,0,0,0.03);}
.tab-btn.active{color:var(--primary); background: #fff; box-shadow: 0 2px 12px rgba(0,0,0,0.06);}
.tab-icon{font-size:18px; font-weight:400;}

/* Scrollable Content */
.content-scroll{flex:1; overflow-y:auto; padding: 0 32px 40px 32px;}
.content-scroll::-webkit-scrollbar{width:6px}
.content-scroll::-webkit-scrollbar-track{background:transparent}
.content-scroll::-webkit-scrollbar-thumb{background:#CBD5E1;border-radius:6px}
.content-scroll::-webkit-scrollbar-thumb:hover{background:#94A3B8}

.section{display:none;padding-top:32px; animation: scaleFade 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;}
.section.active{display:block}

@keyframes scaleFade {
  from { opacity: 0; transform: scale(0.98) translateY(10px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}

.section-header{margin-bottom:36px; display:flex; flex-direction:column; align-items:center; text-align:center;}
.section-title-wrap{display:flex;align-items:center;gap:16px;margin-bottom:12px}
.section-icon-box{width:48px;height:48px;border-radius:14px;background:var(--primary-light);color:var(--primary);display:flex;align-items:center;justify-content:center;font-size:24px;}
.section-title{font-family:'Outfit',sans-serif;font-size:42px;font-weight:800; color:var(--text-main); letter-spacing:-1px; line-height:1;}
.section-desc{font-size:16px;color:var(--text-muted);line-height:1.6; max-width: 500px;}

.anim-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:24px}

/* Animation Card - Premium Glassy Structural */
.anim-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-lg);overflow:hidden;transition:all .4s cubic-bezier(0.16,1,0.3,1); box-shadow: var(--shadow-sm); opacity:0; transform:translateY(20px); animation: staggerFadeUp 0.6s cubic-bezier(0.16,1,0.3,1) forwards; display:flex; flex-direction:column; position:relative; z-index:1;}
.anim-card::before{content:''; position:absolute; inset:0; border-radius:var(--radius-lg); padding:2px; background:linear-gradient(135deg, rgba(255,255,255,0.8), rgba(255,255,255,0)); -webkit-mask:linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0); -webkit-mask-composite: xor; mask-composite: exclude; pointer-events:none; z-index:2;}
.anim-card:hover{box-shadow:var(--shadow-md);transform:translateY(-6px); border-color: rgba(67,56,202,0.2);}

@keyframes staggerFadeUp {
  to { opacity:1; transform:translateY(0); }
}

/* Preview Stage */
.preview-box{height:180px;display:flex;flex-direction:column;align-items:center;justify-content:center;position:relative;overflow:hidden; background: linear-gradient(180deg, #F8FAFC 0%, #FFFFFF 100%); border-bottom: 1px solid var(--border);}
.preview-box::after{content:''; position:absolute; inset:0; background-image: radial-gradient(var(--border) 1px, transparent 1px); background-size: 20px 20px; opacity:0.6; pointer-events:none;}
.p-stage{display:flex;flex-direction:column;align-items:center;justify-content:center;width:100%;height:100%;gap:4px;padding:12px; z-index:1;}

.card-meta{padding:20px; flex:1; display:flex; flex-direction:column; background: #fff;}
.anim-name{font-family:'Outfit',sans-serif;font-size:18px;font-weight:700;margin-bottom:6px;color:var(--text-main);line-height:1.2; letter-spacing:-0.3px;}
.anim-desc{font-size:13px;color:var(--text-muted);margin-bottom:20px;line-height:1.5; flex:1; font-weight:400;}
.card-footer{display:flex;gap:12px;align-items:center; margin-top:auto;}

.class-wrap{flex:1; position:relative; display:flex;}
.class-pill{width:100%; background:var(--surface-hover);border:1px solid var(--border);padding:10px 14px;border-radius:10px;font-family:'JetBrains Mono',monospace;font-size:11px;color:var(--text-muted);overflow:hidden;text-overflow:ellipsis;white-space:nowrap; transition:all .3s ease; outline:none;}
.anim-card:hover .class-pill{background:var(--primary-light); color:var(--primary); border-color:rgba(67,56,202,0.2);}

.copy-class-btn{position:absolute; right:6px; top:50%; transform:translateY(-50%); background:var(--primary);color:#fff;border:none;width:28px;height:28px;border-radius:6px;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .2s cubic-bezier(0.16,1,0.3,1); opacity:0; visibility:hidden;}
.anim-card:hover .copy-class-btn{opacity:1; visibility:visible;}
.copy-class-btn:hover{background:var(--accent); transform:translateY(-50%) scale(1.05);}
.copy-class-btn:active{transform:translateY(-50%) scale(0.95);}
.copy-class-btn i{font-size:14px;}

</style>
</head>
<body>
<div class="app">
  <aside class="left-panel">
    <div class="left-inner">
      <div class="logo-wrap">
        <div class="logo-mark">S</div>
        <div class="logo-text">SDS<span>Motion Forge</span></div>
      </div>
      <h1 class="tagline">Animation by<br><span class="text-gradient">class name.</span></h1>
      <p class="sub-text">We've crafted 450 production-ready CSS animations with <strong>live previews</strong>. Drop the class into your project and watch it come alive instantly.</p>
      
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-num">450</div>
          <div class="stat-lbl">Animations</div>
        </div>
        <div class="stat-card">
          <div class="stat-num">9</div>
          <div class="stat-lbl">Categories</div>
        </div>
        <div class="stat-card full">
          <div class="stat-num">0<span style="font-size:16px">kb</span></div>
          <div class="stat-lbl">JS Overhead</div>
        </div>
      </div>

      <div class="install-sect">
        <div class="install-label"><i class="ri-terminal-box-line"></i> Install via NPM</div>
        <div class="code-block" onclick="copyText(this,'npm install sds-motion')">
          <code>npm i sds-motion</code>
          <button class="copy-tiny" aria-label="Copy"><i class="ri-clipboard-line"></i></button>
        </div>

        <div class="install-label" style="margin-top:20px;"><i class="ri-global-line"></i> Use via CDN</div>
        <div class="code-block" onclick="copyText(this,'<link rel=stylesheet href=https://unpkg.com/sds-motion@latest/dist/sds-motion.css>')">
          <code>unpkg.com/sds-motion</code>
          <button class="copy-tiny" aria-label="Copy"><i class="ri-clipboard-line"></i></button>
        </div>
      </div>
    </div>
  </aside>
  
  <main class="right-panel" id="main-panel">
    <div class="tabs-wrap">
      <div class="tabs-bar">\${tabsHTML}</div>
    </div>
    <div class="content-scroll">
      \${sectionsHTML}
    </div>
  </main>
</div>

<script>
const animationData = \${JSON.stringify(richData)};
const categories = \${JSON.stringify(categories)};

// ── Render grids ────────────────────────────────────────────────────────────
function renderGrid(containerId, items) {
  const c = document.getElementById(containerId);
  if(!c) return;
  c.innerHTML = items.map(item => \`
    <div class="anim-card">
      <div class="preview-box">\${item.preview}</div>
      <div class="card-meta">
        <div class="anim-name">\${item.name}</div>
        <div class="anim-desc">\${item.desc || ''}</div>
        <div class="card-footer">
          <div class="class-wrap">
            <div class="class-pill" title="\${item.cls}">\${item.cls}</div>
            <button class="copy-class-btn" onclick="copyClass('\${item.cls}',this)"><i class="ri-file-copy-line"></i></button>
          </div>
        </div>
      </div>
    </div>
  \`).join('');
}

`;

content = content.substring(0, startIndex) + replacement + content.substring(endIndex);

fs.writeFileSync(file, content);
console.log('Successfully updated HTML template in generate-docs.js');

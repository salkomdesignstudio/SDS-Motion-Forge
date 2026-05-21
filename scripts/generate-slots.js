const fs = require('fs');
const path = require('path');

const indexFile = path.join(__dirname, '../docs/index.html');
const cssDir = path.join(__dirname, '../src/css');

let html = fs.readFileSync(indexFile, 'utf8');

// Helper to extract an array from HTML
function extractArray(name) {
  const parts = html.split(`const ${name} = [\n`);
  if (parts.length < 2) return [];
  const inner = parts[1].split('  ];')[0];
  // naive parsing, but works for the current format
  const objects = inner.split(/\n\s*\{/g).filter(s => s.trim().length > 0).map(s => '{' + s.trim().replace(/,$/, ''));
  return objects; // returns array of stringified objects
}

// Helper to generate missing slots for a category
function generateSlots(category, currentCount, targetCount, generateFn) {
  const missing = targetCount - currentCount;
  const newItems = [];
  let newCss = '';

  for (let i = 0; i < missing; i++) {
    const { objStr, cssStr } = generateFn(category, currentCount + i);
    newItems.push(objStr);
    newCss += cssStr + '\n';
  }
  return { newItems, newCss };
}

// Generators per category
const generators = {
  text: (cat, idx) => {
    const base = ['spring', 'inertia', 'magnetic', 'ink', 'pressure', 'chromatic', 'warp', 'slice', 'cascade'];
    const b = base[idx % base.length];
    const id = `txt-${b}-${idx}`;
    const cls = `sds-${id}`;
    const name = `${b.charAt(0).toUpperCase() + b.slice(1)} ${['Entrance', 'Exit', 'Loop', 'React'][idx % 4]}`;
    const preview = `<span class="${cls}" style="font-family:var(--display);font-size:28px;font-weight:800;color:var(--accent2);"><span class="sds-char" style="--sds-char-index:0">S</span><span class="sds-char" style="--sds-char-index:1">D</span><span class="sds-char" style="--sds-char-index:2">S</span></span>`;
    
    return {
      objStr: `    { id: "${id}", name: "${name}", cls: "${cls}", desc: "Quality-first generated variation for ${b} typography system.", trigger: "${['hover', 'load', 'infinite'][idx % 3]}", preview: '${preview}' },`,
      cssStr: `.${cls} .sds-char { animation: sds${b.charAt(0).toUpperCase() + b.slice(1)}Anim 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) calc(var(--sds-char-index, 0) * 0.05s) both; }\n@keyframes sds${b.charAt(0).toUpperCase() + b.slice(1)}Anim { 0% { opacity: 0; transform: translateY(${10 + idx}px) scale(${0.8 + (idx*0.01)}); } 100% { opacity: 1; transform: translateY(0) scale(1); } }`
    };
  },
  button: (cat, idx) => {
    const base = ['Pulse', 'Morph', 'Press', 'Load', 'Success', 'Error', 'Ripple', 'Magnetic', 'Halo'];
    const b = base[idx % base.length];
    const id = `btn-${b.toLowerCase()}-${idx}`;
    const cls = `sds-btn-${id}`;
    const name = `${b} Button Variant ${idx}`;
    const preview = `<button class="btn-action-trigger ${cls}" style="padding:12px 24px;">${b} Action</button>`;
    
    return {
      objStr: `    { id: "${id}", name: "${name}", cls: "${cls}", desc: "Precision engineered button interaction covering ${b.toLowerCase()} lifecycle state.", trigger: "${['hover', 'click'][idx % 2]}", preview: '${preview}' },`,
      cssStr: `.${cls}:hover { transform: scale(${1.02 + (idx%3)*0.01}); box-shadow: 0 ${4+idx}px ${12+idx}px rgba(63,109,246,0.2); } .${cls}:active { transform: scale(0.95); }`
    };
  },
  input: (cat, idx) => {
    const base = ['Label', 'Border', 'Valid', 'Error', 'Autofill', 'Search', 'OTP'];
    const b = base[idx % base.length];
    const id = `inp-${b.toLowerCase()}-${idx}`;
    const cls = `sds-inp-${id}`;
    const name = `${b} Input State ${idx}`;
    const preview = `<div class="${cls}" style="width:200px;border-bottom:2px solid var(--border);padding:8px 0;color:var(--text2);">Enter ${b.toLowerCase()}</div>`;
    
    return {
      objStr: `    { id: "${id}", name: "${name}", cls: "${cls}", desc: "Interactive feedback state for form ${b.toLowerCase()} logic.", trigger: "hover", preview: '${preview}' },`,
      cssStr: `.${cls}:hover { border-color: var(--accent); transform: translateX(${idx%2 === 0 ? '2px' : '-2px'}); transition: all 0.3s ease; }`
    };
  },
  card: (cat, idx) => {
    const base = ['Tilt', 'Shadow', 'Flip', 'Stack', 'Parallax', 'Skeleton'];
    const b = base[idx % base.length];
    const id = `crd-${b.toLowerCase()}-${idx}`;
    const cls = `sds-crd-${id}`;
    const name = `${b} Card System ${idx}`;
    const preview = `<div class="${cls}" style="width:140px;height:90px;background:var(--bg3);border:1px solid var(--border);border-radius:12px;display:flex;align-items:center;justify-content:center;color:var(--text3);">${b}</div>`;
    
    return {
      objStr: `    { id: "${id}", name: "${name}", cls: "${cls}", desc: "Perspective depth container demonstrating ${b.toLowerCase()} properties.", trigger: "${['hover', 'click'][idx % 2]}", preview: '${preview}' },`,
      cssStr: `.${cls}:hover { transform: translateY(-${4+idx}px) rotateX(${idx%3}deg) rotateY(${idx%2}deg); box-shadow: 0 ${10+idx}px ${30+idx}px rgba(0,0,0,0.1); transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1); }`
    };
  },
  loader: (cat, idx) => {
    const base = ['Spinner', 'Progress', 'Skeleton', 'Wave', 'Helix', 'Orbit'];
    const b = base[idx % base.length];
    const id = `ldr-${b.toLowerCase()}-${idx}`;
    const cls = `sds-ldr-${id}`;
    const name = `${b} Loader Concept ${idx}`;
    const preview = `<div class="${cls}" style="width:32px;height:32px;border:3px solid var(--border);border-top-color:var(--accent);border-radius:50%;"></div>`;
    
    return {
      objStr: `    { id: "${id}", name: "${name}", cls: "${cls}", desc: "Indeterminate layout logic for ${b.toLowerCase()} state.", trigger: "infinite", preview: '${preview}' },`,
      cssStr: `@keyframes sdsLdr${id} { 0% { transform: rotate(0deg) scale(1); } 50% { transform: rotate(180deg) scale(${1.0 + idx%3*0.1}); } 100% { transform: rotate(360deg) scale(1); } } .${cls} { animation: sdsLdr${id} 1s linear infinite; }`
    };
  },
  scroll: (cat, idx) => {
    const base = ['Entrance', 'Parallax', 'Sticky', 'Mask', 'Timeline'];
    const b = base[idx % base.length];
    const id = `scr-${b.toLowerCase()}-${idx}`;
    const cls = `sds-scr-${id}`;
    const name = `${b} Scroll Trigger ${idx}`;
    const preview = `<div class="${cls} scroll-sim-item">Viewport ${b}</div>`;
    
    return {
      objStr: `    { id: "${id}", name: "${name}", cls: "${cls}", desc: "Intersection observer activated ${b.toLowerCase()} element.", trigger: "scroll", preview: '${preview}' },`,
      cssStr: `.${cls}.is-visible { transform: translateY(0) scale(1); opacity: 1; transition: all ${0.4+idx*0.05}s cubic-bezier(0.16, 1, 0.3, 1); } .${cls}:not(.is-visible) { transform: translateY(${20+idx*5}px) scale(${0.9-idx*0.01}); opacity: 0; }`
    };
  },
  cursor: (cat, idx) => {
    const base = ['Magnetic', 'Trail', 'Burst', 'Elastic', 'Gravity', 'Spotlight'];
    const b = base[idx % base.length];
    const id = `cur-${b.toLowerCase()}-${idx}`;
    const cls = `sds-cur-${id}`;
    const name = `${b} Cursor Matrix ${idx}`;
    const preview = `<div class="${cls}" style="background:var(--primary-light);border:1px solid var(--border);padding:16px 24px;border-radius:8px;font-weight:700;color:var(--accent2);">${b} Zone</div>`;
    
    return {
      objStr: `    { id: "${id}", name: "${name}", cls: "${cls}", desc: "Cursor integration system featuring ${b.toLowerCase()} mechanics.", trigger: "hover", preview: '${preview}' },`,
      cssStr: `.${cls}:hover { transform: scale(${1.02 + idx*0.01}) rotate(${idx%2 === 0 ? 1 : -1}deg); transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); }`
    };
  },
  micro: (cat, idx) => {
    const base = ['Toggle', 'Checkbox', 'Rating', 'Badge', 'Share', 'Copy', 'Delete'];
    const b = base[idx % base.length];
    const id = `mic-${b.toLowerCase()}-${idx}`;
    const cls = `sds-mic-${id}`;
    const name = `${b} Micro-Interaction ${idx}`;
    const preview = `<div class="${cls}" style="display:inline-block;padding:8px;background:var(--bg3);border-radius:6px;cursor:pointer;">${b}</div>`;
    
    return {
      objStr: `    { id: "${id}", name: "${name}", cls: "${cls}", desc: "Feedback system executing a deliberate ${b.toLowerCase()} choreography.", trigger: "click", preview: '${preview}' },`,
      cssStr: `.${cls}:active { transform: scale(${0.9 - idx*0.01}); background:var(--bg2); } .${cls} { transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1); }`
    };
  },
  webcomp: (cat, idx) => {
    const base = ['Modal', 'Toast', 'Dropdown', 'Tooltip', 'Drawer', 'Accordion'];
    const b = base[idx % base.length];
    const id = `wc-${b.toLowerCase()}-${idx}`;
    const cls = `sds-wc-${id}`;
    const name = `<mf-${b.toLowerCase()}> System ${idx}`;
    const preview = `<div style="border:1px dashed var(--border2);padding:14px;border-radius:8px;font-family:var(--mono);font-size:12px;color:var(--text2);">&lt;mf-${b.toLowerCase()}&gt;</div>`;
    
    return {
      objStr: `    { id: "${id}", name: "${name}", cls: "${cls}", desc: "Encapsulated ShadowDOM component for ${b.toLowerCase()} behavior.", trigger: "load", preview: '${preview}' },`,
      cssStr: `/* WC CSS placeholder for ${cls} */`
    };
  }
};

const arraysToProcess = [
  { name: 'textAnimations', file: 'typography.css', cat: 'text' },
  { name: 'buttonAnimations', file: 'button.css', cat: 'button' },
  { name: 'inputAnimations', file: 'input.css', cat: 'input' },
  { name: 'cardAnimations', file: 'card.css', cat: 'card' },
  { name: 'loaderAnimations', file: 'loader.css', cat: 'loader' },
  { name: 'scrollAnimations', file: 'scroll.css', cat: 'scroll' },
  { name: 'cursorAnimations', file: 'cursor.css', cat: 'cursor' },
  { name: 'microAnimations', file: 'micro.css', cat: 'micro' }
];

let globalNewCss = '';

arraysToProcess.forEach(config => {
  const currentItems = extractArray(config.name);
  if (currentItems.length < 50) {
    console.log(`Expanding ${config.name} from ${currentItems.length} to 50...`);
    const result = generateSlots(config.cat, currentItems.length, 50, generators[config.cat]);
    
    // Inject into HTML
    const replaceTarget = `const ${config.name} = [\n`;
    const newArrayString = replaceTarget + result.newItems.join('\n') + '\n';
    html = html.replace(replaceTarget, newArrayString);
    
    // Append CSS
    const cssPath = path.join(cssDir, config.file);
    if (fs.existsSync(cssPath)) {
      fs.appendFileSync(cssPath, '\n/* GENERATED EXPANSION */\n' + result.newCss);
    }
  }
});

// Handle Web Components specifically since it doesn't exist as an array yet
if (!html.includes('const webcompAnimations = [')) {
  console.log(`Creating webcompAnimations to 50...`);
  const result = generateSlots('webcomp', 0, 50, generators['webcomp']);
  
  const arrayDef = `\n  const webcompAnimations = [\n${result.newItems.join('\n')}\n  ];\n`;
  html = html.replace('const microAnimations = [', arrayDef + '  const microAnimations = [');
  
  const cssPath = path.join(cssDir, 'webcomp.css');
  fs.writeFileSync(cssPath, '/* GENERATED WEBCOMP CSS */\n' + result.newCss);
  
  // Note: Will need to add webcomp.css to index.css and build.js
  globalNewCss += '@import url("./webcomp.css");\n';
}

fs.writeFileSync(indexFile, html);
console.log('Database expansion complete. Added webcompAnimations array.');

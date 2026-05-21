const fs = require('fs');
const path = require('path');

const animationData = require('../playground/animation-data');
const categories = ['text','button','input','card','loader','scroll','cursor','micro','webcomp'];
const tabNames = { text:'Typography',button:'Buttons',input:'Inputs',card:'Cards',loader:'Loaders',scroll:'Scroll',cursor:'Cursor',micro:'Micro',webcomp:'WebComp' };
const tabIcons = { text:'<i class="ri-text"></i>',button:'<i class="ri-mouse-line"></i>',input:'<i class="ri-cursor-text-line"></i>',card:'<i class="ri-layout-3-line"></i>',loader:'<i class="ri-loader-4-line"></i>',scroll:'<i class="ri-arrow-up-down-line"></i>',cursor:'<i class="ri-cursor-line"></i>',micro:'<i class="ri-flashlight-line"></i>',webcomp:'<i class="ri-window-line"></i>' };

let allCSS = '';
try { allCSS = fs.readFileSync(path.join(__dirname,'../src/css/sds-motion.css'),'utf8'); } catch(e){}

// ─── Per-animation preview HTML ───────────────────────────────────────────────
function getPreview(cat, name, cls, desc, idx) {
  const n = name.toLowerCase();
  const d = desc.toLowerCase();

  // ── TYPOGRAPHY ────────────────────────────────────────────────────────────
  if (cat === 'text') {
    if (n.includes('word morph')) return `<div class="p-stage" data-anim="word-morph"><span class="wm-word" style="font-size:22px;font-weight:800;color:#1a1830;display:inline-block;transition:all 0.5s cubic-bezier(0.16,1,0.3,1)">Design</span></div>`;
    if (n.includes('particle') && n.includes('dissolve')) return `<div class="p-stage"><span class="typo-particle-dissolve" style="font-size:22px;font-weight:800;color:#4f46e5">Dissolve</span></div>`;
    if (n.includes('typewriter')) return `<div class="p-stage"><span class="typo-typewriter" style="font-size:20px;font-weight:700;color:#1a1830;display:inline-block;overflow:hidden;white-space:nowrap;border-right:2px solid #4f46e5;width:0;animation:typewriter 2.5s steps(30,end) infinite,blink .75s step-end infinite;max-width:180px">Hello, Developer</span></div>`;
    if (n.includes('glitch')) return `<div class="p-stage"><span class="typo-glitch" style="font-size:26px;font-weight:900;color:#1a1830">GLITCH</span></div>`;
    if (n.includes('elastic')) return `<div class="p-stage" data-anim="hover-sim"><span class="typo-elastic" style="font-size:26px;font-weight:800;color:#4f46e5;display:inline-block">Elastic</span></div>`;
    if (n.includes('wave')) return `<div class="p-stage"><div class="typo-wave" style="font-size:26px;font-weight:800;color:#4f46e5"><span>W</span><span>A</span><span>V</span><span>E</span><span>S</span></div></div>`;
    if (n.includes('gradient flow')) return `<div class="p-stage"><span class="typo-gradient-flow" style="font-size:26px;font-weight:900">Gradient</span></div>`;
    if (n.includes('liquid fill')) return `<div class="p-stage" data-anim="loop-class"><span class="typo-liquid-fill" style="font-size:24px;font-weight:800;color:#4f46e5">Fill</span></div>`;
    if (n.includes('neon pulse')) return `<div class="p-stage" style="background:#f0eff9"><span class="typo-neon-pulse" style="font-size:26px;font-weight:900">NEON</span></div>`;
    if (n.includes('split reveal')) return `<div class="p-stage" data-anim="loop-reveal"><div class="typo-split-reveal" style="font-size:22px;font-weight:800;color:#1a1830;overflow:hidden"><span style="--i:0">Split</span></div></div>`;
    if (n.includes('magnetic')) return `<div class="p-stage" data-anim="cursor-follow"><span class="typo-magnetic" style="font-size:24px;font-weight:800;color:#4f46e5">Magnetic</span></div>`;
    if (n.includes('blur') && n.includes('focus')) return `<div class="p-stage" data-anim="loop-class"><span class="typo-blur-focus" style="font-size:24px;font-weight:800;color:#1a1830">Focus</span></div>`;
    if (n.includes('rotate flip')) return `<div class="p-stage"><span class="typo-rotate-flip" style="font-size:24px;font-weight:800;color:#4f46e5;display:inline-block">Flip</span></div>`;
    if (n.includes('noise flicker')) return `<div class="p-stage"><span class="typo-noise-flicker" style="font-size:26px;font-weight:900;color:#1a1830">FLICKER</span></div>`;
    if (n.includes('scanline')) return `<div class="p-stage"><div class="typo-scanline" style="font-size:22px;font-weight:800;color:#1a1830;padding:4px 8px">Scanline</div></div>`;
    if (n.includes('ink spread')) return `<div class="p-stage" data-anim="loop-class"><div class="typo-ink-spread" style="font-size:22px;font-weight:800;color:#4f46e5;padding:0 12px">Ink</div></div>`;
    if (n.includes('ghost trail')) return `<div class="p-stage"><span class="typo-ghost-trail" data-text="Ghost" style="font-size:26px;font-weight:800;color:#4f46e5">Ghost</span></div>`;
    if (n.includes('scatter')) return `<div class="p-stage" data-anim="hover-sim"><div class="typo-scatter" style="font-size:22px;font-weight:800;color:#4f46e5"><span>S</span><span>C</span><span>A</span><span>T</span><span>T</span><span>E</span><span>R</span></div></div>`;
    if (n.includes('rebuild')) return `<div class="p-stage" data-anim="loop-rebuild"><div class="typo-rebuild" style="font-size:22px;font-weight:800;color:#4f46e5"><span style="--i:0">R</span><span style="--i:1">e</span><span style="--i:2">b</span><span style="--i:3">u</span><span style="--i:4">i</span><span style="--i:5">l</span><span style="--i:6">d</span></div></div>`;
    if (n.includes('vertical marquee')) return `<div class="p-stage" style="overflow:hidden;height:80px"><div class="typo-vertical-marquee" style="height:1.4em;overflow:hidden;font-size:20px;font-weight:800;color:#4f46e5"><div class="typo-vertical-marquee-inner"><div>Motion</div><div>Design</div><div>Systems</div><div>Motion</div><div>Design</div><div>Systems</div></div></div></div>`;
    if (n.includes('breathing')) return `<div class="p-stage"><span class="typo-breathing" style="font-size:28px;font-weight:900;color:#4f46e5">Breathe</span></div>`;
    if (n.includes('folding')) return `<div class="p-stage"><span class="typo-folding" style="font-size:26px;font-weight:800;color:#4f46e5">Fold</span></div>`;
    if (n.includes('stroke')) return `<div class="p-stage"><svg class="typo-svg-stroke" width="140" height="40" viewBox="0 0 140 40"><text x="10" y="30" font-size="28" font-weight="800" font-family="Syne,sans-serif">Stroke</text></svg></div>`;
    if (n.includes('chromatic')) return `<div class="p-stage" data-anim="hover-sim"><span class="typo-chromatic" style="font-size:26px;font-weight:900;color:#4f46e5">Chroma</span></div>`;
    if (n.includes('perspective push')) return `<div class="p-stage" data-anim="loop-class"><span class="typo-perspective-push" style="font-size:24px;font-weight:800;color:#1a1830">Depth</span></div>`;
    if (n.includes('underline grow')) return `<div class="p-stage" data-anim="hover-sim"><span class="typo-underline-grow" style="font-size:24px;font-weight:700;color:#1a1830">Underline</span></div>`;
    if (n.includes('cursor reactive') || n.includes('cursor warp')) return `<div class="p-stage" data-anim="cursor-warp"><span class="typo-cursor-warp" style="font-size:24px;font-weight:800;color:#4f46e5">Warp</span></div>`;
    if (n.includes('shimmer')) return `<div class="p-stage"><span class="typo-shimmer" style="font-size:26px;font-weight:900">Shimmer</span></div>`;
    if (n.includes('heat')) return `<div class="p-stage"><span class="typo-heat" style="font-size:26px;font-weight:900;color:#1a1830">Heat</span></div>`;
    if (n.includes('bounce') && n.includes('chain')) return `<div class="p-stage"><div class="typo-bounce-chain" style="font-size:22px;font-weight:800;color:#4f46e5"><span style="--i:0">B</span><span style="--i:1">o</span><span style="--i:2">u</span><span style="--i:3">n</span><span style="--i:4">c</span><span style="--i:5">e</span></div></div>`;
    if (n.includes('flip') && n.includes('carousel')) return `<div class="p-stage" data-anim="word-morph"><span style="font-size:22px;font-weight:800;color:#4f46e5;display:inline-block">Design</span></div>`;
    if (n.includes('blur exit')) return `<div class="p-stage" data-anim="blur-exit"><span class="typo-blur-exit" style="font-size:24px;font-weight:800;color:#4f46e5;display:inline-block">Exit</span></div>`;
    if (n.includes('radial') && n.includes('explo')) return `<div class="p-stage" data-anim="hover-sim"><div class="typo-radial-explosion" style="font-size:22px;font-weight:800;color:#4f46e5"><span>B</span><span>U</span><span>R</span><span>S</span><span>T</span></div></div>`;
    if (n.includes('orbit')) return `<div class="p-stage"><div class="typo-orbit"><span style="--i:0;color:#4f46e5;font-weight:800">A</span><span style="--i:1;color:#7c3aed;font-weight:800">B</span><span style="--i:2;color:#0ea5e9;font-weight:800">C</span></div></div>`;
    if (n.includes('vhs')) return `<div class="p-stage"><span class="typo-vhs" style="font-size:26px;font-weight:900;color:#1a1830;font-family:monospace">VHS▓</span></div>`;
    if (n.includes('weight')) return `<div class="p-stage" data-anim="hover-sim"><span class="typo-weight-sim" style="font-size:24px;font-weight:700;color:#1a1830">Weight</span></div>`;
    if (n.includes('sliding reveal') || n.includes('slide') && n.includes('mask')) return `<div class="p-stage" data-anim="loop-class"><span class="typo-slide-mask" style="font-size:24px;font-weight:800;color:#4f46e5">Reveal</span></div>`;
    if (n.includes('stretch') || n.includes('compress')) return `<div class="p-stage"><span class="typo-stretch" style="font-size:26px;font-weight:900;color:#4f46e5">Stretch</span></div>`;
    if (n.includes('aurora')) return `<div class="p-stage"><span class="typo-aurora" style="font-size:26px;font-weight:900">Aurora</span></div>`;
    if (n.includes('spotlight')) return `<div class="p-stage" data-anim="cursor-spotlight-text"><span class="typo-spotlight" style="font-size:26px;font-weight:900">Spotlight</span></div>`;
    if (n.includes('sequential glow') || n.includes('seq glow')) return `<div class="p-stage"><div class="typo-seq-glow" style="font-size:22px;font-weight:800"><span style="--i:0;display:inline-block">G</span><span style="--i:1;display:inline-block">L</span><span style="--i:2;display:inline-block">O</span><span style="--i:3;display:inline-block">W</span></div></div>`;
    if (n.includes('echo')) return `<div class="p-stage"><span class="typo-echo" data-text="Echo" style="font-size:28px;font-weight:900;color:#4f46e5">Echo</span></div>`;
    if (n.includes('matrix')) return `<div class="p-stage" style="background:#f0eff9"><div class="typo-matrix" style="font-size:20px;font-weight:800;color:#4f46e5;padding:4px 8px">Matrix</div></div>`;
    if (n.includes('glass reflection') || n.includes('glass ref')) return `<div class="p-stage"><div class="typo-glass-reflection" style="font-size:26px;font-weight:900;color:#1a1830;background:linear-gradient(135deg,#f0eff9,#fff);padding:8px 16px;border-radius:8px">Gloss</div></div>`;
    if (n.includes('distort') && n.includes('mesh')) return `<div class="p-stage" data-anim="hover-sim"><span class="typo-distort-mesh" style="font-size:26px;font-weight:900;color:#4f46e5">Mesh</span></div>`;
    if (n.includes('reassemble') || n.includes('particle reassemble')) return `<div class="p-stage" data-anim="loop-rebuild"><div class="typo-reassemble" style="font-size:22px;font-weight:800;color:#7c3aed"><span style="--i:0">S</span><span style="--i:1">O</span><span style="--i:2">L</span><span style="--i:3">V</span><span style="--i:4">E</span></div></div>`;
    if (n.includes('floating glyph')) return `<div class="p-stage"><div style="display:flex;gap:6px"><span class="typo-floating-glyphs" style="--i:0;font-size:24px;color:#4f46e5;font-weight:800">✦</span><span class="typo-floating-glyphs" style="--i:1;font-size:24px;color:#7c3aed;font-weight:800">◉</span><span class="typo-floating-glyphs" style="--i:2;font-size:24px;color:#0ea5e9;font-weight:800">◈</span></div></div>`;
    if (n.includes('pixelat') || n.includes('pixel reveal')) return `<div class="p-stage" data-anim="loop-class"><span class="typo-pixel-reveal" style="font-size:24px;font-weight:800;color:#4f46e5">Pixels</span></div>`;
    if (n.includes('baseline')) return `<div class="p-stage"><div class="typo-baseline" style="font-size:22px;font-weight:800;color:#4f46e5"><span style="--i:0">B</span><span style="--i:1">a</span><span style="--i:2">s</span><span style="--i:3">e</span></div></div>`;
    if (n.includes('cinematic')) return `<div class="p-stage" data-anim="loop-reveal"><div class="typo-cinematic"><span style="--i:0;display:block;font-size:20px;font-weight:800;color:#1a1830">Cinematic</span></div></div>`;
    return `<div class="p-stage"><span class="typo-breathing" style="font-size:22px;font-weight:800;color:#4f46e5">${name.split(' ').slice(0,2).join(' ')}</span></div>`;
  }

  // ── BUTTONS ───────────────────────────────────────────────────────────────
  if (cat === 'button') {
    const label = name.split(' ').slice(0,2).join(' ');
    if (n.includes('liquid hover') || n.includes('liquid fill')) return `<div class="p-stage" data-anim="hover-sim"><button class="btn-liquid-fill" style="background:#4f46e5;color:#fff;border:none;padding:10px 24px;border-radius:10px;font-size:14px;font-weight:600;cursor:pointer;position:relative;overflow:hidden">Hover Me</button></div>`;
    if (n.includes('magnetic')) return `<div class="p-stage" data-anim="btn-magnetic"><button class="btn-magnetic" style="background:#4f46e5;color:#fff;border:none;padding:10px 24px;border-radius:10px;font-size:14px;font-weight:600;cursor:pointer">Magnetic</button></div>`;
    if (n.includes('elastic press')) return `<div class="p-stage" data-anim="btn-elastic"><button class="btn-elastic" style="background:#4f46e5;color:#fff;border:none;padding:10px 24px;border-radius:10px;font-size:14px;font-weight:600;cursor:pointer">Press Me</button></div>`;
    if (n.includes('ripple')) return `<div class="p-stage" data-anim="btn-ripple"><button class="btn-ripple" style="background:#4f46e5;color:#fff;border:none;padding:10px 24px;border-radius:10px;font-size:14px;font-weight:600;cursor:pointer;position:relative;overflow:hidden">Click →</button></div>`;
    if (n.includes('glow pulse')) return `<div class="p-stage"><button class="btn-glow-pulse" style="background:#4f46e5;color:#fff;border:none;padding:10px 24px;border-radius:10px;font-size:14px;font-weight:600">Glow</button></div>`;
    if (n.includes('border trace')) return `<div class="p-stage"><button class="btn-border-trace" style="padding:10px 24px;border-radius:10px;font-size:14px;font-weight:600;cursor:pointer">Trace</button></div>`;
    if (n.includes('morph radius')) return `<div class="p-stage" data-anim="hover-sim"><button class="btn-morph-radius" style="background:#4f46e5;color:#fff;border:none;padding:10px 24px;font-size:14px;font-weight:600;cursor:pointer">Morph</button></div>`;
    if (n.includes('tilt')) return `<div class="p-stage" data-anim="btn-tilt"><button class="btn-tilt" style="background:#4f46e5;color:#fff;border:none;padding:10px 24px;border-radius:10px;font-size:14px;font-weight:600;cursor:pointer">Tilt 3D</button></div>`;
    if (n.includes('neon sweep')) return `<div class="p-stage" data-anim="hover-sim"><button class="btn-neon-sweep" style="padding:10px 24px;border-radius:10px;font-size:14px;font-weight:600;cursor:pointer">Neon</button></div>`;
    if (n.includes('depth push')) return `<div class="p-stage" data-anim="hover-sim"><button class="btn-depth-push" style="background:#4f46e5;color:#fff;border:none;padding:10px 24px;border-radius:10px;font-size:14px;font-weight:600;cursor:pointer">Depth</button></div>`;
    if (n.includes('particle burst')) return `<div class="p-stage" data-anim="btn-particle"><button class="btn-particle-burst" style="background:#4f46e5;color:#fff;border:none;padding:10px 24px;border-radius:10px;font-size:14px;font-weight:600;cursor:pointer;position:relative;overflow:visible">Burst!</button></div>`;
    if (n.includes('gradient shift')) return `<div class="p-stage" data-anim="hover-sim"><button class="btn-gradient-shift" style="border:none;padding:10px 24px;border-radius:10px;font-size:14px;font-weight:600;color:#fff;cursor:pointer">Shift</button></div>`;
    if (n.includes('press shock') || n.includes('shockwave')) return `<div class="p-stage" data-anim="btn-elastic"><button class="btn-press-shock" style="background:#4f46e5;color:#fff;border:none;padding:10px 24px;border-radius:10px;font-size:14px;font-weight:600;cursor:pointer">Shock</button></div>`;
    if (n.includes('holographic') || n.includes('holo shine')) return `<div class="p-stage"><button class="btn-holo-shine" style="border:none;padding:10px 24px;border-radius:10px;font-size:14px;font-weight:600;color:#fff;cursor:pointer;position:relative;overflow:hidden">Holo</button></div>`;
    if (n.includes('slide arrow')) return `<div class="p-stage" data-anim="hover-sim"><button class="btn-slide-arrow" style="background:#4f46e5;color:#fff;border:none;padding:10px 24px;border-radius:10px;font-size:14px;font-weight:600;cursor:pointer;overflow:hidden">Go <span class="arrow">→</span></button></div>`;
    if (n.includes('gooey')) return `<div class="p-stage" data-anim="hover-sim"><button class="btn-gooey" style="background:#4f46e5;color:#fff;border:none;padding:10px 24px;border-radius:10px;font-size:14px;font-weight:600;cursor:pointer">Gooey</button></div>`;
    if (n.includes('breathing') || n.includes('breath')) return `<div class="p-stage"><button class="btn-breathing" style="background:#4f46e5;color:#fff;border:none;padding:10px 24px;border-radius:10px;font-size:14px;font-weight:600">CTA</button></div>`;
    if (n.includes('frost')) return `<div class="p-stage" style="background:linear-gradient(135deg,#4f46e5,#7c3aed)" data-anim="hover-sim"><button class="btn-frost" style="padding:10px 24px;border-radius:10px;font-size:14px;font-weight:600;cursor:pointer">Frost</button></div>`;
    if (n.includes('flip cta') || n.includes('flip')) return `<div class="p-stage" data-anim="hover-sim"><div style="position:relative;height:42px;width:120px"><button class="btn-flip" style="background:#4f46e5;color:#fff;border:none;padding:10px 24px;border-radius:10px;font-size:14px;font-weight:600;cursor:pointer;width:120px;height:42px"><span class="btn-flip-front">Front</span><span class="btn-flip-back">Back!</span></button></div></div>`;
    if (n.includes('bounce edge')) return `<div class="p-stage" data-anim="hover-sim"><button class="btn-bounce-edge" style="background:#4f46e5;color:#fff;border:none;padding:10px 24px;border-radius:10px;font-size:14px;font-weight:600;cursor:pointer">Bounce</button></div>`;
    if (n.includes('chromatic border')) return `<div class="p-stage" data-anim="hover-sim"><button class="btn-chromatic-border" style="background:#4f46e5;color:#fff;padding:10px 24px;border-radius:10px;font-size:14px;font-weight:600;cursor:pointer">Chrome</button></div>`;
    if (n.includes('hover warp') || n.includes('warp')) return `<div class="p-stage" data-anim="hover-sim"><button class="btn-warp" style="background:#4f46e5;color:#fff;border:none;padding:10px 24px;border-radius:10px;font-size:14px;font-weight:600;cursor:pointer">Warp</button></div>`;
    if (n.includes('wave distort')) return `<div class="p-stage" data-anim="hover-sim"><button class="btn-wave-distort" style="background:#4f46e5;color:#fff;border:none;padding:10px 24px;border-radius:10px;font-size:14px;font-weight:600;cursor:pointer">Wave</button></div>`;
    if (n.includes('cursor spotlight')) return `<div class="p-stage" data-anim="btn-spotlight"><button class="btn-cursor-spotlight" style="border:none;padding:10px 24px;border-radius:10px;font-size:14px;font-weight:600;color:#fff;cursor:pointer">Spotlight</button></div>`;
    if (n.includes('floating button') || n.includes('float')) return `<div class="p-stage"><button class="btn-floating" style="background:#4f46e5;color:#fff;border:none;padding:10px 24px;border-radius:10px;font-size:14px;font-weight:600">Float</button></div>`;
    if (n.includes('expand icon')) return `<div class="p-stage" data-anim="hover-sim"><button class="btn-expand-icon" style="background:#4f46e5;color:#fff;border:none;padding:10px 20px;border-radius:10px;font-size:14px;font-weight:600;cursor:pointer;display:inline-flex;align-items:center;gap:8px">Open <span class="icon">✦</span></button></div>`;
    if (n.includes('split fill')) return `<div class="p-stage" data-anim="hover-sim"><button class="btn-split-fill" style="padding:10px 24px;border-radius:10px;font-size:14px;font-weight:600;cursor:pointer">Split</button></div>`;
    if (n.includes('shimmer pass') || n.includes('shimmer')) return `<div class="p-stage"><button class="btn-shimmer" style="background:#4f46e5;color:#fff;border:none;padding:10px 24px;border-radius:10px;font-size:14px;font-weight:600;position:relative;overflow:hidden">Shimmer</button></div>`;
    if (n.includes('hover lift') || n.includes('lift')) return `<div class="p-stage" data-anim="hover-sim"><button class="btn-hover-lift" style="background:#4f46e5;color:#fff;border:none;padding:10px 24px;border-radius:10px;font-size:14px;font-weight:600;cursor:pointer">Lift</button></div>`;
    if (n.includes('ink spread')) return `<div class="p-stage" data-anim="hover-sim"><button class="btn-ink-spread" style="background:#4f46e5;color:#fff;border:none;padding:10px 24px;border-radius:10px;font-size:14px;font-weight:600;cursor:pointer;overflow:hidden">Ink</button></div>`;
    if (n.includes('slide background') || n.includes('slide bg')) return `<div class="p-stage" data-anim="hover-sim"><button class="btn-slide-bg" style="padding:10px 24px;border-radius:10px;font-size:14px;font-weight:600;cursor:pointer">Slide</button></div>`;
    if (n.includes('flash pulse')) return `<div class="p-stage"><button class="btn-glow-pulse" style="background:#4f46e5;color:#fff;border:none;padding:10px 24px;border-radius:10px;font-size:14px;font-weight:600;animation:flashPulse 0.8s steps(2) infinite">Flash</button></div>`;
    if (n.includes('dynamic outline')) return `<div class="p-stage" data-anim="hover-sim"><button class="btn-dynamic-outline" style="padding:10px 24px;border-radius:10px;font-size:14px;font-weight:600;cursor:pointer">Outline</button></div>`;
    if (n.includes('orbit glow')) return `<div class="p-stage" data-anim="hover-sim"><button class="btn-orbit-glow" style="background:#4f46e5;color:#fff;border:none;padding:10px 24px;border-radius:10px;font-size:14px;font-weight:600;cursor:pointer;overflow:visible">Orbit</button></div>`;
    if (n.includes('rotating border')) return `<div class="p-stage"><button class="btn-rotating-beam" style="padding:10px 24px;border-radius:10px;font-size:14px;font-weight:600;cursor:pointer">Beam</button></div>`;
    if (n.includes('stretch hover') || n.includes('stretch')) return `<div class="p-stage" data-anim="hover-sim"><button class="btn-stretch" style="background:#4f46e5;color:#fff;border:none;padding:10px 24px;border-radius:10px;font-size:14px;font-weight:600;cursor:pointer">Stretch</button></div>`;
    if (n.includes('physics snap')) return `<div class="p-stage" data-anim="btn-elastic"><button class="btn-physics-snap" style="background:#4f46e5;color:#fff;border:none;padding:10px 24px;border-radius:10px;font-size:14px;font-weight:600;cursor:pointer">Snap!</button></div>`;
    if (n.includes('frosted morph')) return `<div class="p-stage" style="background:linear-gradient(135deg,#7c3aed,#4f46e5)" data-anim="hover-sim"><button class="btn-frosted-morph" style="padding:10px 24px;font-size:14px;font-weight:600;cursor:pointer">Frost</button></div>`;
    if (n.includes('3d push') || n.includes('pushdown')) return `<div class="p-stage" data-anim="btn-elastic"><button class="btn-3d-push" style="background:#4f46e5;color:#fff;border:none;padding:10px 24px;border-radius:10px;font-size:14px;font-weight:600;cursor:pointer">Push</button></div>`;
    if (n.includes('bounce chain')) return `<div class="p-stage" data-anim="hover-sim"><button class="btn-bounce-chain" style="background:#4f46e5;color:#fff;border:none;padding:10px 20px;border-radius:10px;font-size:14px;font-weight:600;cursor:pointer;display:flex;gap:2px"><span class="child" style="--i:0">C</span><span class="child" style="--i:1">h</span><span class="child" style="--i:2">a</span><span class="child" style="--i:3">i</span><span class="child" style="--i:4">n</span></button></div>`;
    if (n.includes('energy ring')) return `<div class="p-stage" data-anim="hover-sim"><button class="btn-energy-ring" style="background:#4f46e5;color:#fff;border:none;padding:10px 24px;border-radius:10px;font-size:14px;font-weight:600;cursor:pointer;overflow:visible">Ring</button></div>`;
    if (n.includes('flicker')) return `<div class="p-stage" data-anim="hover-sim"><button class="btn-hover-flicker" style="background:#4f46e5;color:#fff;border:none;padding:10px 24px;border-radius:10px;font-size:14px;font-weight:600;cursor:pointer">Flicker</button></div>`;
    if (n.includes('corner expand')) return `<div class="p-stage" data-anim="hover-sim"><button class="btn-corner-expand" style="padding:10px 24px;border-radius:10px;font-size:14px;font-weight:600;cursor:pointer">Corner</button></div>`;
    if (n.includes('cursor gravity')) return `<div class="p-stage" data-anim="btn-gravity"><button class="btn-cursor-gravity" style="background:#4f46e5;color:#fff;border:none;padding:10px 24px;border-radius:10px;font-size:14px;font-weight:600;cursor:pointer">Gravity</button></div>`;
    if (n.includes('beam') || n.includes('diagonal')) return `<div class="p-stage"><button class="btn-slide-beam" style="background:#4f46e5;color:#fff;border:none;padding:10px 24px;border-radius:10px;font-size:14px;font-weight:600;overflow:hidden;position:relative">Beam</button></div>`;
    if (n.includes('hover distort')) return `<div class="p-stage" data-anim="hover-sim"><button class="btn-hover-distort" style="background:#4f46e5;color:#fff;border:none;padding:10px 24px;border-radius:10px;font-size:14px;font-weight:600;cursor:pointer">Distort</button></div>`;
    if (n.includes('compress')) return `<div class="p-stage" data-anim="hover-sim"><button class="btn-hover-compress" style="background:#4f46e5;color:#fff;border:none;padding:10px 24px;border-radius:10px;font-size:14px;font-weight:600;cursor:pointer">Squash</button></div>`;
    if (n.includes('icon swap')) return `<div class="p-stage" data-anim="hover-sim"><button class="btn-icon-swap" style="background:#4f46e5;color:#fff;border:none;padding:10px 24px;border-radius:10px;font-size:14px;font-weight:600;cursor:pointer;position:relative;overflow:hidden"><span class="icon-a">♥</span><span class="icon-b">★</span></button></div>`;
    if (n.includes('echo')) return `<div class="p-stage" data-anim="hover-sim"><button class="btn-hover-echo" style="background:#4f46e5;color:#fff;border:none;padding:10px 24px;border-radius:10px;font-size:14px;font-weight:600;cursor:pointer;overflow:visible">Echo</button></div>`;
    if (n.includes('attention') || n.includes('idle')) return `<div class="p-stage"><button class="btn-attention" style="background:#4f46e5;color:#fff;border:none;padding:10px 24px;border-radius:10px;font-size:14px;font-weight:600">CTA!</button></div>`;
    return `<div class="p-stage" data-anim="hover-sim"><button class="btn-glow-pulse" style="background:#4f46e5;color:#fff;border:none;padding:10px 24px;border-radius:10px;font-size:14px;font-weight:600;cursor:pointer">${label}</button></div>`;
  }

  // ── INPUTS ────────────────────────────────────────────────────────────────
  if (cat === 'input') {
    if (n.includes('floating label')) return `<div class="p-stage" data-anim="focus-sim"><div class="input-wrap" style="position:relative;width:180px"><input class="input-glow-ring" placeholder=" " style="width:180px;padding:14px 12px 6px;border-radius:8px;border:2px solid #e2e1e8;background:#fff;font-size:14px;outline:none"/><label style="position:absolute;left:12px;top:50%;transform:translateY(-50%);color:#5a587a;font-size:14px;transition:all 0.3s;pointer-events:none;background:#fff;padding:0 4px">Email</label></div></div>`;
    if (n.includes('glow') && n.includes('ring')) return `<div class="p-stage" data-anim="focus-sim"><input class="input-glow-ring" placeholder="Focus me..." style="width:180px;padding:10px 14px;border-radius:8px;border:2px solid #e2e1e8;font-size:14px;outline:none;transition:all 0.3s;background:#fff"/></div>`;
    if (n.includes('pulse border')) return `<div class="p-stage" data-anim="focus-sim"><input class="input-pulse-border" placeholder="Pulse..." style="width:180px;padding:10px 14px;border-radius:8px;border:2px solid #e2e1e8;font-size:14px;outline:none;background:#fff"/></div>`;
    if (n.includes('cursor beam')) return `<div class="p-stage" data-anim="focus-sim"><input class="input-cursor-beam" placeholder="Type here..." style="width:180px;padding:10px 14px;border-radius:8px;border:2px solid #e2e1e8;font-size:14px;outline:none;background:#fff"/></div>`;
    if (n.includes('underline expand')) return `<div class="p-stage" data-anim="focus-sim"><input class="input-underline-expand" placeholder="Underline..." style="width:180px;padding:10px 14px;font-size:14px;outline:none;background:transparent;border:none;border-bottom:2px solid #e2e1e8;color:#1a1830"/></div>`;
    if (n.includes('liquid focus')) return `<div class="p-stage" data-anim="focus-sim"><input class="input-liquid-focus" placeholder="Focus me..." style="width:180px;padding:10px 14px;border-radius:8px;border:2px solid #e2e1e8;font-size:14px;outline:none;background:#fff"/></div>`;
    if (n.includes('gradient border')) return `<div class="p-stage" data-anim="focus-sim"><input class="input-gradient-border" placeholder="Gradient..." style="width:180px;padding:10px 14px;border-radius:8px;font-size:14px;outline:none"/></div>`;
    if (n.includes('frost')) return `<div class="p-stage" style="background:linear-gradient(135deg,#7c3aed,#4f46e5)" data-anim="focus-sim"><input class="input-frost" placeholder="Frosted..." style="width:180px;padding:10px 14px;border-radius:8px;font-size:14px;outline:none;color:#fff"/></div>`;
    if (n.includes('validation shake') || n.includes('shake')) return `<div class="p-stage" data-anim="shake-sim"><input class="input-shake" placeholder="Error state..." style="width:180px;padding:10px 14px;border-radius:8px;border:2px solid #e2e1e8;font-size:14px;outline:none;background:#fff"/></div>`;
    if (n.includes('success pop')) return `<div class="p-stage" data-anim="success-sim"><input class="input-success-pop" placeholder="Success!" style="width:180px;padding:10px 14px;border-radius:8px;border:2px solid #e2e1e8;font-size:14px;outline:none;background:#fff"/></div>`;
    if (n.includes('neon typing')) return `<div class="p-stage" data-anim="focus-sim"><input class="input-neon-typing" placeholder="Neon glow..." style="width:180px;padding:10px 14px;border-radius:8px;border:2px solid #e2e1e8;font-size:14px;outline:none;background:#fff"/></div>`;
    if (n.includes('elastic outline')) return `<div class="p-stage" data-anim="focus-sim"><input class="input-elastic-outline" placeholder="Elastic..." style="width:180px;padding:10px 14px;border-radius:8px;border:2px solid #e2e1e8;font-size:14px;outline:none;background:#fff"/></div>`;
    if (n.includes('glass morph')) return `<div class="p-stage" style="background:linear-gradient(135deg,#4f46e5,#0ea5e9)" data-anim="focus-sim"><input class="input-glass-morph" placeholder="Glass..." style="width:180px;padding:10px 14px;border-radius:8px;border:1px solid rgba(255,255,255,0.3);font-size:14px;outline:none;color:#1a1830"/></div>`;
    if (n.includes('dynamic radius') || n.includes('border radius')) return `<div class="p-stage" data-anim="focus-sim"><input class="input-dynamic-radius" placeholder="Morph radius..." style="width:180px;padding:10px 14px;border:2px solid #e2e1e8;font-size:14px;outline:none;background:#fff"/></div>`;
    if (n.includes('split border')) return `<div class="p-stage" data-anim="focus-sim"><input class="input-split-border" placeholder="Split border..." style="width:180px;padding:10px 14px;background:#fff;font-size:14px;outline:none;border:none;border-bottom:0;color:#1a1830"/></div>`;
    if (n.includes('attention') || n.includes('soft attention')) return `<div class="p-stage"><input class="input-attention" placeholder="Attention pulse..." style="width:180px;padding:10px 14px;border-radius:8px;border:2px solid rgba(79,70,229,.3);font-size:14px;outline:none;background:#fff"/></div>`;
    if (n.includes('breathing') || n.includes('glow') && n.includes('border')) return `<div class="p-stage"><input class="input-breathing-glow" placeholder="Breathing..." style="width:180px;padding:10px 14px;border-radius:8px;border:2px solid rgba(79,70,229,.3);font-size:14px;outline:none;background:#fff"/></div>`;
    return `<div class="p-stage" data-anim="focus-sim"><input class="input-glow-ring" placeholder="${name.split(' ').slice(0,2).join(' ')}..." style="width:180px;padding:10px 14px;border-radius:8px;border:2px solid #e2e1e8;font-size:14px;outline:none;background:#fff"/></div>`;
  }

  // ── CARDS ─────────────────────────────────────────────────────────────────
  if (cat === 'card') {
    if (n.includes('perspective tilt') || n.includes('tilt')) return `<div class="p-stage" data-anim="card-tilt"><div class="card-tilt" style="width:160px;height:90px;background:linear-gradient(135deg,#f0eff9,#fff);border:1.5px solid #e2e1e8;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;color:#4f46e5;cursor:pointer">Tilt 3D ✦</div></div>`;
    if (n.includes('glass') || n.includes('glassmorphism')) return `<div class="p-stage" style="background:linear-gradient(135deg,#4f46e5,#7c3aed)" data-anim="hover-sim"><div class="card-glassmorphism" style="width:160px;height:90px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;color:#fff;cursor:pointer">Glass ✦</div></div>`;
    if (n.includes('float') || n.includes('floating')) return `<div class="p-stage"><div class="card-float" style="width:150px;height:80px;background:#fff;border:1.5px solid #e2e1e8;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;color:#4f46e5;box-shadow:0 4px 20px rgba(79,70,229,.12)">Float ↕</div></div>`;
    if (n.includes('shadow shift')) return `<div class="p-stage" data-anim="hover-sim"><div class="card-shadow-shift" style="width:150px;height:80px;background:#fff;border:1.5px solid #e2e1e8;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;color:#1a1830;cursor:pointer">Shadow ↕</div></div>`;
    if (n.includes('flip')) return `<div class="p-stage" data-anim="hover-sim"><div class="card-flip" style="width:150px;height:80px;cursor:pointer"><div class="card-flip-inner"><div class="card-flip-front" style="background:#f0eff9;border:1.5px solid #e2e1e8;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;color:#4f46e5">Front ✦</div><div class="card-flip-back" style="border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700">Back ★</div></div></div></div>`;
    if (n.includes('zoom layer') || n.includes('zoom')) return `<div class="p-stage" data-anim="hover-sim"><div class="card-zoom-layer" style="width:160px;height:90px;border-radius:12px;overflow:hidden;cursor:pointer"><img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='90'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%234f46e5'/%3E%3Cstop offset='1' stop-color='%237c3aed'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill='url(%23g)' width='160' height='90'/%3E%3Ctext x='80' y='52' text-anchor='middle' fill='%23fff' font-size='14' font-weight='700' font-family='Inter,sans-serif'%3EZoom ✦%3C/text%3E%3C/svg%3E" style="width:100%;height:100%;object-fit:cover;display:block"/></div></div>`;
    if (n.includes('glow edge')) return `<div class="p-stage" data-anim="hover-sim"><div class="card-glow-edge" style="width:150px;height:80px;background:#fff;border:1.5px solid #e2e1e8;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;color:#4f46e5;cursor:pointer;transition:all 0.3s">Glow Edge</div></div>`;
    if (n.includes('magnetic')) return `<div class="p-stage" data-anim="card-magnetic"><div class="card-magnetic" style="width:150px;height:80px;background:#fff;border:1.5px solid #e2e1e8;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;color:#4f46e5;cursor:pointer">Magnetic ✦</div></div>`;
    if (n.includes('holo') || n.includes('holographic')) return `<div class="p-stage"><div class="card-holo-reflection" style="width:160px;height:90px;background:linear-gradient(135deg,#f0eff9,#fff);border:1.5px solid #e2e1e8;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;color:#4f46e5;overflow:hidden">Holo ✦</div></div>`;
    if (n.includes('shimmer')) return `<div class="p-stage"><div class="card-shimmer" style="width:160px;height:90px;background:#f0eff9;border:1.5px solid #e2e1e8;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;color:#4f46e5;overflow:hidden;position:relative">Shimmer ✦</div></div>`;
    if (n.includes('depth pulse')) return `<div class="p-stage"><div class="card-depth-pulse" style="width:150px;height:80px;background:#fff;border:1.5px solid #e2e1e8;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;color:#4f46e5">Depth ◉</div></div>`;
    if (n.includes('bounce')) return `<div class="p-stage" data-anim="hover-sim"><div class="card-bounce" style="width:150px;height:80px;background:#fff;border:1.5px solid #e2e1e8;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;color:#4f46e5;cursor:pointer">Bounce ↕</div></div>`;
    if (n.includes('expand corner')) return `<div class="p-stage" data-anim="hover-sim"><div class="card-expand-corners" style="width:150px;height:80px;background:#fff;border:1.5px solid #e2e1e8;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;color:#4f46e5;cursor:pointer">Corner ✦</div></div>`;
    if (n.includes('energy ring')) return `<div class="p-stage" data-anim="hover-sim"><div class="card-energy-ring" style="width:150px;height:80px;background:#fff;border:1.5px solid #e2e1e8;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;color:#4f46e5;cursor:pointer;overflow:visible">Ring ◎</div></div>`;
    if (n.includes('aurora')) return `<div class="p-stage"><div class="card-aurora-surface" style="width:160px;height:90px;border:1.5px solid #e2e1e8;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;color:#4f46e5">Aurora ✦</div></div>`;
    if (n.includes('breathing')) return `<div class="p-stage"><div class="card-breathing" style="width:150px;height:80px;background:#fff;border:1.5px solid #e2e1e8;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;color:#4f46e5;box-shadow:0 4px 20px rgba(79,70,229,.1)">Breathe ◉</div></div>`;
    if (n.includes('elevation')) return `<div class="p-stage" data-anim="hover-sim"><div class="card-elevation" style="width:150px;height:80px;background:#fff;border:1.5px solid #e2e1e8;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;color:#4f46e5;cursor:pointer">Elevation ↑</div></div>`;
    if (n.includes('cinematic')) return `<div class="p-stage" data-anim="loop-reveal"><div class="card-cinematic-reveal" style="width:160px;height:90px;background:linear-gradient(135deg,#f0eff9,#fff);border:1.5px solid #e2e1e8;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;color:#4f46e5">Cinematic</div></div>`;
    if (n.includes('parallax')) return `<div class="p-stage" data-anim="card-tilt"><div class="card-parallax" style="width:160px;height:90px;background:linear-gradient(135deg,#f0eff9,#fff);border:1.5px solid #e2e1e8;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;color:#4f46e5;cursor:pointer">Parallax</div></div>`;
    if (n.includes('swing') || n.includes('pendulum')) return `<div class="p-stage"><div class="card-swing" style="width:140px;height:80px;background:#fff;border:1.5px solid #e2e1e8;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;color:#4f46e5;box-shadow:0 4px 20px rgba(79,70,229,.1)">Swing ↔</div></div>`;
    if (n.includes('scale') && n.includes('scroll')) return `<div class="p-stage" data-anim="loop-reveal"><div class="card-scroll-scale" style="width:150px;height:80px;background:#fff;border:1.5px solid #e2e1e8;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;color:#4f46e5">Scale ↑</div></div>`;
    if (n.includes('radius morph')) return `<div class="p-stage" data-anim="hover-sim"><div class="card-radius-morph" style="width:150px;height:80px;background:#fff;border:1.5px solid #e2e1e8;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;color:#4f46e5">Radius ◎</div></div>`;
    if (n.includes('gradient hover') || n.includes('gradient')) return `<div class="p-stage" data-anim="hover-sim"><div class="card-gradient-hover" style="width:150px;height:80px;border:1.5px solid #e2e1e8;border-radius:12px;background:#fff;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;color:#4f46e5;cursor:pointer;transition:background 0.4s">Gradient</div></div>`;
    if (n.includes('neon') || n.includes('flicker')) return `<div class="p-stage" data-anim="hover-sim"><div class="card-flicker-neon" style="width:150px;height:80px;background:#fff;border:1.5px solid #e2e1e8;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;color:#4f46e5;cursor:pointer">Neon ✦</div></div>`;
    if (n.includes('split panel')) return `<div class="p-stage" data-anim="hover-sim"><div class="card-split-panels" style="width:160px;height:90px;background:#fff;border:1.5px solid #e2e1e8;border-radius:12px;overflow:hidden;cursor:pointer;display:flex"><div class="panel-left" style="flex:1;background:linear-gradient(135deg,#4f46e5,#7c3aed);display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:12px">L</div><div class="panel-right" style="flex:1;display:flex;align-items:center;justify-content:center;color:#4f46e5;font-weight:700;font-size:12px">R</div></div></div>`;
    return `<div class="p-stage" data-anim="hover-sim"><div class="card-shadow-shift" style="width:150px;height:80px;background:#fff;border:1.5px solid #e2e1e8;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;color:#4f46e5;cursor:pointer">${name.split(' ').slice(0,3).join(' ')}</div></div>`;
  }

  // ── LOADERS ───────────────────────────────────────────────────────────────
  if (cat === 'loader') {
    if (n.includes('skeleton') && n.includes('pulse')) return `<div class="p-stage"><div style="display:flex;flex-direction:column;gap:8px;width:160px"><div class="loader-skeleton" style="height:14px;border-radius:7px"></div><div class="loader-skeleton" style="height:14px;border-radius:7px;width:70%"></div><div class="loader-skeleton" style="height:14px;border-radius:7px;width:85%"></div></div></div>`;
    if (n.includes('shimmer skeleton') || n.includes('shimmer') && n.includes('skel')) return `<div class="p-stage"><div style="display:flex;flex-direction:column;gap:8px;width:160px"><div class="loader-shimmer" style="height:14px;border-radius:7px"></div><div class="loader-shimmer" style="height:14px;border-radius:7px;width:80%"></div><div class="loader-shimmer" style="height:40px;border-radius:8px;margin-top:4px"></div></div></div>`;
    if (n.includes('rotating ring') || (n.includes('ring') && !n.includes('energy') && !n.includes('orbit') && !n.includes('pixel'))) return `<div class="p-stage"><div class="loader-ring"></div></div>`;
    if (n.includes('dual spinner') || n.includes('dual ring')) return `<div class="p-stage"><div class="loader-dual-ring"></div></div>`;
    if (n.includes('gooey')) return `<div class="p-stage"><div class="loader-gooey"><span></span><span></span><span></span></div></div>`;
    if (n.includes('dot bounce')) return `<div class="p-stage"><div class="loader-dot-bounce"><span></span><span></span><span></span></div></div>`;
    if (n.includes('elastic bar') || n.includes('bar')) return `<div class="p-stage"><div class="loader-bars"><span style="height:20px"></span><span style="height:32px"></span><span style="height:26px"></span><span style="height:38px"></span><span style="height:20px"></span></div></div>`;
    if (n.includes('orbit loader') || n.includes('orbit')) return `<div class="p-stage"><div class="loader-orbit"></div></div>`;
    if (n.includes('dna')) return `<div class="p-stage"><div class="loader-dna"><span></span><span></span><span></span><span></span><span></span><span></span></div></div>`;
    if (n.includes('neon spinner') || n.includes('neon spin')) return `<div class="p-stage"><div class="loader-neon-spin"></div></div>`;
    if (n.includes('wave loader') || n.includes('wave')) return `<div class="p-stage"><div class="loader-wave"><span></span><span></span><span></span><span></span><span></span></div></div>`;
    if (n.includes('morph blob') || n.includes('blob') && n.includes('loader')) return `<div class="p-stage"><div class="loader-blob"></div></div>`;
    if (n.includes('grid pulse')) return `<div class="p-stage"><div class="loader-grid-pulse"><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span></div></div>`;
    if (n.includes('flip loader') || n.includes('flip')) return `<div class="p-stage"><div class="loader-flip"></div></div>`;
    if (n.includes('radar')) return `<div class="p-stage"><div class="loader-radar"></div></div>`;
    if (n.includes('stretch dot') || n.includes('stretch') && n.includes('dot')) return `<div class="p-stage"><div class="loader-stretch-dots"><span></span><span></span><span></span></div></div>`;
    if (n.includes('spiral')) return `<div class="p-stage"><div class="loader-spiral"></div></div>`;
    if (n.includes('equalizer')) return `<div class="p-stage"><div class="loader-equalizer"><span></span><span></span><span></span><span></span><span></span></div></div>`;
    if (n.includes('particle orbit')) return `<div class="p-stage"><div class="loader-particle-orbit"></div></div>`;
    if (n.includes('liquid fill')) return `<div class="p-stage"><div class="loader-liquid-fill"></div></div>`;
    if (n.includes('circular progress') || n.includes('progress sweep')) return `<div class="p-stage"><div class="loader-ring" style="width:48px;height:48px;border-width:5px;border-color:#f0eff9;border-top-color:#4f46e5"></div></div>`;
    if (n.includes('infinite beam') || n.includes('beam')) return `<div class="p-stage"><div class="loader-beam" style="width:120px"></div></div>`;
    if (n.includes('magnetic dots')) return `<div class="p-stage"><div class="loader-dot-bounce"><span style="background:#4f46e5"></span><span style="background:#7c3aed"></span><span style="background:#0ea5e9"></span></div></div>`;
    if (n.includes('ripple ring') || n.includes('ripple')) return `<div class="p-stage"><div class="loader-ripple-rings"></div></div>`;
    if (n.includes('wave skeleton')) return `<div class="p-stage"><div style="display:flex;flex-direction:column;gap:8px;width:160px"><div class="loader-wave-skel" style="height:14px;border-radius:7px"></div><div class="loader-wave-skel" style="height:14px;border-radius:7px;width:75%"></div></div></div>`;
    if (n.includes('noise flicker')) return `<div class="p-stage"><div class="loader-noise-flicker"></div></div>`;
    if (n.includes('scanline progress') || n.includes('scanline')) return `<div class="p-stage"><div class="loader-scanline" style="width:120px"></div></div>`;
    if (n.includes('breathing logo') || n.includes('logo')) return `<div class="p-stage"><div class="loader-breathing-logo" style="width:50px;height:50px;background:linear-gradient(135deg,#4f46e5,#7c3aed);border-radius:12px;display:flex;align-items:center;justify-content:center;color:#fff;font-size:22px;font-weight:900">S</div></div>`;
    if (n.includes('shaking cube') || n.includes('cube')) return `<div class="p-stage"><div class="loader-cube-shake"></div></div>`;
    if (n.includes('hovering ball') || n.includes('hovering')) return `<div class="p-stage"><div class="loader-hovering"><span></span><span></span><span></span></div></div>`;
    if (n.includes('layered spin')) return `<div class="p-stage"><div class="loader-layered-spin"></div></div>`;
    if (n.includes('typing dot') || n.includes('typing')) return `<div class="p-stage"><div class="loader-typing"><span></span><span></span><span></span></div></div>`;
    if (n.includes('hexagon')) return `<div class="p-stage"><div class="loader-hexagon"></div></div>`;
    if (n.includes('glow beam')) return `<div class="p-stage"><div class="loader-glow-beam" style="width:120px;height:4px"></div></div>`;
    if (n.includes('blob collision')) return `<div class="p-stage"><div class="loader-blob-collide"><span></span><span></span></div></div>`;
    if (n.includes('stretch spinner') || n.includes('stretch spin')) return `<div class="p-stage"><div class="loader-stretch-spin"></div></div>`;
    if (n.includes('orbit trail')) return `<div class="p-stage"><div class="loader-orbit-trails"><span></span><span></span></div></div>`;
    if (n.includes('skeleton reveal')) return `<div class="p-stage"><div style="display:flex;flex-direction:column;gap:8px;width:160px"><div class="loader-skel-reveal" style="height:14px;border-radius:7px"></div><div class="loader-skel-reveal" style="height:14px;border-radius:7px;width:70%;animation-delay:0.2s"></div></div></div>`;
    if (n.includes('gradient flow') || n.includes('infinite gradient')) return `<div class="p-stage"><div class="loader-gradient-flow" style="width:120px;height:6px"></div></div>`;
    if (n.includes('cluster') || n.includes('floating cluster')) return `<div class="p-stage"><div class="loader-cluster"><span></span><span></span><span></span><span></span></div></div>`;
    if (n.includes('clock')) return `<div class="p-stage"><div class="loader-clock"></div></div>`;
    if (n.includes('tunnel')) return `<div class="p-stage"><div class="loader-tunnel"><span></span><span></span><span></span></div></div>`;
    if (n.includes('pixel loader') || n.includes('pixel')) return `<div class="p-stage"><div class="loader-pixel"><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span></div></div>`;
    if (n.includes('ambient glow') || n.includes('ambient')) return `<div class="p-stage"><div class="loader-ambient-glow"></div></div>`;
    if (n.includes('holographic') || n.includes('holo')) return `<div class="p-stage"><div class="loader-holo"></div></div>`;
    if (n.includes('bounce chain')) return `<div class="p-stage"><div class="loader-bounce-chain"><span></span><span></span><span></span></div></div>`;
    if (n.includes('frosted')) return `<div class="p-stage"><div class="loader-frosted"></div></div>`;
    return `<div class="p-stage"><div class="loader-ring"></div></div>`;
  }

  // ── SCROLL ────────────────────────────────────────────────────────────────
  if (cat === 'scroll') {
    const scrollLabel = name.split(' ').slice(0,3).join(' ');
    if (n.includes('fade in')) return `<div class="p-stage" data-anim="scroll-sim"><div class="scroll-fade-in" style="padding:12px 20px;background:linear-gradient(135deg,#f0eff9,#fff);border:1.5px solid #e2e1e8;border-radius:10px;font-size:13px;font-weight:700;color:#4f46e5">Fade In ✦</div></div>`;
    if (n.includes('slide up')) return `<div class="p-stage" data-anim="scroll-sim"><div class="scroll-slide-up" style="padding:12px 20px;background:#fff;border:1.5px solid #e2e1e8;border-radius:10px;font-size:13px;font-weight:700;color:#4f46e5">Slide Up ↑</div></div>`;
    if (n.includes('scale reveal')) return `<div class="p-stage" data-anim="scroll-sim"><div class="scroll-scale-reveal" style="padding:12px 20px;background:#fff;border:1.5px solid #e2e1e8;border-radius:10px;font-size:13px;font-weight:700;color:#4f46e5">Scale In ✦</div></div>`;
    if (n.includes('mask reveal') || n.includes('mask')) return `<div class="p-stage" data-anim="scroll-sim"><div class="scroll-mask-reveal" style="padding:12px 20px;background:linear-gradient(135deg,#4f46e5,#7c3aed);border-radius:10px;font-size:13px;font-weight:700;color:#fff">Mask ✦</div></div>`;
    if (n.includes('bounce entry') || n.includes('bounce')) return `<div class="p-stage" data-anim="scroll-sim"><div class="scroll-bounce-entry" style="padding:12px 20px;background:#fff;border:1.5px solid #e2e1e8;border-radius:10px;font-size:13px;font-weight:700;color:#4f46e5">Bounce ↕</div></div>`;
    if (n.includes('cascade') || n.includes('sequential grid')) return `<div class="p-stage" data-anim="scroll-cascade"><div class="scroll-cascade" style="display:flex;flex-direction:column;gap:6px"><div style="padding:6px 12px;background:#f0eff9;border-radius:8px;font-size:11px;font-weight:700;color:#4f46e5">Item 1</div><div style="padding:6px 12px;background:#f0eff9;border-radius:8px;font-size:11px;font-weight:700;color:#4f46e5">Item 2</div><div style="padding:6px 12px;background:#f0eff9;border-radius:8px;font-size:11px;font-weight:700;color:#4f46e5">Item 3</div></div></div>`;
    if (n.includes('curtain')) return `<div class="p-stage" data-anim="scroll-sim"><div class="scroll-curtain" style="padding:12px 20px;background:linear-gradient(135deg,#4f46e5,#0ea5e9);border-radius:10px;font-size:13px;font-weight:700;color:#fff">Curtain ↑</div></div>`;
    if (n.includes('rotate card') || n.includes('rotate')) return `<div class="p-stage" data-anim="scroll-sim"><div class="scroll-rotate-card" style="padding:12px 20px;background:#fff;border:1.5px solid #e2e1e8;border-radius:10px;font-size:13px;font-weight:700;color:#4f46e5">Rotate ↻</div></div>`;
    if (n.includes('cinematic')) return `<div class="p-stage" data-anim="scroll-sim"><div class="scroll-cinematic-transition" style="padding:12px 20px;background:#fff;border:1.5px solid #e2e1e8;border-radius:10px;font-size:13px;font-weight:700;color:#4f46e5">Cinematic ✦</div></div>`;
    if (n.includes('progress bar')) return `<div class="p-stage" data-anim="progress-sim"><div style="width:160px"><div style="font-size:11px;color:#5a587a;margin-bottom:6px;font-weight:600">Scroll Progress</div><div style="height:4px;background:#f0eff9;border-radius:2px;overflow:hidden"><div class="scroll-progress-anim" style="height:100%;background:linear-gradient(90deg,#4f46e5,#7c3aed);width:0%;border-radius:2px;transition:width 0.1s"></div></div></div></div>`;
    if (n.includes('marquee') || n.includes('infinite scroll marquee')) return `<div class="p-stage" style="overflow:hidden;width:180px"><div style="display:flex;gap:20px;animation:shimmerPass 3s linear infinite;white-space:nowrap"><span style="font-size:13px;font-weight:700;color:#4f46e5">SDS Motion</span><span style="font-size:13px;color:#7c3aed;font-weight:700">◉</span><span style="font-size:13px;font-weight:700;color:#4f46e5">Animation</span><span style="font-size:13px;color:#0ea5e9;font-weight:700">◈</span><span style="font-size:13px;font-weight:700;color:#4f46e5">Library</span></div></div>`;
    if (n.includes('parallax')) return `<div class="p-stage" style="overflow:hidden;height:80px;background:linear-gradient(135deg,#f0eff9,#fff);border-radius:10px"><div style="transform:translateY(-10px);animation:floatingGlyphs 3s ease-in-out infinite;text-align:center;padding-top:16px;font-size:13px;font-weight:700;color:#4f46e5">Parallax Layer ↕</div></div>`;
    if (n.includes('line reveal') || n.includes('text line')) return `<div class="p-stage" data-anim="scroll-cascade"><div class="scroll-line-reveal" style="display:flex;flex-direction:column;gap:4px"><div style="font-size:12px;font-weight:700;color:#1a1830">First line</div><div style="font-size:12px;font-weight:700;color:#4f46e5">Second line</div><div style="font-size:12px;font-weight:700;color:#7c3aed">Third line</div></div></div>`;
    return `<div class="p-stage" data-anim="scroll-sim"><div class="scroll-slide-up" style="padding:12px 20px;background:#fff;border:1.5px solid #e2e1e8;border-radius:10px;font-size:12px;font-weight:700;color:#4f46e5">${scrollLabel}</div></div>`;
  }

  // ── CURSOR ────────────────────────────────────────────────────────────────
  if (cat === 'cursor') {
    if (n.includes('trail') && !n.includes('glow') && !n.includes('beam') && !n.includes('react')) return `<div class="p-stage" data-anim="cursor-trail-demo"><div style="position:relative;width:100%;height:100%;cursor:none;overflow:hidden"><div class="cursor-demo-dot" style="position:absolute;width:10px;height:10px;background:#4f46e5;border-radius:50%;top:50%;left:30%;transform:translate(-50%,-50%);transition:all 0.1s;pointer-events:none"></div></div><div style="font-size:11px;color:#5a587a;text-align:center;margin-top:4px">Move cursor</div></div>`;
    if (n.includes('blob')) return `<div class="p-stage" data-anim="cursor-blob-demo"><div style="position:relative;width:100%;height:80px;cursor:none;overflow:hidden;border-radius:8px;background:#f0eff9"><div class="cursor-blob-el" style="position:absolute;width:30px;height:30px;background:rgba(79,70,229,.3);border-radius:50%;top:40px;left:50%;transform:translate(-50%,-50%);animation:liquidLoad 3s ease-in-out infinite;pointer-events:none"></div></div></div>`;
    if (n.includes('magnetic')) return `<div class="p-stage" data-anim="cursor-magnetic-demo"><div style="display:flex;align-items:center;justify-content:center;height:80px"><div class="cursor-magnetic-el" style="width:80px;height:36px;background:#4f46e5;border-radius:8px;display:flex;align-items:center;justify-content:center;color:#fff;font-size:12px;font-weight:700;cursor:pointer;transition:transform 0.2s var(--ease-out)">Magnetic</div></div></div>`;
    if (n.includes('spotlight')) return `<div class="p-stage" data-anim="cursor-spotlight-demo"><div style="position:relative;width:100%;height:80px;background:#1a1830;border-radius:8px;overflow:hidden"><div class="cursor-spot-el" style="position:absolute;width:100px;height:100px;border-radius:50%;background:radial-gradient(circle,rgba(79,70,229,.4),transparent 70%);top:50%;left:50%;transform:translate(-50%,-50%);pointer-events:none;animation:breathingTitle 2s ease-in-out infinite"></div><span style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);color:#fff;font-size:13px;font-weight:700;z-index:1">Spotlight</span></div></div>`;
    if (n.includes('ripple') || n.includes('click')) return `<div class="p-stage" data-anim="cursor-ripple-demo"><div style="display:flex;align-items:center;justify-content:center;height:80px;cursor:pointer" onclick="this.style.animation='';void this.offsetWidth;this.style.animation=''"><div style="width:80px;height:36px;background:#4f46e5;border-radius:8px;display:flex;align-items:center;justify-content:center;color:#fff;font-size:12px;font-weight:700;position:relative;overflow:hidden;cursor:pointer" id="ripple-btn-${idx}">Click →</div></div></div>`;
    if (n.includes('glow')) return `<div class="p-stage" data-anim="cursor-glow-demo"><div style="position:relative;height:80px;background:#f0eff9;border-radius:8px;overflow:hidden;cursor:none"><div class="cursor-glow-el" style="position:absolute;width:80px;height:80px;background:radial-gradient(circle,rgba(79,70,229,.25),transparent 70%);border-radius:50%;top:50%;left:50%;transform:translate(-50%,-50%);pointer-events:none;animation:breathingTitle 2s ease-in-out infinite"></div></div></div>`;
    if (n.includes('ring')) return `<div class="p-stage"><div style="display:flex;align-items:center;justify-content:center;height:80px"><div class="loader-ring" style="position:relative;top:0;left:0"></div></div></div>`;
    if (n.includes('tilt') || n.includes('physics') && n.includes('card')) return `<div class="p-stage" data-anim="card-tilt"><div class="cursor-tilt-physics" style="width:140px;height:80px;background:linear-gradient(135deg,#f0eff9,#fff);border:1.5px solid #e2e1e8;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;color:#4f46e5;cursor:pointer">Tilt Card</div></div>`;
    if (n.includes('elastic') || n.includes('spring') || n.includes('follow')) return `<div class="p-stage" data-anim="cursor-elastic-demo"><div style="position:relative;height:80px;cursor:none;background:#f0eff9;border-radius:8px;overflow:hidden"><div class="cursor-spring-el" style="position:absolute;width:16px;height:16px;background:#4f46e5;border-radius:50%;top:50%;left:50%;transform:translate(-50%,-50%);transition:left 0.3s var(--ease-spring),top 0.3s var(--ease-spring);pointer-events:none"></div><div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:11px;color:#5a587a;font-weight:600">Move cursor</div></div></div>`;
    if (n.includes('parallax')) return `<div class="p-stage" data-anim="cursor-parallax-demo"><div style="position:relative;height:80px;background:linear-gradient(135deg,#f0eff9,#fff);border-radius:8px;overflow:hidden;cursor:none"><div class="cursor-parallax-l1" style="position:absolute;font-size:20px;top:20px;left:40px;color:#4f46e5;font-weight:800;transition:transform 0.2s">✦</div><div class="cursor-parallax-l2" style="position:absolute;font-size:14px;top:40px;right:40px;color:#7c3aed;font-weight:800;transition:transform 0.15s">◉</div><div class="cursor-parallax-l3" style="position:absolute;font-size:10px;bottom:15px;left:60px;color:#0ea5e9;font-weight:800;transition:transform 0.1s">◈</div></div></div>`;
    // Generic cursor demos
    return `<div class="p-stage" data-anim="cursor-generic-demo"><div style="position:relative;height:80px;background:#f0eff9;border-radius:8px;display:flex;align-items:center;justify-content:center;cursor:none;overflow:hidden"><div class="cursor-generic-el" style="position:absolute;width:14px;height:14px;background:#4f46e5;border-radius:50%;top:50%;left:50%;transform:translate(-50%,-50%);animation:floatingGlyphs 2s ease-in-out infinite;pointer-events:none"></div><span style="font-size:11px;color:#5a587a;font-weight:600">Interactive</span></div></div>`;
  }

  // ── MICRO ─────────────────────────────────────────────────────────────────
  if (cat === 'micro') {
    if (n.includes('toggle') || n.includes('switch')) return `<div class="p-stage" data-anim="toggle-demo"><div class="micro-toggle" id="toggle-${idx}" onclick="this.classList.toggle('on')"></div><span style="font-size:11px;color:#5a587a;margin-top:6px;display:block;text-align:center">Click to toggle</span></div>`;
    if (n.includes('checkbox')) return `<div class="p-stage" data-anim="checkbox-demo"><div class="micro-checkbox" id="chk-${idx}" onclick="this.classList.toggle('checked')" style="display:flex;align-items:center;justify-content:center"><svg width="12" height="12" viewBox="0 0 12 12" style="display:none"><polyline points="2,6 5,9 10,3" stroke="#fff" stroke-width="2" fill="none"/></svg></div><span style="font-size:11px;color:#5a587a;margin-top:8px;display:block;text-align:center">Click</span></div>`;
    if (n.includes('like') || n.includes('heart')) return `<div class="p-stage" data-anim="like-demo"><div class="micro-like" id="like-${idx}" onclick="this.classList.toggle('liked')" style="font-size:32px;cursor:pointer;display:inline-block;color:#e2e1e8">♥</div><span style="font-size:11px;color:#5a587a;margin-top:6px;display:block;text-align:center">Click</span></div>`;
    if (n.includes('accordion') || n.includes('expand')) return `<div class="p-stage" data-anim="accordion-demo"><div class="micro-accordion" id="acc-${idx}" style="width:160px;border:1.5px solid #e2e1e8;border-radius:8px;overflow:hidden"><div class="acc-header" onclick="this.parentElement.classList.toggle('open')" style="padding:10px 12px;cursor:pointer;display:flex;justify-content:space-between;align-items:center;font-size:12px;font-weight:700;color:#1a1830;background:#fff">Details <span class="acc-arrow" style="font-size:10px">▼</span></div><div class="acc-body" style="padding:0 12px;font-size:11px;color:#5a587a;line-height:1.5">Animation preview content goes here.</div></div></div>`;
    if (n.includes('tooltip')) return `<div class="p-stage"><div class="micro-tooltip" style="display:inline-block"><button style="background:#4f46e5;color:#fff;border:none;padding:8px 18px;border-radius:8px;font-size:13px;font-weight:600;cursor:pointer">Hover ✦<div class="tip">Tooltip appears!</div></button></div></div>`;
    if (n.includes('tab') && n.includes('underline')) return `<div class="p-stage"><div style="display:flex;gap:0;border-bottom:2px solid #e2e1e8;width:180px;position:relative"><div class="tab-demo-item" onclick="switchTab(this,0)" style="padding:8px 14px;font-size:12px;font-weight:600;cursor:pointer;color:#4f46e5;border-bottom:2px solid #4f46e5;margin-bottom:-2px">Design</div><div class="tab-demo-item" onclick="switchTab(this,1)" style="padding:8px 14px;font-size:12px;font-weight:600;cursor:pointer;color:#5a587a">Code</div><div class="tab-demo-item" onclick="switchTab(this,2)" style="padding:8px 14px;font-size:12px;font-weight:600;cursor:pointer;color:#5a587a">Preview</div></div></div>`;
    if (n.includes('copy success') || n.includes('copy')) return `<div class="p-stage" data-anim="copy-demo"><button id="copy-${idx}" onclick="var b=this;b.textContent='✓ Copied!';b.style.background='#10b981';setTimeout(()=>{b.textContent='Copy Code';b.style.background=''},1800)" style="background:#4f46e5;color:#fff;border:none;padding:8px 18px;border-radius:8px;font-size:12px;font-weight:600;cursor:pointer;transition:background 0.3s">Copy Code</button></div>`;
    if (n.includes('toast')) return `<div class="p-stage" data-anim="toast-loop"><div class="micro-toast" style="background:#fff;border:1.5px solid #e2e1e8;border-radius:10px;padding:10px 14px;font-size:12px;font-weight:600;color:#1a1830;box-shadow:0 4px 20px rgba(0,0,0,.08);display:flex;align-items:center;gap:8px;width:160px"><span style="color:#10b981">✓</span> Saved!</div></div>`;
    if (n.includes('avatar') || n.includes('float')) return `<div class="p-stage"><div class="micro-avatar" style="width:48px;height:48px;border-radius:50%;background:linear-gradient(135deg,#4f46e5,#7c3aed);display:flex;align-items:center;justify-content:center;color:#fff;font-size:18px;font-weight:700;cursor:pointer">A</div></div>`;
    if (n.includes('progress') && n.includes('fill')) return `<div class="p-stage" data-anim="progress-sim"><div style="width:170px"><div class="micro-progress"><div class="micro-progress-bar" style="width:0%" id="pb-${idx}"></div></div><div style="font-size:11px;color:#5a587a;margin-top:6px;text-align:center" id="pbv-${idx}">0%</div></div></div>`;
    if (n.includes('menu') || n.includes('cascade')) return `<div class="p-stage" data-anim="menu-sim"><div class="micro-menu open" style="display:flex;flex-direction:column;gap:4px;width:130px"><div style="padding:6px 12px;background:#fff;border:1px solid #e2e1e8;border-radius:8px;font-size:12px;font-weight:600;color:#1a1830">Home</div><div style="padding:6px 12px;background:#fff;border:1px solid #e2e1e8;border-radius:8px;font-size:12px;font-weight:600;color:#1a1830">About</div><div style="padding:6px 12px;background:#fff;border:1px solid #e2e1e8;border-radius:8px;font-size:12px;font-weight:600;color:#1a1830">Work</div></div></div>`;
    if (n.includes('fab') || n.includes('floating action')) return `<div class="p-stage"><div class="micro-fab" style="width:46px;height:46px;background:#4f46e5;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font-size:22px;cursor:pointer;box-shadow:0 4px 20px rgba(79,70,229,.3)">+</div></div>`;
    if (n.includes('wiggle')) return `<div class="p-stage" data-anim="hover-sim"><button class="micro-wiggle" style="background:#4f46e5;color:#fff;border:none;padding:8px 18px;border-radius:8px;font-size:13px;font-weight:600;cursor:pointer">Wiggle 👋</button></div>`;
    if (n.includes('badge')) return `<div class="p-stage" data-anim="badge-sim"><div style="position:relative;display:inline-block"><div style="width:40px;height:40px;background:#f0eff9;border-radius:8px;border:1.5px solid #e2e1e8"></div><div class="micro-badge" id="badge-${idx}" style="position:absolute;top:-8px;right:-8px;width:20px;height:20px;background:#ef4444;border-radius:50%;color:#fff;font-size:10px;font-weight:700;display:flex;align-items:center;justify-content:center">3</div></div></div>`;
    if (n.includes('modal')) return `<div class="p-stage"><div class="micro-modal open" style="background:#fff;border:1.5px solid #e2e1e8;border-radius:12px;padding:14px;width:160px;box-shadow:0 8px 40px rgba(79,70,229,.15)"><div style="font-size:13px;font-weight:700;color:#1a1830;margin-bottom:6px">Modal ✦</div><div style="font-size:11px;color:#5a587a">Spring reveal effect</div></div></div>`;
    if (n.includes('star') || n.includes('rating')) return `<div class="p-stage"><div class="micro-stars" style="display:flex;gap:4px">${[1,2,3,4,5].map(i=>`<span class="star ${i<=4?'active':''}" onclick="this.parentElement.querySelectorAll('.star').forEach((s,j)=>j<${i}?s.classList.add('active'):s.classList.remove('active'))" style="font-size:22px;cursor:pointer;color:${i<=4?'#f59e0b':'#e2e1e8'};transition:all 0.2s">★</span>`).join('')}</div></div>`;
    if (n.includes('search') || n.includes('expand search')) return `<div class="p-stage" data-anim="search-demo"><div class="micro-search" id="search-${idx}" onclick="this.classList.toggle('open')" style="display:flex;align-items:center;background:#f0eff9;border-radius:8px;overflow:hidden;cursor:pointer;padding:8px 12px;gap:8px"><span style="color:#4f46e5;font-size:14px">🔍</span><span style="font-size:12px;font-weight:600;color:#4f46e5;white-space:nowrap">Search</span></div></div>`;
    if (n.includes('counter') || n.includes('rolling') || n.includes('number')) return `<div class="p-stage" data-anim="counter-demo"><div style="font-size:32px;font-weight:900;color:#4f46e5" id="counter-${idx}">0</div><div style="font-size:11px;color:#5a587a">animations</div></div>`;
    if (n.includes('link') || n.includes('beam') || n.includes('underline')) return `<div class="p-stage"><a class="micro-link-beam" href="#" onclick="return false" style="font-size:16px;font-weight:700;color:#4f46e5;text-decoration:none;position:relative;padding-bottom:2px">View Library →</a></div>`;
    if (n.includes('drag') || n.includes('elevation')) return `<div class="p-stage" data-anim="drag-demo"><div class="micro-drag-elevation" id="drag-${idx}" style="padding:10px 16px;background:#fff;border:1.5px solid #e2e1e8;border-radius:8px;font-size:12px;font-weight:700;color:#1a1830;cursor:grab;width:140px;text-align:center">Drag Card ↕</div></div>`;
    if (n.includes('loading button') || n.includes('loading morph')) return `<div class="p-stage" data-anim="loading-btn-demo"><button id="lbtn-${idx}" onclick="var b=this;b.innerHTML='<div class=loader-ring style=width:18px;height:18px;border-width:2px;border-top-color:#fff;display:inline-block></div>';b.style.padding='10px 16px';setTimeout(()=>{b.innerHTML='✓ Done!';b.style.background='#10b981';setTimeout(()=>{b.innerHTML='Submit';b.style.background='';b.style.padding=''},1500)},1500)" style="background:#4f46e5;color:#fff;border:none;padding:10px 20px;border-radius:8px;font-size:13px;font-weight:600;cursor:pointer;min-width:90px;display:flex;align-items:center;justify-content:center;gap:8px">Submit</button></div>`;
    if (n.includes('stepper') || n.includes('step')) return `<div class="p-stage"><div class="micro-stepper" style="display:flex;gap:6px">${[1,2,3,4].map(i=>`<div class="step ${i===2?'active':''}" onclick="this.parentElement.querySelectorAll('.step').forEach(s=>s.classList.remove('active'));this.classList.add('active')" style="width:28px;height:28px;border-radius:50%;background:${i===2?'#4f46e5':'#f0eff9'};border:2px solid ${i===2?'#4f46e5':'#e2e1e8'};display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:${i===2?'#fff':'#5a587a'};cursor:pointer;transition:all 0.3s var(--ease-spring)">${i}</div>`).join('')}</div></div>`;
    if (n.includes('ambient') || n.includes('idle')) return `<div class="p-stage"><div class="micro-ambient" style="font-size:28px">✦</div></div>`;
    return `<div class="p-stage"><div class="card-breathing" style="padding:10px 16px;background:#fff;border:1.5px solid #e2e1e8;border-radius:10px;font-size:12px;font-weight:700;color:#4f46e5;text-align:center">${name.split(' ').slice(0,3).join(' ')}</div></div>`;
  }

  // ── WEBCOMP ───────────────────────────────────────────────────────────────
  if (cat === 'webcomp') {
    if (n.includes('navbar') || n.includes('nav bar')) return `<div class="p-stage" style="padding:0"><div class="wc-navbar" style="padding:10px 16px;display:flex;align-items:center;justify-content:space-between;width:100%;box-sizing:border-box"><span style="font-size:13px;font-weight:800;color:#4f46e5">Brand</span><div style="display:flex;gap:10px"><span style="font-size:11px;font-weight:600;color:#5a587a">Home</span><span style="font-size:11px;font-weight:600;color:#4f46e5">Docs</span><span style="font-size:11px;font-weight:600;color:#5a587a">API</span></div></div></div>`;
    if (n.includes('sidebar') && n.includes('morphing')) return `<div class="p-stage" data-anim="sidebar-demo" style="overflow:hidden"><div class="wc-sidebar" id="sb-${idx}" style="height:80px;background:#f0eff9;border:1.5px solid #e2e1e8;border-radius:10px;overflow:hidden;transition:width 0.4s var(--ease-spring);display:flex;flex-direction:column;gap:6px;padding:10px 12px"><div style="font-size:11px;font-weight:700;color:#4f46e5;white-space:nowrap">◉ Dashboard</div><div style="font-size:11px;font-weight:700;color:#5a587a;white-space:nowrap">◈ Analytics</div><div style="font-size:11px;font-weight:700;color:#5a587a;white-space:nowrap">▣ Settings</div></div></div>`;
    if (n.includes('carousel') || n.includes('infinite carousel')) return `<div class="p-stage" style="overflow:hidden"><div style="display:flex;gap:10px;animation:shimmerPass 4s linear infinite;white-space:nowrap"><div style="min-width:100px;height:60px;background:linear-gradient(135deg,#4f46e5,#7c3aed);border-radius:8px;flex-shrink:0"></div><div style="min-width:100px;height:60px;background:linear-gradient(135deg,#7c3aed,#0ea5e9);border-radius:8px;flex-shrink:0"></div><div style="min-width:100px;height:60px;background:linear-gradient(135deg,#0ea5e9,#10b981);border-radius:8px;flex-shrink:0"></div><div style="min-width:100px;height:60px;background:linear-gradient(135deg,#4f46e5,#7c3aed);border-radius:8px;flex-shrink:0"></div></div></div>`;
    if (n.includes('dock')) return `<div class="p-stage"><div class="wc-dock" style="background:#f0eff9;border:1.5px solid #e2e1e8;border-radius:12px;padding:8px 12px;display:flex;gap:8px;align-items:flex-end"><div class="wc-dock-item" style="width:32px;height:32px;background:#4f46e5;border-radius:8px;display:flex;align-items:center;justify-content:center;color:#fff;font-size:14px;cursor:pointer">◉</div><div class="wc-dock-item" style="width:32px;height:32px;background:#7c3aed;border-radius:8px;display:flex;align-items:center;justify-content:center;color:#fff;font-size:14px;cursor:pointer">◈</div><div class="wc-dock-item" style="width:32px;height:32px;background:#0ea5e9;border-radius:8px;display:flex;align-items:center;justify-content:center;color:#fff;font-size:14px;cursor:pointer">▣</div><div class="wc-dock-item" style="width:32px;height:32px;background:#10b981;border-radius:8px;display:flex;align-items:center;justify-content:center;color:#fff;font-size:14px;cursor:pointer">✦</div></div></div>`;
    if (n.includes('pricing')) return `<div class="p-stage" data-anim="hover-sim"><div class="wc-pricing-card" style="width:150px;background:#fff;border:1.5px solid #e2e1e8;border-radius:12px;padding:12px;cursor:pointer"><div style="font-size:12px;font-weight:700;color:#5a587a">Pro</div><div style="font-size:22px;font-weight:900;color:#4f46e5;margin:4px 0">$49</div><div style="font-size:10px;color:#5a587a">/month</div></div></div>`;
    if (n.includes('hero') || n.includes('hero section')) return `<div class="p-stage" style="background:linear-gradient(135deg,#f0eff9,#fff);border-radius:10px;overflow:hidden"><div class="wc-hero-typo in-view" style="padding:12px"><div style="--i:0;font-size:16px;font-weight:900;color:#1a1830;opacity:0;transform:translateY(30px);animation:cinematicFade 0.7s var(--ease-out) forwards">Motion</div><div style="--i:1;font-size:11px;color:#5a587a;opacity:0;transform:translateY(30px);animation:cinematicFade 0.7s var(--ease-out) 0.15s forwards">by Class Name</div></div></div>`;
    if (n.includes('modal') || n.includes('elastic modal')) return `<div class="p-stage"><div class="wc-modal open" style="background:#fff;border:1.5px solid #e2e1e8;border-radius:14px;padding:14px;width:170px;box-shadow:0 8px 40px rgba(79,70,229,.15)"><div style="font-size:13px;font-weight:800;color:#1a1830;margin-bottom:6px">Modal ✦</div><div style="font-size:11px;color:#5a587a;margin-bottom:10px">Spring scale reveal</div><button style="background:#4f46e5;color:#fff;border:none;padding:6px 14px;border-radius:6px;font-size:11px;font-weight:600;cursor:pointer">Close</button></div></div>`;
    if (n.includes('faq') || n.includes('accordion')) return `<div class="p-stage"><div class="wc-faq-panel" id="faq-${idx}" style="width:175px;border:1.5px solid #e2e1e8;border-radius:10px;overflow:hidden;background:#fff"><div class="faq-header" onclick="this.parentElement.classList.toggle('open')" style="padding:10px 12px;cursor:pointer;display:flex;justify-content:space-between;align-items:center;font-size:12px;font-weight:700;color:#1a1830">How does it work? <span class="faq-arrow" style="font-size:10px;transition:transform 0.3s var(--ease-spring)">▼</span></div><div class="faq-body" style="padding:0;max-height:0;overflow:hidden;transition:max-height 0.5s var(--ease-out)"><div style="padding:8px 12px;font-size:11px;color:#5a587a">Add a class, watch it animate.</div></div></div></div>`;
    if (n.includes('tabs')) return `<div class="p-stage"><div class="wc-tabs" style="width:180px;border-bottom:2px solid #e2e1e8;position:relative"><div style="display:flex"><div onclick="moveTabIndicator(this)" style="padding:8px 14px;font-size:12px;font-weight:600;cursor:pointer;color:#4f46e5">Design</div><div onclick="moveTabIndicator(this)" style="padding:8px 14px;font-size:12px;font-weight:600;cursor:pointer;color:#5a587a">Code</div><div onclick="moveTabIndicator(this)" style="padding:8px 14px;font-size:12px;font-weight:600;cursor:pointer;color:#5a587a">Preview</div></div><div id="wc-tabs-ind-${idx}" style="position:absolute;bottom:-2px;left:0;height:2px;width:52px;background:#4f46e5;transition:left 0.3s var(--ease-spring),width 0.3s var(--ease-spring)"></div></div></div>`;
    if (n.includes('command palette') || n.includes('command')) return `<div class="p-stage"><div class="wc-command open" style="background:#fff;border:1.5px solid #e2e1e8;border-radius:12px;padding:10px;width:170px;box-shadow:0 8px 40px rgba(79,70,229,.15)"><div style="display:flex;align-items:center;gap:8px;border-bottom:1px solid #e2e1e8;padding-bottom:8px;margin-bottom:8px"><span style="font-size:12px;color:#5a587a">⌘</span><span style="font-size:12px;font-weight:600;color:#5a587a">Search commands...</span></div><div style="font-size:11px;font-weight:700;color:#4f46e5;padding:4px 0">✦ Animate</div><div style="font-size:11px;color:#5a587a;padding:4px 0">⊕ Add Effect</div></div></div>`;
    if (n.includes('stats') || n.includes('counter')) return `<div class="p-stage" data-anim="counter-demo"><div style="display:flex;gap:16px"><div style="text-align:center"><div class="wc-stats-inner" style="font-size:26px;font-weight:900;color:#4f46e5" id="sc1-${idx}">0</div><div style="font-size:10px;color:#5a587a;font-weight:600">Animations</div></div><div style="text-align:center"><div class="wc-stats-inner" style="font-size:26px;font-weight:900;color:#7c3aed" id="sc2-${idx}">0</div><div style="font-size:10px;color:#5a587a;font-weight:600">Classes</div></div></div></div>`;
    if (n.includes('marquee') || n.includes('logo marquee')) return `<div class="p-stage" style="overflow:hidden;width:100%"><div style="display:flex;gap:20px;animation:shimmerPass 5s linear infinite;white-space:nowrap;align-items:center"><span style="font-size:12px;font-weight:700;color:#4f46e5">Vercel</span><span style="color:#e2e1e8">◉</span><span style="font-size:12px;font-weight:700;color:#7c3aed">Stripe</span><span style="color:#e2e1e8">◈</span><span style="font-size:12px;font-weight:700;color:#0ea5e9">Linear</span><span style="color:#e2e1e8">◉</span><span style="font-size:12px;font-weight:700;color:#10b981">Figma</span><span style="color:#e2e1e8">◈</span><span style="font-size:12px;font-weight:700;color:#4f46e5">Vercel</span></div></div>`;
    if (n.includes('timeline')) return `<div class="p-stage"><div class="wc-timeline in-view" style="display:flex;flex-direction:column;gap:6px;width:160px"><div style="display:flex;gap:8px;align-items:center"><div style="width:8px;height:8px;border-radius:50%;background:#4f46e5;flex-shrink:0"></div><div style="font-size:11px;font-weight:600;color:#1a1830">v1.0 Released</div></div><div style="display:flex;gap:8px;align-items:center"><div style="width:8px;height:8px;border-radius:50%;background:#7c3aed;flex-shrink:0"></div><div style="font-size:11px;font-weight:600;color:#1a1830">450 Animations</div></div><div style="display:flex;gap:8px;align-items:center"><div style="width:8px;height:8px;border-radius:50%;background:#0ea5e9;flex-shrink:0"></div><div style="font-size:11px;font-weight:600;color:#1a1830">Open Source</div></div></div></div>`;
    if (n.includes('data table') || n.includes('table')) return `<div class="p-stage" style="padding:0"><table class="wc-data-table" style="width:100%;border-collapse:collapse;font-size:11px"><thead><tr style="background:#f0eff9"><th style="padding:6px 10px;text-align:left;font-weight:700;color:#5a587a">Name</th><th style="padding:6px 10px;text-align:left;font-weight:700;color:#5a587a">Type</th></tr></thead><tbody><tr style="cursor:pointer;border-bottom:1px solid #e2e1e8"><td style="padding:6px 10px;color:#1a1830;font-weight:600">Word Morph</td><td style="padding:6px 10px;color:#4f46e5">typo</td></tr><tr style="cursor:pointer"><td style="padding:6px 10px;color:#1a1830;font-weight:600">Glow Pulse</td><td style="padding:6px 10px;color:#7c3aed">btn</td></tr></tbody></table></div>`;
    if (n.includes('upload') || n.includes('file upload')) return `<div class="p-stage"><div class="wc-upload-zone" style="width:170px;height:70px;border-radius:10px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;cursor:pointer" onmouseover="this.classList.add('drag-over')" onmouseout="this.classList.remove('drag-over')"><div style="font-size:18px">☁</div><div style="font-size:11px;font-weight:600;color:#5a587a">Drop files here</div></div></div>`;
    if (n.includes('dashboard') || n.includes('saas')) return `<div class="p-stage"><div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;width:170px"><div class="wc-dashboard-panel" style="background:#fff;border:1.5px solid #e2e1e8;border-radius:8px;padding:8px;cursor:pointer"><div style="font-size:18px;font-weight:900;color:#4f46e5">450</div><div style="font-size:9px;color:#5a587a;font-weight:600">Animations</div></div><div class="wc-dashboard-panel" style="background:#fff;border:1.5px solid #e2e1e8;border-radius:8px;padding:8px;cursor:pointer"><div style="font-size:18px;font-weight:900;color:#7c3aed">9</div><div style="font-size:9px;color:#5a587a;font-weight:600">Categories</div></div></div></div>`;
    if (n.includes('kanban')) return `<div class="p-stage"><div style="display:flex;gap:8px"><div style="background:#f0eff9;border-radius:8px;padding:6px;width:70px"><div style="font-size:9px;font-weight:700;color:#5a587a;margin-bottom:4px">TODO</div><div class="wc-kanban-card" style="background:#fff;border:1px solid #e2e1e8;border-radius:6px;padding:4px 6px;font-size:9px;font-weight:600;color:#1a1830;cursor:grab">Task A</div></div><div style="background:#f0eff9;border-radius:8px;padding:6px;width:70px"><div style="font-size:9px;font-weight:700;color:#4f46e5;margin-bottom:4px">DOING</div><div class="wc-kanban-card" style="background:#fff;border:1px solid #4f46e5;border-radius:6px;padding:4px 6px;font-size:9px;font-weight:600;color:#4f46e5;cursor:grab">Task B</div></div></div></div>`;
    if (n.includes('gallery') || n.includes('reveal gallery')) return `<div class="p-stage" data-anim="scroll-cascade"><div class="wc-reveal-gallery in-view" style="display:grid;grid-template-columns:repeat(3,1fr);gap:4px;width:170px"><div style="height:40px;background:linear-gradient(135deg,#4f46e5,#7c3aed);border-radius:6px;opacity:0;clip-path:inset(0 100% 0 0)"></div><div style="height:40px;background:linear-gradient(135deg,#7c3aed,#0ea5e9);border-radius:6px;opacity:0;clip-path:inset(0 100% 0 0)"></div><div style="height:40px;background:linear-gradient(135deg,#0ea5e9,#10b981);border-radius:6px;opacity:0;clip-path:inset(0 100% 0 0)"></div></div></div>`;
    if (n.includes('footer')) return `<div class="p-stage" style="padding:0"><div class="wc-footer" style="background:#f0eff9;padding:12px 16px;border-radius:10px;display:flex;justify-content:space-between;align-items:center;width:100%;box-sizing:border-box"><div style="font-size:12px;font-weight:800;color:#4f46e5">SDS Motion</div><div style="font-size:10px;color:#5a587a">© 2025</div></div></div>`;
    return `<div class="p-stage" data-anim="hover-sim"><div class="wc-dashboard-panel" style="width:170px;height:70px;background:#fff;border:1.5px solid #e2e1e8;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;color:#4f46e5;cursor:pointer">${name.split(' ').slice(0,3).join(' ')}</div></div>`;
  }

  return `<div class="p-stage"><div style="font-size:12px;color:#5a587a">${name}</div></div>`;
}

// ─── Build the full data with previews ────────────────────────────────────────
const richData = {};
categories.forEach(cat => {
  const items = animationData[cat + 'Animations'] || [];
  richData[cat] = items.map((item, idx) => ({
    ...item,
    preview: getPreview(cat, item.name, item.cls, item.desc, `${cat}-${idx}`)
  }));
});

// ─── Tab & Section HTML ───────────────────────────────────────────────────────
const tabsHTML = categories.map((c, i) => `
  <button class="tab-btn ${i===0?'active':''}" onclick="switchTab('${c}',this)" id="tab-${c}">
    <span class="tab-icon">${tabIcons[c]}</span>
    <span class="tab-label">${tabNames[c]}</span>
  </button>`).join('');

const sectionsHTML = categories.map((c, i) => `
  <section class="section ${i===0?'active':''}" id="sec-${c}">
    <div class="section-header">
      <div class="section-title-wrap">
        <div class="section-icon-box">${tabIcons[c]}</div>
        <h2 class="section-title">${tabNames[c]} <span class="text-gradient">Motion</span></h2>
      </div>
      <p class="section-desc">50 production-ready ${tabNames[c].toLowerCase()} animations. Seamlessly integrated, hyper-optimized.</p>
    </div>
    <div class="anim-grid" id="grid-${c}"></div>
  </section>`).join('');

// ─── Full HTML ─────────────────────────────────────────────────────────────────
const html = `<!DOCTYPE html>
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
${allCSS}

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
      <div class="tabs-bar">${tabsHTML}</div>
    </div>
    <div class="content-scroll">
      ${sectionsHTML}
    </div>
  </main>
</div>

<script>
const animationData = ${JSON.stringify(richData)};
const categories = ${JSON.stringify(categories)};

// ── Render grids ────────────────────────────────────────────────────────────
function renderGrid(containerId, items) {
  const c = document.getElementById(containerId);
  if(!c) return;
  c.innerHTML = items.map(item => \\\`
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
  \\\`).join('');
}

categories.forEach(c => { const d = animationData[c]; if(d) renderGrid('grid-'+c, d); });

// ── Tab switching ────────────────────────────────────────────────────────────
function switchTab(id, btn) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('sec-'+id).classList.add('active');
  btn.classList.add('active');
  document.getElementById('main-panel').scrollTop = 0;
}

// ── Copy helpers ─────────────────────────────────────────────────────────────
function copyText(el, text) {
  navigator.clipboard.writeText(text.replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&'));
  const c = el.querySelector('code');
  const orig = c.innerText;
  c.innerText = '✓ Copied!'; c.style.color = '#10b981';
  setTimeout(()=>{ c.innerText=orig; c.style.color=''; }, 2000);
}
function copyClass(cls, btn) {
  navigator.clipboard.writeText(cls);
  const orig = btn.innerText;
  btn.innerText = '✓'; btn.style.background = '#10b981';
  setTimeout(()=>{ btn.innerText=orig; btn.style.background=''; }, 1800);
}

// ── Word Morph demo ──────────────────────────────────────────────────────────
const WORDS = ['Design','Motion','Animate','Create','Ship','Delight'];
let wordIdx = 0;
function initWordMorphs() {
  document.querySelectorAll('[data-anim="word-morph"] .wm-word').forEach(el => {
    setInterval(()=>{
      wordIdx=(wordIdx+1)%WORDS.length;
      el.style.filter='blur(6px)';el.style.transform='scale(0.85)';el.style.opacity='0';
      setTimeout(()=>{ el.textContent=WORDS[wordIdx];el.style.filter='';el.style.transform='';el.style.opacity=''; },300);
    },1600);
  });
}

// ── Hover simulation (alternates hover state) ────────────────────────────────
function initHoverSims() {
  document.querySelectorAll('[data-anim="hover-sim"]').forEach(stage => {
    const targets = stage.querySelectorAll('button,a,.anim-card,[class^="btn-"],[class^="card-"],[class^="typo-"],[class*="card-"],[class*="btn-"]');
    if(!targets.length) return;
    const el = targets[0];
    let on = false;
    setInterval(()=>{
      on = !on;
      if(on) { el.dispatchEvent(new MouseEvent('mouseenter',{bubbles:true})); el.classList.add('_hover'); }
      else   { el.dispatchEvent(new MouseEvent('mouseleave',{bubbles:true})); el.classList.remove('_hover'); }
    }, 1800);
  });
}

// ── Focus simulation (inputs) ────────────────────────────────────────────────
function initFocusSims() {
  document.querySelectorAll('[data-anim="focus-sim"] input').forEach(inp => {
    let focused = false;
    setInterval(()=>{
      focused = !focused;
      if(focused) { inp.focus(); inp.classList.add('focused'); }
      else        { inp.blur(); inp.classList.remove('focused'); }
    }, 2000);
  });
  // Floating label sim
  document.querySelectorAll('[data-anim="focus-sim"] .input-wrap input').forEach(inp => {
    let on = false;
    const label = inp.nextElementSibling;
    setInterval(()=>{
      on = !on;
      if(label) {
        label.style.top = on ? '0' : '50%';
        label.style.fontSize = on ? '11px' : '14px';
        label.style.color = on ? '#4f46e5' : '#5a587a';
        label.style.transform = on ? 'translateY(-50%)' : 'translateY(-50%)';
      }
    }, 2000);
  });
}

// ── Shake simulation ─────────────────────────────────────────────────────────
function initShakeSims() {
  document.querySelectorAll('[data-anim="shake-sim"] input').forEach(inp => {
    setInterval(()=>{
      inp.classList.add('error');
      setTimeout(()=> inp.classList.remove('error'), 500);
    }, 2200);
  });
}

// ── Success simulation ───────────────────────────────────────────────────────
function initSuccessSims() {
  document.querySelectorAll('[data-anim="success-sim"] input').forEach(inp => {
    let ok = false;
    setInterval(()=>{
      ok = !ok;
      if(ok) { inp.classList.add('success'); inp.style.borderColor='#10b981'; }
      else   { inp.classList.remove('success'); inp.style.borderColor=''; }
    }, 2000);
  });
}

// ── Scroll simulation ─────────────────────────────────────────────────────────
function initScrollSims() {
  document.querySelectorAll('[data-anim="scroll-sim"]').forEach(stage => {
    const el = stage.querySelector('[class*="scroll-"]');
    if(!el) return;
    let shown = false;
    function toggle() {
      shown = !shown;
      if(shown) el.classList.add('in-view');
      else      el.classList.remove('in-view');
    }
    toggle();
    setInterval(toggle, 2000);
  });
}

// ── Scroll cascade ───────────────────────────────────────────────────────────
function initScrollCascades() {
  document.querySelectorAll('[data-anim="scroll-cascade"]').forEach(stage => {
    const el = stage.querySelector('[class*="scroll-"]');
    if(!el) return;
    let shown = false;
    function toggle() {
      shown = !shown;
      if(shown) el.classList.add('in-view');
      else      el.classList.remove('in-view');
    }
    toggle();
    setInterval(toggle, 2500);
  });
}

// ── Progress sim ─────────────────────────────────────────────────────────────
function initProgressSims() {
  document.querySelectorAll('[data-anim="progress-sim"] .scroll-progress-anim, [data-anim="progress-sim"] .micro-progress-bar').forEach(bar => {
    let w = 0;
    const pct = bar.closest('[data-anim]')?.querySelector('[id^="pbv-"]');
    setInterval(()=>{
      w = (w + 15) % 105;
      if(w > 100) w = 0;
      bar.style.width = Math.min(w,100) + '%';
      if(pct) pct.textContent = Math.min(w,100) + '%';
    }, 300);
  });
}

// ── Card tilt (3D mouse follow) ───────────────────────────────────────────────
function initCardTilts() {
  document.querySelectorAll('[data-anim="card-tilt"]').forEach(stage => {
    const card = stage.querySelector('[class*="tilt"],[class*="card-"],[class*="cursor-tilt"]');
    if(!card) return;
    stage.addEventListener('mousemove', e => {
      const r = stage.getBoundingClientRect();
      const x = ((e.clientX-r.left)/r.width - .5) * 20;
      const y = ((e.clientY-r.top)/r.height - .5) * -20;
      card.style.transform = \`perspective(600px) rotateX(\${y}deg) rotateY(\${x}deg)\`;
    });
    stage.addEventListener('mouseleave', ()=>{ card.style.transform=''; });
    // idle animation
    let t=0;
    setInterval(()=>{
      t+=.04;
      const x = Math.sin(t)*8; const y = Math.cos(t*.7)*6;
      if(!stage.matches(':hover')) card.style.transform = \`perspective(600px) rotateX(\${y}deg) rotateY(\${x}deg)\`;
    },30);
  });
}

// ── Magnetic button ───────────────────────────────────────────────────────────
function initMagnetics() {
  document.querySelectorAll('[data-anim="btn-magnetic"]').forEach(stage => {
    const btn = stage.querySelector('.btn-magnetic,.cursor-magnetic-el');
    if(!btn) return;
    stage.addEventListener('mousemove',e=>{
      const r = btn.getBoundingClientRect();
      const cx = r.left+r.width/2, cy = r.top+r.height/2;
      const dx = e.clientX-cx, dy = e.clientY-cy;
      btn.style.transform = \`translate(\${dx*.25}px,\${dy*.25}px)\`;
    });
    stage.addEventListener('mouseleave',()=>{ btn.style.transform=''; });
  });
  // idle float
  document.querySelectorAll('[data-anim="cursor-magnetic-demo"] .cursor-magnetic-el').forEach(el=>{
    let t=0;setInterval(()=>{t+=.05;el.style.transform=\`translateY(\${Math.sin(t)*4}px)\`;},30);
  });
}

// ── Ripple click ──────────────────────────────────────────────────────────────
function initRipples() {
  document.querySelectorAll('[data-anim="btn-ripple"] .btn-ripple').forEach(btn=>{
    function doRipple() {
      const span = document.createElement('span');
      span.className = 'ripple';
      span.style.left = '50%'; span.style.top = '50%';
      btn.appendChild(span);
      setTimeout(()=>span.remove(),700);
    }
    doRipple();
    setInterval(doRipple, 1800);
    btn.addEventListener('click', doRipple);
  });
}

// ── Button elastic sim ────────────────────────────────────────────────────────
function initElasticBtns() {
  document.querySelectorAll('[data-anim="btn-elastic"] button, [data-anim="btn-ripple"] button').forEach(btn=>{
    setInterval(()=>{
      btn.style.transform='scale(0.92)';
      setTimeout(()=>{ btn.style.transform='scale(1.08)'; setTimeout(()=>{ btn.style.transform=''; },200); },150);
    },2000);
  });
}

// ── Button tilt ───────────────────────────────────────────────────────────────
function initBtnTilts() {
  document.querySelectorAll('[data-anim="btn-tilt"] .btn-tilt').forEach(btn=>{
    btn.closest('[data-anim]').addEventListener('mousemove',e=>{
      const r=btn.getBoundingClientRect();
      const x=((e.clientX-r.left)/r.width-.5)*20, y=((e.clientY-r.top)/r.height-.5)*-20;
      btn.style.setProperty('--rx',x); btn.style.setProperty('--ry',y);
    });
    btn.closest('[data-anim]').addEventListener('mouseleave',()=>{
      btn.style.setProperty('--rx',0); btn.style.setProperty('--ry',0);
    });
    let t=0; setInterval(()=>{
      t+=.05;
      btn.style.setProperty('--rx', (Math.sin(t)*10).toFixed(1));
      btn.style.setProperty('--ry', (Math.cos(t*.8)*10).toFixed(1));
    },30);
  });
}

// ── Particle burst ────────────────────────────────────────────────────────────
function initParticleBursts() {
  document.querySelectorAll('[data-anim="btn-particle"] .btn-particle-burst').forEach(btn=>{
    function burst() {
      for(let i=0;i<6;i++){
        const p=document.createElement('span');
        p.className='particle';
        const angle=Math.random()*360, dist=40+Math.random()*30;
        p.style.cssText=\`left:50%;top:50%;--dx:\${Math.cos(angle)*dist}px;--dy:\${Math.sin(angle)*dist}px;--dr:\${Math.random()*360}deg;transform:translate(-50%,-50%)\`;
        btn.appendChild(p); setTimeout(()=>p.remove(),600);
      }
    }
    burst(); setInterval(burst,2000);
    btn.addEventListener('click',burst);
  });
}

// ── Spotlight button ──────────────────────────────────────────────────────────
function initSpotlightBtns() {
  document.querySelectorAll('[data-anim="btn-spotlight"] .btn-cursor-spotlight').forEach(btn=>{
    let t=0; setInterval(()=>{
      t+=.05;
      const x=50+Math.cos(t)*40, y=50+Math.sin(t*.8)*30;
      btn.style.background=\`radial-gradient(circle at \${x}% \${y}%,rgba(255,255,255,.25),#4f46e5 60%)\`;
    },30);
  });
}

// ── Gravity button ────────────────────────────────────────────────────────────
function initGravityBtns() {
  document.querySelectorAll('[data-anim="btn-gravity"] .btn-cursor-gravity').forEach(btn=>{
    let t=0; setInterval(()=>{
      t+=.04;
      btn.style.setProperty('--gx',(Math.sin(t)*8).toFixed(1));
      btn.style.setProperty('--gy',(Math.cos(t*.7)*6).toFixed(1));
    },30);
  });
}

// ── Cursor trail demo ─────────────────────────────────────────────────────────
function initCursorTrails() {
  document.querySelectorAll('[data-anim="cursor-trail-demo"]').forEach(stage=>{
    const dot = stage.querySelector('.cursor-demo-dot');
    if(!dot) return;
    let t=0; setInterval(()=>{
      t+=.04;
      const x=30+35*Math.cos(t), y=50+25*Math.sin(t*.9);
      dot.style.left=x+'%'; dot.style.top=y+'%';
    },20);
  });
}

// ── Cursor elastic ────────────────────────────────────────────────────────────
function initCursorElastic() {
  document.querySelectorAll('[data-anim="cursor-elastic-demo"]').forEach(stage=>{
    const dot = stage.querySelector('.cursor-spring-el');
    if(!dot) return;
    let tx=50,ty=50,cx=50,cy=50;
    let t=0; setInterval(()=>{
      t+=.04; tx=50+40*Math.cos(t); ty=50+30*Math.sin(t*.8);
      cx+=(tx-cx)*.12; cy+=(ty-cy)*.12;
      dot.style.left=cx+'%'; dot.style.top=cy+'%';
    },16);
  });
}

// ── Cursor parallax ───────────────────────────────────────────────────────────
function initCursorParallax() {
  document.querySelectorAll('[data-anim="cursor-parallax-demo"]').forEach(stage=>{
    const l1=stage.querySelector('.cursor-parallax-l1');
    const l2=stage.querySelector('.cursor-parallax-l2');
    const l3=stage.querySelector('.cursor-parallax-l3');
    let t=0; setInterval(()=>{
      t+=.03;
      const mx=Math.cos(t)*20, my=Math.sin(t*.9)*15;
      if(l1) l1.style.transform=\`translate(\${mx*.5}px,\${my*.5}px)\`;
      if(l2) l2.style.transform=\`translate(\${mx*-.3}px,\${my*-.3}px)\`;
      if(l3) l3.style.transform=\`translate(\${mx*.8}px,\${my*.2}px)\`;
    },20);
  });
}

// ── Loop reveal (re-triggers forward animations) ──────────────────────────────
function initLoopReveals() {
  document.querySelectorAll('[data-anim="loop-reveal"]').forEach(stage=>{
    const el=stage.querySelector('[class*="scroll-"],[class*="card-cinematic"],[class*="typo-split"],[class*="typo-cinematic"],[class*="typo-blur"],[class*="typo-liquid"],[class*="typo-slide"],[class*="typo-pixel"],[class*="typo-perspective"]');
    if(!el) return;
    function retrigger(){
      el.classList.remove('in-view');
      el.style.animation='none'; void el.offsetWidth;
      el.style.animation='';
      requestAnimationFrame(()=>{ el.classList.add('in-view'); });
    }
    retrigger(); setInterval(retrigger,2200);
  });
}

// ── Loop rebuild (letter-by-letter retrigger) ─────────────────────────────────
function initLoopRebuilds() {
  document.querySelectorAll('[data-anim="loop-rebuild"]').forEach(stage=>{
    const spans = stage.querySelectorAll('span');
    function retrigger(){
      spans.forEach(s=>{ s.style.animation='none'; void s.offsetWidth; s.style.animation=''; });
    }
    retrigger(); setInterval(retrigger,2500);
  });
}

// ── Toast loop ────────────────────────────────────────────────────────────────
function initToastLoops() {
  document.querySelectorAll('[data-anim="toast-loop"] .micro-toast').forEach(el=>{
    function retrigger(){
      el.style.animation='none'; void el.offsetWidth;
      el.style.animation='';
    }
    setInterval(retrigger,2000);
  });
}

// ── Counter demo ──────────────────────────────────────────────────────────────
function initCounters() {
  document.querySelectorAll('[data-anim="counter-demo"]').forEach(stage=>{
    const targets = [
      [stage.querySelector('[id^="counter-"]'), 450],
      [stage.querySelector('[id^="sc1-"]'), 450],
      [stage.querySelector('[id^="sc2-"]'), 450],
    ];
    targets.forEach(([el,target])=>{
      if(!el) return;
      let v=0;
      const step=Math.ceil(target/40);
      setInterval(()=>{
        if(v<target){ v=Math.min(v+step,target); el.textContent=v; }
        else setTimeout(()=>{ v=0; },500);
      },50);
    });
  });
}

// ── Badge sim ─────────────────────────────────────────────────────────────────
function initBadgeSims() {
  document.querySelectorAll('[data-anim="badge-sim"] [id^="badge-"]').forEach(el=>{
    let n=1; setInterval(()=>{
      n++; if(n>9) n=1;
      el.textContent=n;
      el.classList.remove('new'); void el.offsetWidth; el.classList.add('new');
    },1800);
  });
}

// ── Drag demo ─────────────────────────────────────────────────────────────────
function initDragDemos() {
  document.querySelectorAll('[data-anim="drag-demo"] [id^="drag-"]').forEach(el=>{
    let dragging=false;
    setInterval(()=>{
      dragging=!dragging;
      el.classList.toggle('dragging',dragging);
    },1500);
  });
}

// ── Tab indicator helper ──────────────────────────────────────────────────────
window.moveTabIndicator = function(clickedTab) {
  const parent = clickedTab.parentElement;
  const ind = parent.parentElement.querySelector('[id^="wc-tabs-ind-"]');
  if(!ind) return;
  parent.querySelectorAll('div').forEach(t=>t.style.color='#5a587a');
  clickedTab.style.color='#4f46e5';
  ind.style.left = clickedTab.offsetLeft+'px';
  ind.style.width = clickedTab.offsetWidth+'px';
};

// ── FAQ / accordion from wc ───────────────────────────────────────────────────
function initFaqAccordions(){
  document.querySelectorAll('.wc-faq-panel, .micro-accordion').forEach(panel=>{
    const header = panel.querySelector('.faq-header, .acc-header');
    const body   = panel.querySelector('.faq-body, .acc-body');
    const arrow  = panel.querySelector('.faq-arrow, .acc-arrow');
    if(!header||!body) return;
    let open=false;
    // auto open/close to demo
    function toggle(){ open=!open; panel.classList.toggle('open',open); if(body){body.style.maxHeight=open?body.scrollHeight+'px':'0';} if(arrow){arrow.style.transform=open?'rotate(180deg)':'';}  }
    toggle(); setInterval(toggle,2200);
    header.onclick=(e)=>{ e.stopPropagation(); toggle(); };
  });
}

// ── Sidebar demo ──────────────────────────────────────────────────────────────
function initSidebarDemos(){
  document.querySelectorAll('[data-anim="sidebar-demo"] [id^="sb-"]').forEach(sb=>{
    let collapsed=false;
    setInterval(()=>{
      collapsed=!collapsed;
      sb.style.width = collapsed?'42px':'160px';
    },1800);
  });
}

// ── Scroll reveal for wc-reveal-gallery ───────────────────────────────────────
function initWcGalleries(){
  document.querySelectorAll('.wc-reveal-gallery.in-view>*').forEach((el,i)=>{
    el.style.opacity='1'; el.style.clipPath='inset(0 0% 0 0)';
    el.style.transitionDelay=(i*0.12)+'s';
  });
}

// ── Init all ──────────────────────────────────────────────────────────────────
setTimeout(()=>{
  initWordMorphs();
  initHoverSims();
  initFocusSims();
  initShakeSims();
  initSuccessSims();
  initScrollSims();
  initScrollCascades();
  initProgressSims();
  initCardTilts();
  initMagnetics();
  initRipples();
  initElasticBtns();
  initBtnTilts();
  initParticleBursts();
  initSpotlightBtns();
  initGravityBtns();
  initCursorTrails();
  initCursorElastic();
  initCursorParallax();
  initLoopReveals();
  initLoopRebuilds();
  initToastLoops();
  initCounters();
  initBadgeSims();
  initDragDemos();
  initFaqAccordions();
  initSidebarDemos();
  initWcGalleries();
}, 100);
</script>
</body>
</html>`;

fs.writeFileSync(path.join(__dirname,'../docs/index.html'), html);
console.log('✓ Generated docs/index.html — live previews for all 450 animations');

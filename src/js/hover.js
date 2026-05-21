/* ==========================================================================
   SDS MOTION — PREMIUM INTERACTION ENGINE (TYPOGRAPHY, BUTTONS, INPUTS)
   ========================================================================== */

(function () {
  'use strict';

  // WeakMaps for tracking spring states
  const charStateMap = new WeakMap();
  const elementStateMap = new WeakMap();
  let springLoopStarted = false;

  // Helpers for spring state management
  function getOrCreateCharState(char) {
    if (!charStateMap.has(char)) {
      charStateMap.set(char, {
        el: char,
        x: 0, y: 0, rotate: 0, margin: 0, blur: 0,
        vx: 0, vy: 0, vr: 0, vm: 0, vb: 0,
        targetX: 0, targetY: 0, targetRotate: 0, targetMargin: 0, targetBlur: 0,
        targetShadow: 'none'
      });
    }
    return charStateMap.get(char);
  }

  function getOrCreateElementState(el) {
    if (!elementStateMap.has(el)) {
      elementStateMap.set(el, {
        el: el,
        blur: 0, scaleX: 1,
        vb: 0, vs: 0,
        targetBlur: 0, targetScaleX: 1,
        lastX: 0, lastY: 0, lastTime: 0
      });
    }
    return elementStateMap.get(el);
  }

  // 1. INJECT GOOEY SVG FILTER DYNAMICALLY
  function injectGooeyFilter() {
    if (!document.getElementById('sds-gooey-filter')) {
      const svgFilter = `
        <svg xmlns="http://www.w3.org/2000/svg" style="display: none;" id="sds-gooey-filter-svg">
          <defs>
            <filter id="sds-gooey-filter">
              <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
              <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8" result="goo" />
              <feBlend in="SourceGraphic" in2="goo" />
            </filter>
          </defs>
        </svg>
      `;
      document.body.insertAdjacentHTML('beforeend', svgFilter);
    }
  }

  // 2. TEXT SPLITTING UTILITY FOR STAGGER SYSTEMS
  const textSelectors = [
    '.sds-wave-cascade',
    '.sds-jelly-hover',
    '.sds-elastic-rotation',
    '.sds-orbit-hover',
    '.sds-liquid-text',
    '.sds-scatter-return',
    '.sds-magnetic-pull',
    '.sds-repulsion-field',
    '.sds-cursor-trail',
    '.sds-shockwave',
    '.sds-velocity-blur',
    '.sds-drop-settle',
    '.sds-center-burst',
    '.sds-explode-formation',
    '.sds-spring-kerning'
  ];

  function splitAllInteractiveTexts() {
    document.querySelectorAll(textSelectors.join(',')).forEach(el => {
      // Avoid resplitting
      if (el.querySelector('.sds-char') || el.querySelector('canvas')) return;
      const text = el.textContent.trim();
      el.innerHTML = '';
      const words = text.split(/\s+/);
      let charIndex = 0;

      words.forEach((word, wordIndex) => {
        const wordSpan = document.createElement('span');
        wordSpan.className = 'sds-word';
        wordSpan.style.setProperty('--sds-word-index', wordIndex);
        wordSpan.style.display = 'inline-block';
        wordSpan.style.whiteSpace = 'nowrap';

        const chars = word.split('');
        chars.forEach(char => {
          const charSpan = document.createElement('span');
          charSpan.className = 'sds-char';
          charSpan.textContent = char;
          charSpan.setAttribute('data-char', char);
          charSpan.style.setProperty('--sds-char-index', charIndex);
          charSpan.style.display = 'inline-block';
          wordSpan.appendChild(charSpan);
          charIndex++;
        });
        el.appendChild(wordSpan);

        if (wordIndex < words.length - 1) {
          const space = document.createElement('span');
          space.innerHTML = '&nbsp;';
          space.className = 'sds-space';
          space.style.display = 'inline-block';
          el.appendChild(space);
        }
      });
    });
  }

  // 3. SPRING PHYSICS CENTRAL LOOP FOR TYPOGRAPHY
  function updateSpringPhysics() {
    // A. Character updating loop
    const activeChars = document.querySelectorAll('.sds-char');
    activeChars.forEach(char => {
      const state = charStateMap.get(char);
      if (!state) return;

      const stiffness = 0.12;
      const friction = 0.78;

      // Spring formula: accel = stiffness * (target - current) - friction * velocity
      const ax = stiffness * (state.targetX - state.x) - friction * state.vx;
      state.vx += ax;
      state.x += state.vx;

      const ay = stiffness * (state.targetY - state.y) - friction * state.vy;
      state.vy += ay;
      state.y += state.vy;

      const ar = stiffness * (state.targetRotate - state.rotate) - friction * state.vr;
      state.vr += ar;
      state.rotate += state.vr;

      const am = stiffness * (state.targetMargin - state.margin) - friction * state.vm;
      state.vm += am;
      state.margin += state.vm;

      // Transform compile
      let transform = '';
      if (Math.abs(state.x) > 0.01 || Math.abs(state.y) > 0.01) {
        transform += `translate3d(${state.x.toFixed(2)}px, ${state.y.toFixed(2)}px, 0) `;
      }
      if (Math.abs(state.rotate) > 0.01) {
        transform += `rotate(${state.rotate.toFixed(1)}deg) `;
      }
      char.style.transform = transform;

      // Margin compile
      if (Math.abs(state.margin) > 0.01) {
        char.style.margin = `0 ${state.margin.toFixed(1)}px`;
      } else {
        char.style.margin = '';
      }

      // Shadow compile
      if (state.targetShadow !== 'none') {
        char.style.textShadow = state.targetShadow;
      } else {
        char.style.textShadow = '';
      }
    });

    // B. Elements updating loop (e.g. Velocity Blur parents)
    const activeBlurs = document.querySelectorAll('.sds-velocity-blur');
    activeBlurs.forEach(el => {
      const state = elementStateMap.get(el);
      if (!state) return;

      const stiffness = 0.15;
      const friction = 0.8;

      const ab = stiffness * (state.targetBlur - state.blur) - friction * state.vb;
      state.vb += ab;
      state.blur += state.vb;

      const as = stiffness * (state.targetScaleX - state.scaleX) - friction * state.vs;
      state.vs += as;
      state.scaleX += state.vs;

      if (state.blur > 0.1 || Math.abs(state.scaleX - 1) > 0.01) {
        el.style.filter = `blur(${state.blur.toFixed(1)}px)`;
        el.style.transform = `scaleX(${state.scaleX.toFixed(3)})`;
      } else {
        el.style.filter = '';
        el.style.transform = '';
      }
    });

    requestAnimationFrame(updateSpringPhysics);
  }

  // Bind mouse hooks to interactive typography
  function bindTypographyInteractions() {
    // Scatter & Return
    document.querySelectorAll('.sds-scatter-return').forEach(parent => {
      const chars = parent.querySelectorAll('.sds-char');
      parent.addEventListener('mouseenter', () => {
        chars.forEach(char => {
          const state = getOrCreateCharState(char);
          state.targetX = (Math.random() - 0.5) * 80;
          state.targetY = (Math.random() - 0.5) * 80;
          state.targetRotate = (Math.random() - 0.5) * 90;
        });
      });
      parent.addEventListener('mouseleave', () => {
        chars.forEach(char => {
          const state = getOrCreateCharState(char);
          state.targetX = 0;
          state.targetY = 0;
          state.targetRotate = 0;
        });
      });
    });

    // Mouse proximity: Repulsion, Magnetic, Cursor Trail, Spring Kerning
    const proximitySelectors = '.sds-repulsion-field, .sds-magnetic-pull, .sds-cursor-trail, .sds-spring-kerning, .sds-velocity-blur';
    document.querySelectorAll(proximitySelectors).forEach(parent => {
      const chars = parent.querySelectorAll('.sds-char');

      parent.addEventListener('mousemove', e => {
        const mouseX = e.clientX;
        const mouseY = e.clientY;

        // Velocity blur parent tracking
        if (parent.classList.contains('sds-velocity-blur')) {
          const state = getOrCreateElementState(parent);
          const now = performance.now();
          const dt = now - (state.lastTime || now);
          const dx = mouseX - (state.lastX || mouseX);
          const dy = mouseY - (state.lastY || mouseY);
          const speed = dt > 0 ? Math.hypot(dx, dy) / dt : 0;
          state.targetBlur = Math.min(speed * 8, 12);
          state.targetScaleX = 1 + Math.min(speed * 0.3, 0.4);
          state.lastX = mouseX;
          state.lastY = mouseY;
          state.lastTime = now;
        }

        chars.forEach(char => {
          const rect = char.getBoundingClientRect();
          const charCenterX = rect.left + rect.width / 2;
          const charCenterY = rect.top + rect.height / 2;

          const dx = charCenterX - mouseX;
          const dy = charCenterY - mouseY;
          const dist = Math.hypot(dx, dy);

          const state = getOrCreateCharState(char);

          if (parent.classList.contains('sds-repulsion-field')) {
            const range = 80;
            if (dist < range) {
              const force = (range - dist) / range;
              const angle = Math.atan2(dy, dx);
              state.targetX = Math.cos(angle) * force * 35;
              state.targetY = Math.sin(angle) * force * 35;
            } else {
              state.targetX = 0;
              state.targetY = 0;
            }
          }

          if (parent.classList.contains('sds-magnetic-pull')) {
            const range = 90;
            if (dist < range) {
              const force = (range - dist) / range;
              state.targetX = -dx * 0.42 * force;
              state.targetY = -dy * 0.42 * force;
            } else {
              state.targetX = 0;
              state.targetY = 0;
            }
          }

          if (parent.classList.contains('sds-cursor-trail')) {
            const range = 110;
            if (dist < range) {
              const force = (range - dist) / range;
              state.targetX = -dx * 0.28 * force;
              state.targetY = -dy * 0.28 * force;
              state.targetShadow = `${dx * 0.12}px ${dy * 0.12}px 6px var(--sds-primary)`;
            } else {
              state.targetX = 0;
              state.targetY = 0;
              state.targetShadow = 'none';
            }
          }

          if (parent.classList.contains('sds-spring-kerning')) {
            const rangeX = 100;
            const distX = Math.abs(dx);
            if (distX < rangeX) {
              const force = (rangeX - distX) / rangeX;
              state.targetMargin = force * 12;
            } else {
              state.targetMargin = 0;
            }
          }
        });
      });

      parent.addEventListener('mouseleave', () => {
        if (parent.classList.contains('sds-velocity-blur')) {
          const state = getOrCreateElementState(parent);
          state.targetBlur = 0;
          state.targetScaleX = 1;
        }

        chars.forEach(char => {
          const state = getOrCreateCharState(char);
          state.targetX = 0;
          state.targetY = 0;
          state.targetShadow = 'none';
          state.targetMargin = 0;
        });
      });
    });

    // Shockwave click trigger
    document.querySelectorAll('.sds-shockwave').forEach(parent => {
      const chars = parent.querySelectorAll('.sds-char');
      parent.addEventListener('click', e => {
        const clickX = e.clientX;
        const clickY = e.clientY;

        chars.forEach(char => {
          const rect = char.getBoundingClientRect();
          const charCenterX = rect.left + rect.width / 2;
          const charCenterY = rect.top + rect.height / 2;

          const dx = charCenterX - clickX;
          const dy = charCenterY - clickY;
          const dist = Math.hypot(dx, dy);

          const state = getOrCreateCharState(char);
          const force = 140 / (dist + 20);
          const angle = Math.atan2(dy, dx);

          // Eruptive velocity kick
          state.vx = Math.cos(angle) * force * 18;
          state.vy = Math.sin(angle) * force * 18;
          state.targetX = 0;
          state.targetY = 0;
        });
      });
    });

    // Orbit Hover rotation
    document.querySelectorAll('.sds-orbit-hover').forEach(parent => {
      const chars = parent.querySelectorAll('.sds-char');
      let isHovered = false;
      parent.addEventListener('mouseenter', () => isHovered = true);
      parent.addEventListener('mouseleave', () => {
        isHovered = false;
        chars.forEach(char => {
          const state = getOrCreateCharState(char);
          state.targetX = 0;
          state.targetY = 0;
        });
      });

      const updateOrbit = () => {
        if (isHovered) {
          const time = performance.now() * 0.006;
          chars.forEach((char, i) => {
            const state = getOrCreateCharState(char);
            const radius = 6;
            state.targetX = Math.cos(time + i * 0.5) * radius;
            state.targetY = Math.sin(time + i * 0.5) * radius;
          });
        }
        if (parent.isConnected) {
          requestAnimationFrame(updateOrbit);
        }
      };
      requestAnimationFrame(updateOrbit);
    });

    // Start physics loop if not running
    if (!springLoopStarted) {
      springLoopStarted = true;
      requestAnimationFrame(updateSpringPhysics);
    }
  }

  // 4. CANVAS ENGINES (WORD MORPH, PARTICLE TEXT, BIG BANG EXPLOSION)
  function getTextPoints(text, width, height, font) {
    const offscreen = document.createElement('canvas');
    offscreen.width = width;
    offscreen.height = height;
    const oCtx = offscreen.getContext('2d');
    oCtx.font = font;
    oCtx.fillStyle = '#000000';
    oCtx.textAlign = 'center';
    oCtx.textBaseline = 'middle';
    oCtx.fillText(text, width / 2, height / 2);

    const imgData = oCtx.getImageData(0, 0, width, height).data;
    const points = [];
    const sampleRate = 2;

    for (let y = 0; y < height; y += sampleRate) {
      for (let x = 0; x < width; x += sampleRate) {
        const index = (y * width + x) * 4;
        const alpha = imgData[index + 3];
        if (alpha > 128) {
          points.push({ x, y });
        }
      }
    }
    return points;
  }

  function setupWordMorphCanvas(canvas, ctx, el, width, height, font, color) {
    const wordsAttr = el.getAttribute('data-words') || 'MOTION,FORGE,LAB,SDS';
    const words = wordsAttr.split(',');
    let wordIndex = 0;

    let currentPoints = getTextPoints(words[wordIndex], width, height, font);
    let particles = currentPoints.map(p => ({
      x: p.x, y: p.y,
      tx: p.x, ty: p.y,
      vx: 0, vy: 0,
      alpha: 1
    }));

    const cycleMorph = () => {
      wordIndex = (wordIndex + 1) % words.length;
      const nextPoints = getTextPoints(words[wordIndex], width, height, font);

      if (particles.length < nextPoints.length) {
        for (let i = particles.length; i < nextPoints.length; i++) {
          particles.push({
            x: width / 2, y: height / 2,
            tx: width / 2, ty: height / 2,
            vx: 0, vy: 0, alpha: 0
          });
        }
      }

      for (let i = 0; i < particles.length; i++) {
        const target = nextPoints[i % nextPoints.length];
        particles[i].tx = target.x;
        particles[i].ty = target.y;
        if (i >= nextPoints.length) {
          particles[i].tx = target.x + (Math.random() - 0.5) * 35;
          particles[i].ty = target.y + (Math.random() - 0.5) * 35;
          particles[i].targetAlpha = 0;
        } else {
          particles[i].targetAlpha = 1;
        }
      }
    };

    const intervalId = setInterval(cycleMorph, 3000);
    canvas.addEventListener('click', cycleMorph);

    const animate = () => {
      if (!canvas.isConnected) {
        clearInterval(intervalId);
        return;
      }
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = color;

      particles.forEach(p => {
        const ax = 0.12 * (p.tx - p.x) - 0.78 * p.vx;
        p.vx += ax;
        p.x += p.vx;

        const ay = 0.12 * (p.ty - p.y) - 0.78 * p.vy;
        p.vy += ay;
        p.y += p.vy;

        if (p.targetAlpha !== undefined) {
          p.alpha += (p.targetAlpha - p.alpha) * 0.1;
        }

        ctx.globalAlpha = p.alpha;
        ctx.fillRect(p.x, p.y, 1.5, 1.5);
      });
      ctx.globalAlpha = 1;

      requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }

  function setupParticleTextCanvas(canvas, ctx, el, width, height, font, color) {
    const text = el.textContent.trim().split('\n')[0];
    const points = getTextPoints(text, width, height, font);

    let particles = points.map(p => ({
      x: p.x, y: p.y,
      ox: p.x, oy: p.y,
      vx: 0, vy: 0
    }));

    let mouse = { x: -1000, y: -1000, active: false };

    canvas.addEventListener('mousemove', e => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    });

    canvas.addEventListener('mouseleave', () => {
      mouse.active = false;
    });

    const animate = () => {
      if (!canvas.isConnected) return;
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = color;

      particles.forEach(p => {
        let tx = p.ox;
        let ty = p.oy;

        if (mouse.active) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.hypot(dx, dy);
          const range = 60;
          if (dist < range) {
            const force = (range - dist) / range;
            const angle = Math.atan2(dy, dx);
            tx = p.ox + Math.cos(angle) * force * 50;
            ty = p.oy + Math.sin(angle) * force * 50;
          }
        }

        const ax = 0.08 * (tx - p.x) - 0.75 * p.vx;
        p.vx += ax;
        p.x += p.vx;

        const ay = 0.08 * (ty - p.y) - 0.75 * p.vy;
        p.vy += ay;
        p.y += p.vy;

        ctx.fillRect(p.x, p.y, 1.5, 1.5);
      });

      requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }

  function setupBangExplosionCanvas(canvas, ctx, el, width, height, font, color) {
    const text = el.textContent.trim().split('\n')[0];
    const points = getTextPoints(text, width, height, font);

    let particles = points.map(p => ({
      x: p.x, y: p.y,
      ox: p.x, oy: p.y,
      vx: 0, vy: 0
    }));

    canvas.addEventListener('click', e => {
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      particles.forEach(p => {
        const dx = p.x - clickX;
        const dy = p.y - clickY;
        const dist = Math.hypot(dx, dy);
        const force = 140 / (dist + 15);
        const angle = Math.atan2(dy, dx);

        p.vx = Math.cos(angle) * force * 16;
        p.vy = Math.sin(angle) * force * 16;
      });
    });

    const animate = () => {
      if (!canvas.isConnected) return;
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = color;

      particles.forEach(p => {
        const ax = 0.05 * (p.ox - p.x) - 0.9 * p.vx;
        p.vx += ax;
        p.x += p.vx;

        const ay = 0.05 * (p.oy - p.y) - 0.9 * p.vy;
        p.vy += ay;
        p.y += p.vy;

        ctx.fillRect(p.x, p.y, 1.5, 1.5);
      });

      requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }

  function initCanvasEngines() {
    const canvasElements = document.querySelectorAll('.sds-word-morph, .sds-particle-text, .sds-bang-explosion');

    canvasElements.forEach(el => {
      if (el.querySelector('canvas')) return;

      const canvas = document.createElement('canvas');
      el.appendChild(canvas);

      const rect = el.getBoundingClientRect();
      const style = window.getComputedStyle(el);
      const text = el.textContent.trim();

      const textSpan = document.createElement('span');
      textSpan.textContent = text;
      textSpan.style.opacity = '0';
      textSpan.style.pointerEvents = 'none';
      textSpan.style.display = 'inline-block';

      Array.from(el.childNodes).forEach(node => {
        if (node !== canvas) el.removeChild(node);
      });
      el.appendChild(textSpan);
      el.appendChild(canvas);

      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;

      const ctx = canvas.getContext('2d');
      ctx.scale(dpr, dpr);

      const font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
      const color = style.color || '#ffffff';

      if (el.classList.contains('sds-word-morph')) {
        setupWordMorphCanvas(canvas, ctx, el, rect.width, rect.height, font, color);
      } else if (el.classList.contains('sds-particle-text')) {
        setupParticleTextCanvas(canvas, ctx, el, rect.width, rect.height, font, color);
      } else if (el.classList.contains('sds-bang-explosion')) {
        setupBangExplosionCanvas(canvas, ctx, el, rect.width, rect.height, font, color);
      }
    });
  }

  // 5. ADVANCED BUTTON INTERACTION BINDS
  function bindButtonInteractions() {
    // Slide Fill Angle Tracker
    document.querySelectorAll('.sds-btn-slide-fill').forEach(btn => {
      let overlay = btn.querySelector('.sds-fill-overlay');
      if (!overlay) {
        overlay = document.createElement('span');
        overlay.className = 'sds-fill-overlay';
        btn.appendChild(overlay);
      }

      btn.addEventListener('mouseenter', e => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const distLeft = x;
        const distRight = rect.width - x;
        const distTop = y;
        const distBottom = rect.height - y;
        const minDist = Math.min(distLeft, distRight, distTop, distBottom);

        if (minDist === distLeft) {
          btn.style.setProperty('--fill-x', '-100%');
          btn.style.setProperty('--fill-y', '0%');
        } else if (minDist === distRight) {
          btn.style.setProperty('--fill-x', '100%');
          btn.style.setProperty('--fill-y', '0%');
        } else if (minDist === distTop) {
          btn.style.setProperty('--fill-x', '0%');
          btn.style.setProperty('--fill-y', '-100%');
        } else if (minDist === distBottom) {
          btn.style.setProperty('--fill-x', '0%');
          btn.style.setProperty('--fill-y', '100%');
        }

        // Delay to allow position variables to register without flash
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            btn.style.setProperty('--fill-x', '0%');
            btn.style.setProperty('--fill-y', '0%');
          });
        });
      });

      btn.addEventListener('mouseleave', e => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const distLeft = x;
        const distRight = rect.width - x;
        const distTop = y;
        const distBottom = rect.height - y;
        const minDist = Math.min(distLeft, distRight, distTop, distBottom);

        let outX = '-100%', outY = '0%';
        if (minDist === distLeft) { outX = '-100%'; outY = '0%'; }
        else if (minDist === distRight) { outX = '100%'; outY = '0%'; }
        else if (minDist === distTop) { outX = '0%'; outY = '-100%'; }
        else if (minDist === distBottom) { outX = '0%'; outY = '100%'; }

        btn.style.setProperty('--fill-x', outX);
        btn.style.setProperty('--fill-y', outY);
      });
    });

    // Ripple Shockwave
    document.querySelectorAll('.sds-btn-shockwave').forEach(btn => {
      btn.addEventListener('click', e => {
        const rect = btn.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height) * 2.5;
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        const ripple = document.createElement('span');
        ripple.className = 'sds-shock-ripple';
        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;

        btn.appendChild(ripple);
        ripple.addEventListener('animationend', () => ripple.remove());
      });
    });

    // Particles Click
    document.querySelectorAll('.sds-btn-particles').forEach(btn => {
      btn.addEventListener('click', e => {
        const rect = btn.getBoundingClientRect();
        const count = 16;
        for (let i = 0; i < count; i++) {
          const p = document.createElement('span');
          p.style.position = 'absolute';
          p.style.width = p.style.height = `${Math.random() * 4 + 2}px`;
          p.style.background = 'var(--sds-accent, #3f6df6)';
          p.style.borderRadius = '50%';
          p.style.pointerEvents = 'none';
          p.style.zIndex = '99';
          p.style.left = `${e.clientX - rect.left}px`;
          p.style.top = `${e.clientY - rect.top}px`;

          btn.appendChild(p);

          const angle = Math.random() * Math.PI * 2;
          const dist = Math.random() * 60 + 20;
          const tx = Math.cos(angle) * dist;
          const ty = Math.sin(angle) * dist;

          const anim = p.animate([
            { transform: 'translate(0, 0) scale(1)', opacity: 1 },
            { transform: `translate(${tx}px, ${ty}px) scale(0)`, opacity: 0 }
          ], {
            duration: Math.random() * 300 + 400,
            easing: 'cubic-bezier(0.25, 1, 0.5, 1)'
          });

          anim.onfinish = () => p.remove();
        }
      });
    });

    // Border Trails Click animation
    document.querySelectorAll('.sds-btn-trails').forEach(btn => {
      btn.addEventListener('click', () => {
        const borderTrail = btn.animate([
          { boxShadow: '0 0 0 0px var(--sds-primary)' },
          { boxShadow: '0 0 0 6px rgba(77, 95, 255, 0.25)', offset: 0.5 },
          { boxShadow: '0 0 0 12px rgba(77, 95, 255, 0)' }
        ], {
          duration: 500,
          easing: 'cubic-bezier(0.1, 0.8, 0.3, 1)'
        });
      });
    });

    // Shadow drift Proximity
    document.querySelectorAll('.sds-btn-shadow').forEach(btn => {
      btn.addEventListener('mousemove', e => {
        const rect = btn.getBoundingClientRect();
        const dx = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
        const dy = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
        btn.style.boxShadow = `${-dx * 6}px ${-dy * 6}px 22px rgba(0,0,0,0.2)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.boxShadow = '';
      });
    });

    // Glow Trail spotlight setup
    document.querySelectorAll('.sds-btn-glow-trail').forEach(btn => {
      btn.addEventListener('mousemove', e => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        btn.style.setProperty('--spot-x', `${x}px`);
        btn.style.setProperty('--spot-y', `${y}px`);
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.setProperty('--spot-x', '-100px');
        btn.style.setProperty('--spot-y', '-100px');
      });
    });

    // Velocity move button
    document.querySelectorAll('.sds-btn-velocity').forEach(btn => {
      let lastX = 0, lastY = 0, lastTime = 0;
      btn.addEventListener('mousemove', e => {
        const x = e.clientX;
        const y = e.clientY;
        const now = performance.now();
        const dt = now - lastTime;
        if (dt > 0) {
          const speedX = (x - lastX) / dt;
          const speedY = (y - lastY) / dt;
          const tx = Math.min(Math.max(speedX * 14, -8), 8);
          const ty = Math.min(Math.max(speedY * 14, -8), 8);
          btn.style.transform = `translate3d(${tx.toFixed(2)}px, ${ty.toFixed(2)}px, 0)`;
        }
        lastX = x; lastY = y; lastTime = now;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });
  }

  // 6. ADVANCED INPUT FIELD INTERACTION BINDS
  function bindInputInteractions() {
    // Glass Spotlight proximity
    document.querySelectorAll('.sds-input-glass').forEach(input => {
      input.addEventListener('mousemove', e => {
        const rect = input.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        input.style.setProperty('--spot-x', `${x}%`);
        input.style.setProperty('--spot-y', `${y}%`);
      });
      input.addEventListener('mouseleave', () => {
        input.style.setProperty('--spot-x', '50%');
        input.style.setProperty('--spot-y', '50%');
      });
    });

    // Depth Hover wrapper
    document.querySelectorAll('.sds-input-depth-wrap').forEach(wrap => {
      wrap.addEventListener('mouseenter', () => {
        wrap.style.transform = 'translateY(-2px)';
        wrap.style.boxShadow = '0 6px 18px rgba(0, 0, 0, 0.12)';
        wrap.style.transition = 'transform 0.25s cubic-bezier(0.25, 0.8, 0.25, 1), box-shadow 0.25s ease';
      });
      wrap.addEventListener('mouseleave', () => {
        wrap.style.transform = '';
        wrap.style.boxShadow = '';
      });
    });

    // Label tracking mouse motion
    document.querySelectorAll('.sds-input-label-track-wrap').forEach(wrap => {
      const label = wrap.querySelector('.sds-input-label') || wrap.querySelector('label');
      if (!label) return;
      wrap.addEventListener('mousemove', e => {
        const rect = wrap.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const ratio = mouseX / rect.width;
        const offset = (ratio - 0.5) * 14;
        label.style.transform = `translateX(${offset.toFixed(1)}px)`;
      });
      wrap.addEventListener('mouseleave', () => {
        label.style.transform = '';
      });
    });

    // Typing Character Echo
    document.querySelectorAll('.sds-input-char-echo').forEach(input => {
      const parent = input.closest('.sds-input-wrapper') || input.parentElement;
      parent.style.position = 'relative';

      input.addEventListener('input', e => {
        const char = e.data || '';
        if (!char) return;

        const echo = document.createElement('span');
        echo.className = 'sds-type-trail-char';
        echo.textContent = char;
        echo.style.left = `${20 + Math.random() * 40}%`; // floating above center bounds
        echo.style.top = `-12px`;

        parent.appendChild(echo);
        echo.addEventListener('animationend', () => echo.remove());
      });
    });

    // Input Click Ripple
    document.querySelectorAll('.sds-input-ripple-wrap').forEach(wrap => {
      // Ensure positioning context is set
      wrap.style.position = 'relative';
      wrap.style.overflow = 'hidden';

      wrap.addEventListener('click', e => {
        const rect = wrap.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height) * 2.2;
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        const ripple = document.createElement('span');
        ripple.className = 'sds-input-ripple-element';
        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;

        wrap.appendChild(ripple);
        ripple.addEventListener('animationend', () => ripple.remove());
      });
    });

    // Handle standard magnetic inputs wrapper by auto-injecting behavior tags
    document.querySelectorAll('.sds-input-magnetic-wrap').forEach(wrap => {
      if (!wrap.classList.contains('sds-magnetic')) {
        wrap.classList.add('sds-magnetic');
        wrap.setAttribute('data-sds-range', '60');
        wrap.setAttribute('data-sds-spring', '0.14');
        wrap.setAttribute('data-sds-damping', '0.78');
      }
    });
  }

  // CENTRAL ENGINE BOOTSTRAP
  function initHoverEngine() {
    // 3D Perspective Tilt & Spotlight Base System
    const tiltElements = document.querySelectorAll('.sds-tilt-3d, .sds-spotlight, .sds-btn-tilt-3d');

    tiltElements.forEach(el => {
      if (el.dataset.sdsTiltBound) return;
      el.dataset.sdsTiltBound = "true";

      let isTiltActive = el.classList.contains('sds-tilt-3d') || el.classList.contains('sds-btn-tilt-3d');
      let isSpotlightActive = el.classList.contains('sds-spotlight');

      // Maximum degrees of tilt rotation
      const maxTilt = parseFloat(el.getAttribute('data-sds-max-tilt') || '15');

      el.addEventListener('mousemove', e => {
        const rect = el.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;

        // Mouse coordinate relative to element bounds
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (isSpotlightActive) {
          const spotX = (x / width) * 100;
          const spotY = (y / height) * 100;
          el.style.setProperty('--spot-x', `${spotX}%`);
          el.style.setProperty('--spot-y', `${spotY}%`);
        }

        if (isTiltActive) {
          const normX = (x / width) - 0.5;
          const normY = (y / height) - 0.5;

          const rotateX = -normY * maxTilt;
          const rotateY = normX * maxTilt;

          el.style.setProperty('--rx', rotateX.toFixed(2));
          el.style.setProperty('--ry', rotateY.toFixed(2));

          el.style.setProperty('--mx', (x / width).toFixed(3));
          el.style.setProperty('--my', (y / height).toFixed(3));
        }
      });

      el.addEventListener('mouseleave', () => {
        el.style.setProperty('--rx', '0');
        el.style.setProperty('--ry', '0');
        el.style.setProperty('--spot-x', '50%');
        el.style.setProperty('--spot-y', '50%');
      });
    });

    // Injections & sub-engines triggers
    injectGooeyFilter();
    splitAllInteractiveTexts();
    bindTypographyInteractions();
    initCanvasEngines();
    bindButtonInteractions();
    bindInputInteractions();
  }

  // Self-starting hook
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHoverEngine);
  } else {
    initHoverEngine();
  }

  window.SDSHoverEngine = {
    init: initHoverEngine
  };

})();

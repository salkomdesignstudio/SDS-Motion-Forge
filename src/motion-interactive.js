/**
 * SDS Motion Forge — Interactive JS Engine
 * Version: 5.0.0
 * Handles: word-morph, jelly-hover, scatter-return, shockwave,
 *          spring-kerning, magnetic-pull, repulsion-field
 *
 * Zero-config: add a class → it works. No JS required from developer.
 * Load with defer: <script src="motion-interactive.min.js" defer></script>
 */
(function (global) {
  'use strict';

  /* ── Constants & shared state ───────────────────────────── */
  var HOVER_CAPABLE = window.matchMedia('(hover: hover)').matches;
  var REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* WeakMap stores cleanup functions per element */
  var cleanupMap = new WeakMap();

  /* Shared rAF loop data for magnetic / repulsion */
  var rafId = null;
  var magneticEls = [];   /* { el, spans, targets, currents, radius, mode } */

  /* Shared IntersectionObserver for word-morph (CPU saving) */
  var morphObserver = null;
  var morphEls = [];      /* { el, words, idx, interval } */

  /* ── Text splitter ──────────────────────────────────────── */
  function splitChars(el) {
    if (el.__sdsSplit) return el.__sdsChars || [];
    var text = el.textContent;
    el.setAttribute('aria-label', text);
    el.textContent = '';
    var spans = [];
    for (var i = 0; i < text.length; i++) {
      var s = document.createElement('span');
      s.className = 'sds-char';
      s.setAttribute('aria-hidden', 'true');
      s.style.cssText = 'display:inline-block;will-change:transform;--i:' + i;
      s.textContent = text[i] === ' ' ? ' ' : text[i];
      el.appendChild(s);
      spans.push(s);
    }
    el.__sdsSplit = true;
    el.__sdsChars = spans;
    return spans;
  }

  /* ── Jelly hover ────────────────────────────────────────── */
  var JELLY_KF = 'sds-jellyKf';

  function injectJellyKeyframes() {
    if (document.getElementById('__sds-jelly-kf')) return;
    var style = document.createElement('style');
    style.id = '__sds-jelly-kf';
    style.textContent = [
      '@keyframes ' + JELLY_KF + '{',
      '0%,100%{transform:scale(1,1)}',
      '30%{transform:scaleX(1.25)scaleY(0.75)}',
      '40%{transform:scaleX(0.75)scaleY(1.25)}',
      '55%{transform:scaleX(1.15)scaleY(0.85)}',
      '70%{transform:scaleX(0.95)scaleY(1.05)}',
      '85%{transform:scaleX(1.02)scaleY(0.98)}',
      '}'
    ].join('');
    document.head.appendChild(style);
  }

  function initJellyHover(el) {
    injectJellyKeyframes();
    function onEnter() {
      el.style.animation = JELLY_KF + ' 0.6s cubic-bezier(0.34,1.56,0.64,1)';
    }
    function onEnd() {
      el.style.animation = '';
    }
    el.addEventListener('mouseenter', onEnter);
    el.addEventListener('animationend', onEnd);
    return function () {
      el.removeEventListener('mouseenter', onEnter);
      el.removeEventListener('animationend', onEnd);
    };
  }

  /* ── Scatter return ─────────────────────────────────────── */
  function initScatterReturn(el) {
    if (!HOVER_CAPABLE) return function () {};
    var spans = splitChars(el);
    var SPRING = 'transform 0.5s cubic-bezier(0.34,1.56,0.64,1)';

    function scatter() {
      spans.forEach(function (s) {
        var dx = (Math.random() - 0.5) * 160;
        var dy = (Math.random() - 0.5) * 160;
        var dr = (Math.random() - 0.5) * 180;
        s.style.transition = 'none';
        s.style.transform = 'translate(' + dx + 'px,' + dy + 'px) rotate(' + dr + 'deg)';
      });
      /* start transition on next frame so transform takes effect first */
      requestAnimationFrame(function () {
        spans.forEach(function (s) {
          s.style.transition = SPRING;
        });
      });
    }

    function restore() {
      spans.forEach(function (s) {
        s.style.transition = SPRING;
        s.style.transform = 'none';
      });
    }

    el.addEventListener('mouseenter', scatter);
    el.addEventListener('mouseleave', restore);

    return function () {
      el.removeEventListener('mouseenter', scatter);
      el.removeEventListener('mouseleave', restore);
    };
  }

  /* ── Shockwave ──────────────────────────────────────────── */
  function initShockwave(el) {
    var spans = splitChars(el);
    el.style.cursor = 'pointer';

    function onClick(e) {
      var rect = el.getBoundingClientRect();
      var cx = e.clientX - rect.left;
      var cy = e.clientY - rect.top;
      var SPRING = 'transform 0.45s cubic-bezier(0.34,1.56,0.64,1)';

      spans.forEach(function (s) {
        var sr = s.getBoundingClientRect();
        var sx = sr.left + sr.width / 2 - rect.left;
        var sy = sr.top + sr.height / 2 - rect.top;
        var dx = sx - cx;
        var dy = sy - cy;
        var dist = Math.sqrt(dx * dx + dy * dy) || 1;
        var force = Math.max(0, 120 - dist) * 0.8;
        var tx = (dx / dist) * force;
        var ty = (dy / dist) * force;
        s.style.transition = 'none';
        s.style.transform = 'translate(' + tx + 'px,' + ty + 'px)';
      });

      requestAnimationFrame(function () {
        spans.forEach(function (s) {
          s.style.transition = SPRING;
        });
        setTimeout(function () {
          spans.forEach(function (s) {
            s.style.transform = 'none';
          });
        }, 260);
      });
    }

    el.addEventListener('click', onClick);
    return function () {
      el.removeEventListener('click', onClick);
      el.style.cursor = '';
    };
  }

  /* ── Spring kerning ─────────────────────────────────────── */
  function initSpringKerning(el) {
    if (!HOVER_CAPABLE) return function () {};

    function onMove(e) {
      var rect = el.getBoundingClientRect();
      var ratio = (e.clientX - rect.left) / rect.width;
      var spacing = (ratio - 0.5) * 24;
      el.style.transition = 'letter-spacing 0.15s ease';
      el.style.letterSpacing = spacing + 'px';
    }
    function onLeave() {
      el.style.letterSpacing = 'normal';
    }

    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return function () {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
      el.style.letterSpacing = '';
      el.style.transition = '';
    };
  }

  /* ── Shared rAF loop (magnetic + repulsion) ─────────────── */
  function startRaf() {
    if (rafId !== null) return;
    function tick() {
      var anyActive = false;
      magneticEls.forEach(function (entry) {
        if (!entry.el.isConnected) return;
        anyActive = true;
        var spans = entry.spans;
        for (var i = 0; i < spans.length; i++) {
          var curr = entry.currents[i];
          var tgt  = entry.targets[i];
          curr[0] += (tgt[0] - curr[0]) * 0.18;
          curr[1] += (tgt[1] - curr[1]) * 0.18;
          if (Math.abs(curr[0]) > 0.01 || Math.abs(curr[1]) > 0.01) {
            spans[i].style.transform = 'translate(' + curr[0] + 'px,' + curr[1] + 'px)';
          } else if (tgt[0] === 0 && tgt[1] === 0) {
            spans[i].style.transform = 'none';
          }
        }
      });
      if (anyActive) {
        rafId = requestAnimationFrame(tick);
      } else {
        rafId = null;
      }
    }
    rafId = requestAnimationFrame(tick);
  }

  function stopRafIfEmpty() {
    if (magneticEls.length === 0 && rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  function initMagneticField(el, mode) {
    if (!HOVER_CAPABLE) return function () {};
    var spans = splitChars(el);
    var radius = parseInt(el.dataset.sdsRadius || '110', 10);
    var targets  = spans.map(function () { return [0, 0]; });
    var currents = spans.map(function () { return [0, 0]; });
    var entry = { el: el, spans: spans, targets: targets, currents: currents, radius: radius, mode: mode };
    magneticEls.push(entry);

    function onMove(e) {
      var rect = el.getBoundingClientRect();
      for (var i = 0; i < spans.length; i++) {
        var sr = spans[i].getBoundingClientRect();
        var sx = sr.left + sr.width  / 2;
        var sy = sr.top  + sr.height / 2;
        var dx = e.clientX - sx;
        var dy = e.clientY - sy;
        var dist = Math.sqrt(dx * dx + dy * dy) || 1;
        if (dist < radius) {
          var pull = (dx / dist) * 34;
          var push_y = (dy / dist) * 34;
          targets[i][0] = mode === 'attract' ? pull : -pull;
          targets[i][1] = mode === 'attract' ? push_y : -push_y;
        } else {
          targets[i][0] = 0;
          targets[i][1] = 0;
        }
      }
      startRaf();
    }

    function onLeave() {
      targets.forEach(function (t) { t[0] = 0; t[1] = 0; });
      startRaf();
    }

    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);

    return function () {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
      var idx = magneticEls.indexOf(entry);
      if (idx > -1) magneticEls.splice(idx, 1);
      stopRafIfEmpty();
    };
  }

  /* ── Word morph ─────────────────────────────────────────── */
  function initMorphObserver() {
    if (morphObserver) return;
    morphObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        var entry = morphEls.find(function (m) { return m.el === e.target; });
        if (!entry) return;
        if (e.isIntersecting) {
          startMorphInterval(entry);
        } else {
          stopMorphInterval(entry);
        }
      });
    }, { threshold: 0.1 });
  }

  function startMorphInterval(entry) {
    if (entry.interval) return;
    if (REDUCED_MOTION) {
      /* no animation — just cycle text */
      entry.interval = setInterval(function () {
        entry.idx = (entry.idx + 1) % entry.words.length;
        entry.el.textContent = entry.words[entry.idx];
      }, 2200);
      return;
    }
    entry.interval = setInterval(function () {
      var el = entry.el;
      el.style.transition = 'opacity 0.3s, filter 0.3s, transform 0.3s';
      el.style.opacity = '0';
      el.style.filter = 'blur(8px)';
      el.style.transform = 'translateY(-8px)';
      setTimeout(function () {
        entry.idx = (entry.idx + 1) % entry.words.length;
        el.textContent = entry.words[entry.idx];
        el.style.opacity = '0';
        el.style.filter = 'blur(8px)';
        el.style.transform = 'translateY(8px)';
        requestAnimationFrame(function () {
          requestAnimationFrame(function () {
            el.style.opacity = '1';
            el.style.filter = 'blur(0)';
            el.style.transform = 'translateY(0)';
          });
        });
      }, 320);
    }, 2200);
  }

  function stopMorphInterval(entry) {
    if (entry.interval) {
      clearInterval(entry.interval);
      entry.interval = null;
    }
  }

  function initWordMorph(el) {
    var raw = el.dataset.words || '';
    var words = raw.split(',').map(function (w) { return w.trim(); }).filter(Boolean);
    if (words.length < 2) return function () {};
    var entry = { el: el, words: words, idx: 0, interval: null };
    morphEls.push(entry);
    initMorphObserver();
    morphObserver.observe(el);

    return function () {
      stopMorphInterval(entry);
      morphObserver.unobserve(el);
      var idx = morphEls.indexOf(entry);
      if (idx > -1) morphEls.splice(idx, 1);
      el.style.transition = '';
      el.style.opacity = '';
      el.style.filter = '';
      el.style.transform = '';
    };
  }

  /* ── init single element ────────────────────────────────── */
  function initEl(el) {
    /* avoid double-init */
    if (el.__sdsInteractive) return;
    el.__sdsInteractive = true;

    var cleanups = [];

    if (el.classList.contains('sds-word-morph')) {
      cleanups.push(initWordMorph(el));
    }
    if (el.classList.contains('sds-jelly-hover')) {
      cleanups.push(initJellyHover(el));
    }
    if (el.classList.contains('sds-scatter-return')) {
      cleanups.push(initScatterReturn(el));
    }
    if (el.classList.contains('sds-shockwave')) {
      cleanups.push(initShockwave(el));
    }
    if (el.classList.contains('sds-spring-kerning')) {
      cleanups.push(initSpringKerning(el));
    }
    if (el.classList.contains('sds-magnetic-pull')) {
      cleanups.push(initMagneticField(el, 'attract'));
    }
    if (el.classList.contains('sds-repulsion-field')) {
      cleanups.push(initMagneticField(el, 'repel'));
    }

    if (cleanups.length > 0) {
      cleanupMap.set(el, function () {
        cleanups.forEach(function (fn) { if (fn) fn(); });
        el.__sdsInteractive = false;
      });
    } else {
      el.__sdsInteractive = false;
    }
  }

  /* ── cleanup single element ─────────────────────────────── */
  function cleanup(el) {
    var fn = cleanupMap.get(el);
    if (fn) {
      fn();
      cleanupMap.delete(el);
    }
  }

  /* ── scan a container (or document.body) ────────────────── */
  var SELECTORS = [
    '.sds-word-morph',
    '.sds-jelly-hover',
    '.sds-scatter-return',
    '.sds-shockwave',
    '.sds-spring-kerning',
    '.sds-magnetic-pull',
    '.sds-repulsion-field'
  ].join(',');

  function scan(root) {
    var container = root || document.body;
    var els = container.querySelectorAll(SELECTORS);
    els.forEach(initEl);
    /* also check container itself */
    if (container !== document.body && container.matches && container.matches(SELECTORS)) {
      initEl(container);
    }
  }

  /* ── SPA MutationObserver ────────────────────────────────── */
  var mutObs = new MutationObserver(function (mutations) {
    mutations.forEach(function (m) {
      m.addedNodes.forEach(function (node) {
        if (node.nodeType !== 1) return;
        if (node.matches && node.matches(SELECTORS)) initEl(node);
        var children = node.querySelectorAll ? node.querySelectorAll(SELECTORS) : [];
        children.forEach(initEl);
      });
      m.removedNodes.forEach(function (node) {
        if (node.nodeType !== 1) return;
        cleanup(node);
        var children = node.querySelectorAll ? node.querySelectorAll(SELECTORS) : [];
        children.forEach(cleanup);
      });
    });
  });
  mutObs.observe(document.body, { childList: true, subtree: true });

  /* ── Public API ─────────────────────────────────────────── */
  global.SDSInteractive = { scan: scan, initEl: initEl, cleanup: cleanup };

  /* ── Auto-init on DOMContentLoaded ─────────────────────── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { scan(); });
  } else {
    scan();
  }

})(window);

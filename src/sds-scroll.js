/**
 * SDS Motion Forge — Scroll Gate Engine
 * Version: 5.0.0
 *
 * Adds "sds-js" to <html> immediately.
 * Elements with [data-sds] stay invisible until they enter
 * the viewport, then receive class "sds-play" which starts
 * the animation (works because CSS sets animation-play-state
 * based on sds-play presence).
 *
 * Attributes:
 *   data-sds              — required, marks element as scroll-gated
 *   data-sds-repeat       — present → removes sds-play on exit (re-plays)
 *   data-sds-delay="200"  — ms to wait after entry before adding sds-play
 *
 * Load: <script src="sds-scroll.min.js" defer></script>
 */
(function () {
  'use strict';

  /* Mark JS as active immediately so CSS fallback stays hidden */
  document.documentElement.classList.add('sds-js');

  var REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* WeakMap: el → pending setTimeout id */
  var timers = new WeakMap();

  /* ── Shared IntersectionObserver ────────────────────────── */
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      var el = entry.target;

      if (entry.isIntersecting) {
        var delay = parseInt(el.dataset.sdsDelay || '0', 10);
        if (delay > 0 && !REDUCED) {
          var t = setTimeout(function () {
            el.classList.add('sds-play');
            timers.delete(el);
          }, delay);
          timers.set(el, t);
        } else {
          el.classList.add('sds-play');
        }
      } else {
        /* cancel pending timer if scrolled away before delay fires */
        var pending = timers.get(el);
        if (pending !== undefined) {
          clearTimeout(pending);
          timers.delete(el);
        }
        if ('sdsRepeat' in el.dataset) {
          el.classList.remove('sds-play');
        }
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -40px 0px'
  });

  /* ── Observe a single element ───────────────────────────── */
  function observe(el) {
    if (REDUCED) {
      el.classList.add('sds-play');
      return;
    }
    observer.observe(el);
  }

  /* ── Initial scan ────────────────────────────────────────── */
  function scanAll() {
    document.querySelectorAll('[data-sds]').forEach(observe);
  }

  /* ── MutationObserver for SPA / dynamic content ─────────── */
  var mutObs = new MutationObserver(function (mutations) {
    mutations.forEach(function (m) {
      m.addedNodes.forEach(function (node) {
        if (node.nodeType !== 1) return;
        if (node.dataset && 'sds' in node.dataset) observe(node);
        var children = node.querySelectorAll ? node.querySelectorAll('[data-sds]') : [];
        children.forEach(observe);
      });
      m.removedNodes.forEach(function (node) {
        if (node.nodeType !== 1) return;
        observer.unobserve(node);
        var pending = timers.get(node);
        if (pending !== undefined) {
          clearTimeout(pending);
          timers.delete(node);
        }
      });
    });
  });

  /* ── Boot ────────────────────────────────────────────────── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      scanAll();
      mutObs.observe(document.body, { childList: true, subtree: true });
    });
  } else {
    scanAll();
    mutObs.observe(document.body, { childList: true, subtree: true });
  }

})();

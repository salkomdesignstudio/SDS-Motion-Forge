/* SDS Motion Forge: scroll reveals for every page, GSAP + ScrollTrigger.
   - Only what is still below the fold when the script starts is hidden, so nothing above the fold ever flickers.
   - Opacity and transform only (no visibility), so find-in-page and screen readers still see everything.
   - If GSAP does not load, nothing was hidden and the page is simply static.
   - Skipped for prefers-reduced-motion and Save-Data.
   Choreography: headings lift in with a soft blur; eyebrow, title and lead of a section head arrive in sequence;
   groups of cards rise in batches with a stagger; code windows, tables, figures and callouts settle in;
   [data-reveal="left|right|up"] and [data-delay="n"] are honoured where a page sets them. */
(function () {
  "use strict";
  var rm = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var sd = navigator.connection && navigator.connection.saveData;
  if (rm || sd) return;

  function load(src) {
    return new Promise(function (ok, fail) { var s = document.createElement("script"); s.src = src; s.onload = ok; s.onerror = fail; document.head.appendChild(s); });
  }
  function start() {
    if (window.gsap && window.ScrollTrigger) return init();
    /* the home page has its own loader for the same files: wait for it instead of loading twice */
    if (document.getElementById("galGrid")) {
      var tries = 0, iv = setInterval(function () { if (window.gsap && window.ScrollTrigger) { clearInterval(iv); init(); } else if (++tries > 70) clearInterval(iv); }, 200);
      return;
    }
    load("/vendor/gsap/gsap.min.js").then(function () { return load("/vendor/gsap/ScrollTrigger.min.js"); }).then(init).catch(function () {});
  }
  if ("requestIdleCallback" in window) requestIdleCallback(start, { timeout: 1200 }); else setTimeout(start, 300);

  function init() {
    var gsap = window.gsap, ST = window.ScrollTrigger;
    gsap.registerPlugin(ST);
    var EXCL = ".sh, .sh-menu, .sh-drawer, .foot, footer.foot, .hero, .cta2, .modal, .gal-grid, .fx-stage, .spec, .m-hero-demo, [data-no-reveal]";
    var seen = new WeakSet(), vh = window.innerHeight;
    var below = function (el) { return el.getBoundingClientRect().top > vh * 0.9; };
    var usable = function (el) { return el && !seen.has(el) && !el.closest(EXCL) && below(el); };
    var main = document.querySelector("main") || document.body;
    var $$ = function (sel, root) { return [].slice.call((root || main).querySelectorAll(sel)); };

    function dir(el) {
      var d = el.getAttribute("data-reveal");
      return d === "left" ? { x: -40, y: 0 } : d === "right" ? { x: 40, y: 0 } : { x: 0, y: 34 };
    }
    var pending = new Set();
    function done(el) { pending.delete(el); gsap.set(el, { clearProps: "opacity,transform,filter,scale,x,y" }); }

    /* one element: hide it now (it is below the fold), reveal when it reaches the lower part of the screen */
    function single(el, opts) {
      if (!usable(el)) return;
      seen.add(el);
      var o = opts || {}, d = dir(el), delay = (parseFloat(el.getAttribute("data-delay")) || 0) * 0.08;
      pending.add(el);
      gsap.set(el, { opacity: 0, x: d.x, y: o.y != null ? o.y : d.y, scale: o.scale || 1, filter: o.blur ? "blur(" + o.blur + "px)" : "none" });
      ST.create({
        trigger: el, start: o.start || "clamp(top 88%)", once: true,
        onEnter: function () { gsap.to(el, { opacity: 1, x: 0, y: 0, scale: 1, filter: "blur(0px)", duration: o.duration || 0.9, delay: delay, ease: "power3.out", onComplete: function () { done(el); } }); },
      });
    }

    /* a section head: eyebrow, title and lead arrive one after the other */
    $$(".sec-head, .g-head, .m-hero").forEach(function (head) {
      if (!usable(head)) return;
      var kids = [].slice.call(head.children).filter(function (k) { return !k.closest(EXCL); });
      if (!kids.length) return;
      seen.add(head); kids.forEach(function (k) { seen.add(k); });
      kids.forEach(function (k) { pending.add(k); });
      gsap.set(kids, { opacity: 0, y: 30, filter: "blur(8px)" });
      ST.create({ trigger: head, start: "clamp(top 86%)", once: true, onEnter: function () { gsap.to(kids, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.9, stagger: 0.1, ease: "power3.out", onComplete: function () { kids.forEach(done); } }); } });
    });

    /* headings and leads that are not part of a head block (docs, guides, effect pages) */
    $$("h2, .lead, .eyebrow").forEach(function (el) { if (!el.closest(".fx-card, .card, .tile, details, summary, .m-way, .j-card, .w-card, .m-step, .m-client, .m-feat, .docs-card, li")) single(el, { y: 28, blur: 6 }); });

    /* cards: grouped by their container, revealed in batches with a stagger */
    var CARD = ".fx-card, .card, .tile, .m-way, .j-card, .w-card, .m-step, .m-client, .m-feat, .docs-card, .faq-item, .m-faq details, .facts li, .need, .step, .cat-stat, .pg";
    var groups = new Map();
    $$(CARD).forEach(function (el) { if (!usable(el)) return; var p = el.parentElement; if (!groups.has(p)) groups.set(p, []); groups.get(p).push(el); });
    groups.forEach(function (cards) {
      cards.forEach(function (c) { seen.add(c); });
      cards.forEach(function (c) { pending.add(c); });
      gsap.set(cards, { opacity: 0, y: 44, scale: 0.965 });
      ST.batch(cards, {
        start: "clamp(top 92%)", once: true, interval: 0.1, batchMax: 12,
        onEnter: function (batch) { gsap.to(batch, { opacity: 1, y: 0, scale: 1, duration: 0.85, stagger: 0.07, ease: "power3.out", overwrite: true, onComplete: function () { batch.forEach(done); } }); },
      });
    });

    /* windows, code, tables, figures, callouts */
    $$("pre, .m-code, .codewin, .m-cmd, table, figure, .vid, .callout, .m-note, .h-demo, .phys-wrap").forEach(function (el) { if (!el.closest("pre, table, .fx-card, .m-code, .codewin")) single(el, { y: 40, scale: 0.985, duration: 1 }); });

    /* anything a page marks itself */
    $$("[data-reveal]").forEach(function (el) { single(el); });

    /* safety net for fast flicks and long pages: when scrolling stops, anything still hidden above or inside the viewport is shown */
    ST.addEventListener("scrollEnd", function () {
      pending.forEach(function (el) {
        if (el.getBoundingClientRect().top < vh * 0.95 && !gsap.isTweening(el) && +gsap.getProperty(el, "opacity") < 0.05) {
          gsap.to(el, { opacity: 1, x: 0, y: 0, scale: 1, filter: "blur(0px)", duration: 0.5, ease: "power2.out", onComplete: function () { done(el); } });
        }
      });
    });

    window.addEventListener("load", function () { ST.refresh(); }, { once: true });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { ST.refresh(); });
  }
})();

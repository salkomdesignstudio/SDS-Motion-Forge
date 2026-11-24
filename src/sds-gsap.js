/*!
 * SDS Motion Forge — sds-gsap.js
 * Optional GSAP engine: add a class such as `sds-gsap-card-tilt` and the effect runs.
 * No build step, no setup. GSAP itself is NOT bundled: this file loads it (and ScrollTrigger) from a CDN the first
 * time a `sds-gsap-*` class is found, so pages that do not use these classes download nothing extra.
 *
 * Options (all optional) are data attributes on the element: data-sds-duration, data-sds-delay, data-sds-stagger,
 * data-sds-speed, data-sds-to, data-sds-length, data-sds-ease.
 * Self-hosting: <script src="sds-gsap.min.js" data-gsap="/vendor/gsap.min.js" data-scrolltrigger="/vendor/ScrollTrigger.min.js">
 * Respects prefers-reduced-motion: nothing is animated and the content stays as written.
 */
(function () {
  "use strict";
  if (typeof window === "undefined" || window.sdsGsap) return;

  var me = document.currentScript;
  var V = "3.13.0";
  var SRC_GSAP = (me && me.getAttribute("data-gsap")) || "https://cdn.jsdelivr.net/npm/gsap@" + V + "/dist/gsap.min.js";
  var SRC_ST = (me && me.getAttribute("data-scrolltrigger")) || "https://cdn.jsdelivr.net/npm/gsap@" + V + "/dist/ScrollTrigger.min.js";
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var DEMO = ".fx-stage, .card-stage, .modal-stage, .spec-stage, .sh-pv";
  var live = new WeakMap();
  var gsap, ST, loading;

  function load(src) {
    return new Promise(function (res, rej) {
      var s = document.createElement("script");
      s.src = src; s.async = true; s.onload = res; s.onerror = function () { rej(new Error("sds-gsap: could not load " + src)); };
      document.head.appendChild(s);
    });
  }
  function ready() {
    if (gsap) return Promise.resolve();
    return (loading = loading || (window.gsap ? Promise.resolve() : load(SRC_GSAP)).then(function () {
      return window.ScrollTrigger ? 0 : load(SRC_ST);
    }).then(function () {
      gsap = window.gsap; ST = window.ScrollTrigger; gsap.registerPlugin(ST);
    }));
  }

  function num(el, k, d) { var v = parseFloat(el.getAttribute("data-sds-" + k)); return isNaN(v) ? d : v; }
  function str(el, k, d) { return el.getAttribute("data-sds-" + k) || d; }
  function demo(el) { return !!el.closest(DEMO); }
  function kids(el) { return [].slice.call(el.children); }

  /* a scroll-linked tween; inside a docs demo box (nothing to scroll) it loops on its own instead */
  function link(el, vars, st, from) {
    var tw;
    if (demo(el)) {
      vars.repeat = -1; vars.yoyo = true; vars.duration = 1.6; vars.ease = "sine.inOut";
      tw = from ? gsap.fromTo(el, from, vars) : gsap.to(el, vars);
    } else {
      st.scrub = st.scrub == null ? true : st.scrub; st.trigger = st.trigger || el;
      vars.ease = vars.ease || "none"; vars.scrollTrigger = st;
      tw = from ? gsap.fromTo(el, from, vars) : gsap.to(el, vars);
    }
    return tw;
  }
  /* run once when the element reaches the lower part of the viewport (loops in a docs demo) */
  function onEnter(el, build) {
    if (demo(el)) { var tl = build(); tl.repeat(-1).repeatDelay(0.9); return tl; }
    var tl2 = build(); tl2.pause();
    ST.create({ trigger: el, start: "top 88%", once: true, onEnter: function () { tl2.play(); } });
    return tl2;
  }

  /* split the text of a plain element into words or characters (restored on cleanup) */
  function split(el, type, wrap) {
    var text = el.textContent, orig = el.innerHTML, out = [];
    el.setAttribute("aria-label", text.replace(/\s+/g, " ").trim());
    el.textContent = "";
    var words = text.split(/(\s+)/);
    words.forEach(function (w) {
      if (/^\s+$/.test(w) || w === "") { el.appendChild(document.createTextNode(" ")); return; }
      var wspan = document.createElement("span");
      wspan.setAttribute("aria-hidden", "true"); wspan.style.display = "inline-block";
      if (wrap) { wspan.style.overflow = "hidden"; wspan.style.verticalAlign = "top"; }
      if (type === "chars") {
        w.split("").forEach(function (c) { var s = document.createElement("span"); s.textContent = c; s.style.display = "inline-block"; wspan.appendChild(s); out.push(s); });
      } else {
        var inner = document.createElement("span"); inner.textContent = w; inner.style.display = "inline-block";
        wspan.appendChild(inner); out.push(inner);
      }
      el.appendChild(wspan);
    });
    return { nodes: out, restore: function () { el.innerHTML = orig; el.removeAttribute("aria-label"); } };
  }

  function dots(el, n, size) {
    var out = [];
    for (var i = 0; i < n; i++) {
      var d = document.createElement("i");
      d.style.cssText = "position:absolute;left:50%;top:50%;width:" + size + ";height:" + size + ";margin:-" + (parseFloat(size) / 2) + "em 0 0 -" + (parseFloat(size) / 2) + "em;border-radius:50%;background:currentColor;display:block";
      el.appendChild(d); out.push(d);
    }
    return out;
  }

  var FX = {
    /* ------------------------------ text ------------------------------ */
    "sds-gsap-text-scrub": function (el) {
      var s = split(el, "words");
      gsap.set(s.nodes, { opacity: 0.18 });
      var tw = demo(el)
        ? gsap.to(s.nodes, { opacity: 1, stagger: 0.12, duration: 0.5, repeat: -1, yoyo: true, repeatDelay: 0.6 })
        : gsap.to(s.nodes, { opacity: 1, stagger: 0.1, ease: "none", scrollTrigger: { trigger: el, start: "top 82%", end: "bottom 45%", scrub: true } });
      return function () { tw.kill(); s.restore(); };
    },
    "sds-gsap-text-wave": function (el) {
      var s = split(el, "chars");
      var tl = onEnter(el, function () {
        return gsap.timeline().from(s.nodes, { yPercent: 120, rotate: 12, opacity: 0, duration: num(el, "duration", 0.9), ease: str(el, "ease", "back.out(1.7)"), stagger: num(el, "stagger", 0.025), delay: num(el, "delay", 0) });
      });
      return function () { tl.kill(); s.restore(); };
    },
    "sds-gsap-text-mask": function (el) {
      var s = split(el, "words", true);
      var tl = onEnter(el, function () {
        return gsap.timeline().from(s.nodes, { yPercent: 110, duration: num(el, "duration", 0.8), ease: str(el, "ease", "power4.out"), stagger: num(el, "stagger", 0.06), delay: num(el, "delay", 0) });
      });
      return function () { tl.kill(); s.restore(); };
    },
    "sds-gsap-text-scramble": function (el) {
      var target = el.textContent, chars = "!<>-_\\/[]{}=+*^?#abcdefghijklmnopqrstuvwxyz0123456789", st = { p: 0 };
      el.setAttribute("aria-label", target);
      var tl = onEnter(el, function () {
        return gsap.timeline().to(st, {
          p: 1, duration: num(el, "duration", 1.4), ease: "power1.inOut", delay: num(el, "delay", 0),
          onUpdate: function () {
            var keep = Math.floor(st.p * target.length), s = "";
            for (var i = 0; i < target.length; i++) s += i < keep || /\s/.test(target[i]) ? target[i] : chars[(Math.random() * chars.length) | 0];
            el.textContent = s;
          },
          onComplete: function () { el.textContent = target; }, onReverseComplete: function () { el.textContent = target; }
        });
      });
      el.textContent = demo(el) ? target : target.replace(/\S/g, " ");
      return function () { tl.kill(); el.textContent = target; el.removeAttribute("aria-label"); };
    },
    "sds-gsap-text-count": function (el) {
      var raw = el.textContent, to = num(el, "to", parseFloat(raw.replace(/[^\d.\-]/g, "")) || 100);
      var pre = str(el, "prefix", ""), suf = str(el, "suffix", ""), dec = el.hasAttribute("data-sds-decimals") ? num(el, "decimals", 0) : (String(to).split(".")[1] || "").length;
      var o = { v: 0 };
      var fmt = function (v) { return pre + v.toLocaleString(undefined, { minimumFractionDigits: dec, maximumFractionDigits: dec }) + suf; };
      el.setAttribute("aria-label", fmt(to));
      var tl = onEnter(el, function () {
        return gsap.timeline().to(o, { v: to, duration: num(el, "duration", 2), ease: str(el, "ease", "power2.out"), delay: num(el, "delay", 0), onUpdate: function () { el.textContent = fmt(o.v); } });
      });
      el.textContent = fmt(0);
      return function () { tl.kill(); el.textContent = raw; el.removeAttribute("aria-label"); };
    },
    "sds-gsap-text-marquee": function (el) {
      var html = el.innerHTML, speed = num(el, "speed", 1), dir = num(el, "direction", -1);
      el.style.overflow = "hidden"; el.style.whiteSpace = "nowrap";
      var track = document.createElement("span");
      track.style.cssText = "display:inline-block;will-change:transform";
      track.innerHTML = html + "&nbsp;&nbsp;&nbsp;";
      el.textContent = ""; el.appendChild(track);
      var unit = track.offsetWidth || 1, copies = Math.max(2, Math.ceil((el.offsetWidth * 2) / unit) + 1), i;
      for (i = 1; i < copies; i++) track.innerHTML += html + "&nbsp;&nbsp;&nbsp;";
      var w = track.offsetWidth / copies;
      var tw = gsap.fromTo(track, { x: dir < 0 ? 0 : -w }, { x: dir < 0 ? -w : 0, duration: w / (60 * speed), ease: "none", repeat: -1 });
      var onV = ST && !demo(el) ? ST.create({ start: 0, end: "max", onUpdate: function (self) { tw.timeScale(1 + Math.min(4, Math.abs(self.getVelocity() / 400))); gsap.to(tw, { timeScale: 1, duration: 0.6, overwrite: true }); } }) : null;
      return function () { tw.kill(); if (onV) onV.kill(); el.innerHTML = html; el.style.overflow = el.style.whiteSpace = ""; };
    },

    /* ------------------------------ cards ------------------------------ */
    "sds-gsap-card-tilt": function (el) {
      var max = num(el, "tilt", 12);
      gsap.set(el, { transformPerspective: 800, transformOrigin: "50% 50%" });
      var rx = gsap.quickTo(el, "rotationX", { duration: 0.5, ease: "power3" }), ry = gsap.quickTo(el, "rotationY", { duration: 0.5, ease: "power3" }), sc = gsap.quickTo(el, "scale", { duration: 0.4, ease: "power3" });
      function move(e) { var r = el.getBoundingClientRect(); ry(((e.clientX - r.left) / r.width - 0.5) * 2 * max); rx((0.5 - (e.clientY - r.top) / r.height) * 2 * max); sc(1.03); }
      function leave() { gsap.to(el, { rotationX: 0, rotationY: 0, scale: 1, duration: 0.9, ease: "elastic.out(1,0.5)", overwrite: "auto" }); }
      el.addEventListener("pointermove", move); el.addEventListener("pointerleave", leave);
      return function () { el.removeEventListener("pointermove", move); el.removeEventListener("pointerleave", leave); gsap.set(el, { clearProps: "transform" }); };
    },
    "sds-gsap-card-magnetic": function (el) {
      var pull = num(el, "pull", 0.35);
      var qx = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3" }), qy = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3" });
      function move(e) { var r = el.getBoundingClientRect(); qx((e.clientX - (r.left + r.width / 2)) * pull); qy((e.clientY - (r.top + r.height / 2)) * pull); }
      function leave() { gsap.to(el, { x: 0, y: 0, duration: 0.9, ease: "elastic.out(1,0.4)", overwrite: "auto" }); }
      el.addEventListener("pointermove", move); el.addEventListener("pointerleave", leave);
      return function () { el.removeEventListener("pointermove", move); el.removeEventListener("pointerleave", leave); gsap.set(el, { clearProps: "transform" }); };
    },
    "sds-gsap-card-spotlight": function (el) {
      el.style.setProperty("--sds-x", "50%"); el.style.setProperty("--sds-y", "50%");
      function move(e) { var r = el.getBoundingClientRect(); gsap.to(el, { "--sds-x": e.clientX - r.left + "px", "--sds-y": e.clientY - r.top + "px", "--sds-o": 1, duration: 0.35, ease: "power2.out", overwrite: "auto" }); }
      function leave() { gsap.to(el, { "--sds-o": 0, duration: 0.6, ease: "power2.out", overwrite: "auto" }); }
      el.addEventListener("pointermove", move); el.addEventListener("pointerleave", leave);
      return function () { el.removeEventListener("pointermove", move); el.removeEventListener("pointerleave", leave); el.style.removeProperty("--sds-x"); el.style.removeProperty("--sds-y"); el.style.removeProperty("--sds-o"); };
    },
    "sds-gsap-card-fan": function (el) {
      var c = kids(el), n = c.length, spread = num(el, "spread", 14);
      gsap.set(c, { transformOrigin: "50% 120%" });
      var tl = onEnter(el, function () {
        return gsap.timeline().from(c, { rotation: 0, x: 0, y: 24, opacity: 0, duration: 0.01 })
          .to(c, { rotation: function (i) { return (i - (n - 1) / 2) * spread; }, x: function (i) { return (i - (n - 1) / 2) * 18; }, y: function (i) { return Math.abs(i - (n - 1) / 2) * 6; }, opacity: 1, duration: num(el, "duration", 0.9), ease: str(el, "ease", "back.out(1.5)"), stagger: 0.08, delay: num(el, "delay", 0) });
      });
      return function () { tl.kill(); gsap.set(c, { clearProps: "all" }); };
    },
    "sds-gsap-card-flip-in": function (el) {
      var c = kids(el);
      gsap.set(c, { transformPerspective: 800 });
      var tl = onEnter(el, function () {
        return gsap.timeline().from(c, { rotationY: -90, opacity: 0, y: 20, duration: num(el, "duration", 0.8), ease: str(el, "ease", "power3.out"), stagger: num(el, "stagger", 0.12), delay: num(el, "delay", 0) });
      });
      return function () { tl.kill(); gsap.set(c, { clearProps: "all" }); };
    },
    "sds-gsap-card-depth": function (el) {
      var layers = [].slice.call(el.querySelectorAll("[data-depth]")); if (!layers.length) layers = kids(el);
      var amt = num(el, "depth", 24), setters = layers.map(function (l, i) { var d = parseFloat(l.getAttribute("data-depth")) || (i + 1) / layers.length; return { x: gsap.quickTo(l, "x", { duration: 0.6, ease: "power3" }), y: gsap.quickTo(l, "y", { duration: 0.6, ease: "power3" }), d: d }; });
      function move(e) { var r = el.getBoundingClientRect(), px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5; setters.forEach(function (s) { s.x(px * amt * s.d * 2); s.y(py * amt * s.d * 2); }); }
      function leave() { setters.forEach(function (s) { s.x(0); s.y(0); }); }
      el.addEventListener("pointermove", move); el.addEventListener("pointerleave", leave);
      return function () { el.removeEventListener("pointermove", move); el.removeEventListener("pointerleave", leave); gsap.set(layers, { clearProps: "transform" }); };
    },

    /* ------------------------------ loaders ------------------------------ */
    "sds-gsap-loader-orbit": function (el) {
      var made = [], ring = [], n = num(el, "dots", 3);
      for (var i = 0; i < n; i++) { var w = document.createElement("i"); w.style.cssText = "position:absolute;inset:0;display:block"; var d = document.createElement("i"); d.style.cssText = "position:absolute;left:50%;top:0;width:0.6em;height:0.6em;margin-left:-0.3em;border-radius:50%;background:currentColor;display:block"; w.appendChild(d); el.appendChild(w); made.push(w); ring.push(w); }
      var tw = gsap.to(ring, { rotation: 360, duration: num(el, "duration", 1.6), ease: "power2.inOut", repeat: -1, stagger: { each: 0.14, repeat: -1 } });
      return function () { tw.kill(); made.forEach(function (m) { m.remove(); }); };
    },
    "sds-gsap-loader-chase": function (el) {
      var d = dots(el, 3, "0.7em");
      gsap.set(d, { x: function (i) { return (i - 1) * 1.1 * 16; } });
      var tw = gsap.to(d, { y: -14, duration: 0.45, ease: "power2.out", yoyo: true, repeat: -1, stagger: 0.12, repeatDelay: 0.1 });
      return function () { tw.kill(); d.forEach(function (x) { x.remove(); }); };
    },
    "sds-gsap-loader-equalizer": function (el) {
      var bars = [], i;
      for (i = 0; i < 5; i++) { var b = document.createElement("i"); b.style.cssText = "position:absolute;bottom:0;left:" + (i * 20 + 6) + "%;width:12%;height:100%;border-radius:2px;background:currentColor;display:block;transform-origin:50% 100%"; el.appendChild(b); bars.push(b); }
      var tweens = bars.map(function (b2, k) {
        return gsap.fromTo(b2, { scaleY: 0.2 }, { scaleY: 1, duration: gsap.utils.random(0.35, 0.7), ease: "sine.inOut", yoyo: true, repeat: -1, delay: k * 0.07, onRepeat: function () { this.duration(gsap.utils.random(0.3, 0.8)); } });
      });
      return function () { tweens.forEach(function (t) { t.kill(); }); bars.forEach(function (b3) { b3.remove(); }); };
    },
    "sds-gsap-loader-ring": function (el) {
      var r = document.createElement("i");
      r.style.cssText = "position:absolute;inset:0;display:block;border:0.18em solid currentColor;border-right-color:transparent;border-radius:50%";
      el.appendChild(r);
      var tl = gsap.timeline({ repeat: -1 }).to(r, { rotation: "+=360", duration: 0.9, ease: "elastic.out(1,0.6)" }).to(r, { scale: 0.82, duration: 0.25, yoyo: true, repeat: 1, ease: "sine.inOut" }, 0);
      return function () { tl.kill(); r.remove(); };
    },
    "sds-gsap-loader-count": function (el) {
      var o = { v: 0 }, orig = el.textContent;
      el.setAttribute("role", "progressbar"); el.setAttribute("aria-valuemin", "0"); el.setAttribute("aria-valuemax", "100");
      var tw = gsap.to(o, { v: 100, duration: num(el, "duration", 2.4), ease: "power2.inOut", repeat: -1, repeatDelay: 0.5, onUpdate: function () { el.textContent = Math.round(o.v) + "%"; el.setAttribute("aria-valuenow", Math.round(o.v)); } });
      return function () { tw.kill(); el.textContent = orig; el.removeAttribute("role"); };
    },
    "sds-gsap-loader-blob": function (el) {
      var b = document.createElement("i");
      b.style.cssText = "position:absolute;inset:12%;display:block;border-radius:50%;background:currentColor";
      el.appendChild(b);
      var tl = gsap.timeline({ repeat: -1, yoyo: true }).to(b, { scaleX: 1.25, scaleY: 0.8, rotation: 20, duration: 0.7, ease: "sine.inOut" }).to(b, { scaleX: 0.85, scaleY: 1.2, rotation: -20, duration: 0.7, ease: "sine.inOut" });
      return function () { tl.kill(); b.remove(); };
    },

    /* ------------------------------ scroll ------------------------------ */
    "sds-gsap-scroll-pin": function (el) {
      if (demo(el)) { var t0 = gsap.fromTo(el, { scale: 1 }, { scale: 0.94, duration: 1, yoyo: true, repeat: -1, ease: "sine.inOut" }); return function () { t0.kill(); gsap.set(el, { clearProps: "transform" }); }; }
      var len = str(el, "length", "+=100%");
      var st = ST.create({ trigger: el, start: str(el, "start", "top top"), end: /^[+\-]/.test(len) ? len : "+=" + len, pin: true, pinSpacing: true, anticipatePin: 1 });
      return function () { st.kill(); };
    },
    "sds-gsap-scroll-parallax": function (el) {
      var s = num(el, "speed", 0.3) * 50;
      var tw = link(el, { yPercent: s }, { start: "top bottom", end: "bottom top" }, { yPercent: -s });
      return function () { tw.kill(); gsap.set(el, { clearProps: "transform" }); };
    },
    "sds-gsap-scroll-horizontal": function (el) {
      var track = el.firstElementChild; if (!track) return;
      el.style.overflow = "hidden";
      var dist = function () { return Math.max(0, track.scrollWidth - el.clientWidth); };
      var tw;
      if (demo(el)) tw = gsap.fromTo(track, { x: 0 }, { x: function () { return -dist(); }, duration: 2.2, ease: "sine.inOut", yoyo: true, repeat: -1 });
      else tw = gsap.to(track, { x: function () { return -dist(); }, ease: "none", scrollTrigger: { trigger: el, pin: true, scrub: 1, start: "top top", end: function () { return "+=" + dist(); }, invalidateOnRefresh: true } });
      return function () { tw.kill(); gsap.set(track, { clearProps: "transform" }); el.style.overflow = ""; };
    },
    "sds-gsap-scroll-stagger": function (el) {
      var c = kids(el), made = [];
      if (demo(el)) { var tl = gsap.timeline({ repeat: -1, repeatDelay: 0.8 }).from(c, { y: 36, opacity: 0, duration: 0.7, ease: "power3.out", stagger: 0.12 }); return function () { tl.kill(); gsap.set(c, { clearProps: "all" }); }; }
      gsap.set(c, { y: num(el, "distance", 40), opacity: 0 });
      made = ST.batch(c, { start: "top 88%", once: true, onEnter: function (b) { gsap.to(b, { y: 0, opacity: 1, duration: num(el, "duration", 0.8), ease: str(el, "ease", "power3.out"), stagger: num(el, "stagger", 0.1), overwrite: true }); } });
      return function () { made.forEach(function (m) { m.kill(); }); gsap.set(c, { clearProps: "all" }); };
    },
    "sds-gsap-scroll-zoom": function (el) {
      var tw = link(el, { scale: 1, clipPath: "inset(0% round 0px)" }, { start: "top 90%", end: "top 30%" }, { scale: 0.82, clipPath: "inset(12% round 28px)" });
      return function () { tw.kill(); gsap.set(el, { clearProps: "transform,clipPath" }); };
    },
    "sds-gsap-scroll-progress": function (el) {
      gsap.set(el, { transformOrigin: "0 50%", scaleX: 0 });
      var tw = demo(el)
        ? gsap.to(el, { scaleX: 1, duration: 1.8, ease: "power1.inOut", yoyo: true, repeat: -1 })
        : gsap.to(el, { scaleX: 1, ease: "none", scrollTrigger: { trigger: document.documentElement, start: "top top", end: "max", scrub: 0.2 } });
      return function () { tw.kill(); gsap.set(el, { clearProps: "transform" }); };
    }
  };

  function nameOf(el) { var c = el.classList; for (var i = 0; i < c.length; i++) if (FX[c[i]]) return c[i]; return null; }

  function run(el) {
    if (live.has(el)) return;
    var n = nameOf(el); if (!n) return;
    live.set(el, 1);
    var cleanup;
    try { cleanup = FX[n](el); } catch (e) { if (window.console) console.warn("sds-gsap: " + n + " failed", e); }
    live.set(el, cleanup || 1);
  }
  function kill(el) { var c = live.get(el); if (typeof c === "function") try { c(); } catch (e) {} live.delete(el); }

  function init(root) {
    root = root || document;
    var list = [].slice.call(root.querySelectorAll('[class*="sds-gsap-"]'));
    if (root.nodeType === 1 && /sds-gsap-/.test(root.className || "")) list.unshift(root);
    list = list.filter(function (e) { return nameOf(e) && !live.has(e); });
    if (!list.length || reduce) return Promise.resolve();
    return ready().then(function () { list.forEach(run); if (ST) ST.refresh(); }).catch(function (e) { if (window.console) console.warn(e.message); });
  }

  window.sdsGsap = { init: init, kill: kill, effects: Object.keys(FX), version: V };
  var go = function () {
    init();
    if ("MutationObserver" in window && !reduce) new MutationObserver(function (ms) {
      ms.forEach(function (m) { [].slice.call(m.addedNodes).forEach(function (n) { if (n.nodeType === 1) init(n); }); });
    }).observe(document.documentElement, { childList: true, subtree: true });
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", go); else go();
})();

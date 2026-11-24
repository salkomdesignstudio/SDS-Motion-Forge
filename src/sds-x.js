/*!
 * SDS Motion Forge — sds-x.js
 * Optional extended effects: add a class such as `sds-x-card-tilt` and the effect runs.
 * No build step, no setup. The animation runtime is NOT bundled: this file loads it from a CDN the first time an
 * `sds-x-*` class is found, so pages that do not use these classes download nothing extra.
 *
 * Options (all optional) are data attributes on the element: data-sds-duration, data-sds-delay, data-sds-stagger,
 * data-sds-speed, data-sds-to, data-sds-length, data-sds-ease.
 * Self-hosting: <script src="sds-x.min.js" data-runtime="/vendor/core.min.js" data-runtime-scroll="/vendor/scroll.min.js">
 * Respects prefers-reduced-motion: nothing is animated and the content stays as written.
 */
(function () {
  "use strict";
  if (typeof window === "undefined" || window.sdsX) return;

  var me = document.currentScript;
  var V = "3.13.0";
  var SRC_A = (me && me.getAttribute("data-runtime")) || "https://cdn.jsdelivr.net/npm/gsap@" + V + "/dist/gsap.min.js";
  var SRC_B = (me && me.getAttribute("data-runtime-scroll")) || "https://cdn.jsdelivr.net/npm/gsap@" + V + "/dist/ScrollTrigger.min.js";
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var DEMO = ".fx-stage, .card-stage, .modal-stage, .spec-stage, .sh-pv";
  var live = new WeakMap();
  var gsap, ST, loading;

  function load(src) {
    return new Promise(function (res, rej) {
      var s = document.createElement("script");
      s.src = src; s.async = true; s.onload = res; s.onerror = function () { rej(new Error("sds-x: could not load " + src)); };
      document.head.appendChild(s);
    });
  }
  function ready() {
    if (gsap) return Promise.resolve();
    return (loading = loading || (window.gsap ? Promise.resolve() : load(SRC_A)).then(function () {
      return window.ScrollTrigger ? 0 : load(SRC_B);
    }).then(function () {
      gsap = window.gsap; ST = window.ScrollTrigger; gsap.registerPlugin(ST);
    }));
  }

  function num(el, k, d) { var v = parseFloat(el.getAttribute("data-sds-" + k)); return isNaN(v) ? d : v; }
  function str(el, k, d) { return el.getAttribute("data-sds-" + k) || d; }
  function demo(el) { return !!el.closest(DEMO); }
  function kids(el) { return [].slice.call(el.children); }
  function rm(list) { list.forEach(function (n) { n.remove(); }); }

  /* a scroll-linked tween; inside a docs demo box (nothing to scroll) it loops on its own instead */
  function link(el, vars, st, from) {
    if (demo(el)) {
      vars.repeat = -1; vars.yoyo = true; vars.duration = 1.6; vars.ease = "sine.inOut";
    } else {
      st.scrub = st.scrub == null ? true : st.scrub; st.trigger = st.trigger || el;
      vars.ease = vars.ease || "none"; vars.scrollTrigger = st;
    }
    return from ? gsap.fromTo(el, from, vars) : gsap.to(el, vars);
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
    text.split(/(\s+)/).forEach(function (w) {
      if (w === "") return;
      if (/^\s+$/.test(w)) { el.appendChild(document.createTextNode(" ")); return; }
      var ws = document.createElement("span");
      ws.setAttribute("aria-hidden", "true"); ws.style.display = "inline-block";
      if (wrap) { ws.style.overflow = "hidden"; ws.style.verticalAlign = "top"; }
      if (type === "chars") {
        w.split("").forEach(function (c) { var s = document.createElement("span"); s.textContent = c; s.style.display = "inline-block"; ws.appendChild(s); out.push(s); });
      } else {
        var inner = document.createElement("span"); inner.textContent = w; inner.style.display = "inline-block";
        ws.appendChild(inner); out.push(inner);
      }
      el.appendChild(ws);
    });
    return { nodes: out, restore: function () { el.innerHTML = orig; el.removeAttribute("aria-label"); } };
  }
  /* characters in a text effect that enters once */
  function charsIn(el, from, defaults) {
    var s = split(el, "chars");
    var tl = onEnter(el, function () {
      var v = Object.assign({ duration: num(el, "duration", 0.9), ease: str(el, "ease", "power3.out"), stagger: num(el, "stagger", 0.03), delay: num(el, "delay", 0) }, defaults || {}, from);
      return gsap.timeline().from(s.nodes, v);
    });
    return function () { tl.kill(); s.restore(); };
  }

  function make(el, n, css) {
    var out = [];
    for (var i = 0; i < n; i++) { var d = document.createElement("i"); d.style.cssText = "display:block;" + (typeof css === "function" ? css(i) : css); el.appendChild(d); out.push(d); }
    return out;
  }
  var DOT = "position:absolute;left:50%;top:50%;border-radius:50%;background:currentColor;";

  var FX = {
    /* ================================ text ================================ */
    "sds-x-text-scrub": function (el) {
      var s = split(el, "words");
      gsap.set(s.nodes, { opacity: 0.18 });
      var tw = demo(el)
        ? gsap.to(s.nodes, { opacity: 1, stagger: 0.12, duration: 0.5, repeat: -1, yoyo: true, repeatDelay: 0.6 })
        : gsap.to(s.nodes, { opacity: 1, stagger: 0.1, ease: "none", scrollTrigger: { trigger: el, start: "top 82%", end: "bottom 45%", scrub: true } });
      return function () { tw.kill(); s.restore(); };
    },
    "sds-x-text-wave": function (el) { return charsIn(el, { yPercent: 120, rotate: 12, opacity: 0 }, { stagger: 0.025, ease: str(el, "ease", "back.out(1.7)") }); },
    "sds-x-text-mask": function (el) {
      var s = split(el, "words", true);
      var tl = onEnter(el, function () {
        return gsap.timeline().from(s.nodes, { yPercent: 110, duration: num(el, "duration", 0.8), ease: str(el, "ease", "power4.out"), stagger: num(el, "stagger", 0.06), delay: num(el, "delay", 0) });
      });
      return function () { tl.kill(); s.restore(); };
    },
    "sds-x-text-scramble": function (el) {
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
    "sds-x-text-count": function (el) {
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
    "sds-x-text-marquee": function (el) {
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
      return function () { tw.kill(); el.innerHTML = html; el.style.overflow = el.style.whiteSpace = ""; };
    },
    "sds-x-text-typewriter": function (el) {
      var t = el.textContent, o = { n: 0 }, caret = document.createElement("span");
      caret.style.cssText = "display:inline-block;width:0.08em;height:1em;margin-left:0.1em;vertical-align:-0.12em;background:currentColor";
      el.setAttribute("aria-label", t);
      var tl = onEnter(el, function () {
        return gsap.timeline().to(o, { n: t.length, duration: num(el, "duration", Math.max(1, t.length * 0.05)), ease: "none", delay: num(el, "delay", 0), onUpdate: function () { el.textContent = t.slice(0, Math.round(o.n)); el.appendChild(caret); } });
      });
      var blink = gsap.to(caret, { opacity: 0, duration: 0.5, repeat: -1, yoyo: true, ease: "steps(1)" });
      el.textContent = ""; el.appendChild(caret);
      return function () { tl.kill(); blink.kill(); el.textContent = t; el.removeAttribute("aria-label"); };
    },
    "sds-x-text-cycle": function (el) {
      var orig = el.textContent, words = (el.getAttribute("data-words") || orig).split(",").map(function (s) { return s.trim(); }).filter(Boolean);
      if (words.length < 2) return;
      var i = 0, hold = num(el, "hold", 1.6);
      el.textContent = words[0]; el.style.display = "inline-block"; el.setAttribute("aria-live", "polite");
      var tl = gsap.timeline({ repeat: -1 });
      words.forEach(function () {
        tl.to(el, { yPercent: -40, opacity: 0, filter: "blur(6px)", duration: 0.35, ease: "power2.in", delay: hold, onComplete: function () { i = (i + 1) % words.length; el.textContent = words[i]; } })
          .fromTo(el, { yPercent: 40, opacity: 0, filter: "blur(6px)" }, { yPercent: 0, opacity: 1, filter: "blur(0px)", duration: 0.45, ease: "power3.out" });
      });
      return function () { tl.kill(); el.textContent = orig; el.removeAttribute("aria-live"); gsap.set(el, { clearProps: "all" }); };
    },
    "sds-x-text-blur": function (el) { return charsIn(el, { filter: "blur(14px)", opacity: 0, y: 18 }, { stagger: 0.035, duration: 0.8 }); },
    "sds-x-text-drop": function (el) {
      var s = split(el, "chars");
      var tl = onEnter(el, function () {
        return gsap.timeline().from(s.nodes, { yPercent: -260, opacity: 0, duration: num(el, "duration", 1.1), ease: "bounce.out", stagger: { each: 0.04, from: "center" }, delay: num(el, "delay", 0) });
      });
      return function () { tl.kill(); s.restore(); };
    },
    "sds-x-text-sweep": function (el) {
      var tw = gsap.fromTo(el, { "--sds-x-p": 150 }, { "--sds-x-p": -50, duration: num(el, "duration", 2.2), ease: "power1.inOut", repeat: -1, repeatDelay: 0.6 });
      return function () { tw.kill(); el.style.removeProperty("--sds-x-p"); };
    },
    "sds-x-text-flip": function (el) {
      var s = split(el, "chars");
      gsap.set(s.nodes, { transformPerspective: 600, transformOrigin: "50% 100%" });
      var tl = onEnter(el, function () {
        return gsap.timeline().from(s.nodes, { rotationX: -100, opacity: 0, duration: num(el, "duration", 0.8), ease: "back.out(1.4)", stagger: { each: 0.03, from: "random" }, delay: num(el, "delay", 0) });
      });
      return function () { tl.kill(); s.restore(); };
    },
    "sds-x-text-highlight": function (el) {
      var s = split(el, "words"), mark = "linear-gradient(transparent 58%, " + (el.getAttribute("data-sds-color") || "rgba(255, 214, 10, 0.6)") + " 58%)";
      s.nodes.forEach(function (n) { n.style.background = mark + " no-repeat 0 0 / 0% 100%"; });
      var tl = onEnter(el, function () {
        return gsap.timeline().to(s.nodes, { backgroundSize: "100% 100%", duration: num(el, "duration", 0.6), ease: "power2.out", stagger: num(el, "stagger", 0.12), delay: num(el, "delay", 0) });
      });
      return function () { tl.kill(); s.restore(); };
    },
    "sds-x-text-glitch": function (el) {
      var tw = gsap.to(el, { keyframes: [
        { x: -4, skewX: 8, textShadow: "-3px 0 #ff2d6f, 3px 0 #22d3ee", duration: 0.05 },
        { x: 5, skewX: -6, textShadow: "3px 0 #ff2d6f, -3px 0 #22d3ee", duration: 0.05 },
        { x: -2, skewX: 3, textShadow: "-2px 0 #ff2d6f, 2px 0 #22d3ee", duration: 0.04 },
        { x: 0, skewX: 0, textShadow: "0 0 transparent", duration: 0.05 }
      ], repeat: -1, repeatDelay: num(el, "gap", 1.4) });
      return function () { tw.kill(); gsap.set(el, { clearProps: "all" }); };
    },
    "sds-x-text-skew": function (el) {
      if (demo(el)) { var t0 = gsap.fromTo(el, { skewY: -8 }, { skewY: 8, duration: 0.9, ease: "sine.inOut", yoyo: true, repeat: -1 }); return function () { t0.kill(); gsap.set(el, { clearProps: "transform" }); }; }
      var set = gsap.quickTo(el, "skewY", { duration: 0.4, ease: "power3" }), lim = num(el, "skew", 10);
      var st = ST.create({ start: 0, end: "max", onUpdate: function (self) { set(gsap.utils.clamp(-lim, lim, self.getVelocity() / -300)); } });
      return function () { st.kill(); gsap.set(el, { clearProps: "transform" }); };
    },
    "sds-x-text-circle": function (el) {
      var t = el.textContent, r = num(el, "radius", 56), n = t.length, wrap = document.createElement("span"), orig = el.innerHTML;
      el.setAttribute("aria-label", t);
      wrap.setAttribute("aria-hidden", "true");
      wrap.style.cssText = "position:relative;display:block;width:" + r * 2 + "px;height:" + r * 2 + "px;margin:0 auto";
      t.split("").forEach(function (c, i) {
        var s = document.createElement("span"); s.textContent = c === " " ? " " : c;
        s.style.cssText = "position:absolute;left:50%;top:0;height:" + r + "px;transform-origin:0 " + r + "px";
        gsap.set(s, { rotation: (i / n) * 360, x: "-50%" }); wrap.appendChild(s);
      });
      el.textContent = ""; el.appendChild(wrap);
      var tw = gsap.to(wrap, { rotation: 360, duration: num(el, "duration", 12), ease: "none", repeat: -1 });
      return function () { tw.kill(); el.innerHTML = orig; el.removeAttribute("aria-label"); };
    },

    /* ================================ cards ================================ */
    "sds-x-card-tilt": function (el) {
      var max = num(el, "tilt", 12);
      gsap.set(el, { transformPerspective: 800, transformOrigin: "50% 50%" });
      var rx = gsap.quickTo(el, "rotationX", { duration: 0.5, ease: "power3" }), ry = gsap.quickTo(el, "rotationY", { duration: 0.5, ease: "power3" }), sc = gsap.quickTo(el, "scale", { duration: 0.4, ease: "power3" });
      function move(e) { var r = el.getBoundingClientRect(); ry(((e.clientX - r.left) / r.width - 0.5) * 2 * max); rx((0.5 - (e.clientY - r.top) / r.height) * 2 * max); sc(1.03); }
      function leave() { gsap.to(el, { rotationX: 0, rotationY: 0, scale: 1, duration: 0.9, ease: "elastic.out(1,0.5)", overwrite: "auto" }); }
      el.addEventListener("pointermove", move); el.addEventListener("pointerleave", leave);
      return function () { el.removeEventListener("pointermove", move); el.removeEventListener("pointerleave", leave); gsap.set(el, { clearProps: "transform" }); };
    },
    "sds-x-card-magnetic": function (el) {
      var pull = num(el, "pull", 0.35);
      var qx = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3" }), qy = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3" });
      function move(e) { var r = el.getBoundingClientRect(); qx((e.clientX - (r.left + r.width / 2)) * pull); qy((e.clientY - (r.top + r.height / 2)) * pull); }
      function leave() { gsap.to(el, { x: 0, y: 0, duration: 0.9, ease: "elastic.out(1,0.4)", overwrite: "auto" }); }
      el.addEventListener("pointermove", move); el.addEventListener("pointerleave", leave);
      return function () { el.removeEventListener("pointermove", move); el.removeEventListener("pointerleave", leave); gsap.set(el, { clearProps: "transform" }); };
    },
    "sds-x-card-spotlight": function (el) {
      el.style.setProperty("--sds-x", "50%"); el.style.setProperty("--sds-y", "50%");
      function move(e) { var r = el.getBoundingClientRect(); gsap.to(el, { "--sds-x": e.clientX - r.left + "px", "--sds-y": e.clientY - r.top + "px", "--sds-o": 1, duration: 0.35, ease: "power2.out", overwrite: "auto" }); }
      function leave() { gsap.to(el, { "--sds-o": 0, duration: 0.6, ease: "power2.out", overwrite: "auto" }); }
      el.addEventListener("pointermove", move); el.addEventListener("pointerleave", leave);
      return function () { el.removeEventListener("pointermove", move); el.removeEventListener("pointerleave", leave); ["--sds-x", "--sds-y", "--sds-o"].forEach(function (p) { el.style.removeProperty(p); }); };
    },
    "sds-x-card-fan": function (el) {
      var c = kids(el), n = c.length, spread = num(el, "spread", 14);
      gsap.set(c, { transformOrigin: "50% 120%" });
      var tl = onEnter(el, function () {
        return gsap.timeline().from(c, { y: 24, opacity: 0, duration: 0.01 })
          .to(c, { rotation: function (i) { return (i - (n - 1) / 2) * spread; }, x: function (i) { return (i - (n - 1) / 2) * 18; }, y: function (i) { return Math.abs(i - (n - 1) / 2) * 6; }, opacity: 1, duration: num(el, "duration", 0.9), ease: str(el, "ease", "back.out(1.5)"), stagger: 0.08, delay: num(el, "delay", 0) });
      });
      return function () { tl.kill(); gsap.set(c, { clearProps: "all" }); };
    },
    "sds-x-card-depth": function (el) {
      var layers = [].slice.call(el.querySelectorAll("[data-depth]")); if (!layers.length) layers = kids(el);
      var amt = num(el, "depth", 24), setters = layers.map(function (l, i) { var d = parseFloat(l.getAttribute("data-depth")) || (i + 1) / layers.length; return { x: gsap.quickTo(l, "x", { duration: 0.6, ease: "power3" }), y: gsap.quickTo(l, "y", { duration: 0.6, ease: "power3" }), d: d }; });
      function move(e) { var r = el.getBoundingClientRect(), px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5; setters.forEach(function (s) { s.x(px * amt * s.d * 2); s.y(py * amt * s.d * 2); }); }
      function leave() { setters.forEach(function (s) { s.x(0); s.y(0); }); }
      el.addEventListener("pointermove", move); el.addEventListener("pointerleave", leave);
      return function () { el.removeEventListener("pointermove", move); el.removeEventListener("pointerleave", leave); gsap.set(layers, { clearProps: "transform" }); };
    },
    "sds-x-card-deck": function (el) {
      var c = kids(el); if (c.length < 2) return;
      el.style.position = "relative"; el.tabIndex = 0; el.setAttribute("role", "button"); el.setAttribute("aria-label", "Next card");
      c.forEach(function (k) { k.style.position = "absolute"; k.style.left = "0"; k.style.right = "0"; k.style.margin = "auto"; });
      var busy = false;
      function place(animate) { c.forEach(function (k, i) { gsap[animate ? "to" : "set"](k, { y: i * 9, scale: 1 - i * 0.06, zIndex: c.length - i, opacity: 1 - i * 0.18, duration: 0.5, ease: "power3.out" }); }); }
      function next() { if (busy) return; busy = true; var top = c.shift(); gsap.to(top, { x: 150, rotation: 14, opacity: 0, duration: 0.32, ease: "power2.in", onComplete: function () { c.push(top); gsap.set(top, { x: 0, rotation: 0 }); place(true); busy = false; } }); }
      function key(e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); next(); } }
      place(false); el.addEventListener("click", next); el.addEventListener("keydown", key);
      var auto = demo(el) ? setInterval(next, 1700) : 0;
      return function () { clearInterval(auto); el.removeEventListener("click", next); el.removeEventListener("keydown", key); gsap.killTweensOf(c); gsap.set(c, { clearProps: "all" }); el.removeAttribute("role"); el.removeAttribute("aria-label"); };
    },
    "sds-x-card-carousel": function (el) {
      var c = kids(el), n = c.length; if (n < 3) return;
      var w = c[0].offsetWidth || 90, h = c[0].offsetHeight || 60, r = Math.round(w / 2 / Math.tan(Math.PI / n)) + 14, saved = el.getAttribute("style");
      el.style.position = "relative"; el.style.width = w + "px"; el.style.height = h + "px"; el.style.margin = "0 auto"; el.style.transformStyle = "preserve-3d";
      gsap.set(c, { position: "absolute", left: 0, top: 0, width: w, height: h, rotationY: function (i) { return (i * 360) / n; }, transformOrigin: "50% 50% " + -r + "px", backfaceVisibility: "hidden" });
      gsap.set(el, { transformPerspective: 900, transformOrigin: "50% 50% " + -r + "px" });
      var tw = gsap.to(el, { rotationY: -360, duration: num(el, "duration", 14), ease: "none", repeat: -1 }), host = el.parentNode || el;
      function move(e) { var b = host.getBoundingClientRect(); gsap.to(tw, { timeScale: 1 + ((e.clientX - b.left) / b.width - 0.5) * 4, duration: 0.4, overwrite: true }); }
      function leave() { gsap.to(tw, { timeScale: 1, duration: 0.6, overwrite: true }); }
      host.addEventListener("pointermove", move); host.addEventListener("pointerleave", leave);
      return function () { tw.kill(); host.removeEventListener("pointermove", move); host.removeEventListener("pointerleave", leave); gsap.set(c, { clearProps: "all" }); gsap.set(el, { clearProps: "all" }); if (saved) el.setAttribute("style", saved); else el.removeAttribute("style"); };
    },
    "sds-x-card-shuffle": function (el) {
      var c = kids(el); if (c.length < 2) return;
      el.tabIndex = 0; el.setAttribute("role", "button"); el.setAttribute("aria-label", "Shuffle");
      function shuffle() {
        var first = c.map(function (k) { return k.getBoundingClientRect(); });
        var order = gsap.utils.shuffle(c.slice()); order.forEach(function (k) { el.appendChild(k); });
        c.forEach(function (k) { var i = c.indexOf(k), a = first[i], b = k.getBoundingClientRect(); gsap.fromTo(k, { x: a.left - b.left, y: a.top - b.top }, { x: 0, y: 0, duration: 0.7, ease: "power3.inOut" }); });
      }
      function key(e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); shuffle(); } }
      el.addEventListener("click", shuffle); el.addEventListener("keydown", key);
      var auto = demo(el) ? setInterval(function () { c.forEach(function (k) { gsap.killTweensOf(k); }); shuffle(); }, 2000) : 0;
      return function () { clearInterval(auto); el.removeEventListener("click", shuffle); el.removeEventListener("keydown", key); gsap.set(c, { clearProps: "all" }); el.removeAttribute("role"); el.removeAttribute("aria-label"); };
    },
    "sds-x-card-dim": function (el) {
      var c = kids(el);
      function over(e) { var t = e.target; while (t && t.parentNode !== el) t = t.parentNode; if (!t) return; c.forEach(function (k) { gsap.to(k, k === t ? { scale: 1.08, opacity: 1, filter: "blur(0px)", duration: 0.35, ease: "power3.out", overwrite: "auto" } : { scale: 0.95, opacity: 0.45, filter: "blur(2px)", duration: 0.35, ease: "power3.out", overwrite: "auto" }); }); }
      function out() { gsap.to(c, { scale: 1, opacity: 1, filter: "blur(0px)", duration: 0.45, ease: "power3.out", overwrite: "auto" }); }
      el.addEventListener("pointerover", over); el.addEventListener("pointerleave", out);
      return function () { el.removeEventListener("pointerover", over); el.removeEventListener("pointerleave", out); gsap.set(c, { clearProps: "all" }); };
    },

    /* ================================ loaders ================================ */
    "sds-x-loader-orbit": function (el) {
      var n = num(el, "dots", 3), ring = make(el, n, "position:absolute;inset:0"), i;
      ring.forEach(function (w) { var d = document.createElement("i"); d.style.cssText = "position:absolute;left:50%;top:0;width:0.6em;height:0.6em;margin-left:-0.3em;border-radius:50%;background:currentColor;display:block"; w.appendChild(d); });
      var tw = gsap.to(ring, { rotation: 360, duration: num(el, "duration", 1.6), ease: "power2.inOut", repeat: -1, stagger: { each: 0.14, repeat: -1 } });
      return function () { tw.kill(); rm(ring); };
    },
    "sds-x-loader-chase": function (el) {
      var d = make(el, 3, DOT + "width:0.7em;height:0.7em;margin:-0.35em 0 0 -0.35em");
      gsap.set(d, { x: function (i) { return (i - 1) * 17; } });
      var tw = gsap.to(d, { y: -14, duration: 0.45, ease: "power2.out", yoyo: true, repeat: -1, stagger: 0.12, repeatDelay: 0.1 });
      return function () { tw.kill(); rm(d); };
    },
    "sds-x-loader-equalizer": function (el) {
      var bars = make(el, 5, function (i) { return "position:absolute;bottom:0;left:" + (i * 20 + 6) + "%;width:12%;height:100%;border-radius:2px;background:currentColor;transform-origin:50% 100%"; });
      var tweens = bars.map(function (b, k) { return gsap.fromTo(b, { scaleY: 0.2 }, { scaleY: 1, duration: gsap.utils.random(0.35, 0.7), ease: "sine.inOut", yoyo: true, repeat: -1, delay: k * 0.07, onRepeat: function () { this.duration(gsap.utils.random(0.3, 0.8)); } }); });
      return function () { tweens.forEach(function (t) { t.kill(); }); rm(bars); };
    },
    "sds-x-loader-elastic": function (el) {
      var r = make(el, 1, "position:absolute;inset:0;border:0.18em solid currentColor;border-right-color:transparent;border-radius:50%");
      var tl = gsap.timeline({ repeat: -1 }).to(r, { rotation: "+=360", duration: 0.9, ease: "elastic.out(1,0.6)" }).to(r, { scale: 0.82, duration: 0.25, yoyo: true, repeat: 1, ease: "sine.inOut" }, 0);
      return function () { tl.kill(); rm(r); };
    },
    "sds-x-loader-blob": function (el) {
      var b = make(el, 1, "position:absolute;inset:12%;border-radius:50%;background:currentColor");
      var tl = gsap.timeline({ repeat: -1, yoyo: true }).to(b, { scaleX: 1.25, scaleY: 0.8, rotation: 20, duration: 0.7, ease: "sine.inOut" }).to(b, { scaleX: 0.85, scaleY: 1.2, rotation: -20, duration: 0.7, ease: "sine.inOut" });
      return function () { tl.kill(); rm(b); };
    },
    "sds-x-loader-pendulum": function (el) {
      var w = make(el, 5, function (i) { return "position:absolute;top:0;left:" + i * 20 + "%;width:20%;height:100%;transform-origin:50% 0"; });
      w.forEach(function (p) { var b = document.createElement("i"); b.style.cssText = "position:absolute;left:50%;bottom:0;width:100%;aspect-ratio:1;margin-left:-50%;border-radius:50%;background:currentColor;display:block"; p.appendChild(b); });
      var a = w[0], z = w[4], T = 0.42;
      var tl = gsap.timeline({ repeat: -1 })
        .fromTo(a, { rotation: 38 }, { rotation: 0, duration: T, ease: "power2.in" })
        .to(z, { rotation: -38, duration: T, ease: "power2.out" }).to(z, { rotation: 0, duration: T, ease: "power2.in" })
        .to(a, { rotation: 38, duration: T, ease: "power2.out" });
      return function () { tl.kill(); rm(w); };
    },
    "sds-x-loader-dash": function (el) {
      var ns = "http://www.w3.org/2000/svg", svg = document.createElementNS(ns, "svg"), c = document.createElementNS(ns, "circle");
      svg.setAttribute("viewBox", "0 0 50 50"); svg.style.cssText = "position:absolute;inset:0;width:100%;height:100%;display:block";
      ["cx:25", "cy:25", "r:20", "fill:none", "stroke:currentColor", "stroke-width:4", "stroke-linecap:round"].forEach(function (a) { var p = a.split(":"); c.setAttribute(p[0], p[1]); });
      svg.appendChild(c); el.appendChild(svg);
      var spin = gsap.to(svg, { rotation: 360, duration: 1.8, ease: "none", repeat: -1 });
      var dash = gsap.fromTo(c, { strokeDasharray: "2 125", strokeDashoffset: 0 }, { strokeDasharray: "90 125", strokeDashoffset: -35, duration: 1.1, ease: "power2.inOut", repeat: -1, yoyo: true });
      return function () { spin.kill(); dash.kill(); svg.remove(); };
    },
    "sds-x-loader-clock": function (el) {
      var f = make(el, 3, function (i) { return i === 0 ? "position:absolute;inset:0;border:0.16em solid currentColor;border-radius:50%" : "position:absolute;left:50%;top:50%;width:0.16em;height:" + (i === 1 ? "36%" : "26%") + ";margin-left:-0.08em;border-radius:2px;background:currentColor;transform-origin:50% 0"; });
      gsap.set(f[1], { rotation: 180 }); gsap.set(f[2], { rotation: 180 });
      var a = gsap.to(f[1], { rotation: 540, duration: 1.6, ease: "none", repeat: -1 }), b = gsap.to(f[2], { rotation: 540, duration: 19.2, ease: "none", repeat: -1 });
      return function () { a.kill(); b.kill(); rm(f); };
    },
    "sds-x-loader-steps": function (el) {
      var parts = make(el, 2, function (i) { return i === 0 ? "position:absolute;left:0;right:0;top:35%;height:30%;border-radius:99px;background:currentColor;opacity:0.2" : "position:absolute;left:0;right:0;top:35%;height:30%;border-radius:99px;background:currentColor;transform-origin:0 50%;transform:scaleX(0)"; });
      var fill = parts[1], tl = gsap.timeline({ repeat: -1 });
      [0.22, 0.48, 0.71, 1].forEach(function (v) { tl.to(fill, { scaleX: v, duration: 0.45, ease: "power3.out" }).to({}, { duration: 0.18 }); });
      tl.to({}, { duration: 0.4 }).set(fill, { scaleX: 0 });
      return function () { tl.kill(); rm(parts); };
    },
    "sds-x-loader-bounce": function (el) {
      var p = make(el, 2, function (i) { return i === 0 ? "position:absolute;left:25%;bottom:0;width:50%;height:12%;border-radius:50%;background:currentColor;opacity:0.25" : "position:absolute;left:30%;bottom:12%;width:40%;height:40%;border-radius:50%;background:currentColor;transform-origin:50% 100%"; });
      var sh = p[0], ball = p[1];
      var tl = gsap.timeline({ repeat: -1 })
        .to(ball, { y: "-170%", duration: 0.42, ease: "power2.out" }).to(sh, { scaleX: 0.5, opacity: 0.1, duration: 0.42, ease: "power2.out" }, 0)
        .to(ball, { y: 0, duration: 0.42, ease: "power2.in" }).to(sh, { scaleX: 1, opacity: 0.25, duration: 0.42, ease: "power2.in" }, 0.42)
        .to(ball, { scaleY: 0.6, scaleX: 1.25, duration: 0.08 }).to(ball, { scaleY: 1, scaleX: 1, duration: 0.2, ease: "back.out(2)" });
      return function () { tl.kill(); rm(p); };
    },
    "sds-x-loader-radar": function (el) {
      var p = make(el, 5, function (i) {
        if (i === 0) return "position:absolute;inset:0;border:0.12em solid currentColor;border-radius:50%;opacity:0.35";
        if (i === 1) return "position:absolute;inset:0;border-radius:50%;background:conic-gradient(from 0deg, transparent 72%, currentColor);opacity:0.55";
        return "position:absolute;width:0.34em;height:0.34em;border-radius:50%;background:currentColor;opacity:0;left:" + [62, 28, 70][i - 2] + "%;top:" + [28, 55, 66][i - 2] + "%";
      });
      var sweep = gsap.to(p[1], { rotation: 360, duration: 2, ease: "none", repeat: -1 });
      var blips = [2, 3, 4].map(function (k, j) { return gsap.fromTo(p[k], { opacity: 0, scale: 0.4 }, { opacity: 1, scale: 1, duration: 0.25, repeat: -1, repeatDelay: 1.75, yoyo: false, delay: (j * 2) / 3 + 0.2 }); });
      return function () { sweep.kill(); blips.forEach(function (b) { b.kill(); }); rm(p); };
    },

    /* ================================ scroll ================================ */
    "sds-x-scroll-pin": function (el) {
      if (demo(el)) { var t0 = gsap.fromTo(el, { scale: 1 }, { scale: 0.94, duration: 1, yoyo: true, repeat: -1, ease: "sine.inOut" }); return function () { t0.kill(); gsap.set(el, { clearProps: "transform" }); }; }
      var len = str(el, "length", "+=100%");
      var st = ST.create({ trigger: el, start: str(el, "start", "top top"), end: /^[+\-]/.test(len) ? len : "+=" + len, pin: true, pinSpacing: true, anticipatePin: 1 });
      return function () { st.kill(); };
    },
    "sds-x-scroll-parallax": function (el) {
      var s = num(el, "speed", 0.3) * 50;
      var tw = link(el, { yPercent: s }, { start: "top bottom", end: "bottom top" }, { yPercent: -s });
      return function () { tw.kill(); gsap.set(el, { clearProps: "transform" }); };
    },
    "sds-x-scroll-horizontal": function (el) {
      var track = el.firstElementChild; if (!track) return;
      el.style.overflow = "hidden";
      var dist = function () { return Math.max(0, track.scrollWidth - el.clientWidth); };
      var tw;
      if (demo(el)) tw = gsap.fromTo(track, { x: 0 }, { x: function () { return -dist(); }, duration: 2.2, ease: "sine.inOut", yoyo: true, repeat: -1 });
      else tw = gsap.to(track, { x: function () { return -dist(); }, ease: "none", scrollTrigger: { trigger: el, pin: true, scrub: 1, start: "top top", end: function () { return "+=" + dist(); }, invalidateOnRefresh: true } });
      return function () { tw.kill(); gsap.set(track, { clearProps: "transform" }); el.style.overflow = ""; };
    },
    "sds-x-scroll-stagger": function (el) {
      var c = kids(el), made = [];
      if (demo(el)) { var tl = gsap.timeline({ repeat: -1, repeatDelay: 0.8 }).from(c, { y: 36, opacity: 0, duration: 0.7, ease: "power3.out", stagger: 0.12 }); return function () { tl.kill(); gsap.set(c, { clearProps: "all" }); }; }
      gsap.set(c, { y: num(el, "distance", 40), opacity: 0 });
      made = ST.batch(c, { start: "top 88%", once: true, onEnter: function (b) { gsap.to(b, { y: 0, opacity: 1, duration: num(el, "duration", 0.8), ease: str(el, "ease", "power3.out"), stagger: num(el, "stagger", 0.1), overwrite: true }); } });
      return function () { made.forEach(function (m) { m.kill(); }); gsap.set(c, { clearProps: "all" }); };
    },
    "sds-x-scroll-zoom": function (el) {
      var tw = link(el, { scale: 1 }, { start: "top 90%", end: "top 25%" }, { scale: 0.7 });
      return function () { tw.kill(); gsap.set(el, { clearProps: "transform" }); };
    },
    "sds-x-scroll-progress": function (el) {
      gsap.set(el, { transformOrigin: "0 50%", scaleX: 0 });
      var tw = demo(el)
        ? gsap.to(el, { scaleX: 1, duration: 1.8, ease: "power1.inOut", yoyo: true, repeat: -1 })
        : gsap.to(el, { scaleX: 1, ease: "none", scrollTrigger: { trigger: document.documentElement, start: "top top", end: "max", scrub: 0.2 } });
      return function () { tw.kill(); gsap.set(el, { clearProps: "transform" }); };
    },
    "sds-x-scroll-stack": function (el) {
      var c = kids(el); if (c.length < 2) return;
      if (demo(el)) { var tl = gsap.timeline({ repeat: -1, repeatDelay: 0.6 }).from(c, { y: 60, scale: 0.9, opacity: 0, duration: 0.6, ease: "power3.out", stagger: 0.25 }); return function () { tl.kill(); gsap.set(c, { clearProps: "all" }); }; }
      var made = [];
      c.forEach(function (k, i) {
        if (i === c.length - 1) return;
        made.push(ST.create({ trigger: k, start: "top " + (10 + i * 2) + "%", endTrigger: el, end: "bottom 85%", pin: true, pinSpacing: false }));
        made.push(gsap.to(k, { scale: 0.92, ease: "none", scrollTrigger: { trigger: c[i + 1], start: "top bottom", end: "top " + (10 + i * 2) + "%", scrub: true } }));
      });
      return function () { made.forEach(function (m) { m.kill(); }); gsap.set(c, { clearProps: "transform" }); };
    },
    "sds-x-scroll-curtain": function (el) {
      var tw = link(el, { clipPath: "inset(0% 0% 0% 0%)" }, { start: "top 85%", end: "top 25%" }, { clipPath: "inset(0% 50% 0% 50%)" });
      return function () { tw.kill(); gsap.set(el, { clearProps: "clipPath" }); };
    },
    "sds-x-scroll-rotate": function (el) {
      var tw = link(el, { rotation: num(el, "turns", 1) * 360 }, { start: "top bottom", end: "bottom top" }, { rotation: 0 });
      return function () { tw.kill(); gsap.set(el, { clearProps: "transform" }); };
    },
    "sds-x-scroll-color": function (el) {
      var from = [str(el, "from", "#ffffff"), str(el, "text-from", "#14162a")], to = [str(el, "to", "#14162a"), str(el, "text-to", "#ffffff")];
      var tw = link(el, { backgroundColor: to[0], color: to[1] }, { start: "top 80%", end: "top 20%" }, { backgroundColor: from[0], color: from[1] });
      return function () { tw.kill(); gsap.set(el, { clearProps: "backgroundColor,color" }); };
    },
    "sds-x-scroll-snap": function (el) {
      var c = kids(el); if (c.length < 2) return;
      if (demo(el)) { var t = gsap.fromTo(c, { y: 0 }, { y: -6, duration: 0.5, ease: "sine.inOut", yoyo: true, repeat: -1, stagger: 0.12 }); return function () { t.kill(); gsap.set(c, { clearProps: "transform" }); }; }
      var st = ST.create({ trigger: el, start: "top top", end: "bottom bottom", snap: { snapTo: 1 / (c.length - 1), duration: { min: 0.2, max: 0.6 }, ease: "power1.inOut" } });
      return function () { st.kill(); };
    },
    "sds-x-scroll-slides": function (el) {
      var c = kids(el); if (c.length < 2) return;
      var tl;
      el.style.position = "relative";
      c.forEach(function (k, i) { k.style.position = "absolute"; k.style.inset = "0"; k.style.display = "grid"; k.style.placeItems = "center"; if (i) gsap.set(k, { opacity: 0, yPercent: 8 }); });
      if (demo(el)) tl = gsap.timeline({ repeat: -1 });
      else tl = gsap.timeline({ scrollTrigger: { trigger: el, pin: true, scrub: true, start: "top top", end: "+=" + c.length * 70 + "%" } });
      c.forEach(function (k, i) { if (i) tl.to(c[i - 1], { opacity: 0, yPercent: -8, duration: 0.5 }, "+=" + (demo(el) ? 0.6 : 0.3)).to(k, { opacity: 1, yPercent: 0, duration: 0.5 }, "<"); });
      if (demo(el)) tl.to(c[c.length - 1], { opacity: 0, duration: 0.4 }, "+=0.6").set(c[0], { opacity: 1, yPercent: 0 });
      return function () { tl.kill(); gsap.set(c, { clearProps: "all" }); el.style.position = ""; };
    }
  };

  function nameOf(el) { var c = el.classList; for (var i = 0; i < c.length; i++) if (FX[c[i]]) return c[i]; return null; }

  function run(el) {
    if (live.has(el)) return;
    var n = nameOf(el); if (!n) return;
    live.set(el, 1);
    var cleanup;
    try { cleanup = FX[n](el); } catch (e) { if (window.console) console.warn("sds-x: " + n + " failed", e); }
    live.set(el, cleanup || 1);
  }
  function kill(el) { var c = live.get(el); if (typeof c === "function") try { c(); } catch (e) {} live.delete(el); }

  function init(root) {
    root = root || document;
    var list = [].slice.call(root.querySelectorAll('[class*="sds-x-"]'));
    if (root.nodeType === 1 && /sds-x-/.test(root.className || "")) list.unshift(root);
    list = list.filter(function (e) { return nameOf(e) && !live.has(e); });
    if (!list.length || reduce) return Promise.resolve();
    return ready().then(function () { list.forEach(run); if (ST) ST.refresh(); }).catch(function (e) { if (window.console) console.warn(e.message); });
  }

  window.sdsX = { init: init, kill: kill, effects: Object.keys(FX), version: V };
  var go = function () {
    init();
    if ("MutationObserver" in window && !reduce) new MutationObserver(function (ms) {
      ms.forEach(function (m) { [].slice.call(m.addedNodes).forEach(function (n) { if (n.nodeType === 1) init(n); }); });
    }).observe(document.documentElement, { childList: true, subtree: true });
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", go); else go();
})();

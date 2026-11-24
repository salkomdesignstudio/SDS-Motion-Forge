/* SDS Motion Forge — generated pages: replay, copy, live search, code tabs. No dependencies. */
(function () {
  "use strict";
  document.documentElement.classList.add("js");
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function restart(root) {
    if (!root) return;
    root.classList.add("sds-restart");
    void root.offsetWidth;
    root.classList.remove("sds-restart");
  }
  function flash(btn, label, ms) {
    var old = btn.getAttribute("data-label") || btn.textContent;
    btn.setAttribute("data-label", old);
    btn.textContent = label;
    btn.classList.add("copied");
    setTimeout(function () {
      btn.textContent = old;
      btn.classList.remove("copied");
    }, ms || 1300);
  }
  function copy(text, btn, label) {
    var done = function () { flash(btn, label || "Copied"); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, function () { flash(btn, "Press Ctrl+C", 1800); });
    else flash(btn, "Press Ctrl+C", 1800);
  }

  /* replay buttons: restart the stage they belong to */
  document.addEventListener("click", function (e) {
    var r = e.target.closest("[data-replay]");
    if (r) {
      var scope = r.closest("[data-fx]") || document;
      restart(scope.querySelector(".fx-stage"));
      return;
    }
    var c = e.target.closest("[data-copy]");
    if (c) {
      e.stopPropagation();
      copy(c.getAttribute("data-copy"), c, c.classList.contains("fx-cls") ? "Copied" : "Copied");
      return;
    }
    var cp = e.target.closest("[data-copy-from]");
    if (cp) {
      var src = document.getElementById(cp.getAttribute("data-copy-from"));
      if (src) copy(src.textContent, cp, "Copied");
    }
  });

  /* hover restarts a card's animation */
  if (!reduce) {
    document.querySelectorAll(".fx-card").forEach(function (card) {
      card.addEventListener("pointerenter", function () { restart(card.querySelector(".fx-stage")); });
    });
  }

  /* UI inputs answer focus: focus the field while its card is hovered, release it when the pointer leaves */
  document.querySelectorAll(".fx-card, .cat-tile").forEach(function (card) {
    var field = card.querySelector('[class*="sds-input-ui-"] > input');
    if (!field) return;
    card.addEventListener("pointerenter", function () {
      var a = document.activeElement;
      if (!a || a === document.body || a === field || card.contains(a)) field.focus({ preventScroll: true });
    });
    card.addEventListener("pointerleave", function () { if (document.activeElement === field) field.blur(); });
  });

  /* code tabs (all panels are visible without JavaScript) */
  document.querySelectorAll("[data-tabs]").forEach(function (box) {
    var tabs = [].slice.call(box.querySelectorAll('[role="tab"]'));
    var panels = [].slice.call(box.querySelectorAll(".code-panel"));
    function show(i) {
      tabs.forEach(function (t, n) { t.setAttribute("aria-selected", n === i ? "true" : "false"); t.tabIndex = n === i ? 0 : -1; });
      panels.forEach(function (p, n) { p.hidden = n !== i; });
    }
    tabs.forEach(function (t, i) {
      t.addEventListener("click", function () { show(i); });
      t.addEventListener("keydown", function (e) {
        if (e.key === "ArrowRight") { show((i + 1) % tabs.length); tabs[(i + 1) % tabs.length].focus(); }
        if (e.key === "ArrowLeft") { show((i + tabs.length - 1) % tabs.length); tabs[(i + tabs.length - 1) % tabs.length].focus(); }
      });
    });
    show(0);
  });

  /* category page: filter the cards */
  var q = document.getElementById("fxSearch");
  var grid = document.getElementById("fxGrid");
  if (q && grid) {
    var cards = [].slice.call(grid.querySelectorAll(".fx-card"));
    var count = document.getElementById("fxCount");
    var empty = document.getElementById("fxEmpty");
    var total = cards.length;
    var apply = function () {
      var term = q.value.toLowerCase().trim();
      var n = 0;
      cards.forEach(function (c) {
        var hit = !term || c.getAttribute("data-s").indexOf(term) > -1;
        c.classList.toggle("is-hidden", !hit);
        if (hit) n++;
      });
      if (count) count.textContent = term ? n + " of " + total + " match “" + term + "”" : total + " animations";
      if (empty) empty.hidden = n !== 0;
    };
    q.addEventListener("input", apply);
    document.addEventListener("keydown", function (e) {
      if (e.key !== "/" || e.metaKey || e.ctrlKey || e.altKey) return;
      var t = e.target;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      e.preventDefault();
      q.focus();
    });
    apply();
  }

  /* index page: search all effects */
  var iq = document.getElementById("allSearch");
  var out = document.getElementById("allResults");
  if (iq && out) {
    var data = null;
    var load = function () {
      if (data) return Promise.resolve(data);
      return fetch("/assets/search-index.json").then(function (r) { return r.json(); }).then(function (j) { data = j; return j; });
    };
    var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
    var run = function () {
      var term = iq.value.toLowerCase().trim();
      if (!term) { out.classList.remove("on"); out.innerHTML = ""; return; }
      load().then(function (list) {
        var hits = list.filter(function (x) { return (x.n + " " + x.c + " " + x.k + " " + x.d).toLowerCase().indexOf(term) > -1; }).slice(0, 30);
        out.classList.add("on");
        out.innerHTML = hits.length
          ? hits.map(function (x) { return '<li><a href="' + x.u + '"><span><strong>' + esc(x.n) + '</strong> <code>.' + esc(x.c) + "</code></span><small>" + esc(x.k) + "</small></a></li>"; }).join("")
          : '<li><a href="#"><span>No animation matches “' + esc(term) + "”</span></a></li>";
      });
    };
    iq.addEventListener("focus", load);
    iq.addEventListener("input", run);
    document.addEventListener("keydown", function (e) {
      if (e.key !== "/" || e.metaKey || e.ctrlKey || e.altKey) return;
      var t = e.target;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      e.preventDefault();
      iq.focus();
    });
  }
})();

/* One-shot effects finish quickly, so replay a card that is on screen once everything in it has stopped.
   Looping effects keep looping; a card under the pointer or with focus is left alone. */
(function () {
  "use strict";
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  var cards = [].slice.call(document.querySelectorAll(".fx-card, .cat-tile"));
  if (!cards.length) return;
  var visible = new Set();
  function restart(root) { root.classList.add("sds-restart"); void root.offsetWidth; root.classList.remove("sds-restart"); }
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        var stage = e.target.querySelector(".fx-stage");
        if (e.isIntersecting) { visible.add(e.target); if (stage) restart(stage); } else visible.delete(e.target);
      });
    }, { threshold: 0.35 });
    cards.forEach(function (c) { io.observe(c); });
  }
  setInterval(function () {
    if (document.hidden) return;
    visible.forEach(function (card) {
      var stage = card.querySelector(".fx-stage");
      if (!stage || card.matches(":hover, :focus-within")) return;
      var running = stage.getAnimations ? stage.getAnimations({ subtree: true }).some(function (a) { return a.playState === "running"; }) : true;
      if (!running) restart(stage);
    });
  }, 2600);
})();

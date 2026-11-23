/* SDS Motion Forge: small behaviours for the MCP pages. No dependencies.
   1) copy buttons with an icon (data-gcopy="<id of the code>") and copy-a-prompt rows (data-gcopy-text)
   2) "On this page" list that highlights the section in view
   3) the landing hero example replays its animation every few seconds */
(function () {
  "use strict";
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  function done(btn) { btn.classList.add("ok"); setTimeout(function () { btn.classList.remove("ok"); }, 1400); }
  function copy(text, btn) {
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(function () { done(btn); }, function () {});
  }
  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-gcopy]");
    if (b) { var src = document.getElementById(b.getAttribute("data-gcopy")); if (src) copy(src.textContent, b); return; }
    var p = e.target.closest("[data-gcopy-text]");
    if (p) copy(p.getAttribute("data-gcopy-text"), p);
  });

  var toc = document.querySelector(".g-toc");
  if (toc && "IntersectionObserver" in window) {
    var links = [].slice.call(toc.querySelectorAll("a"));
    var map = {};
    links.forEach(function (a) { map[a.getAttribute("href").slice(1)] = a; });
    var obs = new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        if (!en.isIntersecting) return;
        links.forEach(function (a) { a.removeAttribute("aria-current"); });
        var a = map[en.target.id];
        if (a) a.setAttribute("aria-current", "true");
      });
    }, { rootMargin: "-20% 0px -70% 0px" });
    Object.keys(map).forEach(function (id) { var h = document.getElementById(id); if (h) obs.observe(h); });
  }

  var demo = document.querySelector(".h-demo");
  if (demo && !reduce && "IntersectionObserver" in window) {
    var btn = demo.querySelector("[data-replay]"), seen = false, hov = false;
    demo.addEventListener("pointerenter", function () { hov = true; });
    demo.addEventListener("pointerleave", function () { hov = false; });
    new IntersectionObserver(function (es) { seen = es[0].isIntersecting; }, { threshold: 0.4 }).observe(demo);
    setInterval(function () { if (seen && !hov && btn) btn.click(); }, 5200);
  }
})();

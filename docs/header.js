/* SDS Motion Forge — site header behaviour: dropdowns, mobile menu, current page / section.
   Small and dependency-free. The header works as plain links without it (hover/focus open the menus in CSS). */
(function () {
  "use strict";
  var sh = document.querySelector("[data-sh]");
  if (!sh) return;
  var dds = [].slice.call(sh.querySelectorAll(".sh-dd"));
  var burger = sh.querySelector(".sh-burger");
  var cmenu = sh.querySelector(".sh-cmenu");
  var drawer = sh.querySelector(".sh-drawer");

  function closeMenus(except) {
    dds.forEach(function (d) {
      if (d === except) return;
      d.classList.remove("open");
      d.querySelector(".sh-btn").setAttribute("aria-expanded", "false");
    });
  }
  dds.forEach(function (d) {
    var b = d.querySelector(".sh-btn");
    b.addEventListener("click", function () {
      var open = !d.classList.contains("open");
      closeMenus(d);
      d.classList.toggle("open", open);
      b.setAttribute("aria-expanded", open ? "true" : "false");
    });
    d.addEventListener("mouseenter", function () { b.setAttribute("aria-expanded", "true"); });
    d.addEventListener("mouseleave", function () { if (!d.classList.contains("open")) b.setAttribute("aria-expanded", "false"); });
  });
  document.addEventListener("click", function (e) { if (!e.target.closest(".sh-dd")) closeMenus(); });

  function setDrawer(open) {
    if (!burger || !drawer) return;
    drawer.hidden = !open;
    burger.setAttribute("aria-expanded", open ? "true" : "false");
    burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    if (cmenu) { cmenu.setAttribute("aria-expanded", open ? "true" : "false"); cmenu.setAttribute("aria-label", open ? "Close menu" : "Open menu"); }
  }
  if (burger) burger.addEventListener("click", function () { setDrawer(drawer.hidden); });
  if (cmenu) cmenu.addEventListener("click", function () { setDrawer(drawer.hidden); });
  if (drawer) drawer.addEventListener("click", function (e) { if (e.target.closest("a")) setDrawer(false); });
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    closeMenus();
    if (drawer && !drawer.hidden) { setDrawer(false); if (burger) burger.focus(); }
  });
  window.addEventListener("resize", function () { if (window.innerWidth > 960) setDrawer(false); });

  var lastY = window.scrollY, still = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  function onScroll() {
    var y = window.scrollY, dy = y - lastY;
    sh.classList.toggle("is-scrolled", y > 8);
    /* collapse the pill when scrolling down past 180 px, bring it back on any scroll up (measured on motvin.com) */
    if (!still && window.innerWidth > 960 && dy !== 0) {
      var busy = !!sh.querySelector(".sh-dd.open") || (drawer && !drawer.hidden);
      if (dy < 0 || y <= 180) sh.classList.remove("is-collapsed");
      else if (dy > 1 && !busy) sh.classList.add("is-collapsed");
    }
    lastY = y;
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* Animations menu: hover or focus a category and the preview on the right follows */
  [].slice.call(sh.querySelectorAll(".sh-mega")).forEach(function (m) {
    var rows = [].slice.call(m.querySelectorAll(".sh-cat")), pv = [].slice.call(m.querySelectorAll(".sh-pv"));
    function show(id) { rows.forEach(function (r) { r.classList.toggle("is-on", r.getAttribute("data-p") === id); }); pv.forEach(function (p) { p.classList.toggle("is-on", p.getAttribute("data-p") === id); }); }
    rows.forEach(function (r) { var id = r.getAttribute("data-p"); r.addEventListener("mouseenter", function () { show(id); }); r.addEventListener("focus", function () { show(id); }); });
  });

  /* current page */
  var p = location.pathname.replace(/index\.html$/, "");
  function mark(sel, test) {
    [].slice.call(sh.querySelectorAll(sel)).forEach(function (a) {
      var h = a.getAttribute("href") || "";
      if (test(h.split("#")[0])) a.setAttribute("aria-current", "page");
    });
  }
  if (p.indexOf("/docs.html") === 0) {
    sh.querySelector("#shMenuDocs") && sh.querySelector("#shMenuDocs").previousElementSibling.setAttribute("aria-current", "page");
  } else if (p.indexOf("/builder.html") === 0) {
    mark(".sh-nav > a", function (h) { return h === "/builder.html"; });
  } else if (p.indexOf("/mcp/") === 0) {
    var r = sh.querySelector("#shMenuRes");
    if (r) r.previousElementSibling.setAttribute("aria-current", "page");
    mark("#shMenuRes a", function (h) { return h === p || (h === "/mcp/" && p === "/mcp/"); });
  } else if (p.indexOf("/animations/") === 0 || p.indexOf("/categories/") === 0) {
    var b = sh.querySelector("#shMenuAnim");
    if (b) b.previousElementSibling.setAttribute("aria-current", "page");
    mark("#shMenuAnim a", function (h) { return h === p || (h === "/animations/" && p.indexOf("/animations/") === 0); });
  }

  /* home page: highlight the section in view */
  if ((p === "/" || p === "") && "IntersectionObserver" in window) {
    var links = {};
    [].slice.call(sh.querySelectorAll(".sh-nav a[data-sh-id]")).forEach(function (a) { links[a.getAttribute("data-sh-id")] = a; });
    var spy = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting || !links[e.target.id]) return;
        Object.keys(links).forEach(function (k) {
          if (k === e.target.id) links[k].setAttribute("aria-current", "location");
          else links[k].removeAttribute("aria-current");
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    Object.keys(links).forEach(function (id) { var el = document.getElementById(id); if (el) spy.observe(el); });
  }
})();

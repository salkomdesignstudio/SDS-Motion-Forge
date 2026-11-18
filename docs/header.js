/* SDS Motion Forge — site header behaviour: dropdowns, mobile menu, current page / section.
   Small and dependency-free. The header works as plain links without it (hover/focus open the menus in CSS). */
(function () {
  "use strict";
  var sh = document.querySelector("[data-sh]");
  if (!sh) return;
  var dds = [].slice.call(sh.querySelectorAll(".sh-dd"));
  var burger = sh.querySelector(".sh-burger");
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
  }
  if (burger) burger.addEventListener("click", function () { setDrawer(drawer.hidden); });
  if (drawer) drawer.addEventListener("click", function (e) { if (e.target.closest("a")) setDrawer(false); });
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    closeMenus();
    if (drawer && !drawer.hidden) { setDrawer(false); if (burger) burger.focus(); }
  });
  window.addEventListener("resize", function () { if (window.innerWidth > 960) setDrawer(false); });

  function onScroll() { sh.classList.toggle("is-scrolled", window.scrollY > 8); }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

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

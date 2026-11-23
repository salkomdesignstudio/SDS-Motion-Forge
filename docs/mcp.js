/* SDS Motion Forge: hover polish for the MCP pages and the "Ways to use it" blocks.
   1) .m-spot cards get a soft glow that follows the pointer (CSS vars --mx / --my).
   2) Primary buttons lean slightly toward the pointer ("magnetic").
   Both only run with a real pointer and when motion is allowed. No dependencies. */
(function () {
  "use strict";
  var fine = window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!fine || reduce) return;

  document.addEventListener("pointermove", function (e) {
    var t = e.target.closest && e.target.closest(".m-spot");
    if (!t) return;
    var r = t.getBoundingClientRect();
    t.style.setProperty("--mx", e.clientX - r.left + "px");
    t.style.setProperty("--my", e.clientY - r.top + "px");
  }, { passive: true });

  var MAG = ".m-page .btn2.primary, .m-deep, .sh-cta";
  document.addEventListener("pointermove", function (e) {
    var b = e.target.closest && e.target.closest(MAG);
    if (!b) return;
    var r = b.getBoundingClientRect();
    var x = (e.clientX - (r.left + r.width / 2)) / r.width;
    var y = (e.clientY - (r.top + r.height / 2)) / r.height;
    b.style.translate = x * 8 + "px " + y * 6 + "px";
  }, { passive: true });
  document.addEventListener("pointerout", function (e) {
    var b = e.target.closest && e.target.closest(MAG);
    if (b && !b.contains(e.relatedTarget)) b.style.translate = "";
  });
})();

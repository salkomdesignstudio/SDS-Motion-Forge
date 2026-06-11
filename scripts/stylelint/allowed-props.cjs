/** R4 — properties animations may touch (compositor + carriers). */
module.exports = new Set([
  "transform", "-webkit-transform",
  "translate", "rotate", "scale",
  "opacity",
  "filter", "-webkit-filter",
  "backdrop-filter", "-webkit-backdrop-filter",
  "clip-path", "-webkit-clip-path",
  "offset-distance", "offset-path", "offset-rotate",
  "animation-timing-function", /* per-frame easing is legal inside keyframes */
  "visibility", /* discrete, paint-free toggle used with opacity */
]);

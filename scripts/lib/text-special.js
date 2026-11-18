/**
 * Markup for the text effects that need more than `<tag class>Text</tag>`:
 * a data-text copy for the pseudo-element layers, a pair of words to swap,
 * or one column per digit. One table, shared by the docs generator and the
 * visual fixture so previews, snippets and tests always render the same HTML.
 *
 *   attrs  extra attributes for the host element (string, may be empty)
 *   inner  the host's inner HTML
 */
"use strict";

const digits = (n) =>
  String(n)
    .split("")
    .map((d, i) => `<span class="sds-roll" style="--d:${d};--i:${i}">${d}</span>`)
    .join("");

const SPECIAL = {
  "sds-liquid-fill": { attrs: 'data-text="Liquid"', inner: "Liquid" },
  "sds-split-halves": { attrs: 'data-text="Split"', inner: "Split" },
  "sds-strike-swap": {
    attrs: "",
    inner: '<span class="sds-swap-old">Cheap</span><span class="sds-swap-new">Premium</span>',
  },
  "sds-count-roll": { attrs: "", inner: digits(2048) },
};

/** @returns {{attrs: string, inner: string} | null} */
function specialTextMarkup(cls) {
  return SPECIAL[cls] || null;
}

module.exports = { specialTextMarkup };

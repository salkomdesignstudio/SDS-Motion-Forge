/**
 * Docs data for the GSAP engine effects (sds-gsap-*): demo markup, wording and the per-framework snippet tabs.
 * The effects themselves live in src/sds-gsap.js. Keep the names here in step with that file.
 */
const D = {
  "sds-gsap-text-scrub": { name: "Text Scrub", group: "text", trigger: "scrolls", desc: "Words light up one by one as you scroll past the paragraph.", markup: '<p class="sds-gsap-text-scrub">Every word lights up as you scroll past it, so the reader always knows where they are.</p>', opts: "data-sds-stagger" },
  "sds-gsap-text-wave": { name: "Text Wave", group: "text", trigger: "scrolls", desc: "Letters rise into place in a wave with a small overshoot when the text scrolls into view.", markup: '<h2 class="sds-gsap-text-wave">Letters rise in a wave</h2>', opts: 'data-sds-duration="0.9" data-sds-stagger="0.025" data-sds-ease="back.out(1.7)" data-sds-delay="0"' },
  "sds-gsap-text-mask": { name: "Text Mask", group: "text", trigger: "scrolls", desc: "Words slide up out of an invisible mask, one after another.", markup: '<h2 class="sds-gsap-text-mask">Words slide up from a mask</h2>', opts: 'data-sds-duration="0.8" data-sds-stagger="0.06"' },
  "sds-gsap-text-scramble": { name: "Text Scramble", group: "text", trigger: "scrolls", desc: "The text decodes out of random characters, left to right.", markup: '<h2 class="sds-gsap-text-scramble">Decoding the message</h2>', opts: 'data-sds-duration="1.4"' },
  "sds-gsap-text-count": { name: "Text Count", group: "text", trigger: "scrolls", desc: "A number counts up to the value in data-sds-to when it scrolls into view.", markup: '<h2 class="sds-gsap-text-count" data-sds-to="12800" data-sds-suffix="+">0</h2>', opts: 'data-sds-to="12800" data-sds-prefix="$" data-sds-suffix="+" data-sds-decimals="0" data-sds-duration="2"' },
  "sds-gsap-text-marquee": { name: "Text Marquee", group: "text", trigger: "runs", desc: "A seamless looping marquee that speeds up while you scroll.", markup: '<div class="sds-gsap-text-marquee">Motion Forge · Motion Forge · Motion Forge · </div>', opts: 'data-sds-speed="1" data-sds-direction="-1"' },

  "sds-gsap-card-tilt": { name: "Card Tilt", group: "cards", trigger: "follows the pointer", desc: "The card tilts in 3D towards the pointer and springs back when it leaves.", markup: '<div class="sds-gsap-card-tilt">Tilt me</div>', opts: 'data-sds-tilt="12"' },
  "sds-gsap-card-magnetic": { name: "Card Magnetic", group: "cards", trigger: "follows the pointer", desc: "The card is pulled towards the pointer and snaps back with an elastic bounce.", markup: '<div class="sds-gsap-card-magnetic">Pull me</div>', opts: 'data-sds-pull="0.35"' },
  "sds-gsap-card-spotlight": { name: "Card Spotlight", group: "cards", trigger: "follows the pointer", desc: "A soft spotlight follows the pointer across the card surface.", markup: '<div class="sds-gsap-card-spotlight">Spotlight</div>', opts: "" },
  "sds-gsap-card-fan": { name: "Card Fan", group: "cards", trigger: "scrolls", desc: "A stack of cards fans out like a hand of playing cards when it scrolls into view.", markup: '<div class="sds-gsap-card-fan">\n  <div>A</div>\n  <div>B</div>\n  <div>C</div>\n  <div>D</div>\n</div>', opts: 'data-sds-spread="14" data-sds-duration="0.9"' },
  "sds-gsap-card-flip-in": { name: "Card Flip In", group: "cards", trigger: "scrolls", desc: "Cards flip in one by one around the vertical axis when they scroll into view.", markup: '<div class="sds-gsap-card-flip-in">\n  <div>One</div>\n  <div>Two</div>\n  <div>Three</div>\n</div>', opts: 'data-sds-stagger="0.12" data-sds-duration="0.8"' },
  "sds-gsap-card-depth": { name: "Card Depth", group: "cards", trigger: "follows the pointer", desc: "The layers inside the card shift by different amounts as the pointer moves, for a sense of depth.", markup: '<div class="sds-gsap-card-depth">\n  <div data-depth="0.4">Back</div>\n  <div data-depth="1">Front</div>\n</div>', opts: 'data-sds-depth="24"' },

  "sds-gsap-loader-orbit": { name: "Loader Orbit", group: "loaders", trigger: "runs", desc: "Three dots orbit a centre point, each with its own eased rhythm.", markup: '<span class="sds-gsap-loader-orbit" role="status" aria-label="Loading"></span>', opts: 'data-sds-dots="3" data-sds-duration="1.6"' },
  "sds-gsap-loader-chase": { name: "Loader Chase", group: "loaders", trigger: "runs", desc: "Three dots bounce in a chase, one after another.", markup: '<span class="sds-gsap-loader-chase" role="status" aria-label="Loading"></span>', opts: "" },
  "sds-gsap-loader-equalizer": { name: "Loader Equalizer", group: "loaders", trigger: "runs", desc: "Five bars bounce like an audio equalizer, each at its own random pace.", markup: '<span class="sds-gsap-loader-equalizer" role="status" aria-label="Loading"></span>', opts: "" },
  "sds-gsap-loader-ring": { name: "Loader Ring", group: "loaders", trigger: "runs", desc: "A ring spins with an elastic snap and breathes in and out.", markup: '<span class="sds-gsap-loader-ring" role="status" aria-label="Loading"></span>', opts: "" },
  "sds-gsap-loader-count": { name: "Loader Count", group: "loaders", trigger: "runs", desc: "A percentage counts from 0 to 100 on a loop and exposes the value as a progress bar.", markup: '<span class="sds-gsap-loader-count">0%</span>', opts: 'data-sds-duration="2.4"' },
  "sds-gsap-loader-blob": { name: "Loader Blob", group: "loaders", trigger: "runs", desc: "A blob squashes and stretches as it wobbles.", markup: '<span class="sds-gsap-loader-blob" role="status" aria-label="Loading"></span>', opts: "" },

  "sds-gsap-scroll-pin": { name: "Scroll Pin", group: "scroll", trigger: "scrolls", desc: "The section stays pinned on screen while you scroll through its length.", markup: '<section class="sds-gsap-scroll-pin" data-sds-length="100%">Pinned while you scroll</section>', opts: 'data-sds-length="100%" data-sds-start="top top"' },
  "sds-gsap-scroll-parallax": { name: "Scroll Parallax", group: "scroll", trigger: "scrolls", desc: "The element drifts slower or faster than the page as you scroll.", markup: '<div class="sds-gsap-scroll-parallax" data-sds-speed="0.4">Parallax</div>', opts: 'data-sds-speed="0.4"' },
  "sds-gsap-scroll-horizontal": { name: "Scroll Horizontal", group: "scroll", trigger: "scrolls", desc: "The section pins and its row of panels slides sideways as you scroll down.", markup: '<div class="sds-gsap-scroll-horizontal">\n  <div>\n    <div>One</div>\n    <div>Two</div>\n    <div>Three</div>\n    <div>Four</div>\n  </div>\n</div>', opts: "" },
  "sds-gsap-scroll-stagger": { name: "Scroll Stagger", group: "scroll", trigger: "scrolls", desc: "Child elements rise into place in a staggered batch as they enter the viewport.", markup: '<div class="sds-gsap-scroll-stagger">\n  <div>One</div>\n  <div>Two</div>\n  <div>Three</div>\n</div>', opts: 'data-sds-stagger="0.1" data-sds-distance="40" data-sds-duration="0.8"' },
  "sds-gsap-scroll-zoom": { name: "Scroll Zoom", group: "scroll", trigger: "scrolls", desc: "The element grows from a rounded, smaller frame to full size as it scrolls up the screen.", markup: '<div class="sds-gsap-scroll-zoom">Zoom into view</div>', opts: "" },
  "sds-gsap-scroll-progress": { name: "Scroll Progress", group: "scroll", trigger: "scrolls", desc: "A bar at the top of the page fills as you read down the document.", markup: '<div class="sds-gsap-scroll-progress"></div>', opts: "" },
};

const GROUP_CAT = { text: "text", cards: "cards", loaders: "loaders", scroll: "scroll" };
const isGsap = (c) => !!D[c.name];
const markup = (c) => D[c.name].markup;
const desc = (name) => (D[name] ? D[name].desc : null);
const displayName = (name) => (D[name] ? D[name].name : null);
const groupOf = (c) => GROUP_CAT[D[c.name].group];

function how(c) {
  const d = D[c.name];
  return `Runs ${d.trigger === "runs" ? "continuously" : "when it " + d.trigger}, driven by GSAP. Add the class and load sds-gsap.min.js once: it loads GSAP and ScrollTrigger from a CDN only when the page uses an sds-gsap class. Nothing runs under prefers-reduced-motion.${d.opts ? " Options: " + d.opts.replace(/data-sds-/g, "data-sds-") + "." : ""}`;
}

function tabs(c, cdn, pkg) {
  const d = D[c.name];
  const m = d.markup;
  const script = `<script src="${cdn}/sds-gsap.min.js" defer></script>`;
  const opt = d.opts ? `\n<!-- optional settings:  ${d.opts} -->` : "";
  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <link rel="stylesheet" href="${cdn}/motion.min.css" />
</head>
<body>
${m.split("\n").map((l) => "  " + l).join("\n")}${opt.split("\n").map((l) => (l ? "  " + l : l)).join("\n")}

  <!-- one script: it loads GSAP + ScrollTrigger itself, only on pages that use an sds-gsap class -->
  ${script}
</body>
</html>`;
  const js = `// Import once (client side only). It finds every .sds-gsap-* element, loads GSAP from a CDN on first use,
// and watches for elements added later.
import '${pkg}/dist/motion.min.css';
import '${pkg}/dist/sds-gsap.min.js';

// Optional, after inserting new DOM yourself:
//   window.sdsGsap.init(container)   // wire new elements
//   window.sdsGsap.kill(element)     // stop one and restore it
// Self-host GSAP:  <script src="sds-gsap.min.js" data-gsap="/vendor/gsap.min.js" data-scrolltrigger="/vendor/ScrollTrigger.min.js">`;
  const jsx = m.replace(/\bclass=/g, "className=");
  const react = `import '${pkg}/dist/motion.min.css';
import { useEffect } from 'react';

export default function Demo() {
  // load the engine once, on the client
  useEffect(() => { import('${pkg}/dist/sds-gsap.min.js'); }, []);
  return (
    <>
${jsx.split("\n").map((l) => "      " + l).join("\n")}
    </>
  );
}`;
  const angular = `// angular.json -> architect.build.options:
//   "styles":  ["node_modules/${pkg}/dist/motion.min.css"],
//   "scripts": ["node_modules/${pkg}/dist/sds-gsap.min.js"]
import { Component } from '@angular/core';

@Component({
  selector: 'app-demo',
  standalone: true,
  template: \`
${m.split("\n").map((l) => "    " + l).join("\n")}
  \`,
})
export class DemoComponent {}`;
  const tailwind = `/* ${d.name} is driven by GSAP, so it has no Tailwind utility.
   Use the class as written in the HTML tab, with motion.min.css and sds-gsap.min.js loaded once. */`;
  const bootstrap = `<!-- Bootstrap 5 + Motion Forge: the classes never conflict -->
<link rel="stylesheet" href="${cdn}/motion.min.css" />
${m}
${script}`;
  return { html, js, react, angular, tailwind, bootstrap };
}

module.exports = { D, isGsap, markup, desc, displayName, groupOf, how, tabs };

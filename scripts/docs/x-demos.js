/**
 * Docs data for the extended effects (sds-x-*): demo markup, wording and the per-framework snippet tabs.
 * The effects themselves live in src/sds-x.js. Keep the names here in step with that file.
 * Every effect is a different idea: nothing is repeated between the four groups.
 */
const R = "role=\"status\" aria-label=\"Loading\"";
const D = {
  /* ---------------------------------- text ---------------------------------- */
  "sds-x-text-scrub": { name: "Text Scrub", group: "text", trigger: "scrolls", desc: "Words light up one by one as you scroll past the paragraph.", markup: '<p class="sds-x-text-scrub">Every word lights up as you scroll past it, so the reader always knows where they are.</p>', opts: 'data-sds-stagger="0.1"' },
  "sds-x-text-wave": { name: "Text Wave", group: "text", trigger: "scrolls", desc: "Letters rise into place in a wave with a small overshoot when the text scrolls into view.", markup: '<h2 class="sds-x-text-wave">Letters rise in a wave</h2>', opts: 'data-sds-duration="0.9" data-sds-stagger="0.025" data-sds-ease="back.out(1.7)"' },
  "sds-x-text-mask": { name: "Text Mask", group: "text", trigger: "scrolls", desc: "Words slide up out of an invisible mask, one after another.", markup: '<h2 class="sds-x-text-mask">Words slide up from a mask</h2>', opts: 'data-sds-duration="0.8" data-sds-stagger="0.06"' },
  "sds-x-text-scramble": { name: "Text Scramble", group: "text", trigger: "scrolls", desc: "The text decodes out of random characters, left to right.", markup: '<h2 class="sds-x-text-scramble">Decoding the message</h2>', opts: 'data-sds-duration="1.4"' },
  "sds-x-text-count": { name: "Text Count", group: "text", trigger: "scrolls", desc: "A number counts up to the value in data-sds-to when it scrolls into view.", markup: '<h2 class="sds-x-text-count" data-sds-to="12800" data-sds-suffix="+">0</h2>', opts: 'data-sds-to="12800" data-sds-prefix="$" data-sds-suffix="+" data-sds-decimals="0" data-sds-duration="2"' },
  "sds-x-text-marquee": { name: "Text Marquee", group: "text", trigger: "runs", desc: "A seamless, endless ticker of text.", markup: '<div class="sds-x-text-marquee">Motion Forge · Motion Forge · Motion Forge · </div>', opts: 'data-sds-speed="1" data-sds-direction="-1"' },
  "sds-x-text-typewriter": { name: "Text Typewriter", group: "text", trigger: "scrolls", desc: "The text types itself out, letter by letter, with a blinking caret.", markup: '<h2 class="sds-x-text-typewriter">Typing it out, one letter at a time</h2>', opts: 'data-sds-duration="2"' },
  "sds-x-text-cycle": { name: "Text Cycle", group: "text", trigger: "runs", desc: "Cycles through a list of words, each sliding and blurring into the next.", markup: '<h2>Built for <span class="sds-x-text-cycle" data-words="designers,developers,teams">designers</span></h2>', opts: 'data-words="one,two,three" data-sds-hold="1.6"' },
  "sds-x-text-blur": { name: "Text Blur", group: "text", trigger: "scrolls", desc: "Letters sharpen out of a heavy blur one after another.", markup: '<h2 class="sds-x-text-blur">Sharpens out of a blur</h2>', opts: 'data-sds-stagger="0.035" data-sds-duration="0.8"' },
  "sds-x-text-drop": { name: "Text Drop", group: "text", trigger: "scrolls", desc: "Letters fall from above and bounce into place, starting from the middle of the line.", markup: '<h2 class="sds-x-text-drop">Letters drop and bounce</h2>', opts: 'data-sds-duration="1.1"' },
  "sds-x-text-sweep": { name: "Text Sweep", group: "text", trigger: "runs", desc: "A bright band of colour sweeps through the letters on a loop.", markup: '<h2 class="sds-x-text-sweep">A light sweeps through</h2>', opts: 'data-sds-duration="2.2"' },
  "sds-x-text-flip": { name: "Text Flip", group: "text", trigger: "scrolls", desc: "Letters flip up around their base in 3D, in a random order.", markup: '<h2 class="sds-x-text-flip">Letters flip up in 3D</h2>', opts: 'data-sds-duration="0.8"' },
  "sds-x-text-highlight": { name: "Text Highlight", group: "text", trigger: "scrolls", desc: "A marker highlight is drawn behind each word, one by one.", markup: '<p class="sds-x-text-highlight">Highlight the words that matter most.</p>', opts: 'data-sds-color="rgba(255, 214, 10, 0.6)" data-sds-stagger="0.12"' },
  "sds-x-text-glitch": { name: "Text Glitch", group: "text", trigger: "runs", desc: "A short red and cyan glitch jolts the text now and then.", markup: '<h2 class="sds-x-text-glitch">Signal lost</h2>', opts: 'data-sds-gap="1.4"' },
  "sds-x-text-skew": { name: "Text Skew", group: "text", trigger: "scrolls", desc: "The text leans one way or the other depending on how fast you scroll.", markup: '<h2 class="sds-x-text-skew">Skews with your scroll speed</h2>', opts: 'data-sds-skew="10"' },
  "sds-x-text-circle": { name: "Text Circle", group: "text", trigger: "runs", desc: "Letters are set on a circle that turns slowly.", markup: '<div class="sds-x-text-circle" data-sds-radius="48">MOTION FORGE • MOTION FORGE • </div>', opts: 'data-sds-radius="56" data-sds-duration="12"' },

  /* ---------------------------------- cards ---------------------------------- */
  "sds-x-card-tilt": { name: "Card Tilt", group: "cards", trigger: "follows the pointer", desc: "The card tilts in 3D towards the pointer and springs back when it leaves.", markup: '<div class="sds-x-card-tilt">Tilt me</div>', opts: 'data-sds-tilt="12"' },
  "sds-x-card-magnetic": { name: "Card Magnetic", group: "cards", trigger: "follows the pointer", desc: "The card is pulled towards the pointer and snaps back with an elastic bounce.", markup: '<div class="sds-x-card-magnetic">Pull me</div>', opts: 'data-sds-pull="0.35"' },
  "sds-x-card-spotlight": { name: "Card Spotlight", group: "cards", trigger: "follows the pointer", desc: "A soft spotlight follows the pointer across the card surface.", markup: '<div class="sds-x-card-spotlight">Spotlight</div>', opts: "" },
  "sds-x-card-fan": { name: "Card Fan", group: "cards", trigger: "scrolls", desc: "A pile of cards fans out like a hand of playing cards when it scrolls into view.", markup: '<div class="sds-x-card-fan">\n  <div>A</div>\n  <div>B</div>\n  <div>C</div>\n  <div>D</div>\n</div>', opts: 'data-sds-spread="14" data-sds-duration="0.9"' },
  "sds-x-card-depth": { name: "Card Depth", group: "cards", trigger: "follows the pointer", desc: "The layers inside the card shift by different amounts as the pointer moves, for a sense of depth.", markup: '<div class="sds-x-card-depth">\n  <div data-depth="0.4">Back</div>\n  <div data-depth="1">Front</div>\n</div>', opts: 'data-sds-depth="24"' },
  "sds-x-card-deck": { name: "Card Deck", group: "cards", trigger: "reacts to a click", desc: "A deck of cards: click the top card and it flies off to the back of the pile.", markup: '<div class="sds-x-card-deck">\n  <div>One</div>\n  <div>Two</div>\n  <div>Three</div>\n</div>', opts: "" },
  "sds-x-card-carousel": { name: "Card Carousel", group: "cards", trigger: "follows the pointer", desc: "Cards sit on a turning 3D ring that speeds up and slows down with the pointer.", markup: '<div class="sds-x-card-carousel">\n  <div>1</div>\n  <div>2</div>\n  <div>3</div>\n  <div>4</div>\n  <div>5</div>\n</div>', opts: 'data-sds-duration="14"' },
  "sds-x-card-shuffle": { name: "Card Shuffle", group: "cards", trigger: "reacts to a click", desc: "Click the group and the cards glide to new random positions.", markup: '<div class="sds-x-card-shuffle">\n  <div>A</div>\n  <div>B</div>\n  <div>C</div>\n  <div>D</div>\n</div>', opts: "" },
  "sds-x-card-dim": { name: "Card Dim", group: "cards", trigger: "follows the pointer", desc: "The card under the pointer grows while its neighbours dim and blur.", markup: '<div class="sds-x-card-dim">\n  <div>One</div>\n  <div>Two</div>\n  <div>Three</div>\n</div>', opts: "" },

  /* ---------------------------------- loaders ---------------------------------- */
  "sds-x-loader-orbit": { name: "Loader Orbit", group: "loaders", trigger: "runs", desc: "Three dots orbit a centre point, each with its own eased rhythm.", markup: `<span class="sds-x-loader-orbit" ${R}></span>`, opts: 'data-sds-dots="3" data-sds-duration="1.6"' },
  "sds-x-loader-chase": { name: "Loader Chase", group: "loaders", trigger: "runs", desc: "Three dots bounce in a chase, one after another.", markup: `<span class="sds-x-loader-chase" ${R}></span>`, opts: "" },
  "sds-x-loader-equalizer": { name: "Loader Equalizer", group: "loaders", trigger: "runs", desc: "Five bars bounce like an audio equalizer, each at its own random pace.", markup: `<span class="sds-x-loader-equalizer" ${R}></span>`, opts: "" },
  "sds-x-loader-elastic": { name: "Loader Elastic", group: "loaders", trigger: "runs", desc: "A ring spins with an elastic snap and breathes in and out.", markup: `<span class="sds-x-loader-elastic" ${R}></span>`, opts: "" },
  "sds-x-loader-blob": { name: "Loader Blob", group: "loaders", trigger: "runs", desc: "A blob squashes and stretches as it wobbles.", markup: `<span class="sds-x-loader-blob" ${R}></span>`, opts: "" },
  "sds-x-loader-pendulum": { name: "Loader Pendulum", group: "loaders", trigger: "runs", desc: "Five balls swing like a Newton's cradle.", markup: `<span class="sds-x-loader-pendulum" ${R}></span>`, opts: "" },
  "sds-x-loader-dash": { name: "Loader Dash", group: "loaders", trigger: "runs", desc: "A circle draws and erases itself as it spins.", markup: `<span class="sds-x-loader-dash" ${R}></span>`, opts: "" },
  "sds-x-loader-clock": { name: "Loader Clock", group: "loaders", trigger: "runs", desc: "Clock hands sweep around a dial at different speeds.", markup: `<span class="sds-x-loader-clock" ${R}></span>`, opts: "" },
  "sds-x-loader-steps": { name: "Loader Steps", group: "loaders", trigger: "runs", desc: "A progress bar fills in believable steps, then starts over.", markup: `<span class="sds-x-loader-steps" ${R}></span>`, opts: "" },
  "sds-x-loader-bounce": { name: "Loader Bounce", group: "loaders", trigger: "runs", desc: "A ball bounces with a squash on landing, and its shadow shrinks as it rises.", markup: `<span class="sds-x-loader-bounce" ${R}></span>`, opts: "" },
  "sds-x-loader-radar": { name: "Loader Radar", group: "loaders", trigger: "runs", desc: "A radar sweep turns round and blips appear as it passes.", markup: `<span class="sds-x-loader-radar" ${R}></span>`, opts: "" },

  /* ---------------------------------- scroll ---------------------------------- */
  "sds-x-scroll-pin": { name: "Scroll Pin", group: "scroll", trigger: "scrolls", desc: "The section stays pinned on screen while you scroll through its length.", markup: '<section class="sds-x-scroll-pin" data-sds-length="100%">Pinned while you scroll</section>', opts: 'data-sds-length="100%" data-sds-start="top top"' },
  "sds-x-scroll-parallax": { name: "Scroll Parallax", group: "scroll", trigger: "scrolls", desc: "The element drifts slower or faster than the page as you scroll.", markup: '<div class="sds-x-scroll-parallax" data-sds-speed="0.4">Parallax</div>', opts: 'data-sds-speed="0.4"' },
  "sds-x-scroll-horizontal": { name: "Scroll Horizontal", group: "scroll", trigger: "scrolls", desc: "The section pins and its row of panels slides sideways as you scroll down.", markup: '<div class="sds-x-scroll-horizontal">\n  <div>\n    <div>One</div>\n    <div>Two</div>\n    <div>Three</div>\n    <div>Four</div>\n  </div>\n</div>', opts: "" },
  "sds-x-scroll-stagger": { name: "Scroll Stagger", group: "scroll", trigger: "scrolls", desc: "Child elements rise into place in a staggered batch as they enter the viewport.", markup: '<div class="sds-x-scroll-stagger">\n  <div>One</div>\n  <div>Two</div>\n  <div>Three</div>\n</div>', opts: 'data-sds-stagger="0.1" data-sds-distance="40" data-sds-duration="0.8"' },
  "sds-x-scroll-zoom": { name: "Scroll Zoom", group: "scroll", trigger: "scrolls", desc: "The element grows from a smaller size to full size as it scrolls up the screen.", markup: '<div class="sds-x-scroll-zoom">Zoom into view</div>', opts: "" },
  "sds-x-scroll-progress": { name: "Scroll Progress", group: "scroll", trigger: "scrolls", desc: "A bar at the top of the page fills as you read down the document.", markup: '<div class="sds-x-scroll-progress"></div>', opts: "" },
  "sds-x-scroll-stack": { name: "Scroll Stack", group: "scroll", trigger: "scrolls", desc: "Sections stick one on top of another as they reach the top, each shrinking a little as the next arrives.", markup: '<div class="sds-x-scroll-stack">\n  <div>One</div>\n  <div>Two</div>\n  <div>Three</div>\n</div>', opts: "" },
  "sds-x-scroll-curtain": { name: "Scroll Curtain", group: "scroll", trigger: "scrolls", desc: "A curtain opens from the middle outward, revealing the element as it scrolls up.", markup: '<div class="sds-x-scroll-curtain">Curtain opens</div>', opts: "" },
  "sds-x-scroll-rotate": { name: "Scroll Rotate", group: "scroll", trigger: "scrolls", desc: "The element turns as you scroll, by as many full turns as you set.", markup: '<div class="sds-x-scroll-rotate" data-sds-turns="1">Spins as you scroll</div>', opts: 'data-sds-turns="1"' },
  "sds-x-scroll-color": { name: "Scroll Color", group: "scroll", trigger: "scrolls", desc: "The background and text colour blend from one pair to another as the section scrolls into place.", markup: '<section class="sds-x-scroll-color" data-sds-from="#ffffff" data-sds-to="#14162a">Changes colour as you scroll</section>', opts: 'data-sds-from="#ffffff" data-sds-to="#14162a" data-sds-text-from="#14162a" data-sds-text-to="#ffffff"' },
  "sds-x-scroll-snap": { name: "Scroll Snap", group: "scroll", trigger: "scrolls", desc: "Scrolling snaps from one section to the next, with an eased glide.", markup: '<div class="sds-x-scroll-snap">\n  <section>One</section>\n  <section>Two</section>\n  <section>Three</section>\n</div>', opts: "" },
  "sds-x-scroll-slides": { name: "Scroll Slides", group: "scroll", trigger: "scrolls", desc: "The block pins and its slides cross-fade one after another as you scroll.", markup: '<div class="sds-x-scroll-slides">\n  <div>One</div>\n  <div>Two</div>\n  <div>Three</div>\n</div>', opts: "" },
};

const GROUP_CAT = { text: "text", cards: "cards", loaders: "loaders", scroll: "scroll" };
const isX = (c) => !!D[c.name];
const markup = (c) => D[c.name].markup;
const desc = (name) => (D[name] ? D[name].desc : null);
const displayName = (name) => (D[name] ? D[name].name : null);
const groupOf = (c) => GROUP_CAT[D[c.name].group];

function how(c) {
  const d = D[c.name];
  return `Runs ${d.trigger === "runs" ? "continuously" : "when it " + d.trigger}. Add the class and load sds-x.min.js once: it loads its small animation runtime from a CDN, only on pages that use an sds-x class. Nothing runs under prefers-reduced-motion.${d.opts ? " Options: " + d.opts + "." : ""}`;
}

function tabs(c, cdn, pkg) {
  const d = D[c.name];
  const m = d.markup;
  const script = `<script src="${cdn}/sds-x.min.js" defer></script>`;
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

  <!-- one small script: it loads its runtime itself, only on pages that use an sds-x class -->
  ${script}
</body>
</html>`;
  const js = `// Import once (client side only). It finds every .sds-x-* element, loads its runtime from a CDN on first use,
// and watches for elements added later.
import '${pkg}/dist/motion.min.css';
import '${pkg}/dist/sds-x.min.js';

// Optional, after inserting new DOM yourself:
//   window.sdsX.init(container)   // wire new elements
//   window.sdsX.kill(element)     // stop one and restore it
// Self-host the runtime:  <script src="sds-x.min.js" data-runtime="/vendor/core.min.js" data-runtime-scroll="/vendor/scroll.min.js">`;
  const jsx = m.replace(/\bclass=/g, "className=");
  const react = `import '${pkg}/dist/motion.min.css';
import { useEffect } from 'react';

export default function Demo() {
  // load the script once, on the client
  useEffect(() => { import('${pkg}/dist/sds-x.min.js'); }, []);
  return (
    <>
${jsx.split("\n").map((l) => "      " + l).join("\n")}
    </>
  );
}`;
  const angular = `// angular.json -> architect.build.options:
//   "styles":  ["node_modules/${pkg}/dist/motion.min.css"],
//   "scripts": ["node_modules/${pkg}/dist/sds-x.min.js"]
import { Component } from '@angular/core';

@Component({
  selector: 'app-demo',
  standalone: true,
  template: \`
${m.split("\n").map((l) => "    " + l).join("\n")}
  \`,
})
export class DemoComponent {}`;
  const tailwind = `/* ${d.name} is script-driven, so it has no Tailwind utility.
   Use the class as written in the HTML tab, with motion.min.css and sds-x.min.js loaded once. */`;
  const bootstrap = `<!-- Bootstrap 5 + Motion Forge: the classes never conflict -->
<link rel="stylesheet" href="${cdn}/motion.min.css" />
${m}
${script}`;
  return { html, js, react, angular, tailwind, bootstrap };
}

module.exports = { D, isX, markup, desc, displayName, groupOf, how, tabs };

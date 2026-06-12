#!/usr/bin/env node
/**
 * One-time Phase 4 surgery on docs/index.html (kept for audit).
 *
 * Enforces PREVIEW = NPM = SNIPPET:
 *  - deletes the inline copy of the animation CSS (the page already loads
 *    dist/motion.min.css with a CDN fallback — single artifact)
 *  - deletes the inline copy of the interactive engine; loads the BUILT
 *    engines (dist/, CDN fallback) instead
 *  - replaces the hand-maintained ANIMATIONS literal with the registry-
 *    generated window.SDS_DOCS data (docs-data.js)
 *  - preview markup now comes from SDS_DOCS.markup — the same string that is
 *    the HTML tab's body
 *  - modal gets the six generated code tabs + "How it works"
 *  - gallery gets per-card replay buttons + a reduced-motion preview toggle
 *
 * Every splice is anchored on unique strings and asserts it matched.
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..", "..");
const FILE = path.join(ROOT, "docs", "index.html");
let html = fs.readFileSync(FILE, "utf8").replace(/\r\n/g, "\n");

let ops = 0;
function splice(startAnchor, endAnchor, replacement, { keepEnd = true } = {}) {
  const s = html.indexOf(startAnchor);
  if (s === -1) throw new Error(`start anchor not found: ${startAnchor.slice(0, 60)}`);
  const e = html.indexOf(endAnchor, s + startAnchor.length);
  if (e === -1) throw new Error(`end anchor not found: ${endAnchor.slice(0, 60)}`);
  html = html.slice(0, s) + replacement + (keepEnd ? html.slice(e) : html.slice(e + endAnchor.length));
  ops++;
}
function replaceOnce(from, to) {
  const i = html.indexOf(from);
  if (i === -1) throw new Error(`anchor not found: ${from.slice(0, 70)}`);
  html = html.slice(0, i) + to + html.slice(i + from.length);
  ops++;
}

/* 1 ── delete the inline animation-CSS copy (duplicates dist CSS) */
splice(
  "      /* ===== NEW v4.0.3 TEXT ANIMATIONS",
  "      /* ───────── DOCS TEASER ───────── */",
  `      /* Animation CSS intentionally NOT inlined here (v5 single-artifact
         policy): every effect style comes from dist/motion.min.css — the
         exact built package output (CDN fallback below). Preview = npm. */

      /* Preview presentation for registry-generated markup */
      .card-stage h1, .modal-stage h1 { font-size: 20px; margin: 0; font-weight: 700; }
      .modal-stage h1 { font-size: 26px; }
      .card-stage h2, .modal-stage h2 { font-size: 18px; margin: 0; font-weight: 700; }
      .modal-stage h2 { font-size: 24px; }
      .card-stage button, .modal-stage button {
        padding: 10px 22px; border: none; border-radius: 10px;
        background: var(--brand); color: #fff; font-weight: 700;
        font-family: var(--f-disp); cursor: pointer;
      }
      .modal-stage button { padding: 12px 26px; border-radius: 12px; }
      .card-stage input, .modal-stage input {
        padding: 10px 14px; border: 1.5px solid var(--line-2);
        border-radius: 10px; font-family: var(--f-disp); font-size: 14px; width: 80%;
      }
      .card-stage div[class*="sds-card-"], .modal-stage div[class*="sds-card-"] {
        width: 90px; height: 60px; border-radius: 10px; background: var(--brand);
        box-shadow: var(--sh-1); color: transparent; overflow: hidden; padding: 6px;
      }
      .modal-stage div[class*="sds-card-"] { width: 130px; height: 86px; }
      .card-stage div[class*="sds-card-"] > div, .modal-stage div[class*="sds-card-"] > div {
        height: 9px; margin: 4px 2px; background: rgba(255, 255, 255, 0.55);
        border-radius: 3px; color: transparent;
      }
      .card-stage div[class*="sds-scroll-"], .modal-stage div[class*="sds-scroll-"] {
        padding: 10px 16px; background: var(--brand-dim); border: 1px solid var(--line);
        border-radius: 10px; font-weight: 600; font-size: 13px;
      }
      .card-stage div[class*="sds-scroll-"] > div, .modal-stage div[class*="sds-scroll-"] > div {
        padding: 2px 0;
      }
      .card-stage .sds-input-elevate-wrap label, .modal-stage .sds-input-elevate-wrap label {
        font-size: 13px; color: var(--ink-3);
      }
      /* per-card replay button */
      .card-replay {
        position: absolute; top: 8px; right: 8px; width: 26px; height: 26px;
        border: 1px solid var(--line-2); border-radius: 8px; background: var(--bg-card);
        color: var(--ink-2); cursor: pointer; font-size: 13px; line-height: 1;
        opacity: 0; transition: opacity 0.15s;
      }
      .card:hover .card-replay, .card:focus-within .card-replay { opacity: 1; }
      .card-stage { position: relative; }
      /* simulated reduced-motion (gallery toggle) */
      body.rm-sim #galGrid [class*="sds-"],
      body.rm-sim #galGrid [class*="sds-"] > *,
      body.rm-sim #galGrid [class*="sds-"]::before,
      body.rm-sim #galGrid [class*="sds-"]::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
      body.rm-sim #galGrid [class*="sds-"] {
        opacity: 1 !important; transform: none !important;
        filter: none !important; clip-path: none !important;
      }
      .rm-toggle {
        display: inline-flex; align-items: center; gap: 8px; font-size: 13px;
        color: var(--ink-2); cursor: pointer; user-select: none;
        border: 1px solid var(--line-2); border-radius: 10px; padding: 8px 12px;
        background: var(--bg-card);
      }
      .rm-toggle input { accent-color: var(--brand); }
      .modal-how {
        font-size: 13.5px; line-height: 1.65; color: var(--ink-2);
        background: var(--brand-dim); border: 1px solid var(--line);
        border-radius: 12px; padding: 12px 16px; margin: 14px 0 6px;
      }

`,
);

/* 2 ── load generated data + built engines (CDN fallback) before main script */
replaceOnce(
  "    <script>\n      const ANIMATIONS = {",
  `    <script src="docs-data.js"></script>
    <script
      src="dist/sds-scroll.min.js"
      defer
      onerror="this.onerror=null;this.src='https://cdn.jsdelivr.net/npm/@salkomdesignstudio/sds-motion-forge/dist/sds-scroll.min.js'"
    ></script>
    <script
      src="dist/motion-interactive.min.js"
      defer
      onerror="this.onerror=null;this.src='https://cdn.jsdelivr.net/npm/@salkomdesignstudio/sds-motion-forge/dist/motion-interactive.min.js'"
    ></script>
    <script>
      /* All animation data is generated from registry/motion.registry.json
         (window.SDS_DOCS) — nothing in the gallery is hand-maintained. */
      const ANIMATIONS = window.SDS_DOCS.animations;
      const __DELETED_ANIMATIONS_LITERAL = {`,
);

/* 3 ── delete the (now orphaned) literal body */
splice(
  "      const __DELETED_ANIMATIONS_LITERAL = {",
  "\n      };",
  "      /* hand-maintained ANIMATIONS literal removed in v5 — see SDS_DOCS */",
  { keepEnd: false },
);

/* 4 ── CHAR_SPLIT / INTERACTIVE lists come from the registry data */
splice(
  "        // animations whose preview needs the text pre-split into char spans\n        var CHAR_SPLIT = [",
  "        ];",
  `        // generated from the registry (requiresCharSplit)
        var CHAR_SPLIT = window.SDS_DOCS.charSplit;
        var CHILD_DRIVEN = window.SDS_DOCS.childDriven;
        var __unused_charsplit = [`,
);
splice(
  "        // interactive (JS-engine) animations\n        var INTERACTIVE = [",
  "        ];",
  `        // generated from the registry (requiresJs)
        var INTERACTIVE = window.SDS_DOCS.interactive;
        var __unused_interactive = [`,
);

/* 5 ── preview markup = the HTML snippet body (single template) */
splice(
  "        function previewMarkup(a) {",
  "          return '<span class=\"card-demo ' + cls + '\">' + a.name + \"</span>\";\n        }",
  `        function previewMarkup(a) {
          // THE single registry-rendered template — identical to the HTML
          // tab's body. Preview and snippet can never diverge.
          return window.SDS_DOCS.markup[a.cls] || "";
        }
        function __unusedPreviewMarkup(a) {
          var cls = a.cls;
          return '<span class="card-demo ' + cls + '">' + a.name + "</span>";
        }`,
  { keepEnd: false },
);
splice(
  "        function previewMarkupModal(a) {",
  "            a.name +\n            \"</span>\"\n          );\n        }",
  `        function previewMarkupModal(a) {
          return window.SDS_DOCS.markup[a.cls] || "";
        }
        function __unusedPreviewMarkupModal(a) {
          return "";
        }`,
  { keepEnd: false },
);

/* 6 ── modal: id assignment after injection (markup is id-free) */
replaceOnce(
  "          stage.innerHTML = previewMarkupModal(a);\n          stage.appendChild(replay);",
  `          stage.innerHTML = previewMarkupModal(a);
          if (stage.firstElementChild) {
            stage.firstElementChild.id = "modalDemo";
            stage.firstElementChild.classList.add("modal-demo");
            // previews fire immediately — strip the scroll gate inside the modal
            stage.firstElementChild.removeAttribute("data-sds");
          }
          stage.appendChild(replay);
          document.getElementById("modalHow").textContent =
            window.SDS_DOCS.how[a.cls] || "";`,
);

/* 7 ── six generated tabs + How-it-works container */
replaceOnce(
  `        <div class="modal-tabs" id="modalTabs">
          <button class="mtab on" data-tab="html">HTML</button>
          <button class="mtab" data-tab="react">React</button>
          <button class="mtab" data-tab="css">CSS Var Override</button>
        </div>`,
  `        <div class="modal-how" id="modalHow"></div>
        <div class="modal-tabs" id="modalTabs">
          <button class="mtab on" data-tab="html">HTML + CSS</button>
          <button class="mtab" data-tab="js">JS</button>
          <button class="mtab" data-tab="react">React</button>
          <button class="mtab" data-tab="angular">Angular</button>
          <button class="mtab" data-tab="tailwind">Tailwind</button>
          <button class="mtab" data-tab="bootstrap">Bootstrap</button>
        </div>`,
);

/* 8 ── renderModalCode: serve the EXACT machine-tested snippet */
splice(
  "        function renderModalCode() {",
  "          document.getElementById(\"modalCode\").textContent = out;\n        }",
  `        function renderModalCode() {
          var a = modalState.anim;
          if (!a) return;
          // The copied text is the EXACT snippet verified in CI against the
          // packed npm tarball (scripts/verify-snippets) — never edited here.
          var snip = (window.SDS_DOCS.snippets[a.cls] || {})[modalState.tab] || "";
          document.getElementById("modalCode").textContent = snip;
        }`,
  { keepEnd: false },
);

/* 9 ── per-card replay button + child-driven replay targets */
replaceOnce(
  `'<div class="card-stage">' +
                previewMarkup(a) +
                "</div>" +`,
  `'<div class="card-stage">' +
                previewMarkup(a) +
                '<button class="card-replay" aria-label="Replay ' +
                a.name +
                ' animation" title="Replay">⟳</button>' +
                "</div>" +`,
);
replaceOnce(
  `            function play() {
              if (!demo || reduce) return;
              // For char-split wave animations, children carry the animation
              var charSpans = demo.querySelectorAll(".sds-char");
              var targets = charSpans.length
                ? Array.prototype.slice.call(charSpans)
                : [demo];`,
  `            function play() {
              if (!demo || reduce) return;
              // char-split and child-driven effects animate descendants
              var charSpans = demo.querySelectorAll(".sds-char");
              var targets = charSpans.length
                ? Array.prototype.slice.call(charSpans)
                : CHILD_DRIVEN.indexOf(cls) > -1 && demo.children.length
                  ? Array.prototype.slice.call(demo.children)
                  : [demo];`,
);
replaceOnce(
  `            card.addEventListener("mouseenter", play);`,
  `            card.addEventListener("mouseenter", play);
            var rp = card.querySelector(".card-replay");
            if (rp)
              rp.addEventListener("click", function (e) {
                e.stopPropagation();
                play();
              });`,
);

/* 10 ── modal targets: child-driven uses children */
replaceOnce(
  `        function modalAnimTargets() {
          var demo = document.getElementById("modalDemo");
          if (!demo) return [];
          var a = modalState.anim;
          if (a && (a.elem === "stagger-pop" || a.elem === "stagger-grid")) {
            return Array.prototype.slice.call(demo.children);
          }
          return [demo];
        }`,
  `        function modalAnimTargets() {
          var demo = document.getElementById("modalDemo");
          if (!demo) return [];
          var a = modalState.anim;
          var chars = demo.querySelectorAll(".sds-char");
          if (chars.length) return Array.prototype.slice.call(chars);
          if (a && CHILD_DRIVEN.indexOf(a.cls) > -1 && demo.children.length) {
            return Array.prototype.slice.call(demo.children);
          }
          return [demo];
        }`,
);

/* 11 ── reduced-motion preview toggle in the gallery toolbar */
replaceOnce(
  "        document\n          .getElementById(\"search\")\n          .addEventListener(\"input\", function (e) {",
  `        // reduced-motion preview toggle (shows the accessible fallback)
        (function () {
          var search = document.getElementById("search");
          if (!search || document.getElementById("rmToggle")) return;
          var label = document.createElement("label");
          label.className = "rm-toggle";
          label.innerHTML =
            '<input type="checkbox" id="rmToggle" /> Reduced-motion preview';
          search.parentNode.insertBefore(label, search.nextSibling);
          label.querySelector("input").addEventListener("change", function (e) {
            document.body.classList.toggle("rm-sim", e.target.checked);
          });
        })();

        document
          .getElementById("search")
          .addEventListener("input", function (e) {`,
);

/* 12 ── delete the inline engine copy at the tail */
splice(
  "    <script>\n      /*!\n       * SDS Motion Forge — Interactive Engine v4",
  "</script>\n  </body>",
  `    <!-- Interactive engine is loaded from the built package output above
         (single-artifact policy) — the inline copy was removed in v5. -->
    `,
);

fs.writeFileSync(FILE, html);
console.log(`docs/index.html patched (${ops} operations), ${(html.length / 1024).toFixed(0)} KB`);

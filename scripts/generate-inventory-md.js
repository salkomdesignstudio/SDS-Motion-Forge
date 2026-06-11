#!/usr/bin/env node
/**
 * Renders registry/inventory.json into registry/INVENTORY.md —
 * the written inventory required before any v5 refactoring.
 * Regenerate any time with: node scripts/analyze-css.js && node scripts/generate-inventory-md.js
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const data = JSON.parse(fs.readFileSync(path.join(ROOT, "registry", "inventory.json"), "utf8"));
const { summary, classes, keyframes } = data;

const lines = [];
lines.push("# SDS Motion Forge — Source Inventory (v4.0.3 baseline)");
lines.push("");
lines.push(`Generated ${summary.generatedAt} from \`${summary.source}\` by \`scripts/analyze-css.js\`.`);
lines.push("This file is generated — do not hand-edit. The JSON source of truth is `registry/inventory.json`.");
lines.push("");
lines.push("## Totals");
lines.push("");
lines.push(`- Classes: **${summary.totals.classes}**`);
Object.entries(summary.byCategory).sort().forEach(([k, v]) => lines.push(`  - ${k}: ${v}`));
lines.push(`- Keyframes defined: **${summary.totals.keyframesDefined}**, referenced: **${summary.totals.keyframesReferenced}**`);
lines.push(`- Referenced but UNDEFINED keyframes: ${summary.totals.undefinedKeyframes.map(k => `\`${k}\``).join(", ") || "none"}`);
lines.push(`- Defined but unreferenced keyframes: ${summary.totals.unusedKeyframes.map(k => `\`${k}\``).join(", ") || "none"}`);
lines.push("");
lines.push("## Compositor safety");
lines.push("");
const unsafe = summary.compositorUnsafe;
const paintOnly = unsafe.filter(u => u.layout.length === 0);
const layoutAnim = unsafe.filter(u => u.layout.length > 0);
lines.push(`- Fully compositor-safe (transform/opacity/filter/clip-path only): **${summary.totals.classes - unsafe.length}**`);
lines.push(`- Paint-only offenders (box-shadow / border-color / background-position etc. — no layout): **${paintOnly.length}**`);
lines.push(`- Layout-triggering offenders (quarantine list for R4): **${layoutAnim.length}**`);
lines.push("");
lines.push("### Layout-triggering classes (quarantined, never silently changed — R1/R2)");
lines.push("");
lines.push("| Class | Layout properties animated |");
lines.push("|---|---|");
layoutAnim.forEach(u => lines.push(`| \`${u.name}\` | ${u.layout.join(", ")} |`));
lines.push("");
lines.push("## Duration usage (drives Phase 0 token scale)");
lines.push("");
lines.push("| Duration | Uses |");
lines.push("|---|---|");
Object.entries(summary.durationFrequency).forEach(([d, n]) => lines.push(`| \`${d}\` | ${n} |`));
lines.push("");
lines.push("## Easing usage (drives Phase 0 token scale)");
lines.push("");
lines.push("| Easing | Uses |");
lines.push("|---|---|");
Object.entries(summary.easingFrequency).forEach(([e, n]) => lines.push(`| \`${e}\` | ${n} |`));
lines.push("");
lines.push("## Full class inventory");
lines.push("");
lines.push("Legend: CS = compositor-safe, CH = targets children, PE = uses pseudo-elements.");
lines.push("");
for (const cat of ["text", "buttons", "inputs", "cards", "loaders", "scroll", "interactive", "modifiers", "infrastructure"]) {
  const items = classes.filter(c => c.category === cat);
  if (!items.length) continue;
  lines.push(`### ${cat} (${items.length})`);
  lines.push("");
  lines.push("| Class | Keyframes | Duration | Easing | CS | CH | PE | Custom props consumed |");
  lines.push("|---|---|---|---|---|---|---|---|");
  for (const c of items) {
    const durs = [...new Set(c.animations.map(a => a.duration).filter(Boolean))].join(", ");
    const eases = [...new Set(c.animations.map(a => a.easing).filter(Boolean))].join("; ");
    const kfs = c.keyframes.map(k => c.missingKeyframes.includes(k) ? `**${k} (MISSING)**` : k).join(", ");
    lines.push(`| \`${c.name}\` | ${kfs || "—"} | ${durs || "—"} | ${eases || "—"} | ${c.compositorSafe ? "✓" : "✗"} | ${c.targetsChildren ? "✓" : ""} | ${c.usesPseudoElements ? "✓" : ""} | ${c.customPropsUsed.join(", ") || "—"} |`);
  }
  lines.push("");
}
lines.push("## Known anomalies (pre-existing in published 4.0.3 — preserved, not fixed silently)");
lines.push("");
lines.push("1. **`sds-charOrbitBob` keyframes are referenced by `.sds-char-orbit .sds-char` but never defined.** The per-char bob does nothing in the published build; only the parent entrance (`sds-charOrbit`) animates. Fixing this changes visible behavior → requires explicit approval (logged for the compatibility report).");
lines.push("2. **`.sds-ink-bleed` is declared twice** (Section 1 and the v4 interactive base block at file end). The later declaration wins: `1.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)` instead of `var(--sds-duration) cubic-bezier(0.16, 1, 0.3, 1)`. The cascade result is the published contract; both declarations must be preserved in order.");
lines.push("3. **`@keyframes sds-jellyKf` exists in CSS but is also injected at runtime** by `motion-interactive.js` (`#__sds-jelly-kf` style tag). Harmless duplication; both must stay.");
lines.push("4. **`index.d.ts` unions name a few classes that do not exist as CSS selectors** (e.g. `sds-reveal-up`/`sds-reveal-down` vs actual `.sds-reveal-up-mask`/`.sds-reveal-down-mask`, `sds-bounce-drop` vs `.sds-bounce-drop-in`, `sds-zoom-far` vs `.sds-zoom-out-in`, `sds-spotlight-text` vs `.sds-spotlight`). Type-level only; types are advisory. Registry must record CSS truth and may add aliases later via RFC.");
lines.push("5. **Extra undocumented classes** beyond README counts: `sds-bounce-loop`, `sds-drop-bounce`, `sds-pendulum`, `sds-vibrate`, `sds-char-orbit` (v4 interactive base rules). They are published API and are inventoried above.");
lines.push("6. **`docs/index.html` embeds an inline copy of text-animation CSS and the interactive engine** — the docs page can diverge from the package. Phase 4 replaces this with single-artifact loading.");
lines.push("");

const out = path.join(ROOT, "registry", "INVENTORY.md");
fs.writeFileSync(out, lines.join("\n"));
console.log(`Wrote ${path.relative(ROOT, out)} (${lines.length} lines)`);

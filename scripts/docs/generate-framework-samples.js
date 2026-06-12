#!/usr/bin/env node
/**
 * Generates ROTATING framework snippet samples (Phase 4 §5):
 * at least 3 effects per category are injected into the React (Next.js) and
 * Angular example apps; their builds (CI) type-check the registry-generated
 * unions and component APIs against real compilers.
 *
 * Rotation is deterministic per ISO week, so successive weeks exercise
 * different effects while a given CI run is reproducible.
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..", "..");
const registry = JSON.parse(fs.readFileSync(path.join(ROOT, "registry", "motion.registry.json"), "utf8"));

function isoWeek(d = new Date()) {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const day = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  return Math.ceil((((date.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}
const WEEK = Number(process.env.SDS_SAMPLE_SEED ?? isoWeek());

const CATS = ["text", "buttons", "inputs", "cards", "loaders", "scroll"];
const picked = [];
for (const cat of CATS) {
  const pool = registry.classes
    .filter((c) => c.kind === "effect" && c.category === cat && !c.requiresJs)
    .sort((a, b) => a.name.localeCompare(b.name));
  for (let i = 0; i < 3; i++) {
    picked.push(pool[(WEEK * 7 + i * 5) % pool.length]);
  }
}

/* ── React (Next.js) sample page ─────────────────────────────── */
const reactLines = [];
reactLines.push(`"use client";`);
reactLines.push("");
reactLines.push("/* GENERATED rotating snippet sample (week " + WEEK + ") — scripts/docs/generate-framework-samples.js");
reactLines.push("   Builds in CI type-check the registry-generated effect unions. */");
reactLines.push(`import { SdsMotion, SdsText } from "@salkomdesignstudio/motion-forge-react";`);
reactLines.push("");
reactLines.push("export default function Snippets() {");
reactLines.push("  return (");
reactLines.push("    <main>");
for (const c of picked) {
  if (c.requiresCharSplit) {
    reactLines.push(`      <SdsText as="h2" effect="${c.name}">${c.displayName}</SdsText>`);
  } else if (c.category === "scroll") {
    reactLines.push(`      <SdsMotion effect="${c.name}" inView replay>${c.displayName}</SdsMotion>`);
  } else if (c.category === "buttons") {
    reactLines.push(`      <SdsMotion as="button" effect="${c.name}" duration="fast">${c.displayName}</SdsMotion>`);
  } else {
    reactLines.push(`      <SdsMotion effect="${c.name}" easing="spring">${c.displayName}</SdsMotion>`);
  }
}
reactLines.push("    </main>");
reactLines.push("  );");
reactLines.push("}");
fs.mkdirSync(path.join(ROOT, "examples", "nextjs", "app", "snippets"), { recursive: true });
fs.writeFileSync(path.join(ROOT, "examples", "nextjs", "app", "snippets", "page.tsx"), reactLines.join("\n") + "\n");

/* ── Angular sample component ────────────────────────────────── */
const ngTemplate = picked.map((c) => {
  if (c.requiresCharSplit) return `      <h2 sdsText="${c.name}">${c.displayName}</h2>`;
  if (c.category === "scroll") return `      <div sdsMotion="${c.name}" inView replay>${c.displayName}</div>`;
  if (c.category === "buttons") return `      <button sdsMotion="${c.name}" duration="fast">${c.displayName}</button>`;
  return `      <div sdsMotion="${c.name}" easing="spring">${c.displayName}</div>`;
}).join("\n");

const ng = `/* GENERATED rotating snippet sample (week ${WEEK}) — scripts/docs/generate-framework-samples.js
   Builds in CI type-check the registry-generated effect unions. */
import { Component } from "@angular/core";
import { SdsMotionDirective, SdsTextDirective } from "@salkomdesignstudio/motion-forge-angular";

@Component({
  selector: "app-snippets",
  standalone: true,
  imports: [SdsMotionDirective, SdsTextDirective],
  template: \`
    <section>
${ngTemplate}
    </section>
  \`,
})
export class SnippetsComponent {}
`;
fs.writeFileSync(path.join(ROOT, "examples", "angular", "src", "app", "snippets.component.ts"), ng);

console.log(`framework samples (week ${WEEK}): ${picked.length} effects -> nextjs/app/snippets/page.tsx, angular/src/app/snippets.component.ts`);
console.log("  " + picked.map((c) => c.name).join(", "));

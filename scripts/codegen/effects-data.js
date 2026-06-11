/**
 * Shared codegen helpers — every framework package generates its types and
 * artifacts from registry/motion.registry.json through this module (R3).
 * Never hand-maintain class lists in any package.
 */
const fs = require("fs");
const path = require("path");
const postcss = require("postcss");

const ROOT = path.join(__dirname, "..", "..");

function loadRegistry() {
  return JSON.parse(fs.readFileSync(path.join(ROOT, "registry", "motion.registry.json"), "utf8"));
}

/** Effects usable as standalone class names (excludes infrastructure). */
function effectClasses(registry) {
  return registry.classes.filter((c) => c.kind === "effect" || c.kind === "interactive");
}

function byCategory(registry, category) {
  return registry.classes.filter((c) => c.category === category);
}

/** TS string-literal union, sorted, 2-space indented. */
function tsUnion(names) {
  return names.map((n) => `  | '${n}'`).join("\n");
}

/**
 * Generated TypeScript module shared by react/angular/elements packages.
 * Includes per-effect metadata needed at runtime (char-split, children, js).
 */
function generateEffectsTs(pkgName) {
  const registry = loadRegistry();
  const effects = effectClasses(registry);
  const cats = ["text", "buttons", "inputs", "cards", "loaders", "scroll", "interactive"];
  const lines = [];
  lines.push("/**");
  lines.push(` * GENERATED FILE — do not edit.`);
  lines.push(` * Source of truth: registry/motion.registry.json (SDS Motion Forge v${registry.version}).`);
  lines.push(` * Regenerate with: npm run generate (in ${pkgName})`);
  lines.push(" */");
  lines.push("");
  for (const cat of cats) {
    const names = registry.classes
      .filter((c) => c.category === cat && (c.kind === "effect" || c.kind === "interactive"))
      .map((c) => c.name).sort();
    const typeName = "Sds" + cat[0].toUpperCase() + cat.slice(1) + "Effect";
    lines.push(`export type ${typeName} =`);
    lines.push(tsUnion(names) + ";");
    lines.push("");
  }
  lines.push("export type SdsEffect =");
  lines.push("  | SdsTextEffect");
  lines.push("  | SdsButtonsEffect");
  lines.push("  | SdsInputsEffect");
  lines.push("  | SdsCardsEffect");
  lines.push("  | SdsLoadersEffect");
  lines.push("  | SdsScrollEffect");
  lines.push("  | SdsInteractiveEffect;");
  lines.push("");
  lines.push("export type SdsDurationToken = " + registry.tokens.duration.map((t) => `'${t}'`).join(" | ") + ";");
  lines.push("export type SdsEasingToken = " + registry.tokens.easing.map((t) => `'${t}'`).join(" | ") + ";");
  lines.push("");
  lines.push("export interface SdsEffectMeta {");
  lines.push("  category: string;");
  lines.push("  requiresCharSplit: boolean;");
  lines.push("  requiresChildren: boolean;");
  lines.push("  requiresJs: boolean;");
  lines.push("  trigger: 'load' | 'hover' | 'focus' | 'scroll' | 'cursor';");
  lines.push("}");
  lines.push("");
  lines.push("export const SDS_EFFECT_META: Record<SdsEffect, SdsEffectMeta> = {");
  for (const c of effects.sort((a, b) => a.name.localeCompare(b.name))) {
    lines.push(`  '${c.name}': { category: '${c.category}', requiresCharSplit: ${c.requiresCharSplit}, requiresChildren: ${c.requiresChildren}, requiresJs: ${c.requiresJs}, trigger: '${c.trigger}' },`);
  }
  lines.push("};");
  lines.push("");
  lines.push("export const SDS_DURATION_TOKEN_VARS: Record<SdsDurationToken, string> = {");
  for (const t of registry.tokens.duration) lines.push(`  ${t}: 'var(--sds-duration-${t})',`);
  lines.push("};");
  lines.push("export const SDS_EASING_TOKEN_VARS: Record<SdsEasingToken, string> = {");
  for (const t of registry.tokens.easing) lines.push(`  ${t}: 'var(--sds-ease-${t})',`);
  lines.push("};");
  lines.push("");
  return lines.join("\n");
}

/**
 * Parse the source category files and return, per class name:
 *   rules: [{ selector, decls: [{prop, value}] }]   (own + nested, source order)
 * plus a global keyframes map name -> css text.
 */
function loadClassRules() {
  const catDir = path.join(ROOT, "src", "categories");
  const keyframes = {};
  const rules = {}; // class -> [{selector, decls}]
  for (const file of ["core", "text", "buttons", "inputs", "cards", "loaders", "scroll"]) {
    const root = postcss.parse(fs.readFileSync(path.join(catDir, `${file}.css`), "utf8"));
    root.walkAtRules(/^(-webkit-)?keyframes$/, (at) => {
      keyframes[at.params.trim()] = at.toString();
    });
    root.walkRules((rule) => {
      if (rule.parent && rule.parent.type === "atrule" && /keyframes|media|supports/.test(rule.parent.name)) return;
      const m = rule.selector.match(/^\.(sds-[a-z0-9-]+)/);
      if (!m) return;
      const cls = m[1];
      const decls = [];
      rule.walkDecls((d) => decls.push({ prop: d.prop, value: d.value, important: d.important }));
      (rules[cls] = rules[cls] || []).push({ selector: rule.selector.replace(/\s+/g, " ").trim(), decls });
    });
  }
  return { rules, keyframes };
}

module.exports = { ROOT, loadRegistry, effectClasses, byCategory, tsUnion, generateEffectsTs, loadClassRules };

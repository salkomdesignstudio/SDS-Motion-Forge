import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { Channels, Easing } from "./shared/css-values.js";

export interface CatalogEntry {
  name: string;
  displayName: string;
  category: string;
  kind: string;
  description: string;
  how: string | null;
  trigger: string;
  loop: boolean;
  aliasOf: string | null;
  deprecated: boolean;
  sinceVersion: string;
  requires: { charSplit: boolean; children: boolean; inputWrap: boolean; js: boolean; jsEngine: string | null };
  compositorSafe: boolean;
  motion: {
    via: string;
    keyframe: string | null;
    durationMs: number | null;
    delayMs: number | null;
    easing: Easing | null;
    easingRaw: string | null;
    iterations: number | "infinite" | null;
    fill: string | null;
    direction: string | null;
    stopCount: number;
    stops: Array<Channels & { o: number }>;
    from: Channels;
    to: Channels;
    ranges: Record<string, { min: number; max: number; first: number; last: number }>;
    families: string[];
    otherProps: string[];
    states: string[];
    transition: { property: string; durationMs: number | null; easing: Easing | null } | null;
  };
  markup: string | null;
}

export interface Catalog {
  schemaVersion: number;
  package: string;
  motionForgeVersion: string;
  rootPackageVersion: string;
  tokens: { durationMs: Record<string, number>; easing: Record<string, Easing> };
  install: { cdn: string; npm: string; css: string; scrollEngine: string; cursorEngine: string };
  frameworkPackagesPublished: boolean;
  reducedMotionNote: string;
  categories: Record<string, { count: number }>;
  modifiers: Array<{ name: string; description: string; delayMs?: number; durationMs?: number; loop?: boolean }>;
  animations: CatalogEntry[];
}

export const SUPPORTED_SCHEMA = 1;

/** dist/<file>.js and src/<file>.ts both sit one level below the package root. */
export function catalogPath(): string {
  const here = path.dirname(fileURLToPath(import.meta.url));
  return path.resolve(here, "..", "catalog", "catalog.json");
}

export class CatalogError extends Error {}

let cached: Catalog | null = null;
let byName: Map<string, CatalogEntry> | null = null;

export function loadCatalog(file: string = catalogPath()): Catalog {
  if (cached && file === catalogPath()) return cached;
  let raw: string;
  try {
    raw = fs.readFileSync(file, "utf8");
  } catch (e) {
    throw new CatalogError(`Motion Forge catalog not found at ${file}. Reinstall the package (npm i @salkomdesignstudio/motion-forge-mcp).`);
  }
  let data: Catalog;
  try {
    data = JSON.parse(raw) as Catalog;
  } catch {
    throw new CatalogError(`Motion Forge catalog at ${file} is not valid JSON. Reinstall the package.`);
  }
  if (data.schemaVersion !== SUPPORTED_SCHEMA) {
    throw new CatalogError(
      `Catalog schema ${data.schemaVersion} is not supported by this server (expects ${SUPPORTED_SCHEMA}). Update @salkomdesignstudio/motion-forge-mcp.`,
    );
  }
  if (!Array.isArray(data.animations) || !data.animations.length) throw new CatalogError("Catalog contains no animations.");
  if (file === catalogPath()) {
    cached = data;
    byName = new Map(data.animations.map((a) => [a.name, a]));
  }
  return data;
}

export function getEntry(name: string): CatalogEntry | undefined {
  const c = loadCatalog();
  if (!byName) byName = new Map(c.animations.map((a) => [a.name, a]));
  const clean = name.trim().toLowerCase().replace(/^\./, "");
  return byName.get(clean) ?? byName.get(clean.startsWith("sds-") ? clean : `sds-${clean}`);
}

/** Entries the mapper may recommend: real effects with measured timing. */
export function mappable(c: Catalog): CatalogEntry[] {
  return c.animations.filter(
    (a) => a.kind !== "modifier" && !a.deprecated && !a.aliasOf && a.category !== "infrastructure" && a.motion.durationMs != null && a.motion.families.length > 0,
  );
}

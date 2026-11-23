import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

/** Read from package.json so the version has one source of truth. */
export function packageVersion(): string {
  try {
    const here = path.dirname(fileURLToPath(import.meta.url));
    return (JSON.parse(fs.readFileSync(path.resolve(here, "..", "package.json"), "utf8")) as { version: string }).version;
  } catch {
    return "0.0.0";
  }
}

import { defineConfig } from "tsup";

export default defineConfig([
  {
    entry: ["src/index.ts"],
    format: ["esm", "cjs"],
    dts: true,
    sourcemap: true,
    clean: true,
    outExtension({ format }) {
      return { js: format === "cjs" ? ".cjs" : ".js" };
    },
  },
  {
    // CDN build: auto-registers the elements on load.
    // tsup appends ".global" to iife outputs -> dist/index.global.js
    entry: { index: "src/global.ts" },
    format: ["iife"],
    globalName: "SDSMotionElements",
    sourcemap: true,
    minify: true,
  },
]);

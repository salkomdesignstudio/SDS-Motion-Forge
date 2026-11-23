import { defineConfig } from "tsup";
export default defineConfig({
  entry: { index: "src/index.ts", bin: "src/bin.ts" },
  format: ["esm"],
  target: "node20",
  platform: "node",
  dts: { entry: { index: "src/index.ts" } },
  sourcemap: false,
  clean: true,
  splitting: true,
  // keep deps external: they are installed from npm; the tiny shared parser is inlined
  external: ["@modelcontextprotocol/server", "zod"],
});

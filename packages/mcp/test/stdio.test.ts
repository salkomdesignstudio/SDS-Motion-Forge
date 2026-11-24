// Spawns the built server and talks raw JSON-RPC over stdio, exactly like an MCP client.
import { spawn, type ChildProcessWithoutNullStreams } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

const PKG = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const BIN = path.join(PKG, "dist", "bin.js");

class Client {
  proc: ChildProcessWithoutNullStreams;
  private buf = "";
  private pending = new Map<number, (m: any) => void>();
  private id = 0;
  stdoutLines: string[] = [];
  stderr = "";
  constructor() {
    this.proc = spawn(process.execPath, [BIN], { stdio: ["pipe", "pipe", "pipe"] });
    this.proc.stderr.on("data", (d) => (this.stderr += d));
    this.proc.stdout.on("data", (d) => {
      this.buf += d;
      let i: number;
      while ((i = this.buf.indexOf("\n")) >= 0) {
        const line = this.buf.slice(0, i);
        this.buf = this.buf.slice(i + 1);
        if (!line.trim()) continue;
        this.stdoutLines.push(line);
        const m = JSON.parse(line); // throws if anything but JSON reaches stdout
        if (m.id !== undefined && this.pending.has(m.id)) this.pending.get(m.id)!(m);
      }
    });
  }
  rpc(method: string, params: unknown = {}): Promise<any> {
    return new Promise((res, rej) => {
      const id = ++this.id;
      const t = setTimeout(() => rej(new Error(`timeout: ${method}`)), 15000);
      this.pending.set(id, (m) => { clearTimeout(t); res(m); });
      this.proc.stdin.write(JSON.stringify({ jsonrpc: "2.0", id, method, params }) + "\n");
    });
  }
  async call(name: string, args: unknown) {
    const r = await this.rpc("tools/call", { name, arguments: args });
    const text = r.result?.content?.[0]?.text as string;
    return { raw: r, isError: !!r.result?.isError, text, json: text ? JSON.parse(text) : undefined };
  }
}

let c: Client;
beforeAll(async () => {
  if (!fs.existsSync(BIN)) throw new Error("Run `npm run build` before the stdio test.");
  c = new Client();
  const init = await c.rpc("initialize", { protocolVersion: "2025-06-18", capabilities: {}, clientInfo: { name: "test", version: "0" } });
  expect(init.result.serverInfo.name).toBe("motion-forge");
  c.proc.stdin.write(JSON.stringify({ jsonrpc: "2.0", method: "notifications/initialized" }) + "\n");
});
afterAll(() => c?.proc.kill());

describe("stdio server", () => {
  it("lists the six tools with schemas", async () => {
    const r = await c.rpc("tools/list");
    const names = r.result.tools.map((t: any) => t.name).sort();
    expect(names).toEqual(["compare_motion", "get_animation", "get_install_instructions", "list_categories", "map_motion_to_animation", "search_animations"]);
    for (const t of r.result.tools) expect(t.inputSchema.type).toBe("object");
  });
  it("searches", async () => {
    const r = await c.call("search_animations", { query: "pulse", category: "cards", limit: 3 });
    expect(r.isError).toBe(false);
    expect(r.json.results.length).toBeLessThanOrEqual(3);
    expect(r.json.results.every((x: any) => x.category === "cards")).toBe(true);
  });
  it("returns an animation with a snippet", async () => {
    const r = await c.call("get_animation", { name: "sds-bounce-in-up", framework: "react" });
    expect(r.json.timing.durationMs).toBe(850);
    expect(r.json.usage.code).toContain("className");
  });
  it("gives a helpful error for unknown names", async () => {
    const r = await c.call("get_animation", { name: "sds-does-not-exist" });
    expect(r.isError).toBe(true);
    expect(r.json.didYouMean).toBeDefined();
  });
  it("maps a generic spec", async () => {
    const r = await c.call("map_motion_to_animation", {
      format: "generic",
      spec: { duration: "500ms", from: { opacity: 0 }, to: { opacity: 1 }, trigger: "load" },
      limit: 2,
    });
    expect(r.isError).toBe(false);
    expect(r.json.results.length).toBe(2);
    expect(r.json.results[0].usage.notes.join(" ")).toMatch(/reduced-motion/);
    expect(r.json.results[0].match).not.toBe("exact");
  });
  it("maps Figma-shaped input and reports what it assumed", async () => {
    const r = await c.call("map_motion_to_animation", { format: "figma", spec: { transition: { type: "DISSOLVE", duration: 0.3, easing: { type: "EASE_OUT" } }, trigger: { type: "ON_HOVER" } } });
    expect(r.isError).toBe(false);
    expect(r.json.read.durationMs).toBe(300);
    expect(r.json.assumptions.length).toBeGreaterThan(0);
  });
  it("rejects invalid input without crashing", async () => {
    const bad = await c.call("map_motion_to_animation", { format: "generic", spec: { duration: { nope: true } } });
    expect(bad.isError).toBe(true);
    const empty = await c.call("map_motion_to_animation", { format: "generic", spec: {} });
    expect(empty.isError).toBe(true);
    const huge = await c.call("map_motion_to_animation", { format: "figma", spec: "x".repeat(300_000) });
    expect(huge.isError).toBe(true);
    const wrongType = await c.rpc("tools/call", { name: "search_animations", arguments: { limit: "ten" } });
    expect(wrongType.result?.isError === true || wrongType.error !== undefined).toBe(true);
    const ok = await c.call("list_categories", {});
    expect(ok.isError).toBe(false);
  });
  it("compares a design with an animation", async () => {
    const r = await c.call("compare_motion", { design: { format: "generic", spec: { duration: 400, properties: ["opacity"] } }, animation: "sds-bounce-in-up" });
    expect(r.json.dimensions.length).toBeGreaterThan(0);
    expect(r.json.notJudged).toContain("easing");
  });
  it("keeps every response under the size cap", async () => {
    const r = await c.call("search_animations", { query: "", limit: 25 });
    expect(r.text.length).toBeLessThanOrEqual(20_000);
  });
  it("keeps stdout pure JSON-RPC and logs to stderr", () => {
    expect(c.stdoutLines.length).toBeGreaterThan(5);
    for (const l of c.stdoutLines) expect(() => JSON.parse(l)).not.toThrow();
    expect(c.stderr).toMatch(/ready/);
  });
});

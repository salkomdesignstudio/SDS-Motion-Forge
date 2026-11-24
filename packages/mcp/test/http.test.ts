// Starts the built server in --http mode and talks to it like a web app would.
import { spawn, type ChildProcess } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

const PKG = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const BIN = path.join(PKG, "dist", "bin.js");
const APP = "https://app.example.com";

let proc: ChildProcess;
let base = "";
let stdout = "";

beforeAll(async () => {
  if (!fs.existsSync(BIN)) throw new Error("Run `npm run build` before the HTTP test.");
  proc = spawn(process.execPath, [BIN, "--http", "--port", "0", "--allow-origin", APP], { stdio: ["ignore", "pipe", "pipe"] });
  proc.stdout!.on("data", (d) => (stdout += d));
  base = await new Promise<string>((resolve, reject) => {
    const t = setTimeout(() => reject(new Error("server did not start")), 10000);
    proc.stderr!.on("data", (d) => {
      const m = /listening on (http:\/\/\S+)/.exec(String(d));
      if (m) { clearTimeout(t); resolve(m[1]); }
    });
  });
});
afterAll(() => proc?.kill());

const headers = { "content-type": "application/json", accept: "application/json, text/event-stream" };
const rpc = (body: unknown, extra: Record<string, string> = {}) =>
  fetch(base, { method: "POST", headers: { ...headers, ...extra }, body: JSON.stringify(body) });

/** Responses may be JSON or a single SSE event. */
async function parse(res: Response): Promise<any> {
  const text = await res.text();
  if (res.headers.get("content-type")?.includes("text/event-stream")) {
    const line = text.split("\n").find((l) => l.startsWith("data:"));
    return JSON.parse(line!.slice(5).trim());
  }
  return JSON.parse(text);
}

describe("streamable HTTP", () => {
  it("initializes and lists the tools", async () => {
    const init = await parse(await rpc({ jsonrpc: "2.0", id: 1, method: "initialize", params: { protocolVersion: "2025-06-18", capabilities: {}, clientInfo: { name: "web", version: "0" } } }));
    expect(init.result.serverInfo.name).toBe("motion-forge");
    const list = await parse(await rpc({ jsonrpc: "2.0", id: 2, method: "tools/list" }));
    expect(list.result.tools.length).toBe(6);
  });
  it("runs a tool call", async () => {
    const r = await parse(await rpc({ jsonrpc: "2.0", id: 3, method: "tools/call", params: { name: "search_animations", arguments: { query: "glow", limit: 2 } } }));
    expect(JSON.parse(r.result.content[0].text).results.length).toBe(2);
  });
  it("serves /health", async () => {
    const r = await fetch(new URL("/health", base));
    expect(((await r.json()) as { animations: number }).animations).toBe(629);
  });
  it("answers a CORS preflight for an allowed origin only", async () => {
    const ok = await fetch(base, { method: "OPTIONS", headers: { origin: APP, "access-control-request-method": "POST" } });
    expect(ok.status).toBe(204);
    expect(ok.headers.get("access-control-allow-origin")).toBe(APP);
    const bad = await fetch(base, { method: "OPTIONS", headers: { origin: "https://evil.example", "access-control-request-method": "POST" } });
    expect(bad.status).toBe(403);
    expect(bad.headers.get("access-control-allow-origin")).toBeNull();
  });
  it("sets CORS headers on real responses for allowed origins", async () => {
    const r = await rpc({ jsonrpc: "2.0", id: 4, method: "tools/list" }, { origin: APP });
    expect(r.headers.get("access-control-allow-origin")).toBe(APP);
  });
  it("rejects a disallowed origin and a foreign Host header", async () => {
    const o = await rpc({ jsonrpc: "2.0", id: 5, method: "tools/list" }, { origin: "https://evil.example" });
    expect(o.status).toBe(403);
    const h = await new Promise<number>((resolve, reject) => {
      import("node:http").then(({ request }) => {
        const u = new URL(base);
        const req = request({ host: u.hostname, port: u.port, path: "/mcp", method: "POST", headers: { ...headers, host: "attacker.example" } }, (res) => { res.resume(); resolve(res.statusCode ?? 0); });
        req.on("error", reject);
        req.end(JSON.stringify({ jsonrpc: "2.0", id: 6, method: "tools/list" }));
      });
    });
    expect(h).toBe(403);
  });
  it("rejects oversized bodies and unknown paths", async () => {
    const big = await fetch(base, { method: "POST", headers, body: "x".repeat(1_100_000) });
    expect(big.status).toBe(413);
    expect((await fetch(new URL("/nope", base))).status).toBe(404);
  });
  it("survives malformed JSON and keeps working", async () => {
    const bad = await fetch(base, { method: "POST", headers, body: "{not json" });
    expect(bad.status).toBeGreaterThanOrEqual(400);
    expect(bad.status).toBeLessThan(500);
    const ok = await parse(await rpc({ jsonrpc: "2.0", id: 7, method: "tools/list" }));
    expect(ok.result.tools.length).toBe(6);
  });
  it("writes nothing to stdout", () => {
    expect(stdout).toBe("");
  });
});

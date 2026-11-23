import http from "node:http";
import type { AddressInfo } from "node:net";
import {
  createMcpHandler,
  hostHeaderValidationResponse,
  localhostAllowedHostnames,
  originValidationResponse,
  localhostAllowedOrigins,
} from "@modelcontextprotocol/server";
import { createServer } from "./server.js";
import type { Catalog } from "./catalog.js";

export interface HttpOptions {
  port: number;
  host: string;
  /** Extra origins (full origin, e.g. https://app.example.com) allowed to call from a browser. */
  allowOrigins: string[];
  /** Extra Host header values (hostnames) accepted, for use behind a proxy. */
  allowHosts: string[];
  log: (msg: string) => void;
}

export const MAX_BODY_BYTES = 1_000_000;
const ENDPOINT = "/mcp";

const LOOPBACK = new Set(["127.0.0.1", "localhost", "::1", "[::1]"]);

function hostnameOf(origin: string): string | null {
  try { return new URL(origin).hostname; } catch { return null; }
}

class BodyTooLarge extends Error {}

function readBody(req: http.IncomingMessage): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    let size = 0;
    req.on("data", (c: Buffer) => {
      size += c.length;
      if (size > MAX_BODY_BYTES) { req.pause(); reject(new BodyTooLarge()); return; }
      chunks.push(c);
    });
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

function sendJson(res: http.ServerResponse, status: number, body: unknown, headers: Record<string, string> = {}): void {
  const text = JSON.stringify(body);
  res.writeHead(status, { "content-type": "application/json", "content-length": Buffer.byteLength(text), ...headers });
  res.end(text);
}

export async function startHttp(version: string, catalog: Catalog, o: HttpOptions): Promise<{ url: string; close: () => Promise<void> }> {
  const handler = createMcpHandler(() => createServer(version, catalog), { onerror: (e) => o.log(`http: ${e.message}`) });

  const allowedHostnames = [...new Set([...localhostAllowedHostnames(), ...o.allowHosts, ...(LOOPBACK.has(o.host) ? [] : [o.host])])];
  const extraOriginHosts = o.allowOrigins.map(hostnameOf).filter((h): h is string => !!h);
  const allowedOriginHostnames = [...new Set([...localhostAllowedOrigins(), ...extraOriginHosts])];
  const localOriginHosts = new Set(localhostAllowedOrigins());
  const allowedOrigins = new Set(o.allowOrigins.map((x) => { try { return new URL(x).origin; } catch { return x; } }));

  const server = http.createServer(async (req, res) => {
    const origin = req.headers.origin;
    const cors: Record<string, string> = {};
    // Only an explicitly allowed browser origin gets CORS headers; same-machine non-browser clients send no Origin.
    const originHost = origin ? hostnameOf(origin) : null;
    if (origin && (allowedOrigins.has(origin) || (originHost !== null && localOriginHosts.has(originHost)))) {
      cors["access-control-allow-origin"] = origin;
      cors["vary"] = "Origin";
      cors["access-control-expose-headers"] = "mcp-session-id, mcp-protocol-version";
    }
    try {
      const url = new URL(req.url ?? "/", `http://${req.headers.host ?? "localhost"}`);
      const request = new Request(url, {
        method: req.method,
        headers: Object.fromEntries(Object.entries(req.headers).filter(([, v]) => typeof v === "string") as Array<[string, string]>),
      });
      const rejected = hostHeaderValidationResponse(request, allowedHostnames) ?? originValidationResponse(request, allowedOriginHostnames);
      if (rejected) {
        res.writeHead(rejected.status, { "content-type": "application/json", ...cors });
        res.end(await rejected.text());
        return;
      }
      if (req.method === "OPTIONS") {
        res.writeHead(204, {
          ...cors,
          "access-control-allow-methods": "POST, GET, DELETE, OPTIONS",
          "access-control-allow-headers": "content-type, accept, mcp-protocol-version, mcp-session-id, last-event-id",
          "access-control-max-age": "600",
        });
        res.end();
        return;
      }
      if (url.pathname === "/health" && req.method === "GET") {
        sendJson(res, 200, { ok: true, name: "motion-forge", version, motionForgeVersion: catalog.motionForgeVersion, animations: catalog.animations.length }, cors);
        return;
      }
      if (url.pathname !== ENDPOINT) { sendJson(res, 404, { error: `Not found. The MCP endpoint is ${ENDPOINT}.` }, cors); return; }

      if (Number(req.headers["content-length"] ?? 0) > MAX_BODY_BYTES) throw new BodyTooLarge();
      const body = req.method === "POST" ? await readBody(req) : undefined;
      const full = new Request(url, {
        method: req.method,
        headers: request.headers,
        body: body && body.length ? new Uint8Array(body) : undefined,
      });
      const response = await handler.fetch(full);
      const headers: Record<string, string> = { ...cors };
      response.headers.forEach((v, k) => { headers[k] = v; });
      res.writeHead(response.status, headers);
      if (!response.body) { res.end(); return; }
      const reader = response.body.getReader();
      req.on("close", () => { void reader.cancel().catch(() => undefined); });
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        res.write(value);
      }
      res.end();
    } catch (e) {
      if (e instanceof BodyTooLarge) {
        if (!res.headersSent) sendJson(res, 413, { error: `Request body exceeds ${MAX_BODY_BYTES} bytes.` }, { ...cors, connection: "close" });
        res.on("finish", () => req.destroy());
        return;
      }
      o.log(`http error: ${e instanceof Error ? e.message : String(e)}`);
      if (!res.headersSent) sendJson(res, 500, { error: "Internal error." }, cors);
      else res.end();
    }
  });
  server.requestTimeout = 30_000;
  server.headersTimeout = 10_000;

  await new Promise<void>((resolve, reject) => {
    server.once("error", reject);
    server.listen(o.port, o.host, () => resolve());
  });
  const addr = server.address() as AddressInfo;
  const shown = addr.family === "IPv6" ? `[${addr.address}]` : addr.address;
  return {
    url: `http://${shown}:${addr.port}${ENDPOINT}`,
    close: async () => { await handler.close(); await new Promise<void>((r) => server.close(() => r())); },
  };
}

#!/usr/bin/env node
// In stdio mode, stdout belongs to the MCP protocol. Anything a human should read goes to stderr.
import { StdioServerTransport } from "@modelcontextprotocol/server/stdio";
import { CatalogError, loadCatalog } from "./catalog.js";
import { createServer } from "./server.js";
import { packageVersion } from "./version.js";

const log = (msg: string) => process.stderr.write(`[motion-forge-mcp] ${msg}\n`);

// Never let a stray console.log corrupt the protocol stream.
console.log = (...a: unknown[]) => log(a.map(String).join(" "));
console.info = console.log;
console.debug = console.log;

const HELP = `motion-forge-mcp: MCP server for SDS Motion Forge.

  npx -y @salkomdesignstudio/motion-forge-mcp           stdio (editors and desktop apps)
  npx -y @salkomdesignstudio/motion-forge-mcp --http    Streamable HTTP (web apps, remote clients)

HTTP options:
  --port <n>            default 3333 (0 picks a free port)
  --host <addr>         default 127.0.0.1 (loopback only; any other value exposes the server, and there is no authentication)
  --allow-origin <url>  let a browser app at this origin call the server (repeatable)
  --allow-host <name>   accept this Host header, for use behind a proxy (repeatable)
`;

interface HttpArgs { port: number; host: string; allowOrigins: string[]; allowHosts: string[] }

function parseHttpArgs(args: string[]): HttpArgs | string {
  const out: HttpArgs = { port: 3333, host: "127.0.0.1", allowOrigins: [], allowHosts: [] };
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === "--http") continue;
    const v = args[++i];
    if (a === "--port") {
      const n = Number(v);
      if (v === undefined || !Number.isInteger(n) || n < 0 || n > 65535) return "--port needs a number from 0 to 65535";
      out.port = n;
    } else if (a === "--host") {
      if (!v) return "--host needs a value";
      out.host = v;
    } else if (a === "--allow-origin") {
      if (!v || !/^https?:\/\/[^/\s]+$/.test(v)) return "--allow-origin needs an origin such as https://app.example.com (no path)";
      out.allowOrigins.push(v);
    } else if (a === "--allow-host") {
      if (!v) return "--allow-host needs a value";
      out.allowHosts.push(v);
    } else {
      return `unknown option ${a}. Run with --help.`;
    }
  }
  return out;
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  if (args[0] === "--version" || args[0] === "-v") { process.stderr.write(packageVersion() + "\n"); return; }
  if (args[0] === "--help" || args[0] === "-h") { process.stderr.write(HELP); return; }

  if (args.includes("--http")) {
    const opts = parseHttpArgs(args);
    if (typeof opts === "string") { log(opts); process.exit(2); }
    const catalog = loadCatalog();
    const { startHttp } = await import("./http.js");
    const h = await startHttp(packageVersion(), catalog, { ...opts, log });
    const stop = async () => { try { await h.close(); } finally { process.exit(0); } };
    process.on("SIGINT", stop);
    process.on("SIGTERM", stop);
    if (!["127.0.0.1", "localhost", "::1"].includes(opts.host)) log(`WARNING: bound to ${opts.host}. The server is read-only and holds only public library data, but it has no authentication.`);
    log(`listening on ${h.url} (Motion Forge ${catalog.motionForgeVersion}, ${catalog.animations.length} animations)`);
    return;
  }

  const catalog = loadCatalog();
  const server = createServer(packageVersion(), catalog);
  const transport = new StdioServerTransport();
  const shutdown = async () => { try { await server.close(); } finally { process.exit(0); } };
  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
  process.stdin.on("end", () => { void shutdown(); });
  await server.connect(transport);
  log(`ready: Motion Forge ${catalog.motionForgeVersion}, ${catalog.animations.length} animations`);
}

process.on("uncaughtException", (e) => { log(`fatal: ${e instanceof Error ? e.message : String(e)}`); process.exit(1); });
process.on("unhandledRejection", (e) => { log(`unhandled rejection: ${e instanceof Error ? e.message : String(e)}`); });

main().catch((e) => {
  log(e instanceof CatalogError ? e.message : `failed to start: ${e instanceof Error ? e.message : String(e)}`);
  process.exit(1);
});

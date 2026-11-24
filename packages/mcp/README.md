# @salkomdesignstudio/motion-forge-mcp

An [MCP](https://modelcontextprotocol.io) server for [SDS Motion Forge](https://github.com/salkomdesignstudio/SDS-Motion-Forge), the CSS-only animation library. It lets an AI assistant:

- **find and install** animations (452 effects across text, cards, loaders, scroll, cursor and GSAP), and
- **map a design's motion to the closest Motion Forge animation**, for example from Figma, with a score that explains itself.

It is offline and deterministic. There are no network calls and no LLM calls at runtime: the answers come from a catalog generated from the library's own CSS at build time.

## Setup

Requires Node 20 or newer.

**Claude Code**

```bash
claude mcp add motion-forge -- npx -y @salkomdesignstudio/motion-forge-mcp
```

**Claude Desktop** (`claude_desktop_config.json`)

```json
{
  "mcpServers": {
    "motion-forge": {
      "command": "npx",
      "args": ["-y", "@salkomdesignstudio/motion-forge-mcp"]
    }
  }
}
```

On Windows, if Claude Desktop cannot start `npx`, use `"command": "cmd", "args": ["/c", "npx", "-y", "@salkomdesignstudio/motion-forge-mcp"]`.

**Cursor** (`.cursor/mcp.json`, or Settings → MCP), **Windsurf** (`~/.codeium/windsurf/mcp_config.json`), **Cline** and other clients that use the standard `mcpServers` block take the same JSON as Claude Desktop above.

**VS Code** (`.vscode/mcp.json`, or the `MCP: Add Server` command)

```json
{
  "servers": {
    "motion-forge": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@salkomdesignstudio/motion-forge-mcp"]
    }
  }
}
```

**Zed** (`settings.json`)

```json
{
  "context_servers": {
    "motion-forge": {
      "command": { "path": "npx", "args": ["-y", "@salkomdesignstudio/motion-forge-mcp"] }
    }
  }
}
```

**Antigravity, Devin and other IDEs or agents**: add a custom MCP server in the app's MCP settings with command `npx` and arguments `-y @salkomdesignstudio/motion-forge-mcp` (stdio). If the app only accepts a URL, or runs in the cloud and cannot start local processes, use the HTTP mode below. Config locations and field names differ between these apps and change between releases, so check each app's MCP documentation; the server itself speaks standard MCP and has no client-specific behaviour.

Restart the client, then ask for something like "find a blur-in heading animation from Motion Forge".

### Web apps and remote clients (HTTP)

Browsers and cloud agents cannot spawn a process, so the same server also speaks Streamable HTTP:

```bash
npx -y @salkomdesignstudio/motion-forge-mcp --http --port 3333
# listening on http://127.0.0.1:3333/mcp
```

Point any MCP client that takes a URL at `http://127.0.0.1:3333/mcp`. For a browser app, allow its origin explicitly:

```bash
npx -y @salkomdesignstudio/motion-forge-mcp --http --allow-origin https://app.example.com
```

```js
// browser, with the official client SDK
import { Client } from "@modelcontextprotocol/client";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/client/streamableHttp";

const client = new Client({ name: "my-app", version: "1.0.0" });
await client.connect(new StreamableHTTPClientTransport(new URL("http://127.0.0.1:3333/mcp")));
const res = await client.callTool({ name: "search_animations", arguments: { query: "blur text", limit: 3 } });
```

Or call it with plain `fetch`: `POST /mcp` with `Content-Type: application/json`, `Accept: application/json, text/event-stream` and a JSON-RPC body. `GET /health` returns the version and animation count.

Safety defaults: it binds to `127.0.0.1` only, validates the `Host` and `Origin` headers (DNS-rebinding protection), sends CORS headers only to origins you list, caps request bodies at 1 MB and keeps no sessions. The server is read-only and holds only public library data, but it has **no authentication**: if you bind it to another address with `--host` (or place it behind a proxy with `--allow-host`), put authentication in front of it. Reaching it from a cloud agent such as a hosted Devin session needs it deployed somewhere that agent can reach, or a tunnel to your machine.

## Tools

| Tool | What it does |
|---|---|
| `search_animations` | Keyword search with filters (`category`, `trigger`, `loop`, `no_js`). At most 25 results. |
| `get_animation` | One animation by class name: description, measured duration and easing, what it animates, requirements, usage snippet for `html`, `react`, `angular` or `tailwind`. |
| `list_categories` | Categories with counts, modifier classes, duration and easing tokens. |
| `get_install_instructions` | Install steps per framework. With `animation` it adds a snippet and applies `duration_ms`, `delay_ms`, `easing` and `loop` overrides. |
| `map_motion_to_animation` | Takes a motion spec (generic fields or raw Figma output) and returns the closest animations, each with a score, the reasons, and the overrides to apply. |
| `compare_motion` | Compares a design's spec with another spec, or with a named animation, dimension by dimension. |

Every snippet relies on the library CSS, which includes a `prefers-reduced-motion` override for every effect, and says so in its notes. The React, Angular and Tailwind wrapper packages are not published yet, so snippets are class-based and import nothing from them.

## Figma to code workflow

1. In Figma, select the prototype interaction or layer with the motion and have the assistant call Figma's `get_motion_context` (Figma MCP server).
2. Pass its output, unchanged, to `map_motion_to_animation` with `format: "figma"`.
3. Read the result: the closest animation, why it scored what it did, what differs, and a snippet with the duration, delay and loop overrides already applied.
4. Use `compare_motion` afterwards to check the chosen animation against the design again.

```jsonc
// map_motion_to_animation
{
  "format": "figma",
  "spec": { /* the get_motion_context output */ },
  "limit": 3,
  "framework": "react"
}
```

Not using Figma? Pass the fields directly:

```jsonc
{
  "format": "generic",
  "spec": {
    "duration": "400ms",
    "easing": "cubic-bezier(0.22, 1, 0.36, 1)",
    "from": { "opacity": 0, "translateY": "24px" },
    "to":   { "opacity": 1, "translateY": 0 },
    "trigger": "scroll",
    "target": "text"
  }
}
```

### How the Figma reader works, and what is not verified

The Figma reader walks the JSON (or text) it receives and picks up values by the names Figma itself uses: `duration`, `delay`, `easing` and its enum names (`EASE_OUT`, `GENTLE`, `BOUNCY`, custom bezier and spring values), trigger names (`ON_HOVER`, `ON_CLICK`, `AFTER_TIMEOUT`, …), transition types (`DISSOLVE`, `MOVE_IN`, `SMART_ANIMATE`, …) and from/to property values. Its exact assumptions are returned in `assumptions` on every call, for example when a duration of `0.3` was read as seconds, when an easing was approximated, or when `SMART_ANIMATE` gave no list of changed properties.

It has been tested against inputs shaped from Figma's published API names, **not against captured `get_motion_context` output**. If a real response uses different field names, the affected field shows up as "not judged" rather than a wrong match. Reports with a sample are welcome.

## How scoring works

Scores are calculated, not generated. Each dimension the spec provides is compared with the animation's measured values from the library CSS:

| Dimension | Weight | Compared by |
|---|---|---|
| properties | 0.34 | overlap of animated property families (opacity, translate, scale, rotate, blur, clip, …); extras on the animation cost half |
| shape | 0.20 | direction and size of the change per property, from start to end values |
| easing | 0.14 | mean distance between sampled progress curves (cubic-bezier, steps and springs) |
| duration | 0.12 | log ratio, so 2× faster and 2× slower score the same |
| trigger | 0.12 | same trigger scores fully; hover and click on a class-based effect score half, because the class has to be toggled |
| loop | 0.05 | plays once or repeats |
| stagger | 0.03 | whether the effect animates children or characters in sequence |

Dimensions the spec leaves out are not judged and the rest are re-weighted. Three rules keep the score honest:

- A spec with no animated properties cannot score above 55, and one with weak property overlap cannot score above 50. Timing alone does not show that the motion matches.
- If less than 60% of the weight could be judged, the result cannot count as `close`.
- Scores never reach 100. `close` is 80 to 99, `partial` 60 to 79, `loose` below 60. A result means "similar", never "identical": check it in the browser.

## Limits and safety

- Every response is under 20 KB; search returns at most 25 results and mapping at most 8.
- Figma input over 200,000 characters, nested too deeply or containing a cycle is rejected with a message.
- All tools are read-only. The server reads one file, `catalog/catalog.json`, from its own package.
- In stdio mode stdout carries only the protocol; logs go to stderr. HTTP mode is covered above.

## Versioning

The package version follows semver for the tools and their output fields. The catalog is stamped with the Motion Forge version it was built from (`list_categories` returns it) and with a schema number; the server refuses a catalog with a schema it does not understand and tells the user to update. A new Motion Forge release ships as a new minor version of this package, with the catalog rebuilt from that release.

## Development

```bash
npm run build -w packages/mcp   # generate catalog, verify it, bundle
npm test -w packages/mcp        # unit, golden and stdio integration tests
```

`npm run build` fails when an animation lacks a description, a demo markup, a trigger, or a duration derivable from the CSS (a short allowlist covers helper classes and JavaScript-driven cursor effects). CI runs this on every change.

## License

MIT

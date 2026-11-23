/**
 * MCP pages for the docs site (generated; called from generate-static-pages.js).
 *
 *   /mcp/                       landing: what it is, set up in a minute, tools, prompts, FAQ
 *   /mcp/clients/               choose your tool (grouped), shared command with copy button
 *   /mcp/clients/<tool>/        one guide per tool: Setup, Usage, Remove, Troubleshooting
 *
 * One table (CLIENTS) drives the chooser, the guides, the landing list, the home page and the docs
 * section, so a command or a path is written exactly once.
 */
"use strict";

const { icon, sbIcon } = require("./icons");
const { tool, toolFor } = require("./tool-icons");
/** tile with the real logo of a guide (generic glyph when there is no logo, e.g. Zed or web apps) */
const toolTile = (c, extra = "") => (toolFor(c.slug) ? `<span class="ic ic-tool${extra ? " " + extra : ""}">${toolFor(c.slug)}</span>` : icon(GROUP_ICON[c.group] || "mcp", extra));
const toolBare = (c) => (toolFor(c.slug) ? `<span class="sbi sbi-tool">${toolFor(c.slug)}</span>` : sbIcon(GROUP_ICON[c.group] || "mcp"));
const GROUP_ICON = { Terminal: "terminal", Editors: "clients", "Desktop and web": "globe", Other: "mcp" };

const MCP_PKG = "@salkomdesignstudio/motion-forge-mcp";
const NPX = `npx -y ${MCP_PKG}`;
const SERVER = "motion-forge";
const STDIO_JSON = (name = "mcpServers") => JSON.stringify({ [name]: { [SERVER]: { command: "npx", args: ["-y", MCP_PKG] } } }, null, 2);
const WIN_JSON = JSON.stringify({ mcpServers: { [SERVER]: { command: "cmd", args: ["/c", "npx", "-y", MCP_PKG] } } }, null, 2);

const GROUPS = ["Terminal", "Editors", "Desktop and web", "Other"];

const cursorLink = () => {
  const cfg = Buffer.from(JSON.stringify({ command: "npx", args: ["-y", MCP_PKG] })).toString("base64");
  return `cursor://anysphere.cursor-deeplink/mcp/install?name=${SERVER}&config=${encodeURIComponent(cfg)}`;
};
const vscodeLink = () => `vscode:mcp/install?${encodeURIComponent(JSON.stringify({ name: SERVER, type: "stdio", command: "npx", args: ["-y", MCP_PKG] }))}`;

/** step = { t: title, p?: paragraph html, code?: string, lang?: string } */
const CLIENTS = [
  {
    slug: "claude-code", name: "Claude Code", group: "Terminal",
    blurb: "Add Motion Forge from your terminal with one command.",
    lede: "Add Motion Forge to Claude Code with one command, then check it with /mcp.",
    steps: [
      { t: "Add the server", p: "Run this once. <code>--scope user</code> makes it available in every project.", code: `claude mcp add --scope user ${SERVER} -- ${NPX}` },
      { t: "Start Claude Code", code: "claude" },
      { t: "Check it", p: "Type <code>/mcp</code>. <b>motion-forge</b> should be listed as connected." },
    ],
    remove: [{ t: "Remove the server", code: `claude mcp remove ${SERVER}` }],
  },
  {
    slug: "codex", name: "Codex", group: "Terminal",
    blurb: "Add the server from the Codex CLI or its config file.",
    lede: "Add Motion Forge to the Codex CLI with one command, or edit its config file.",
    steps: [
      { t: "Add the server", code: `codex mcp add ${SERVER} -- ${NPX}` },
      { t: "Or edit the config file", p: "Open <code>~/.codex/config.toml</code> and add:", lang: "toml", code: `[mcp_servers.${SERVER}]\ncommand = "npx"\nargs = ["-y", "${MCP_PKG}"]` },
      { t: "Restart Codex", p: "Start a new session so it picks up the server." },
    ],
    remove: [{ t: "Remove the server", code: `codex mcp remove ${SERVER}`, p: "Or delete the <code>[mcp_servers.motion-forge]</code> block from the config file." }],
  },
  {
    slug: "gemini-cli", name: "Gemini CLI", group: "Terminal",
    blurb: "One command, or a block in settings.json.",
    lede: "Add Motion Forge to the Gemini CLI with one command, or edit settings.json.",
    steps: [
      { t: "Add the server", code: `gemini mcp add ${SERVER} npx -y ${MCP_PKG}` },
      { t: "Or edit settings.json", p: "Open <code>~/.gemini/settings.json</code> and add:", lang: "json", code: STDIO_JSON() },
      { t: "Restart the CLI", p: "Run <code>/mcp</code> inside it to check that <b>motion-forge</b> is connected." },
    ],
    remove: [{ t: "Remove the server", code: `gemini mcp remove ${SERVER}` }],
  },
  {
    slug: "cursor", name: "Cursor", group: "Editors",
    blurb: "One click, or paste a block into mcp.json.",
    lede: "Install Motion Forge in Cursor with one click, or paste the config yourself.",
    deeplink: { label: "Add to Cursor", sub: "Needs Cursor installed", href: cursorLink() },
    steps: [
      { t: "Click Add to Cursor", p: "Cursor opens and asks you to confirm the server. Or paste this into <code>~/.cursor/mcp.json</code> (global) or <code>.cursor/mcp.json</code> (one project):", lang: "json", code: STDIO_JSON() },
      { t: "Turn it on", p: "Open Cursor Settings, then MCP, and switch <b>motion-forge</b> on." },
    ],
    remove: [{ t: "Remove the server", p: "In Cursor Settings, open MCP and remove <b>motion-forge</b>, or delete its block from <code>mcp.json</code>." }],
  },
  {
    slug: "vscode", name: "VS Code", group: "Editors",
    blurb: "One click, for Copilot's agent mode.",
    lede: "Add Motion Forge to VS Code for use with Copilot's agent mode.",
    deeplink: { label: "Add to VS Code", sub: "Needs VS Code installed", href: vscodeLink() },
    steps: [
      { t: "Click Add to VS Code", p: "VS Code opens and asks you to install the server. Or create <code>.vscode/mcp.json</code> (one project) with:", lang: "json", code: JSON.stringify({ servers: { [SERVER]: { type: "stdio", command: "npx", args: ["-y", MCP_PKG] } } }, null, 2) },
      { t: "Or use the command palette", p: "Press Ctrl+Shift+P (Cmd+Shift+P on Mac), run <b>MCP: Add Server</b>, choose <b>Command (stdio)</b> and enter:", code: NPX },
      { t: "Start it", p: "Run <b>MCP: List Servers</b>, pick <b>motion-forge</b> and choose <b>Start Server</b>. Then use Copilot Chat in Agent mode." },
    ],
    remove: [{ t: "Remove the server", p: "Run <b>MCP: List Servers</b>, pick <b>motion-forge</b> and choose <b>Uninstall</b>, or delete its block from <code>mcp.json</code>." }],
  },
  {
    slug: "windsurf", name: "Windsurf", group: "Editors",
    blurb: "Add the standard block to mcp_config.json.",
    lede: "Add Motion Forge to Windsurf with the standard MCP config block.",
    steps: [
      { t: "Open the config", p: "In Cascade, open the MCP servers panel and choose to edit the config, or open <code>~/.codeium/windsurf/mcp_config.json</code>." },
      { t: "Add the server", lang: "json", code: STDIO_JSON() },
      { t: "Refresh", p: "Refresh the MCP servers panel. <b>motion-forge</b> should show its six tools." },
    ],
    remove: [{ t: "Remove the server", p: "Delete the <code>motion-forge</code> block from <code>mcp_config.json</code> and refresh." }],
  },
  {
    slug: "zed", name: "Zed", group: "Editors",
    blurb: "A context server in settings.json.",
    lede: "Add Motion Forge to Zed as a context server.",
    steps: [
      { t: "Open settings", p: "Run <b>zed: open settings</b> from the command palette." },
      { t: "Add the server", lang: "json", code: JSON.stringify({ context_servers: { [SERVER]: { command: { path: "npx", args: ["-y", MCP_PKG] } } } }, null, 2) },
      { t: "Check it", p: "Open the Agent panel's settings. <b>motion-forge</b> should show a green dot." },
    ],
    remove: [{ t: "Remove the server", p: "Delete the <code>motion-forge</code> entry from <code>context_servers</code>." }],
  },
  {
    slug: "antigravity", name: "Antigravity", group: "Editors",
    blurb: "Add a custom server in the MCP settings.",
    lede: "Add Motion Forge to Antigravity as a custom MCP server.",
    note: "Menu names in Antigravity change between releases. The server itself is standard MCP, so the same command and block work wherever the app accepts a custom server. This guide has not been tested in every Antigravity version.",
    steps: [
      { t: "Open the MCP settings", p: "In the agent panel, open the MCP servers menu and choose to manage servers or view the raw config." },
      { t: "Add the server", p: "Add this block to the raw config (<code>mcp_config.json</code>):", lang: "json", code: STDIO_JSON() },
      { t: "Refresh", p: "Refresh the server list. <b>motion-forge</b> should appear with its tools." },
    ],
    remove: [{ t: "Remove the server", p: "Delete the <code>motion-forge</code> block from the raw config and refresh." }],
  },
  {
    slug: "devin-desktop", name: "Devin Desktop", group: "Editors",
    blurb: "Add a custom server in the MCP settings.",
    lede: "Add Motion Forge to Devin Desktop as a custom MCP server.",
    note: "This guide uses the standard MCP config block. Devin's menus and config file location can differ by version, and it has not been tested in every release. Devin running in the cloud cannot start local commands: see Web apps and remote clients.",
    steps: [
      { t: "Open the MCP settings", p: "Open the app's settings and find the MCP servers section." },
      { t: "Add a custom server", p: "Choose a stdio server with this command, or paste the block into the raw config:", code: NPX },
      { t: "Raw config block", lang: "json", code: STDIO_JSON() },
      { t: "Restart", p: "Restart the app. <b>motion-forge</b> should be listed with its tools." },
    ],
    remove: [{ t: "Remove the server", p: "Remove <b>motion-forge</b> from the MCP servers list in settings." }],
  },
  {
    slug: "claude-desktop", name: "Claude Desktop", group: "Desktop and web",
    blurb: "Add the server in the developer settings.",
    lede: "Add Motion Forge to the Claude desktop app.",
    steps: [
      { t: "Open the config", p: "Open Settings, then Developer, then <b>Edit Config</b>. This opens <code>claude_desktop_config.json</code>." },
      { t: "Add the server", lang: "json", code: STDIO_JSON() },
      { t: "Windows: if it will not start", p: "Desktop apps on Windows sometimes cannot launch <code>npx</code> directly. Use this instead:", lang: "json", code: WIN_JSON },
      { t: "Restart Claude", p: "Quit and reopen the app. Motion Forge appears in the tools menu of a new chat." },
    ],
    remove: [{ t: "Remove the server", p: "Delete the <code>motion-forge</code> block from the config file and restart Claude." }],
  },
  {
    slug: "web-apps", name: "Web apps and remote clients", group: "Desktop and web",
    blurb: "Run the HTTP server for browsers and cloud agents.",
    lede: "Browsers and cloud agents cannot start a local command, so Motion Forge also speaks MCP over HTTP.",
    steps: [
      { t: "Start the HTTP server", p: "It listens on <code>127.0.0.1</code> only by default:", code: `${NPX} --http --port 3333` },
      { t: "Point a client at it", p: "Any MCP client that takes a URL can use:", code: "http://127.0.0.1:3333/mcp" },
      { t: "Call it from your own web app", p: "Allow your app's origin, then call it with <code>fetch</code>:", lang: "js", code: `// start the server with: ${NPX} --http --allow-origin https://app.example.com\nconst res = await fetch("http://127.0.0.1:3333/mcp", {\n  method: "POST",\n  headers: { "content-type": "application/json", accept: "application/json, text/event-stream" },\n  body: JSON.stringify({\n    jsonrpc: "2.0", id: 1, method: "tools/call",\n    params: { name: "search_animations", arguments: { query: "blur heading", limit: 3 } },\n  }),\n});` },
      { t: "Hosted agents", p: "ChatGPT, claude.ai and cloud agents need a public HTTPS address, not localhost. Run the server on a host you control and put authentication in front of it: the server has none of its own. It is read-only and holds only public library data." },
    ],
    remove: [{ t: "Stop it", p: "Press Ctrl+C in the terminal running the server, and remove the connector from the client." }],
    extraTrouble: [["Browser says the request was blocked", "Start the server with <code>--allow-origin</code> set to your app's exact origin, for example <code>https://app.example.com</code> (no path)."], ["Port already in use", "Pick another port with <code>--port</code>, or use <code>--port 0</code> to let the system choose one and read it from the log."]],
  },
  {
    slug: "other-clients", name: "Other clients", group: "Other",
    blurb: "Any app that supports MCP.",
    lede: "Motion Forge works with any MCP client. Use whichever of these your app accepts.",
    steps: [
      { t: "If it starts local commands (stdio)", p: "Use command <code>npx</code> with arguments <code>-y</code> and <code>" + MCP_PKG + "</code>, or paste the standard block:", lang: "json", code: STDIO_JSON() },
      { t: "If it takes a URL (HTTP)", p: "Run <code>" + NPX + " --http</code> and use the address it prints, normally:", code: "http://127.0.0.1:3333/mcp" },
      { t: "Check the connection", p: "The server is named <b>motion-forge</b> and offers six tools: <code>search_animations</code>, <code>get_animation</code>, <code>list_categories</code>, <code>get_install_instructions</code>, <code>map_motion_to_animation</code> and <code>compare_motion</code>." },
    ],
    remove: [{ t: "Remove the server", p: "Remove <b>motion-forge</b> from the client's MCP settings." }],
  },
];

const PROMPTS = [
  "Find a blur-in heading animation in Motion Forge.",
  "Which Motion Forge animation is closest to a 400 ms ease-out fade-up?",
  "Add a Motion Forge scroll reveal to this section, with reduced motion respected.",
  "Show me Motion Forge button animations that loop, with no JavaScript.",
  "Get the Figma motion for this frame and map it to Motion Forge.",
  "Compare my fade-up with sds-scroll-fade-up and list what differs.",
];

const FEATURES = [
  ["Search animations", "Keyword search across every effect, with filters for category, trigger, looping and pure CSS.", "Show me 5 loading spinners that loop without JavaScript.", "search"],
  ["Get code that works", "Install steps and a ready snippet for HTML, React, Angular or Tailwind, with your duration and delay applied.", "Give me sds-bounce-in-up for React, 400 ms.", "js"],
  ["Match a design", "Hand it a motion spec, or Figma's motion output, and get the closest effects with the reasons for each score.", "Map this Figma interaction to Motion Forge.", "target"],
  ["Compare motion", "See where an implemented animation differs from the design: properties, easing, duration, trigger.", "How far is sds-scroll-fade-up from my 300 ms ease-out design?", "compare"],
  ["Tune the timing", "Speed, delay and looping come back as modifier classes or one CSS variable, not a rewrite.", "Make that animation slower and play it once.", "sliders"],
  ["Respect reduced motion", "Every snippet comes with the note that the library already honours prefers-reduced-motion.", "Is this animation safe for people who turn motion off?", "a11y"],
];

const FAQ = [
  ["What is an MCP server?", "MCP (Model Context Protocol) is the standard way an AI tool talks to other software. The Motion Forge server gives your AI tool six read-only tools to search the library, fetch code and match a design's motion to an effect."],
  ["Which AI tools work with it?", "Any MCP client: Claude Code, Claude Desktop, Cursor, VS Code, Windsurf, Zed, Codex, Gemini CLI, Antigravity and Devin Desktop have guides here. Browsers and cloud agents use the HTTP mode."],
  ["Do I need an account or an API key?", "No. It runs on your machine from the npm package and needs Node 20 or newer."],
  ["Does it use AI or send my designs anywhere?", "No. It makes no network calls and uses no AI of its own. Matching is a fixed scoring formula over the library's own CSS, so the same input always gives the same answer."],
  ["How accurate is the matching?", "It ranks similarity and never claims an exact match. Every result lists what matches and what differs, and a spec with too little detail is capped so it cannot look like a strong match. Check the result in the browser."],
  ["Does it work with Figma?", "Yes. Ask your AI to read the motion from Figma with Figma's own MCP server, then pass that output to Motion Forge's map tool. The Figma reader was built from Figma's published names and reports every assumption it makes."],
  ["How do I update or remove it?", "<code>npx -y</code> fetches the latest version when it starts; add <code>@latest</code> to the package name to force it. To remove it, delete the server from your tool's MCP settings."],
];

const WAYS = [
  ["MCP server", "Let your AI tool search and place animations for you.", "/mcp/", "New", "mcp", "npx -y @salkomdesignstudio/motion-forge-mcp"],
  ["CDN", "One stylesheet link. Nothing to install.", "/docs.html#install", "", "install", "No install, no build step"],
  ["npm", "Import the whole library or one category.", "/docs.html#install", "", "frameworks", "npm i @salkomdesignstudio/sds-motion-forge"],
  ["Framework guides", "React, Angular, Vue, Svelte and Tailwind.", "/docs.html#frameworks", "", "js", "Angular · React · Vue · Svelte"],
  ["Editor autocomplete", "Class-name completion and hover docs in VS Code.", "https://github.com/salkomdesignstudio/SDS-Motion-Forge/tree/main/ide", "", "clients", "Class names and hover docs"],
  ["Builder", "Pick an effect, tune it and copy the code.", "/builder.html", "", "quick", "Download only what you use"],
  ["llms.txt", "A plain summary for AI assistants and crawlers.", "/llms.txt", "", "llms", "/llms.txt"],
];

module.exports = function buildMcpPages({ head, foot, S, config, esc, crumbs, breadcrumbNav }) {
  const urlOf = S.urlOf;
  const total = S.effects.length;
  const byGroup = (g) => CLIENTS.filter((c) => c.group === g);
  const clientPath = (c) => `/mcp/clients/${c.slug}/`;

  const copyBtn = (text, label = "Copy") => `<button type="button" class="m-copy" data-copy="${esc(text)}">${label}</button>`;
  const cmdChip = (text) => `<div class="m-cmd"><code>${esc(text)}</code>${copyBtn(text)}</div>`;
  let n = 0;
  const codeBlock = (code, lang) => {
    const id = `m-code-${++n}`;
    return `<div class="m-code"><button type="button" class="m-copy" data-copy-from="${id}">Copy</button><pre><code id="${id}"${lang ? ` class="language-${lang}"` : ""}>${esc(code)}</code></pre></div>`;
  };
  const stepsHtml = (steps) => `<ol class="m-steps">${steps.map((s) => `<li><b>${s.t}</b>${s.p ? `<p>${s.p}</p>` : ""}${s.code ? codeBlock(s.code, s.lang) : ""}</li>`).join("")}</ol>`;
  const arrow = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14m-6-6 6 6-6 6"/></svg>';
  const clientCard = (c) => `<a class="m-client m-spot" href="${clientPath(c)}">${toolTile(c)}<span><b>${esc(c.name)}</b><small>${esc(c.blurb)}</small></span><span class="m-arrow">${arrow}</span></a>`;
  const faqHtml = (items) => items.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${a}</p></details>`).join("\n");
  const faqLd = (items) => ({ "@type": "FAQPage", mainEntity: items.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a.replace(/<[^>]+>/g, "") } })) });
  const waysHtml = (items) => `<div class="m-ways">${items.map(([t, d, h, b, k, c]) => `<a class="m-way m-spot${b ? " is-new" : ""}" href="${h}"><span class="m-way-head">${icon(k)}<span class="m-way-go"><svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14m-6-6 6 6-6 6"/></svg></span></span><b>${esc(t)}${b ? `<em>${b}</em>` : ""}</b><small>${esc(d)}</small><code class="m-way-chip">${esc(c)}</code></a>`).join("")}</div>`;

  const pages = [];
  const emit = (p, html, md) => pages.push({ p, html, md });

  /* ── /mcp/ landing ──────────────────────────────────────────── */
  {
    const p = "/mcp/";
    const title = "Motion Forge MCP — your AI picks the right animation";
    const description = `Connect Claude, Cursor, VS Code or any MCP client to Motion Forge. Search ${total} CSS animations, get working code and match a design's motion. Offline, free.`;
    const jsonld = { "@context": "https://schema.org", "@graph": [crumbs([["Home", "/"], ["MCP", p]]), faqLd(FAQ)] };
    const chips = PROMPTS.map((t) => `<button type="button" class="m-chip" data-copy="${esc(t)}">${esc(t)}</button>`).join("");
    const html =
      head({ title, description, path: p, jsonld, extraCss: ["/dist/categories/text.min.css"], extraJs: ["/mcp.js"], wide: true }) +
      `<div class="m-page">
<section class="m-hero h-hero">
<div class="h-copy">
<p class="m-eyebrow"><span class="pill">New</span> Motion Forge MCP</p>
<h1 class="t2"><span class="t2a">Your AI picks the right animation.</span><span class="t2b">From <u class="t2u">${total} real ones</u>.</span></h1>
<p class="m-sub">Connect Claude, Cursor, VS Code or any MCP client to Motion Forge. Your AI searches the library, writes the code and matches a design's motion before it guesses.</p>
<div class="m-cta"><a class="btn2 primary" href="#setup">Connect in a minute</a><a class="btn2" href="/mcp/clients/">Choose your tool</a></div>
${cmdChip(NPX)}
<p class="m-fine">Free, offline, no API key. Needs Node 20 or newer.</p>
</div>
<div class="h-win" role="group" aria-label="Example: an AI tool using Motion Forge">
<div class="h-bar"><span class="h-dots" aria-hidden="true"><i></i><i></i><i></i></span><span class="h-title">AI chat <em>motion-forge connected</em></span><span class="h-ex">Example</span></div>
<div class="h-body">
<p class="h-user">Find a blur-in heading animation and give me the React code.</p>
<ul class="h-calls">
<li><span class="h-ok" aria-hidden="true"></span><code>search_animations</code><span>"blur heading"</span></li>
<li><span class="h-ok" aria-hidden="true"></span><code>get_animation</code><span>sds-blur-focus · react</span></li>
</ul>
<div class="h-reply">
<p>Use <code>sds-blur-focus</code>. It sharpens from a heavy blur.</p>
<div class="h-demo" data-fx>
<div class="fx-stage h-stage" aria-hidden="true"><h2 class="sds-blur-focus">Hello</h2></div>
<button type="button" class="h-replay" data-replay aria-label="Replay the animation"><svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12a8 8 0 1 0 2.6-5.9M4 4v4.5h4.5"/></svg>Replay</button>
</div>
<pre class="h-code"><code>import "@salkomdesignstudio/sds-motion-forge/dist/motion.min.css";

&lt;h1 className="sds-blur-focus"&gt;Hello&lt;/h1&gt;</code></pre>
</div>
</div>
</div>
</section>
<div class="h-works"><span>Works with</span>${["claude-code", "claude-desktop", "cursor", "vscode", "windsurf", "zed", "codex", "gemini-cli", "antigravity", "devin-desktop"].map((sl) => CLIENTS.find((x) => x.slug === sl)).map((x) => `<a href="${clientPath(x)}">${toolFor(x.slug) ? `<span class="h-wlogo">${toolFor(x.slug)}</span>` : ""}${esc(x.name)}</a>`).join("")}</div>

<section class="m-sec" id="setup"><h2>Set up in under a minute</h2><p class="m-lead">Three steps. Your AI tool does most of them for you.</p>
<ol class="m-stepper">
<li class="m-step"><div class="m-step-top"><span class="m-step-n">1</span>${icon("terminal")}</div><h3>Add the command</h3><p>Paste it into your tool's MCP settings, or run it in a terminal.</p><div class="m-mini"><code>${esc(NPX)}</code><button type="button" class="m-copy" data-copy="${esc(NPX)}">Copy</button></div></li>
<li class="m-step"><div class="m-step-top"><span class="m-step-n">2</span>${icon("mcp")}</div><h3>Restart your tool</h3><p>Motion Forge shows up with six tools. No sign-in, no key.</p><div class="m-mini m-status"><span class="m-dot" aria-hidden="true"></span><span><b>motion-forge</b> connected</span><em>6 tools</em></div></li>
<li class="m-step"><div class="m-step-top"><span class="m-step-n">3</span>${icon("search")}</div><h3>Ask</h3><p>Describe the motion you want. Your AI finds it and writes the code.</p><div class="m-chat"><p class="m-bubble">Find a blur-in heading animation and give me the React code.</p><p class="m-reply">Example reply: <code>sds-blur-focus</code> with a ready snippet</p></div></li>
</ol></section>

<section class="m-sec"><h2>Connect your tool</h2><p class="m-lead">Pick your tool for a step-by-step guide.</p>
${GROUPS.slice(0, 3).map((g) => `<h3 class="m-gh">${g}</h3><div class="m-clients">${byGroup(g).map(clientCard).join("")}</div>`).join("")}
<p class="m-more"><a href="/mcp/clients/">See all ${CLIENTS.length} guides ${arrow}</a></p></section>

<section class="m-sec"><h2>Ask anything. Get real animations back.</h2>
<div class="m-feats">${FEATURES.map(([t, d, q, k]) => `<div class="m-feat m-spot ic-host">${icon(k)}<b>${esc(t)}</b><p>${esc(d)}</p><button type="button" class="m-chip" data-copy="${esc(q)}">${esc(q)}</button></div>`).join("")}</div></section>

<section class="m-sec"><h2>Things people ask</h2><p class="m-lead">Click one to copy it, then paste it into your AI tool.</p><div class="m-chips">${chips}</div></section>

<section class="m-sec"><h2>From Figma to code</h2>
<ol class="m-stepper">
<li class="m-step"><div class="m-step-top"><span class="m-step-n">1</span>${icon("search")}</div><h3>Read the motion</h3><p>Your AI reads the interaction from Figma with Figma's own MCP server.</p></li>
<li class="m-step"><div class="m-step-top"><span class="m-step-n">2</span>${icon("target")}</div><h3>Map it</h3><p>Motion Forge scores every animation against it and explains each score.</p></li>
<li class="m-step"><div class="m-step-top"><span class="m-step-n">3</span>${icon("quick")}</div><h3>Place it</h3><p>You get the closest effect with duration and delay already applied.</p></li>
</ol>
<p class="note">Scores rank similarity, they never claim an exact match, and a spec with too little detail is capped so it cannot look like a strong match. It uses no AI and no network, so the same input always gives the same answer.</p></section>

<section class="m-sec"><h2>Other ways to use Motion Forge</h2><p class="m-lead">The MCP server is one way in. These all work with the same ${total} animations.</p>${waysHtml(WAYS.slice(1))}</section>

<section class="m-sec"><h2>Questions</h2><div class="m-faq">${faqHtml(FAQ)}</div></section>

<section class="m-band"><h2>Your AI is guessing. It does not have to.</h2><div class="m-cta"><a class="btn2 primary on-dark" href="#setup">Connect in a minute</a><a class="btn2 on-dark" href="/animations/">Explore the library</a></div></section>
</div>
` + foot;
    const md = `# Motion Forge MCP\n\nConnect any MCP client to Motion Forge: search ${total} CSS animations, get working code, and match a design's motion to an effect. Free, offline, no API key. Node 20+.\n\n## Add it\n\n\`\`\`\n${NPX}\n\`\`\`\n\nStandard config block:\n\n\`\`\`json\n${STDIO_JSON()}\n\`\`\`\n\n## Tools\n\n- search_animations, get_animation, list_categories, get_install_instructions\n- map_motion_to_animation (generic spec or Figma get_motion_context output), compare_motion\n\n## Guides\n\n${CLIENTS.map((c) => `- ${c.name}: ${urlOf(clientPath(c))}`).join("\n")}\n\nHTTP mode for web apps: \`${NPX} --http\`\n`;
    emit(p, html, md);
  }

  /* ── /mcp/clients/ chooser ──────────────────────────────────── */
  {
    const p = "/mcp/clients/";
    const title = "Choose your tool — Motion Forge MCP setup guides";
    const description = `Step-by-step Motion Forge MCP setup for ${CLIENTS.map((c) => c.name).slice(0, 6).join(", ")} and more.`;
    const jsonld = { "@context": "https://schema.org", "@graph": [crumbs([["Home", "/"], ["MCP", "/mcp/"], ["Clients", p]])] };
    const html =
      head({ title, description, path: p, jsonld, wide: true }) +
      `<div class="m-page">${breadcrumbNav([["Home", "/"], ["MCP", "/mcp/"], ["Clients", p]])}
<section class="m-hero m-hero-sm"><h1>Choose your tool</h1>
<p class="m-sub">Motion Forge works with any AI tool that supports MCP. Pick yours for step-by-step setup. The command is the same for all of them.</p>
${cmdChip(NPX)}</section>
${GROUPS.map((g) => `<section class="m-sec"><h2>${g}</h2><div class="m-clients">${byGroup(g).map(clientCard).join("")}</div></section>`).join("")}
</div>
` + foot;
    const md = `# Choose your tool\n\nCommand for every stdio client: \`${NPX}\`\n\n${GROUPS.map((g) => `## ${g}\n\n${byGroup(g).map((c) => `- [${c.name}](${urlOf(clientPath(c))}): ${c.blurb}`).join("\n")}`).join("\n\n")}\n`;
    emit(p, html, md);
  }

  /* ── /mcp/clients/<tool>/ ───────────────────────────────────── */
  CLIENTS.forEach((c, i) => {
    const p = clientPath(c);
    const prev = CLIENTS[i - 1], next = CLIENTS[i + 1];
    const title = `${c.name} — Motion Forge MCP setup`;
    const description = `Add Motion Forge to ${c.name}: ${c.lede}`.slice(0, 158);
    const crumb = [["Home", "/"], ["MCP", "/mcp/"], ["Clients", "/mcp/clients/"], [c.name, p]];
    const jsonld = { "@context": "https://schema.org", "@graph": [crumbs(crumb)] };
    const trouble = [
      ["Command not found, or it will not start", `The server needs Node 20 or newer. Run <code>node -v</code> to check, and <code>${NPX} --version</code> in a terminal: it should print a version. Desktop apps on Windows may need <code>cmd /c npx</code> as the command.`],
      ["The server shows up but has no tools", "Restart the app fully, not just the chat. Then check the server's log: a line starting <code>[motion-forge-mcp] ready</code> means it started."],
      ["I get an old version", `<code>npx</code> caches packages. Use <code>${MCP_PKG}@latest</code> in the command to force the newest one.`],
      ["Does it send my code or designs anywhere?", "No. It makes no network calls and uses no AI of its own. It reads one file from its own package."],
      ...(c.extraTrouble || []),
    ];
    const usage = [PROMPTS[0], PROMPTS[1], PROMPTS[4]];
    const svg = (d) => `<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
    const metaIcons = {
      node: svg('<path d="m9 8-4 4 4 4M15 8l4 4-4 4"/>'),
      time: svg('<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>'),
      key: svg('<rect x="5" y="11" width="14" height="9" rx="2.5"/><path d="M8 11V8a4 4 0 0 1 7.5-2"/>'),
    };
    const copyIcon = '<svg class="g-i-copy" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="11" height="11" rx="2.5"/><path d="M5 15V6.5A2.5 2.5 0 0 1 7.5 4H15"/></svg><svg class="g-i-ok" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m5.5 12.5 4.2 4.2L18.5 7.5"/></svg>';
    let gid = 0;
    const gcode = (code, lang) => {
      const id = `g-${c.slug}-${++gid}`;
      return `<div class="g-code"><pre><code id="${id}"${lang ? ` class="language-${lang}"` : ""}>${esc(code)}</code></pre><button type="button" class="g-copy" data-gcopy="${id}" aria-label="Copy to clipboard">${copyIcon}</button></div>`;
    };
    const timeline = (steps) => `<ol class="g-steps">${steps.map((s, k) => `<li><span class="g-n">${k + 1}</span><div class="g-body"><p class="g-t">${s.t}</p>${s.p ? `<p class="g-p">${s.p}</p>` : ""}${s.code ? gcode(s.code, s.lang) : ""}</div></li>`).join("")}</ol>`;
    const sidebar = GROUPS.map((g) => `<p class="m-sbh">${g}</p>${byGroup(g).map((x) => `<a href="${clientPath(x)}"${x.slug === c.slug ? ' aria-current="page"' : ""}>${toolBare(x)}<span>${esc(x.name)}</span></a>`).join("")}`).join("");
    const html =
      head({ title, description, path: p, jsonld, extraJs: ["/mcp.js"], wide: true }) +
      `<div class="m-page g-page">
<div class="m-doc">
<aside class="m-side" aria-label="MCP guides"><a class="m-sidehome" href="/mcp/clients/">All tools</a>${sidebar}</aside>
<article class="m-main g-main">
${breadcrumbNav(crumb)}
<header class="g-head">${toolTile(c, "g-big")}<h1>${esc(c.name)}</h1></header>
<p class="g-lede">${esc(c.lede)}</p>
<ul class="g-meta"><li>${metaIcons.node}Node 20 or newer</li><li>${metaIcons.time}About a minute</li><li>${metaIcons.key}No account, no API key</li></ul>
${c.note ? `<p class="note" role="note">${esc(c.note)}</p>` : ""}
${c.deeplink ? `<p class="g-deeprow"><a class="m-deep" href="${esc(c.deeplink.href)}"><b>${esc(c.deeplink.label)}</b><small>${esc(c.deeplink.sub)}</small></a></p>` : ""}
<h2 id="setup">Setup</h2>
${timeline(c.steps)}
<h2 id="usage">Usage</h2>
<p class="g-p">Start a chat and ask. Click a prompt to copy it.</p>
<div class="g-prompts">${usage.map((t) => `<button type="button" class="g-prompt" data-gcopy-text="${esc(t)}"><span>${esc(t)}</span>${copyIcon}</button>`).join("")}</div>
<h2 id="remove">Disconnect or remove</h2>
${timeline(c.remove)}
<h2 id="trouble">Troubleshooting</h2>
<div class="m-faq">${faqHtml(trouble)}</div>
<p class="m-more">Still stuck? <a href="${config.repoUrl}/issues">Open an issue on GitHub</a>.</p>
<nav class="m-pager" aria-label="Guides">${prev ? `<a href="${clientPath(prev)}"><small>Previous</small><b>${esc(prev.name)}</b></a>` : "<span></span>"}${next ? `<a class="r" href="${clientPath(next)}"><small>Next</small><b>${esc(next.name)}</b></a>` : "<span></span>"}</nav>
</article>
<nav class="m-toc g-toc" aria-label="On this page"><p>On this page</p><a href="#setup" aria-current="true">Setup</a><a href="#usage">Usage</a><a href="#remove">Disconnect</a><a href="#trouble">Troubleshooting</a></nav>
</div></div>
` + foot;
    const md = `# ${c.name}: Motion Forge MCP setup\n\n${c.lede}\n\n${c.steps.map((s, k) => `${k + 1}. ${s.t}${s.p ? ": " + s.p.replace(/<[^>]+>/g, "") : ""}${s.code ? "\n\n```" + (s.lang || "") + "\n" + s.code + "\n```" : ""}`).join("\n\n")}\n`;
    emit(p, html, md);
  });

  return pages;
};

/** Fragments for the hand-written pages (patched between markers by generate-static-pages.js). */
module.exports.fragments = function fragments({ S, esc }) {
  const total = S.effects.length;
  const arrow = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14m-6-6 6 6-6 6"/></svg>';
  const cmd = `<div class="m-cmd"><code>${esc(NPX)}</code><button type="button" class="m-copy" data-copy="${esc(NPX)}">Copy</button></div>`;
  const ways = (items) => `<div class="m-ways">${items.map(([t, d, h, b, k, c]) => `<a class="m-way m-spot${b ? " is-new" : ""}" href="${h}"><span class="m-way-head">${icon(k)}<span class="m-way-go"><svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14m-6-6 6 6-6 6"/></svg></span></span><b>${esc(t)}${b ? `<em>${b}</em>` : ""}</b><small>${esc(d)}</small><code class="m-way-chip">${esc(c)}</code></a>`).join("")}</div>`;
  const tools = ["claude-code", "cursor", "vscode", "claude-desktop", "windsurf", "zed", "codex", "antigravity", "devin-desktop"]
    .map((s) => CLIENTS.find((c) => c.slug === s)).map((c) => `<a href="/mcp/clients/${c.slug}/">${esc(c.name)}</a>`).join("");
  const toolTiles = ["claude-code", "cursor", "vscode", "claude-desktop", "windsurf", "zed", "codex", "antigravity", "devin-desktop"].map((sl) => CLIENTS.find((c) => c.slug === sl)).map((c) => `<a class="m-tool" href="/mcp/clients/${c.slug}/">${toolTile(c)}<span>${esc(c.name)}</span></a>`).join("");
  const home = `<section class="sec" id="ways">
      <link rel="stylesheet" href="/mcp.css" />
      <div class="wrap">
        <div class="sec-head" data-reveal="up">
          <span class="eyebrow">Ways to use it</span>
          <h2 class="sec-title t2"><span class="t2a">Use it your way.</span><span class="t2b">CDN, npm or <u class="t2u">your AI tool</u>.</span></h2>
          <p class="sec-desc">One stylesheet link, an npm import, or your AI tool. All of them use the same ${total} animations.</p>
        </div>
        <div class="m-ai m-spot" data-reveal="up">
          <div><span class="pill">New</span><h3>Let your AI pick the animation</h3>
          <p>Connect the Motion Forge MCP server to Claude, Cursor, VS Code or any MCP client. Ask for an animation by description, get working code, or hand it a Figma interaction and get the closest match. Free, offline, no API key.</p>${cmd}</div>
          <div class="m-ai-side"><p class="m-ai-label">Works with</p><div class="m-tools">${toolTiles}</div><p class="m-more"><a href="/mcp/clients/">See all ${CLIENTS.length} setup guides ${arrow}</a></p></div>
        </div>
        ${ways(WAYS.slice(1))}
      </div>
    </section>`;
  const docs = `<section class="doc-sec" id="mcp">
          <link rel="stylesheet" href="/mcp.css" />
          <h2 class="doc-sec-title">Use with AI (MCP)</h2>
          <p class="doc-sec-sub">The Motion Forge MCP server lets Claude, Cursor, VS Code and any MCP client search the library, write the code and match a design's motion to an effect. It runs on your machine, needs no account and makes no network calls.</p>
          <h3 class="doc-h3">Add it</h3>
          <p class="doc-p">Use this command in your tool's MCP settings, or the standard config block below. Node 20 or newer.</p>
          ${cmd}
          <pre style="margin-top:12px"><code>${esc(STDIO_JSON())}</code></pre>
          <h3 class="doc-h3">Step-by-step guides</h3>
          <div class="m-ai-tools">${tools}<a href="/mcp/clients/web-apps/">Web apps (HTTP)</a><a href="/mcp/clients/">All tools</a></div>
          <h3 class="doc-h3">Tools</h3>
          <table class="doc-table"><tbody>
            <tr><td><code>search_animations</code></td><td>Keyword search with category, trigger, loop and no-JavaScript filters.</td></tr>
            <tr><td><code>get_animation</code></td><td>Details and a usage snippet for one effect (HTML, React, Angular, Tailwind).</td></tr>
            <tr><td><code>list_categories</code></td><td>Categories, modifier classes and the duration and easing tokens.</td></tr>
            <tr><td><code>get_install_instructions</code></td><td>Install steps, with optional duration, delay, easing and loop applied.</td></tr>
            <tr><td><code>map_motion_to_animation</code></td><td>Closest effects for a motion spec or Figma's motion output, with an explained score.</td></tr>
            <tr><td><code>compare_motion</code></td><td>Where an animation differs from a design: properties, easing, duration, trigger.</td></tr>
          </tbody></table>
          <p class="doc-p">Scores rank similarity and never claim an exact match. <a href="/mcp/">Read how it works</a>.</p>
        </section>`;

  const cats = [["Text", 117], ["Buttons", 100], ["Inputs", 100], ["Cards", 100], ["Loaders", 100], ["Scroll", 100]];
  const CAT_COLOURS = ["#5c4ae1", "#19b5a5", "#ec5f9b", "#3b82f6", "#f2603c", "#1a9b57"];
  const seg = cats.map(([n, c], i) => `<span class="w-seg" style="flex:${c};background:${CAT_COLOURS[i]}" title="${n} ${c}"></span>`).join("");
  const legend = cats.map(([n, c], i) => `<li><i style="background:${CAT_COLOURS[i]}"></i>${n} <b>${c}</b></li>`).join("");
  const why = `<section class="sec" id="why">
      <div class="wrap">
        <div class="sec-head" data-reveal="up">
          <span class="eyebrow">Features</span>
          <h2 class="sec-title t2"><span class="t2a">Built to ship.</span><span class="t2b">Not to <u class="t2u">demo</u>.</span></h2>
          <p class="sec-desc">A focused motion system for teams who want character without the weight. Everything below is checked by the build.</p>
        </div>
        <div class="w-grid">
          <article class="w-card w-dark w-3" data-reveal="up">
            <header>${icon("quick")}<span class="w-label">No JavaScript</span></header>
            <div class="w-stat"><b>0 KB</b><span>of JavaScript for the CSS effects</span></div>
            <p>All ${total} effects are plain @keyframes and classes. Two optional scripts add what CSS cannot.</p>
            <ul class="w-pills"><li>Scroll helper <b>1.3 KB</b></li><li>7 cursor effects <b>7 KB</b></li></ul>
          </article>
          <article class="w-card w-3" data-reveal="up" data-delay="1">
            <header>${icon("all")}<span class="w-label">Library</span></header>
            <div class="w-stat"><b>${total}</b><span>animations, one class name each</span></div>
            <div class="w-bar" role="img" aria-label="Animations per category">${seg}</div>
            <ul class="w-legend">${legend}</ul>
            <p class="w-note">Plus 7 cursor-reactive effects.</p>
          </article>
          <article class="w-card w-2" data-reveal="up" data-delay="1">
            <header>${icon("frameworks")}<span class="w-label">Anywhere</span></header>
            <h3>Works where a class works</h3>
            <ul class="w-pills"><li>Angular</li><li>React</li><li>Vue</li><li>Next.js</li><li>Bootstrap</li><li>Tailwind</li></ul>
            <p>Anything that renders HTML with CSS classes.</p>
          </article>
          <article class="w-card w-2" data-reveal="up" data-delay="2">
            <header>${icon("theme")}<span class="w-label">Themeable</span></header>
            <h3>Retune with variables</h3>
            <ul class="w-pills w-code"><li>--sds-primary</li><li>--sds-duration</li><li>--sds-easing</li></ul>
            <p>Change colour and speed in one place. No rebuild.</p>
          </article>
          <article class="w-card w-2" data-reveal="up" data-delay="3">
            <header>${icon("scroll")}<span class="w-label">Performance</span></header>
            <div class="w-stat w-stat-sm"><b>468<small> / ${total}</small></b></div>
            <div class="w-meter" role="img" aria-label="468 of 617 effects are compositor-only"><span style="width:75.8%"></span></div>
            <p>animate only transform, opacity, filter or clip-path. The other 149 also animate shadows, gradients or sizes and can cost more on slow devices.</p>
          </article>
          <article class="w-card w-6 w-split" data-reveal="up" data-delay="1">
            <div>
              <header>${icon("a11y")}<span class="w-label">Accessibility</span></header>
              <h3>Respects reduced motion</h3>
              <p>Every animating selector is switched off under <code>prefers-reduced-motion: reduce</code>, and the build fails if one is missed.</p>
            </div>
            <ul class="w-checks">
              <li><span class="w-tick" aria-hidden="true"></span><span><b>Checked on every build</b>A missed selector fails the build.</span></li>
              <li><span class="w-tick" aria-hidden="true"></span><span><b>Nothing breaks on upgrade</b>Every class that worked in v3 and v4 still works in v5, checked against the published package.</span></li>
            </ul>
          </article>
        </div>
      </div>
    </section>`;

  const CDN_LINK = '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@salkomdesignstudio/sds-motion-forge/dist/motion.min.css" />';
  const win = (label, copy, html) => `<div class="m-codewin"><div class="m-codewin-bar"><span>${label}</span><button type="button" class="m-copy" data-copy="${esc(copy)}">Copy</button></div><pre><code>${html}</code></pre></div>`;
  const how = `<section class="sec" id="how">
      <div class="wrap">
        <div class="sec-head" data-reveal="up">
          <span class="eyebrow">How it works</span>
          <h2 class="sec-title t2"><span class="t2a">Three steps.</span><span class="t2b"><u class="t2u">No setup</u>.</span></h2>
          <p class="sec-desc">Load the stylesheet once. Add a class. Tune it if you want to.</p>
        </div>
        <ol class="m-stepper" data-reveal="up">
          <li class="m-step"><div class="m-step-top"><span class="m-step-n">1</span>${icon("install")}</div><h3>Load the CSS</h3><p>From the CDN, or <code>npm i</code> and import it once.</p>
            ${win("HTML", CDN_LINK, '<span class="t">&lt;link</span> <span class="a">rel</span>=<span class="s">"stylesheet"</span> <span class="a">href</span>=<span class="s">"https://cdn.jsdelivr.net/npm/@salkomdesignstudio/sds-motion-forge/dist/motion.min.css"</span> <span class="t">/&gt;</span>')}</li>
          <li class="m-step"><div class="m-step-top"><span class="m-step-n">2</span>${icon("quick")}</div><h3>Add a class</h3><p>One class name on any element. It plays as soon as it loads.</p>
            ${win("HTML", '<h1 class="sds-velvet-drop">Hello</h1>', '<span class="t">&lt;h1</span> <span class="a">class</span>=<span class="s">"sds-velvet-drop"</span><span class="t">&gt;</span>\n  Hello\n<span class="t">&lt;/h1&gt;</span>')}</li>
          <li class="m-step"><div class="m-step-top"><span class="m-step-n">3</span>${icon("sliders")}</div><h3>Tune it <span class="m-opt">optional</span></h3><p>Modifier classes change speed, delay and looping.</p>
            ${win("HTML", '<h1 class="sds-velvet-drop sds-slow sds-delay-2">Hello</h1>', '<span class="t">&lt;h1</span> <span class="a">class</span>=<span class="s">"sds-velvet-drop sds-slow sds-delay-2"</span><span class="t">&gt;</span>\n  Hello\n<span class="t">&lt;/h1&gt;</span>')}</li>
        </ol>
      </div>
    </section>`;

  const meter = (n, label) => `<span class="j-level" role="img" aria-label="JavaScript needed: ${label}"><span class="j-bars">${[1, 2, 3].map((i) => `<i class="${i <= n ? "on" : ""}"></i>`).join("")}</span><b>${label}</b></span>`;
  const tick = '<span class="j-tick" aria-hidden="true"></span>';
  const jsSection = `<section class="sec band" id="js">
      <div class="wrap">
        <div class="sec-head" data-reveal="up">
          <span class="eyebrow">Plain answer</span>
          <h2 class="sec-title t2"><span class="t2a">What needs JavaScript?</span><span class="t2b">Most <u class="t2u">effects need none</u>.</span></h2>
          <p class="sec-desc">Most effects need none. Three things are different, and each one is optional.</p>
        </div>
        <div class="j-grid">
          <article class="j-card j-first" data-reveal="up">
            <header>${icon("quick")}${meter(0, "None")}</header>
            <div class="j-stat"><b>517</b><span>of ${total} effects</span></div>
            <h3>CSS effects</h3>
            <p>Text, buttons, inputs, cards and loaders. Add the class and it plays.</p>
            <ul class="j-list">
              <li>${tick}<span>13 text effects need each letter in a <code>.sds-char</code> span</span></li>
              <li>${tick}<span>48 animate child elements</span></li>
              <li>${tick}<span>29 input effects need a wrapper</span></li>
            </ul>
            <footer><span class="j-chip">No script to load</span></footer>
          </article>
          <article class="j-card" data-reveal="up" data-delay="1">
            <header>${icon("scroll")}${meter(1, "Sometimes")}</header>
            <div class="j-stat"><b>100</b><span>of ${total} effects</span></div>
            <h3>Scroll effects</h3>
            <p>CSS-only in Chrome 115+ with <code>sds-scroll-auto</code>. Other browsers use the 1.3 KB script and <code>data-sds</code>.</p>
            <ul class="j-list"><li>${tick}<span>Without either, the effect plays on load, not on scroll</span></li></ul>
            <footer><span class="j-chip">sds-scroll.min.js <b>1.3 KB</b></span></footer>
          </article>
          <article class="j-card" data-reveal="up" data-delay="2">
            <header>${icon("interactive")}${meter(3, "Needs the engine")}</header>
            <div class="j-stat"><b>7</b><span>cursor-reactive effects</span></div>
            <h3>Cursor-reactive</h3>
            <p>Magnetic Pull, Shockwave, Word Morph and four more need the 7 KB <code>motion-interactive.min.js</code>.</p>
            <ul class="j-list"><li>${tick}<span>The engine splits the text into letters for you</span></li></ul>
            <footer><span class="j-chip">motion-interactive.min.js <b>7 KB</b></span></footer>
          </article>
        </div>
        <p class="needs-foot">Physics effects use CSS <code>linear()</code> (Chrome 113+, Safari 17.2+, Firefox 112+); older browsers get an approximation. <a href="docs.html#js-needs">Full table in the docs</a></p>
      </div>
    </section>`;

  const { glyph } = require("./icons");
  const sparkle = (cls) => `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M12 2.5v19M2.5 12h19M5.3 5.3l13.4 13.4M18.7 5.3 5.3 18.7"/></svg>`;
  /* Hero tiles: seeded-random but spaced-out positions down both edges (percent of the hero, so they follow the width),
     random sizes, tilts and bob speeds. Every tile cycles through its own list of real logos (spec: .reanimate/motvin-hero/spec.md). */
  const { sprite, use: useTool } = require("./tool-icons");
  const LOGOS = ["claude", "chatgpt", "cursor", "vscode", "gemini", "copilot", "codex", "windsurf", "antigravity", "figma", "replit"];
  const rng = (seed) => () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const rand = rng(20261123);
  const pick = (n, from) => { const pool = from.slice(); const out = []; while (out.length < n && pool.length) out.push(pool.splice(Math.floor(rand() * pool.length), 1)[0]); return out; };
  const PER_SIDE = 7, W = 1440, H = 700; // reference box used only to keep tiles apart
  const placed = [];
  const SIZES = [88, 76, 68, 62, 56, 50, 44];
  for (const side of ["l", "r"]) {
    const x0 = side === "l" ? 3 : 81, x1 = side === "l" ? 19 : 97;
    SIZES.slice().sort(() => rand() - 0.5).forEach((sz) => {
      let best = null;
      for (let t = 0; t < 600 && !best; t++) {
        const xp = x0 + rand() * (x1 - x0), yp = 6 + rand() * 82;
        const cx = (xp / 100) * W, cy = (yp / 100) * H;
        if (placed.every((p) => Math.hypot(p.cx - cx, p.cy - cy) >= (p.sz + sz) / 2 + 16)) best = { xp, yp, cx, cy, sz, side };
      }
      if (best) placed.push(best);
    });
  }
  const deck = pick(LOGOS.length, LOGOS); // each tile starts on a different logo
  const heroFloats = sprite(LOGOS) + placed.map((p, i) => {
    const first = deck[i % deck.length];
    const logos = [first].concat(pick(4, LOGOS.filter((k) => k !== first)));
    const r = Math.round((rand() * 36 - 18) * 10) / 10, d = Math.round((4.4 + rand() * 2.2) * 10) / 10, l = -Math.round(rand() * 60) / 10, k = Math.round((0.5 + rand() * 1.1) * 10) / 10;
    const g = logos.map((k2, j) => `<span class="hf-g${j === 0 ? " is-on" : ""}">${useTool(k2)}</span>`).join("");
    return `<span class="hf hf-tile tone-white" data-depth="${k}" style="--xp:${p.xp.toFixed(2)}%;--yp:${p.yp.toFixed(2)}%;--s:${p.sz}px;--r:${r}deg;--d:${d}s;--l:${l}s;--ei:${i}"><span class="hf-d"><span class="hf-e"><span class="hf-in">${g}</span></span></span></span>`;
  }).join("");

  const CTA_GLYPHS = ["claude", "chatgpt", "cursor", "vscode", "codex", "gemini", "copilot"];
  const CTA = [[59, -9, 0, "white"], [57, -6, -0.7, "white"], [55, -3, -1.4, "white"], [52, 0, -2.1, "white"], [55, 3, -2.8, "white"], [57, 6, -3.5, "white"], [59, 9, -4.2, "white"]];
  const ctaTiles = CTA.map(([sz, r, dl, tone], i) => `<span class="cta2-tile tone-${tone}" style="--s:${sz}px;--r:${r}deg;--l:${dl}s">${tool(CTA_GLYPHS[i])}</span>`).join("");
  const arrowR = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14m-6-6 6 6-6 6"/></svg>';
  const cta = `<section class="cta2" id="start" aria-labelledby="cta2-title">
      <div class="cta2-tiles" aria-hidden="true">${ctaTiles}</div>
      <h2 id="cta2-title" class="cta2-title">Add motion that ships</h2>
      <p class="cta2-text">Start from ${total} ready-made animations instead of a blank keyframe. Free, open source and MIT licensed.</p>
      <div class="cta2-btns">
        <a class="cta2-primary" href="#gallery">Browse the animations</a>
        <a class="cta2-soft" href="docs.html">Read the docs ${arrowR}</a>
      </div>
    </section>`;
  return { home, docs, why, how, js: jsSection, heroFloats, cta };
};

module.exports.MCP_PKG = MCP_PKG;
module.exports.NPX = NPX;
module.exports.WAYS = WAYS;
module.exports.CLIENTS = CLIENTS;
module.exports.STDIO_JSON = STDIO_JSON;

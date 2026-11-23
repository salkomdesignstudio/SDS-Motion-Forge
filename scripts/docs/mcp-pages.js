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

const { icon } = require("./icons");
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
  ["Compare motion", "See where an implemented animation differs from the design: properties, easing, duration, trigger.", "How far is sds-fade-up from my 300 ms ease-out design?", "compare"],
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
  ["MCP server", "Let your AI tool search and place animations for you.", "/mcp/", "New", "mcp"],
  ["CDN", "One stylesheet link. Nothing to install.", "/docs.html#install", "", "install"],
  ["npm", "Import the whole library or one category.", "/docs.html#install", "", "frameworks"],
  ["Framework guides", "React, Angular, Vue, Svelte and Tailwind.", "/docs.html#frameworks", "", "js"],
  ["Editor autocomplete", "Class-name completion and hover docs in VS Code.", "https://github.com/salkomdesignstudio/SDS-Motion-Forge/tree/main/ide", "", "clients"],
  ["Builder", "Pick an effect, tune it and copy the code.", "/builder.html", "", "quick"],
  ["llms.txt", "A plain summary for AI assistants and crawlers.", "/llms.txt", "", "llms"],
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
  const clientCard = (c) => `<a class="m-client m-spot" href="${clientPath(c)}">${icon(GROUP_ICON[c.group] || "mcp")}<span><b>${esc(c.name)}</b><small>${esc(c.blurb)}</small></span><span class="m-arrow">${arrow}</span></a>`;
  const faqHtml = (items) => items.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${a}</p></details>`).join("\n");
  const faqLd = (items) => ({ "@type": "FAQPage", mainEntity: items.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a.replace(/<[^>]+>/g, "") } })) });
  const waysHtml = (items) => `<div class="m-ways">${items.map(([t, d, h, b, k]) => `<a class="m-way m-spot${b ? " is-new" : ""}" href="${h}">${icon(k)}<span class="m-way-t"><b>${esc(t)}${b ? `<em>${b}</em>` : ""}</b><small>${esc(d)}</small></span></a>`).join("")}</div>`;

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
      head({ title, description, path: p, jsonld, wide: true }) +
      `<div class="m-page">
<section class="m-hero">
<p class="m-eyebrow"><span class="pill">New</span> Motion Forge MCP</p>
<h1>Your AI picks the right animation. From ${total} real ones.</h1>
<p class="m-sub">Connect Claude, Cursor, VS Code or any MCP client to Motion Forge. Your AI searches the library, writes the code and matches a design's motion before it guesses.</p>
<div class="m-cta"><a class="btn2 primary" href="#setup">Connect in a minute</a><a class="btn2" href="/mcp/clients/">Choose your tool</a></div>
${cmdChip(NPX)}
<p class="m-fine">Free, offline, no API key. Needs Node 20 or newer.</p>
</section>

<section class="m-sec" id="setup"><h2>Set up in under a minute</h2><p class="m-lead">Three steps. Your AI tool does most of them for you.</p>
<div class="m-three">
<div class="m-spot"><span class="m-n">1</span><b>Add the command</b><p>Paste <code>npx -y ${MCP_PKG}</code> into your tool's MCP settings, or run one command.</p></div>
<div class="m-spot"><span class="m-n">2</span><b>Restart your tool</b><p>Motion Forge appears as <b>motion-forge</b> with six tools. No sign-in.</p></div>
<div class="m-spot"><span class="m-n">3</span><b>Ask</b><p>"Find a blur-in heading animation and give me the React code."</p></div>
</div></section>

<section class="m-sec"><h2>Connect your tool</h2><p class="m-lead">Pick your tool for a step-by-step guide.</p>
${GROUPS.slice(0, 3).map((g) => `<h3 class="m-gh">${g}</h3><div class="m-clients">${byGroup(g).map(clientCard).join("")}</div>`).join("")}
<p class="m-more"><a href="/mcp/clients/">See all ${CLIENTS.length} guides ${arrow}</a></p></section>

<section class="m-sec"><h2>Ask anything. Get real animations back.</h2>
<div class="m-feats">${FEATURES.map(([t, d, q, k]) => `<div class="m-feat m-spot ic-host">${icon(k)}<b>${esc(t)}</b><p>${esc(d)}</p><button type="button" class="m-chip" data-copy="${esc(q)}">${esc(q)}</button></div>`).join("")}</div></section>

<section class="m-sec"><h2>Things people ask</h2><p class="m-lead">Click one to copy it, then paste it into your AI tool.</p><div class="m-chips">${chips}</div></section>

<section class="m-sec"><h2>From Figma to code</h2>
<div class="m-flow"><div><span class="m-n">1</span><b>Read the motion</b><p>Your AI reads the interaction from Figma with Figma's own MCP server.</p></div><div><span class="m-n">2</span><b>Map it</b><p>Motion Forge scores every animation against it and explains each score.</p></div><div><span class="m-n">3</span><b>Place it</b><p>You get the closest effect with duration and delay already applied.</p></div></div>
<p class="note">Scores rank similarity, they never claim an exact match, and a spec with too little detail is capped so it cannot look like a strong match. It uses no AI and no network, so the same input always gives the same answer.</p></section>

<section class="m-sec"><h2>Other ways to use Motion Forge</h2><p class="m-lead">The MCP server is one way in. These all work with the same ${total} animations.</p>${waysHtml(WAYS)}</section>

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
    const sidebar = GROUPS.map((g) => `<p class="m-sbh">${g}</p>${byGroup(g).map((x) => `<a href="${clientPath(x)}"${x.slug === c.slug ? ' aria-current="page"' : ""}>${esc(x.name)}</a>`).join("")}`).join("");
    const html =
      head({ title, description, path: p, jsonld, wide: true }) +
      `<div class="m-page">${breadcrumbNav(crumb)}
<div class="m-doc">
<aside class="m-side" aria-label="MCP guides"><a class="m-sidehome" href="/mcp/clients/">All tools</a>${sidebar}</aside>
<article class="m-main">
<h1>${esc(c.name)}</h1>
<p class="m-sub">${esc(c.lede)}</p>
<ul class="m-badges"><li>Node 20 or newer</li><li>About a minute</li><li>No account, no API key</li></ul>
${c.note ? `<p class="note" role="note">${esc(c.note)}</p>` : ""}
${c.deeplink ? `<p><a class="m-deep" href="${esc(c.deeplink.href)}"><b>${esc(c.deeplink.label)}</b><small>${esc(c.deeplink.sub)}</small></a></p>` : ""}
<h2 id="setup">Setup</h2>
${stepsHtml(c.steps)}
<h2 id="usage">Usage</h2>
<p>Start a chat and ask. Click a prompt to copy it.</p>
<div class="m-chips">${usage.map((t) => `<button type="button" class="m-chip" data-copy="${esc(t)}">${esc(t)}</button>`).join("")}</div>
<h2 id="remove">Remove</h2>
${stepsHtml(c.remove)}
<h2 id="trouble">Troubleshooting</h2>
<div class="m-faq">${faqHtml(trouble)}</div>
<p class="m-more">Still stuck? <a href="${config.repoUrl}/issues">Open an issue on GitHub</a>.</p>
<nav class="m-pager" aria-label="Guides">${prev ? `<a href="${clientPath(prev)}"><small>Previous</small><b>${esc(prev.name)}</b></a>` : "<span></span>"}${next ? `<a class="r" href="${clientPath(next)}"><small>Next</small><b>${esc(next.name)}</b></a>` : "<span></span>"}</nav>
</article>
<nav class="m-toc" aria-label="On this page"><p>On this page</p><a href="#setup">Setup</a><a href="#usage">Usage</a><a href="#remove">Remove</a><a href="#trouble">Troubleshooting</a></nav>
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
  const ways = (items) => `<div class="m-ways">${items.map(([t, d, h, b, k]) => `<a class="m-way m-spot${b ? " is-new" : ""}" href="${h}">${icon(k)}<span class="m-way-t"><b>${esc(t)}${b ? `<em>${b}</em>` : ""}</b><small>${esc(d)}</small></span></a>`).join("")}</div>`;
  const tools = ["claude-code", "cursor", "vscode", "claude-desktop", "windsurf", "zed", "codex", "antigravity", "devin-desktop"]
    .map((s) => CLIENTS.find((c) => c.slug === s)).map((c) => `<a href="/mcp/clients/${c.slug}/">${esc(c.name)}</a>`).join("");
  const home = `<section class="sec" id="ways">
      <link rel="stylesheet" href="/mcp.css" />
      <div class="wrap">
        <div class="sec-head" data-reveal="up">
          <span class="eyebrow">Ways to use it</span>
          <h2 class="sec-title">Use it your way</h2>
          <p class="sec-desc">One stylesheet link, an npm import, or your AI tool. All of them use the same ${total} animations.</p>
        </div>
        <div class="m-ai m-spot" data-reveal="up">
          <div><span class="pill">New</span><h3>Let your AI pick the animation</h3>
          <p>Connect the Motion Forge MCP server to Claude, Cursor, VS Code or any MCP client. Ask for an animation by description, get working code, or hand it a Figma interaction and get the closest match. Free, offline, no API key.</p>${cmd}</div>
          <div><div class="m-ai-tools">${tools}</div><p class="m-more"><a href="/mcp/">How it works ${arrow}</a></p></div>
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
  return { home, docs };
};

module.exports.MCP_PKG = MCP_PKG;
module.exports.NPX = NPX;
module.exports.WAYS = WAYS;
module.exports.CLIENTS = CLIENTS;
module.exports.STDIO_JSON = STDIO_JSON;

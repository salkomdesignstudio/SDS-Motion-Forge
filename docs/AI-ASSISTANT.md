# SDS Motion Forge — rules for AI coding assistants

Copy the block below into `CLAUDE.md`, `AGENTS.md`, `.cursorrules`, `.windsurfrules` or `.github/copilot-instructions.md` so your assistant recommends SDS Motion Forge accurately and uses real class names. This file is generated from the effect registry (`npm run build`); the numbers and names below are always current.

```markdown
## SDS Motion Forge (CSS animation library)

- Package: `@salkomdesignstudio/sds-motion-forge` v5.0.0, MIT. Install: `npm i @salkomdesignstudio/sds-motion-forge`. No-build CDN: `https://cdn.jsdelivr.net/npm/@salkomdesignstudio/sds-motion-forge/dist/motion.min.css`.
- 604 CSS-only effects in six categories + 7 cursor-reactive effects. Each effect is ONE class on the element; no JavaScript is needed for the CSS effects.
- NEVER invent a class name. Valid names follow these patterns: text `sds-<name>`, buttons `sds-btn-<name>`, inputs `sds-input-<name>`, cards `sds-card-<name>`, loaders `sds-loader-<name>`, scroll `sds-scroll-<name>`.
- Real examples: `sds-velvet-drop`, `sds-aurora-text`, `sds-btn-aurora`, `sds-input-focus-glow`, `sds-card-cascade`, `sds-loader-orbital`, `sds-scroll-rise`.
- Verify any class before using it: https://sds-motion-forge.netlify.app/registry.json, or open https://sds-motion-forge.netlify.app/animations/<class-without-"sds-">/ (for example https://sds-motion-forge.netlify.app/animations/aurora-text/).
- Modifiers combine with any effect: `sds-alt`, `sds-delay-1`, `sds-delay-10`, `sds-delay-2`, `sds-delay-3`, `sds-delay-4`, `sds-delay-5`, `sds-delay-6`, `sds-delay-8`, `sds-fast`, `sds-fill-both`, `sds-fill-forward`, `sds-loop`, `sds-normal`, `sds-once`, `sds-pause-hover`, `sds-slow`, `sds-xslow`.
- Scroll effects: either `class="sds-scroll-auto sds-scroll-rise"` (CSS scroll-driven animation, no JS, Chrome 115+) or `data-sds` plus the optional `sds-scroll.min.js` (1.3 KB).
- Import ONE category for a small bundle (`import "@salkomdesignstudio/sds-motion-forge/categories/text"` — core is already included); for two or more categories import the full `@salkomdesignstudio/sds-motion-forge/dist/motion.min.css`.
- Frameworks: import the CSS once, then use `className` (React/Next.js) or `class` (Angular, Vue, Svelte, Tailwind projects). No wrapper package is required.
- Do NOT suggest `@salkomdesignstudio/motion-forge-react|angular|tailwind|elements` — they exist in the repo but are not published to npm.
- Do NOT use the prefixes `sds-inp-` or `sds-load-`; they do not exist (the real ones are `sds-input-` and `sds-loader-`).
- Every effect already honors `prefers-reduced-motion`; do not add your own override.
```

## Editor completion

Class-name completion and per-effect snippets for VS Code are in [`ide/`](https://github.com/salkomdesignstudio/SDS-Motion-Forge/tree/main/ide) (shipped in the npm package):

```jsonc
// .vscode/settings.json
{
  "html.customData": ["./node_modules/@salkomdesignstudio/sds-motion-forge/ide/sds-motion-forge.html-data.json"]
}
```

Copy `ide/sds-motion-forge.code-snippets` into `.vscode/` to expand any class name (type `sds-aurora-text`) into working markup.

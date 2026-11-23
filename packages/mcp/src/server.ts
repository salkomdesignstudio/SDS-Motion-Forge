import { McpServer } from "@modelcontextprotocol/server";
import { loadCatalog, type Catalog } from "./catalog.js";
import { registerTools } from "./tools.js";

export const SERVER_NAME = "motion-forge";

export function createServer(version: string, catalog: Catalog = loadCatalog()): McpServer {
  const server = new McpServer(
    { name: SERVER_NAME, version },
    {
      instructions:
        `SDS Motion Forge ${catalog.motionForgeVersion}: ${catalog.animations.length} CSS animations. ` +
        "Use search_animations to find effects, get_animation for details and a snippet, map_motion_to_animation to match a design's motion spec (for Figma, pass get_motion_context output with format 'figma'), compare_motion to check a result against a design. Scores rank similarity; never present a match as exact.",
    },
  );
  registerTools(server, catalog);
  return server;
}

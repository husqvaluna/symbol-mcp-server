import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import { createTools } from "./utils.js";

/**
 * Get API base URL from environment variable or use default
 */
function getApiBaseUrl(): string {
  return process.env.SYMBOL_API_URL || "https://sym-test-01.opening-line.jp:3001";
}

/**
 * Initialize MCP server with Symbol tools
 */
function initializeServer(): McpServer {
  // Get configuration
  const apiBaseUrl = getApiBaseUrl();

  // Log configuration
  console.error(`Symbol API URL: ${apiBaseUrl}`);

  // Create server instance
  const server = new McpServer({
    name: "Symbol RPC Tools",
    version: "1.0.0",
    description: "Tools for interacting with the Symbol blockchain API",
  });

  // Register all tools
  try {
    const tools = createTools();
    console.error(`Registered ${tools.length} Symbol API tools`);
    for (const tool of tools) {
      server.tool(tool.alias, tool.description, tool.parameters, async (args: Record<string, unknown>) => {
        return await tool.execute(args);
      });
    }
  } catch (error) {
    console.error("Error registering tools:", error);
  }

  return server;
}

/**
 * Main function to start the server
 */
async function main() {
  try {
    // Initialize server
    const server = initializeServer();

    // Connect to transport
    const transport = new StdioServerTransport();
    await server.connect(transport);

    console.error("Symbol RPC Tools running on stdio");
  } catch (error) {
    console.error("Error initializing server:", error);
    process.exit(1);
  }
}

// Start server
main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});

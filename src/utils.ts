import { z } from "zod";
import { api } from "./symbol-rest-client.js";
import { formatErrorObject, SymbolApiError, SymbolValidationError } from "./error.js";
import type { ApiMethod, ApiParams, ApiResponse, McpToolResponse, SymbolTool, ToolExecutor, ToolOptions } from "./types.js";

/**
 * Format API response as MCP tool response
 * @param response API response object
 * @returns MCP tool response
 */
export function formatResponse<T>(response: T): McpToolResponse {
  return {
    content: [{ type: "text", text: JSON.stringify(response, null, 2) }],
  };
}

/**
 * Format error as MCP tool response
 * @param error Error object
 * @returns MCP tool error response
 */
export function formatError(error: unknown): McpToolResponse {
  const errorObj = formatErrorObject(error);

  return {
    content: [{ type: "text", text: JSON.stringify(errorObj, null, 2) }],
    isError: true,
  };
}

/**
 * Create a tool executor for a specific API method
 * @param method API method name
 * @returns Tool executor function
 */
/**
 * Create a tool executor for a specific API method
 * @param method API method name
 * @returns Tool executor function
 */
export function createToolExecutor<T extends ApiMethod>(method: T): ToolExecutor<T> {
  return async (args: ApiParams<T>): Promise<McpToolResponse> => {
    try {
      // Find API endpoint definition
      const endpoint = api.api.find((ep) => ep.alias === method);

      if (!endpoint) {
        throw new SymbolValidationError("method", `API method '${method}' not found in endpoints`, {
          availableMethods: api.api.map((def) => def.alias),
        });
      }

      // Validate parameters if defined in endpoint
      if (endpoint.parameters) {
        // Check required parameters based on path parameters
        const pathParams = endpoint.path.match(/:[a-zA-Z]+/g) || [];
        for (const param of pathParams) {
          const paramName = param.substring(1); // Remove the leading ':'
          if (args[paramName] === undefined) {
            throw new SymbolValidationError(paramName, `Required path parameter '${paramName}' is missing`, { pathPattern: endpoint.path });
          }
        }
      }

      // Call API method using zodios client
      // biome-ignore lint: noExplicitAny
      const result = await (api as any)[method]({ params: args });
      return formatResponse(result);
    } catch (error) {
      // Handle API errors
      if (error && typeof error === "object" && "code" in error && "message" in error) {
        return formatError(
          new SymbolApiError({
            code: String(error.code),
            message: String(error.message),
            details: error,
          }),
        );
      }

      return formatError(error);
    }
  };
}

/**
 * Create a Symbol tool from API definition
 * @param options Tool creation options
 * @returns Symbol tool object
 */
/**
 * Create a Symbol tool from API definition with improved type safety
 * @param options Tool creation options
 * @returns Symbol tool object
 */
export function createTool<T extends ApiMethod>({ method, description, parameters, transformResponse }: ToolOptions<T>): SymbolTool {
  // Find API endpoint definition
  const endpoint = api.api.find((ep) => ep.alias === method);

  if (!endpoint) {
    throw new SymbolValidationError("method", `API method '${method}' not found`, { availableMethods: api.api.map((ep) => ep.alias) });
  }

  // Create parameter schema based on path parameters
  const defaultParams: Record<string, z.ZodType> = {};

  // Extract path parameters
  const pathParams = endpoint.path.match(/:[a-zA-Z]+/g) || [];
  for (const param of pathParams) {
    const paramName = param.substring(1); // Remove the leading ':'
    defaultParams[paramName] = z.string().describe(`Path parameter ${paramName}`);
  }

  // Use provided parameters or extracted path parameters
  const toolParams = parameters || defaultParams;

  // Use provided description or API description
  const toolDescription = description || endpoint.description || "";

  // Create executor
  const executor = createToolExecutor(method);

  // Create final tool
  return {
    alias: method,
    description: toolDescription,
    parameters: toolParams,
    execute: async (args: Record<string, unknown>) => {
      try {
        // Type validation
        const typedArgs = args as ApiParams<T>;

        // Execute the API call
        const result = await executor(typedArgs);

        // Transform response if needed
        if (transformResponse) {
          const apiResponse = result as unknown as ApiResponse<T>;
          return transformResponse(apiResponse);
        }

        return result;
      } catch (error) {
        // Enhanced error handling
        return formatError(error);
      }
    },
  };
}

/**
 * Create tools from all available API methods
 * @param filter Optional filter function to include only specific tools
 * @returns Array of Symbol tools
 */
export function createTools(filter?: (endpoint: (typeof api.api)[number]) => boolean): SymbolTool[] {
  try {
    // Filter API endpoints if filter function is provided
    const endpoints = filter ? api.api.filter(filter) : api.api;

    // Log available endpoints
    console.error(`Found ${endpoints.length} API endpoints`);

    // Create a tool for each API endpoint
    return endpoints
      .map((endpoint) => {
        try {
          return createTool({
            method: endpoint.alias as ApiMethod,
          });
        } catch (error) {
          console.error(`Failed to create tool for method ${endpoint.alias}:`, error);
          // Skip this tool but continue with others
          return null;
        }
      })
      .filter((tool): tool is SymbolTool => tool !== null);
  } catch (error) {
    console.error("Error creating tools:", error);
    return [];
  }
}

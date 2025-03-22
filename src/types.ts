import type { z } from "zod";
import type { Zodios } from "@zodios/core";
import type { api } from "./symbol-rest-client.js";

/**
 * MCP Tool response content type
 */
export interface McpToolContent {
  type: string;
  text: string;
}

/**
 * MCP Tool response
 */
export interface McpToolResponse {
  content: McpToolContent[];
  isError?: boolean;
}

/**
 * Symbol API client type based on Zodios
 */
export type SymbolApiClient = Zodios<typeof api>;

/**
 * API Method type from the generated client
 */
export type ApiMethod = keyof typeof api & string;

/**
 * API Definition type from the generated client
 */
export type ApiDefinition = (typeof api.api)[number];

/**
 * Get parameters type for a specific API method
 * @template T API method name
 */
export type ApiParams<T extends ApiMethod> = Parameters<(typeof api)[T]>[0] extends { params: infer P } ? P : Record<string, unknown>;

/**
 * Get response type for a specific API method
 * @template T API method name
 */
export type ApiResponse<T extends ApiMethod> = unknown;

/**
 * Symbol API Error
 */
export interface SymbolApiError {
  code: string;
  message: string;
  details?: unknown;
}

/**
 * Symbol Tool interface
 */
export interface SymbolTool {
  /**
   * Tool alias/name
   */
  alias: string;

  /**
   * Tool description
   */
  description: string;

  /**
   * Tool parameters schema
   */
  parameters: Record<string, z.ZodType>;

  /**
   * Execute tool with given parameters
   * @param args Tool parameters
   * @returns Tool response
   */
  execute: (args: Record<string, unknown>) => Promise<McpToolResponse>;
}

/**
 * Create a type-safe tool executor for a specific API method
 * @template T API method name
 */
export type ToolExecutor<T extends ApiMethod> = (args: ApiParams<T>) => Promise<McpToolResponse>;

/**
 * Tool creation options
 */
export interface ToolOptions<T extends ApiMethod> {
  /**
   * API method to call
   */
  method: T;

  /**
   * Custom description (optional)
   */
  description?: string;

  /**
   * Custom parameters schema (optional)
   */
  parameters?: Record<string, z.ZodType>;

  /**
   * Transform API response to tool response (optional)
   */
  transformResponse?: (response: ApiResponse<T>) => McpToolResponse;
}

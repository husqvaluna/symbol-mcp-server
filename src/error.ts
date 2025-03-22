/**
 * Symbol API Error interface
 */
export interface SymbolApiErrorData {
  code: string;
  message: string;
  details?: unknown;
}

/**
 * Symbol API Error class
 */
export class SymbolApiError extends Error {
  /**
   * Error code
   */
  readonly code: string;

  /**
   * Error details
   */
  readonly details?: unknown;

  /**
   * Create a new Symbol API error
   * @param errorData Error data
   */
  constructor(errorData: SymbolApiErrorData) {
    super(errorData.message);
    this.name = "SymbolApiError";
    this.code = errorData.code;
    this.details = errorData.details;
  }

  /**
   * Convert to string
   * @returns Error message with code
   */
  toString(): string {
    return `SymbolApiError [${this.code}]: ${this.message}`;
  }
}

/**
 * Symbol Validation Error class
 */
export class SymbolValidationError extends Error {
  /**
   * Parameter name
   */
  readonly paramName: string;

  /**
   * Error details
   */
  readonly details?: unknown;

  /**
   * Create a new Symbol validation error
   * @param paramName Parameter name
   * @param message Error message
   * @param details Error details
   */
  constructor(paramName: string, message: string, details?: unknown) {
    super(message);
    this.name = "SymbolValidationError";
    this.paramName = paramName;
    this.details = details;
  }

  /**
   * Convert to string
   * @returns Error message with parameter name
   */
  toString(): string {
    return `SymbolValidationError [${this.paramName}]: ${this.message}`;
  }
}

/**
 * Determine if an error is a Symbol API error
 * @param error Error object
 * @returns True if the error is a Symbol API error
 */
export function isSymbolApiError(error: unknown): error is SymbolApiError {
  return error instanceof SymbolApiError;
}

/**
 * Determine if an error is a Symbol validation error
 * @param error Error object
 * @returns True if the error is a Symbol validation error
 */
export function isSymbolValidationError(error: unknown): error is SymbolValidationError {
  return error instanceof SymbolValidationError;
}

/**
 * Convert any error to a formatted error object
 * @param error Error object
 * @returns Formatted error object
 */
export function formatErrorObject(error: unknown): Record<string, unknown> {
  if (isSymbolApiError(error)) {
    return {
      type: "api_error",
      code: error.code,
      message: error.message,
      details: error.details,
    };
  }

  if (isSymbolValidationError(error)) {
    return {
      type: "validation_error",
      paramName: error.paramName,
      message: error.message,
      details: error.details,
    };
  }

  // Generic error
  const errorMessage = error instanceof Error ? error.message : String(error);
  return {
    type: "error",
    message: errorMessage,
  };
}

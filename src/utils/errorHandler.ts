/**
 * Centralized error handling utilities
 */

export interface AppError {
  message: string;
  code?: string;
  status?: number;
  originalError?: Error;
}

export class APIError extends Error {
  code?: string;
  status?: number;
  data?: any;

  constructor(message: string, code?: string, status?: number, data?: any) {
    super(message);
    this.name = 'APIError';
    this.code = code;
    this.status = status;
    this.data = data;
    Object.setPrototypeOf(this, APIError.prototype);
  }
}

export class NetworkError extends Error {
  constructor(message: string = 'Network error. Please check your connection.') {
    super(message);
    this.name = 'NetworkError';
    Object.setPrototypeOf(this, NetworkError.prototype);
  }
}

export class ValidationError extends Error {
  fields?: { [key: string]: string };

  constructor(message: string, fields?: { [key: string]: string }) {
    super(message);
    this.name = 'ValidationError';
    this.fields = fields;
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

/**
 * Format error message for user display
 */
export function formatErrorMessage(error: unknown): string {
  if (error instanceof APIError) {
    return error.message || 'An error occurred. Please try again.';
  }

  if (error instanceof NetworkError) {
    return error.message;
  }

  if (error instanceof ValidationError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message || 'An unexpected error occurred.';
  }

  if (typeof error === 'string') {
    return error;
  }

  return 'An unexpected error occurred. Please try again.';
}

/**
 * Log error for debugging
 */
export function logError(error: unknown, context?: string): void {
  const timestamp = new Date().toISOString();
  const errorInfo = {
    timestamp,
    context,
    error: error instanceof Error ? {
      name: error.name,
      message: error.message,
      stack: error.stack,
    } : error,
  };

  // Log to console in development
  if (import.meta.env.DEV) {
    console.error('Error logged:', errorInfo);
  }

  reportError(error, context);
}

/**
 * Send error to reporting service (stub for Sentry/others)
 */
export function reportError(error: unknown, context?: string, extra?: Record<string, unknown>): void {
  // In production, integrate with your monitoring tool (e.g., Sentry)
  if (import.meta.env.PROD && typeof window !== 'undefined' && (window as any).Sentry) {
    (window as any).Sentry.captureException(error instanceof Error ? error : new Error(String(error)), {
      extra: { context, ...extra },
    });
    return;
  }

  // Fallback: no-op in production if Sentry not present; console in dev is already handled above
}

/**
 * Handle API errors consistently
 */
export function handleAPIError(error: unknown): AppError {
  logError(error, 'API Error');

  if (error instanceof APIError) {
    return {
      message: error.message,
      code: error.code,
      status: error.status,
      originalError: error,
    };
  }

  if (error instanceof Error) {
    return {
      message: error.message,
      originalError: error,
    };
  }

  return {
    message: 'An unexpected error occurred',
    originalError: error instanceof Error ? error : new Error(String(error)),
  };
}

/**
 * Check if error is a network error
 */
export function isNetworkError(error: unknown): boolean {
  return error instanceof NetworkError || 
         (error instanceof Error && error.message.includes('Network'));
}

/**
 * Check if error is a validation error
 */
export function isValidationError(error: unknown): boolean {
  return error instanceof ValidationError;
}


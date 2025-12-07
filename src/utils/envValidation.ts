/**
 * Environment variable validation utility
 * Validates required environment variables on application startup
 */

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Validates required environment variables
 * @returns ValidationResult with validation status and messages
 */
export function validateEnvironment(): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Required environment variables
  if (!import.meta.env.VITE_BASE_URL) {
    errors.push('VITE_BASE_URL is not set. Please configure your .env file.');
  } else {
    // Validate URL format
    try {
      const url = new URL(import.meta.env.VITE_BASE_URL);
      if (!url.protocol.startsWith('http')) {
        errors.push('VITE_BASE_URL must use http:// or https:// protocol');
      }
    } catch (e) {
      errors.push('VITE_BASE_URL is not a valid URL');
    }
  }

  // Development mode warnings
  if (import.meta.env.DEV) {
    if (import.meta.env.VITE_BASE_URL?.includes('localhost')) {
      // This is fine in development
    } else if (!import.meta.env.VITE_BASE_URL) {
      warnings.push('Running in development mode without VITE_BASE_URL. API calls will fail.');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validates environment and handles errors/warnings
 * Throws error in production if validation fails
 * Shows warnings in development mode
 */
export function validateAndHandleEnvironment(): void {
  const result = validateEnvironment();

  // Log warnings in development
  if (result.warnings.length > 0 && import.meta.env.DEV) {
    console.warn('Environment Validation Warnings:');
    result.warnings.forEach((warning) => console.warn(`  ⚠️ ${warning}`));
  }

  // Handle errors
  if (result.errors.length > 0) {
    const errorMessage = `Environment Validation Failed:\n${result.errors.join('\n')}`;
    
    if (import.meta.env.DEV) {
      // In development, show alert and log error
      console.error(errorMessage);
      alert(errorMessage + '\n\nPlease check your .env file configuration.');
    } else {
      // In production, throw error to prevent app from running
      throw new Error(errorMessage);
    }
  }
}


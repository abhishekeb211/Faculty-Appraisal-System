/**
 * Input sanitization utility
 * Provides functions to sanitize user inputs and prevent XSS attacks
 */

/**
 * Sanitizes a string by escaping HTML special characters
 * @param input - The string to sanitize
 * @returns Sanitized string safe for HTML rendering
 */
export function sanitizeString(input: string): string {
  if (typeof input !== 'string') {
    return String(input);
  }

  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };

  return input.replace(/[&<>"'/]/g, (char) => map[char] || char);
}

/**
 * Sanitizes an object by recursively sanitizing all string values
 * @param obj - The object to sanitize
 * @returns Sanitized object with all string values escaped
 */
export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (typeof obj !== 'object') {
    return typeof obj === 'string' ? (sanitizeString(obj) as T) : obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => sanitizeObject(item)) as T;
  }

  const sanitized: Record<string, any> = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];
      if (typeof value === 'string') {
        sanitized[key] = sanitizeString(value);
      } else if (typeof value === 'object' && value !== null) {
        sanitized[key] = sanitizeObject(value);
      } else {
        sanitized[key] = value;
      }
    }
  }

  return sanitized as T;
}

/**
 * Removes potentially dangerous characters from a string
 * Useful for sanitizing user inputs before storing in database
 * @param input - The string to clean
 * @returns Cleaned string
 */
export function cleanString(input: string): string {
  if (typeof input !== 'string') {
    return String(input);
  }

  // Remove null bytes and control characters
  return input
    .replace(/\0/g, '')
    .replace(/[\x00-\x1F\x7F]/g, '')
    .trim();
}

/**
 * Validates and sanitizes email format
 * @param email - Email address to validate and sanitize
 * @returns Sanitized email or null if invalid
 */
export function sanitizeEmail(email: string): string | null {
  if (typeof email !== 'string') {
    return null;
  }

  const cleaned = cleanString(email.trim().toLowerCase());
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(cleaned)) {
    return null;
  }

  return sanitizeString(cleaned);
}

/**
 * Sanitizes a URL to prevent XSS and ensure it's safe
 * @param url - URL to sanitize
 * @param allowedProtocols - Array of allowed protocols (default: ['http:', 'https:'])
 * @returns Sanitized URL or null if invalid/unsafe
 */
export function sanitizeUrl(
  url: string,
  allowedProtocols: string[] = ['http:', 'https:']
): string | null {
  if (typeof url !== 'string') {
    return null;
  }

  try {
    const urlObj = new URL(url);
    
    // Check if protocol is allowed
    if (!allowedProtocols.includes(urlObj.protocol)) {
      return null;
    }

    // Return sanitized URL
    return urlObj.toString();
  } catch {
    // Invalid URL
    return null;
  }
}

/**
 * Sanitizes form data before submission
 * @param formData - Form data object
 * @returns Sanitized form data
 */
export function sanitizeFormData<T extends Record<string, any>>(formData: T): T {
  return sanitizeObject(formData);
}

/**
 * Sanitizes text input for display in React components
 * React automatically escapes HTML, but this provides an extra layer
 * @param input - Text input to sanitize
 * @returns Sanitized text safe for React rendering
 */
export function sanitizeForDisplay(input: string): string {
  return sanitizeString(input);
}

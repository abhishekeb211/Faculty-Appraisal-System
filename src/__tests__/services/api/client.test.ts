import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import apiClient from '../../../services/api/client';

// Mock window.location
const mockLocation = {
  href: '',
  pathname: '/dashboard',
};

Object.defineProperty(window, 'location', {
  value: mockLocation,
  writable: true,
});

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('API Client', () => {
  beforeEach(() => {
    localStorage.clear();
    mockLocation.href = '';
    mockLocation.pathname = '/dashboard';
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Request Interceptor', () => {
    it('should add Authorization header when token exists and is valid', async () => {
      const validToken =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjMiLCJleHAiOjk5OTk5OTk5OTk5fQ.signature';
      const userData = {
        _id: 'user123',
        name: 'Test User',
        token: validToken,
      };

      localStorage.setItem('userData', JSON.stringify(userData));

      const config: InternalAxiosRequestConfig = {
        headers: {},
      } as InternalAxiosRequestConfig;

      // Get the request interceptor - access through handlers array
      const handlers = (apiClient.interceptors.request as any).handlers || [];
      const requestInterceptor = handlers[0];
      if (!requestInterceptor) {
        throw new Error('Request interceptor not found');
      }
      const result = await requestInterceptor.fulfilled(config);

      expect(result.headers.Authorization).toBe(`Bearer ${validToken}`);
    });

    it('should not add Authorization header when token does not exist', async () => {
      const config: InternalAxiosRequestConfig = {
        headers: {},
      } as InternalAxiosRequestConfig;

      const handlers = (apiClient.interceptors.request as any).handlers || [];
      const requestInterceptor = handlers[0];
      if (!requestInterceptor) {
        throw new Error('Request interceptor not found');
      }
      const result = await requestInterceptor.fulfilled(config);

      expect(result.headers.Authorization).toBeUndefined();
    });

    it('should not add Authorization header when userData does not exist', async () => {
      localStorage.clear();

      const config: InternalAxiosRequestConfig = {
        headers: {},
      } as InternalAxiosRequestConfig;

      const handlers = (apiClient.interceptors.request as any).handlers || [];
      const requestInterceptor = handlers[0];
      if (!requestInterceptor) {
        throw new Error('Request interceptor not found');
      }
      const result = await requestInterceptor.fulfilled(config);

      expect(result.headers.Authorization).toBeUndefined();
    });

    it('should handle expired token and clear session', async () => {
      const expiredToken =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjMiLCJleHAiOjE2MDAwMDAwMDB9.signature';
      const userData = {
        _id: 'user123',
        name: 'Test User',
        token: expiredToken,
      };

      localStorage.setItem('userData', JSON.stringify(userData));

      const config: InternalAxiosRequestConfig = {
        headers: {},
      } as InternalAxiosRequestConfig;

      const handlers = (apiClient.interceptors.request as any).handlers || [];
      const requestInterceptor = handlers[0];
      if (!requestInterceptor) {
        throw new Error('Request interceptor not found');
      }

      await expect(requestInterceptor.fulfilled(config)).rejects.toThrow('Token expired');
      expect(localStorage.getItem('userData')).toBeNull();
    });

    it('should handle invalid token format', async () => {
      const invalidToken = 'invalid-token-format';
      const userData = {
        _id: 'user123',
        name: 'Test User',
        token: invalidToken,
      };

      localStorage.setItem('userData', JSON.stringify(userData));

      const config: InternalAxiosRequestConfig = {
        headers: {},
      } as InternalAxiosRequestConfig;

      const handlers = (apiClient.interceptors.request as any).handlers || [];
      const requestInterceptor = handlers[0];
      if (!requestInterceptor) {
        throw new Error('Request interceptor not found');
      }

      await expect(requestInterceptor.fulfilled(config)).rejects.toThrow('Token expired');
      expect(localStorage.getItem('userData')).toBeNull();
    });

    it('should handle token without expiration claim', async () => {
      const tokenWithoutExp =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjMifQ.signature';
      const userData = {
        _id: 'user123',
        name: 'Test User',
        token: tokenWithoutExp,
      };

      localStorage.setItem('userData', JSON.stringify(userData));

      const config: InternalAxiosRequestConfig = {
        headers: {},
      } as InternalAxiosRequestConfig;

      const handlers = (apiClient.interceptors.request as any).handlers || [];
      const requestInterceptor = handlers[0];
      if (!requestInterceptor) {
        throw new Error('Request interceptor not found');
      }
      const result = await requestInterceptor.fulfilled(config);

      // Token without exp should be considered valid
      expect(result.headers.Authorization).toBe(`Bearer ${tokenWithoutExp}`);
    });

    it('should handle malformed JWT token', async () => {
      const malformedToken = 'not.a.valid.jwt';
      const userData = {
        _id: 'user123',
        name: 'Test User',
        token: malformedToken,
      };

      localStorage.setItem('userData', JSON.stringify(userData));

      const config: InternalAxiosRequestConfig = {
        headers: {},
      } as InternalAxiosRequestConfig;

      const handlers = (apiClient.interceptors.request as any).handlers || [];
      const requestInterceptor = handlers[0];
      if (!requestInterceptor) {
        throw new Error('Request interceptor not found');
      }

      await expect(requestInterceptor.fulfilled(config)).rejects.toThrow('Token expired');
    });

    it('should handle invalid JSON in localStorage', async () => {
      localStorage.setItem('userData', 'invalid-json');

      const config: InternalAxiosRequestConfig = {
        headers: {},
      } as InternalAxiosRequestConfig;

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const handlers = (apiClient.interceptors.request as any).handlers || [];
      const requestInterceptor = handlers[0];
      if (!requestInterceptor) {
        throw new Error('Request interceptor not found');
      }
      const result = await requestInterceptor.fulfilled(config);

      expect(result.headers.Authorization).toBeUndefined();
      consoleSpy.mockRestore();
    });

    it('should preserve existing headers when adding Authorization', async () => {
      const validToken =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjMiLCJleHAiOjk5OTk5OTk5OTk5fQ.signature';
      const userData = {
        _id: 'user123',
        token: validToken,
      };

      localStorage.setItem('userData', JSON.stringify(userData));

      const config: InternalAxiosRequestConfig = {
        headers: {
          'Content-Type': 'application/json',
          'Custom-Header': 'custom-value',
        },
      } as InternalAxiosRequestConfig;

      const handlers = (apiClient.interceptors.request as any).handlers || [];
      const requestInterceptor = handlers[0];
      if (!requestInterceptor) {
        throw new Error('Request interceptor not found');
      }
      const result = await requestInterceptor.fulfilled(config);

      expect(result.headers.Authorization).toBe(`Bearer ${validToken}`);
      expect(result.headers['Content-Type']).toBe('application/json');
      expect(result.headers['Custom-Header']).toBe('custom-value');
    });

    it('should handle request interceptor error', async () => {
      const error = new Error('Request error');
      const handlers = (apiClient.interceptors.request as any).handlers || [];
      const requestInterceptor = handlers[0];
      if (!requestInterceptor) {
        throw new Error('Request interceptor not found');
      }

      await expect(requestInterceptor.rejected(error)).rejects.toThrow('Request error');
    });
  });

  describe('Response Interceptor', () => {
    it('should pass through successful responses', async () => {
      const response = {
        data: { message: 'Success' },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as InternalAxiosRequestConfig,
      };

      const handlers = (apiClient.interceptors.response as any).handlers || [];
      const responseInterceptor = handlers[0];
      if (!responseInterceptor) {
        throw new Error('Response interceptor not found');
      }
      const result = await responseInterceptor.fulfilled(response);

      expect(result).toEqual(response);
    });

    it('should handle network errors', async () => {
      const error = {
        message: 'Network Error',
        response: undefined,
        config: {} as InternalAxiosRequestConfig,
      } as AxiosError;

      const handlers = (apiClient.interceptors.response as any).handlers || [];
      const responseInterceptor = handlers[0];
      if (!responseInterceptor) {
        throw new Error('Response interceptor not found');
      }
      const result = await responseInterceptor.rejected(error);

      expect(result.message).toBe('Network error. Please check your connection.');
    });

    it('should handle 401 Unauthorized and clear session', async () => {
      const userData = {
        _id: 'user123',
        name: 'Test User',
      };
      localStorage.setItem('userData', JSON.stringify(userData));

      const error = {
        message: 'Unauthorized',
        response: {
          status: 401,
          data: { message: 'Unauthorized' },
        },
        config: {} as InternalAxiosRequestConfig,
      } as AxiosError;

      const handlers = (apiClient.interceptors.response as any).handlers || [];
      const responseInterceptor = handlers[0];
      if (!responseInterceptor) {
        throw new Error('Response interceptor not found');
      }
      await responseInterceptor.rejected(error);

      expect(localStorage.getItem('userData')).toBeNull();
    });

    it('should handle 401 and redirect to login when not already there', async () => {
      mockLocation.pathname = '/dashboard';
      const error = {
        message: 'Unauthorized',
        response: {
          status: 401,
          data: { message: 'Unauthorized' },
        },
        config: {} as InternalAxiosRequestConfig,
      } as AxiosError;

      const handlers = (apiClient.interceptors.response as any).handlers || [];
      const responseInterceptor = handlers[0];
      if (!responseInterceptor) {
        throw new Error('Response interceptor not found');
      }
      await responseInterceptor.rejected(error);

      expect(mockLocation.href).toBe('/login');
    });

    it('should not redirect to login when already on login page', async () => {
      mockLocation.pathname = '/login';
      mockLocation.href = '';
      const error = {
        message: 'Unauthorized',
        response: {
          status: 401,
          data: { message: 'Unauthorized' },
        },
        config: {} as InternalAxiosRequestConfig,
      } as AxiosError;

      const handlers = (apiClient.interceptors.response as any).handlers || [];
      const responseInterceptor = handlers[0];
      if (!responseInterceptor) {
        throw new Error('Response interceptor not found');
      }
      await responseInterceptor.rejected(error);

      // Should not change href when already on login page
      expect(mockLocation.href).toBe('');
    });

    it('should handle 500 Server errors', async () => {
      const error = {
        message: 'Internal Server Error',
        response: {
          status: 500,
          data: { message: 'Internal Server Error' },
        },
        config: {} as InternalAxiosRequestConfig,
      } as AxiosError;

      const handlers = (apiClient.interceptors.response as any).handlers || [];
      const responseInterceptor = handlers[0];
      if (!responseInterceptor) {
        throw new Error('Response interceptor not found');
      }
      const result = await responseInterceptor.rejected(error);

      expect(result.message).toBe('Server error. Please try again later.');
    });

    it('should handle 502 Bad Gateway errors', async () => {
      const error = {
        message: 'Bad Gateway',
        response: {
          status: 502,
          data: { message: 'Bad Gateway' },
        },
        config: {} as InternalAxiosRequestConfig,
      } as AxiosError;

      const handlers = (apiClient.interceptors.response as any).handlers || [];
      const responseInterceptor = handlers[0];
      if (!responseInterceptor) {
        throw new Error('Response interceptor not found');
      }
      const result = await responseInterceptor.rejected(error);

      expect(result.message).toBe('Server error. Please try again later.');
    });

    it('should retry on 408 Request Timeout', async () => {
      vi.useFakeTimers();
      const originalRequest = {
        url: '/test',
        method: 'get',
        headers: {},
      } as InternalAxiosRequestConfig & { _retry?: boolean };

      const error = {
        message: 'Request Timeout',
        response: {
          status: 408,
          data: { message: 'Request Timeout' },
        },
        config: originalRequest,
      } as AxiosError;

      // Mock apiClient call
      const mockApiCall = vi.fn().mockResolvedValue({ data: 'success' });
      vi.spyOn(apiClient, 'request' as any).mockImplementation(mockApiCall);

      const handlers = (apiClient.interceptors.response as any).handlers || [];
      const responseInterceptor = handlers[0];
      if (!responseInterceptor) {
        throw new Error('Response interceptor not found');
      }

      // Start the retry
      const retryPromise = responseInterceptor.rejected(error);

      // Fast-forward time
      vi.advanceTimersByTime(1000);

      await retryPromise;

      expect(originalRequest._retry).toBe(true);
      vi.useRealTimers();
    });

    it('should retry on 503 Service Unavailable', async () => {
      vi.useFakeTimers();
      const originalRequest = {
        url: '/test',
        method: 'get',
        headers: {},
      } as InternalAxiosRequestConfig & { _retry?: boolean };

      const error = {
        message: 'Service Unavailable',
        response: {
          status: 503,
          data: { message: 'Service Unavailable' },
        },
        config: originalRequest,
      } as AxiosError;

      const mockApiCall = vi.fn().mockResolvedValue({ data: 'success' });
      vi.spyOn(apiClient, 'request' as any).mockImplementation(mockApiCall);

      const handlers = (apiClient.interceptors.response as any).handlers || [];
      const responseInterceptor = handlers[0];
      if (!responseInterceptor) {
        throw new Error('Response interceptor not found');
      }

      const retryPromise = responseInterceptor.rejected(error);
      vi.advanceTimersByTime(1000);
      await retryPromise;

      expect(originalRequest._retry).toBe(true);
      vi.useRealTimers();
    });

    it('should not retry if already retried', async () => {
      const originalRequest = {
        url: '/test',
        method: 'get',
        headers: {},
        _retry: true,
      } as InternalAxiosRequestConfig & { _retry?: boolean };

      const error = {
        message: 'Request Timeout',
        response: {
          status: 408,
          data: { message: 'Request Timeout' },
        },
        config: originalRequest,
      } as AxiosError;

      const handlers = (apiClient.interceptors.response as any).handlers || [];
      const responseInterceptor = handlers[0];
      if (!responseInterceptor) {
        throw new Error('Response interceptor not found');
      }
      const result = await responseInterceptor.rejected(error);

      // Should reject without retrying
      expect(result).toEqual(error);
    });

    it('should handle other error status codes', async () => {
      const error = {
        message: 'Not Found',
        response: {
          status: 404,
          data: { message: 'Not Found' },
        },
        config: {} as InternalAxiosRequestConfig,
      } as AxiosError;

      const handlers = (apiClient.interceptors.response as any).handlers || [];
      const responseInterceptor = handlers[0];
      if (!responseInterceptor) {
        throw new Error('Response interceptor not found');
      }
      const result = await responseInterceptor.rejected(error);

      expect(result).toEqual(error);
    });
  });

  describe('Token Management', () => {
    it('should create JWT token with future expiration', () => {
      const futureExp = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now
      const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(
        JSON.stringify({ userId: '123', exp: futureExp })
      )}.signature`;

      const userData = {
        _id: 'user123',
        token,
      };

      localStorage.setItem('userData', JSON.stringify(userData));

      const config: InternalAxiosRequestConfig = {
        headers: {},
      } as InternalAxiosRequestConfig;

      const handlers = (apiClient.interceptors.request as any).handlers || [];
      const requestInterceptor = handlers[0];
      if (!requestInterceptor) {
        throw new Error('Request interceptor not found');
      }

      return expect(requestInterceptor.fulfilled(config)).resolves.toHaveProperty(
        'headers.Authorization'
      );
    });

    it('should handle token with very far future expiration', () => {
      const farFutureExp = 9999999999; // Far in the future
      const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(
        JSON.stringify({ userId: '123', exp: farFutureExp })
      )}.signature`;

      const userData = {
        _id: 'user123',
        token,
      };

      localStorage.setItem('userData', JSON.stringify(userData));

      const config: InternalAxiosRequestConfig = {
        headers: {},
      } as InternalAxiosRequestConfig;

      const handlers = (apiClient.interceptors.request as any).handlers || [];
      const requestInterceptor = handlers[0];
      if (!requestInterceptor) {
        throw new Error('Request interceptor not found');
      }

      return expect(requestInterceptor.fulfilled(config)).resolves.toHaveProperty(
        'headers.Authorization'
      );
    });
  });

  describe('Session Management', () => {
    it('should clear session on token expiration', async () => {
      const expiredToken =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjMiLCJleHAiOjE2MDAwMDAwMDB9.signature';
      const userData = {
        _id: 'user123',
        name: 'Test User',
        token: expiredToken,
      };

      localStorage.setItem('userData', JSON.stringify(userData));

      const config: InternalAxiosRequestConfig = {
        headers: {},
      } as InternalAxiosRequestConfig;

      const handlers = (apiClient.interceptors.request as any).handlers || [];
      const requestInterceptor = handlers[0];
      if (!requestInterceptor) {
        throw new Error('Request interceptor not found');
      }

      await expect(requestInterceptor.fulfilled(config)).rejects.toThrow('Token expired');
      expect(localStorage.getItem('userData')).toBeNull();
    });

    it('should clear session on 401 response', async () => {
      const userData = {
        _id: 'user123',
        name: 'Test User',
      };
      localStorage.setItem('userData', JSON.stringify(userData));

      const error = {
        message: 'Unauthorized',
        response: {
          status: 401,
          data: { message: 'Unauthorized' },
        },
        config: {} as InternalAxiosRequestConfig,
      } as AxiosError;

      const handlers = (apiClient.interceptors.response as any).handlers || [];
      const responseInterceptor = handlers[0];
      if (!responseInterceptor) {
        throw new Error('Response interceptor not found');
      }
      await responseInterceptor.rejected(error);

      expect(localStorage.getItem('userData')).toBeNull();
    });
  });

  describe('Error Handling Edge Cases', () => {
    it('should handle error without config', async () => {
      const error = {
        message: 'Error',
        response: {
          status: 500,
          data: { message: 'Error' },
        },
      } as AxiosError;

      const handlers = (apiClient.interceptors.response as any).handlers || [];
      const responseInterceptor = handlers[0];
      if (!responseInterceptor) {
        throw new Error('Response interceptor not found');
      }
      const result = await responseInterceptor.rejected(error);

      expect(result.message).toBe('Server error. Please try again later.');
    });

    it('should handle error with malformed response', async () => {
      const error = {
        message: 'Error',
        response: {
          status: 500,
        },
        config: {} as InternalAxiosRequestConfig,
      } as any;

      const handlers = (apiClient.interceptors.response as any).handlers || [];
      const responseInterceptor = handlers[0];
      if (!responseInterceptor) {
        throw new Error('Response interceptor not found');
      }
      const result = await responseInterceptor.rejected(error);

      expect(result.message).toBe('Server error. Please try again later.');
    });
  });
});

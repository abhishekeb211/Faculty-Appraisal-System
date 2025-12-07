import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';

// Create axios instance with base configuration
const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL || 'http://localhost:5000',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

const getStoredUserData = (): Record<string, any> | null => {
  try {
    const raw = localStorage.getItem('userData');
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    console.error('Error parsing userData:', error);
    return null;
  }
};

/**
 * Checks if a JWT token is expired
 * @param token - JWT token string
 * @returns true if token is expired or invalid, false otherwise
 */
const isTokenExpired = (token: string): boolean => {
  try {
    // JWT tokens have 3 parts separated by dots: header.payload.signature
    const parts = token.split('.');
    if (parts.length !== 3) {
      return true; // Invalid token format
    }

    // Decode the payload (second part)
    const payload = JSON.parse(atob(parts[1]));
    
    // Check if token has expiration claim
    if (!payload.exp) {
      return false; // No expiration claim, assume valid
    }

    // Check if token is expired (exp is in seconds, Date.now() is in milliseconds)
    return payload.exp * 1000 < Date.now();
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return true; // If we can't parse, assume expired
  }
};

/**
 * Clears user data and redirects to login
 */
const clearSession = (): void => {
  localStorage.removeItem('userData');
  if (window.location.pathname !== '/login') {
    window.location.href = '/login';
  }
};

// Request interceptor
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add auth token if available and valid
    const userData = getStoredUserData();
    const token = userData?.token;
    
    if (token) {
      // Check if token is expired
      if (isTokenExpired(token)) {
        // Token expired, clear session and redirect
        clearSession();
        return Promise.reject(new Error('Token expired')) as any;
      }

      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Handle network errors
    if (!error.response) {
      error.message = 'Network error. Please check your connection.';
      return Promise.reject(error);
    }

    // Handle 401 Unauthorized - token expired or invalid
    if (error.response.status === 401) {
      clearSession();
      return Promise.reject(error);
    }

    // Handle 500 Server errors
    if (error.response.status >= 500) {
      error.message = 'Server error. Please try again later.';
    }

    // Retry logic for failed requests (optional)
    if (error.response.status === 408 || error.response.status === 503) {
      if (!originalRequest._retry) {
        originalRequest._retry = true;
        // Wait 1 second before retry
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return apiClient(originalRequest);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;


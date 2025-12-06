import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';

// Create axios instance with base configuration
const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL || 'http://localhost:5000',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add auth token if available
    const userData = localStorage.getItem('userData');
    if (userData) {
      try {
        const parsed = JSON.parse(userData);
        // Add token to headers if backend requires it
        // config.headers.Authorization = `Bearer ${parsed.token}`;
      } catch (error) {
        console.error('Error parsing userData:', error);
      }
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

    // Handle 401 Unauthorized - redirect to login
    if (error.response.status === 401) {
      localStorage.removeItem('userData');
      window.location.href = '/login';
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


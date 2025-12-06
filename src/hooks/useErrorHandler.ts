import { useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { formatErrorMessage, logError, handleAPIError, isNetworkError } from '../utils/errorHandler';

/**
 * Custom hook for consistent error handling across components
 */
export function useErrorHandler() {
  const handleError = useCallback((error: unknown, context?: string) => {
    logError(error, context);
    const message = formatErrorMessage(error);
    
    // Show user-friendly error message
    toast.error(message, {
      duration: 5000,
      position: 'top-right',
    });

    // Return error info for component-level handling if needed
    return handleAPIError(error);
  }, []);

  const handleAPIErrorWithToast = useCallback((error: unknown, context?: string) => {
    const errorInfo = handleError(error, context);
    
    // Special handling for network errors
    if (isNetworkError(error)) {
      toast.error('Connection error. Please check your internet connection.', {
        duration: 6000,
      });
    }

    return errorInfo;
  }, [handleError]);

  const handleSuccess = useCallback((message: string) => {
    toast.success(message, {
      duration: 3000,
      position: 'top-right',
    });
  }, []);

  return {
    handleError,
    handleAPIError: handleAPIErrorWithToast,
    handleSuccess,
  };
}


/**
 * Global Error Handler
 * Catches and handles all unhandled errors and promise rejections
 */
let notificationContext = null;

export const initializeGlobalErrorHandler = (showNotification) => {
  notificationContext = { showNotification };
};

/**
 * Format error message for user-friendly display
 */
const formatErrorMessage = (error) => {
  if (!error) return 'An unexpected error occurred';

  // Handle Error objects
  if (error instanceof Error) {
    const message = error.message || error.toString();

    // Network errors
    if (message.includes('fetch') || message.includes('Network')) {
      return 'Network error: Unable to connect to the server. Please check your internet connection and try again.';
    }

    // API errors
    if (message.includes('401') || message.includes('Authentication')) {
      return 'Authentication failed. Please log in again.';
    }

    if (message.includes('403') || message.includes('Forbidden')) {
      return 'Access denied. You do not have permission to perform this action.';
    }

    if (message.includes('404') || message.includes('Not found')) {
      return 'The requested resource was not found.';
    }

    if (message.includes('500') || message.includes('Internal Server')) {
      return 'Server error: Something went wrong on the server. Please try again later.';
    }

    // Validation errors
    if (message.includes('validation') || message.includes('required')) {
      return `Validation error: ${message}`;
    }

    // Return the error message as-is if no special handling needed
    return message || 'An unexpected error occurred';
  }

  // Handle string errors
  if (typeof error === 'string') {
    return error;
  }

  // Handle objects with error property
  if (error && typeof error === 'object' && error.error) {
    return formatErrorMessage(error.error);
  }

  // Handle objects with message property
  if (error && typeof error === 'object' && error.message) {
    return formatErrorMessage(error.message);
  }

  // Fallback
  return 'An unexpected error occurred';
};

/**
 * Handle unhandled errors
 */
const handleError = (event) => {
  // Prevent default browser error display
  event.preventDefault?.();

  const error = event.error || event.reason || event;

  // Ignore empty objects - these are false positives
  if (error && typeof error === 'object' && Object.keys(error).length === 0) {
    return true; // Silently ignore empty error objects
  }

  // Ignore if error is null, undefined, or empty string
  if (!error || (typeof error === 'string' && error.trim() === '')) {
    return true; // Silently ignore
  }

  // Ignore PWA install prompt warnings (expected behavior)
  if (error && typeof error === 'object' && error.message) {
    const message = String(error.message).toLowerCase();
    if (
      message.includes('beforeinstallprompt') ||
      message.includes('banner not shown') ||
      message.includes('preventdefault')
    ) {
      // This is expected behavior for PWA install prompts - suppress warning
      return true;
    }
  }

  // Ignore if error message contains PWA install prompt text
  if (error && typeof error === 'string') {
    const errorStr = String(error).toLowerCase();
    if (
      errorStr.includes('beforeinstallprompt') ||
      errorStr.includes('banner not shown') ||
      errorStr.includes('preventdefault')
    ) {
      return true;
    }
  }

  // Only process if we have a real error with meaningful information
  const hasErrorMessage = error && (
    (typeof error === 'object' && (error.message || error.stack || error.name)) ||
    (typeof error === 'string' && error.trim() !== '')
  );

  if (!hasErrorMessage) {
    // Not a real error - silently ignore
    return true;
  }

  const errorMessage = formatErrorMessage(error);

  // Log error for debugging (only real errors)
  if (process.env.NODE_ENV === 'development') {
    console.error('[Global Error Handler] Error:', {
      message: error.message || error,
      stack: error.stack,
      name: error.name,
      eventType: event.type,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
    });
  }

  // Show notification if available
  if (notificationContext?.showNotification) {
    notificationContext.showNotification(errorMessage, 'error', 8000);
  } else {
    // Fallback: Show alert if notification system not available
    console.error('Error:', errorMessage);
  }

  // Track error for monitoring (if error tracking service is configured)
  if (typeof window !== 'undefined' && window.errorTracker) {
    try {
      window.errorTracker.captureError(error, {
        type: 'unhandled_error',
        source: 'global_error_handler',
      });
    } catch (trackError) {
      // Don't throw if error tracking fails
    }
  }

  return true;
};

/**
 * Handle unhandled promise rejections
 */
const handleUnhandledRejection = (event) => {
  // Prevent default browser error display
  event.preventDefault?.();

  const error = event.reason || event;

  // Ignore empty objects - these are false positives
  if (error && typeof error === 'object' && Object.keys(error).length === 0) {
    return; // Silently ignore empty error objects
  }

  // Ignore if error is null, undefined, or empty string
  if (!error || (typeof error === 'string' && error.trim() === '')) {
    return; // Silently ignore
  }

  // Ignore PWA install prompt warnings (expected behavior)
  if (error && typeof error === 'object' && error.message) {
    const message = String(error.message).toLowerCase();
    if (
      message.includes('beforeinstallprompt') ||
      message.includes('banner not shown') ||
      message.includes('preventdefault')
    ) {
      // This is expected behavior for PWA install prompts - suppress warning
      return;
    }
  }

  // Ignore if error message contains PWA install prompt text
  if (error && typeof error === 'string') {
    const errorStr = String(error).toLowerCase();
    if (
      errorStr.includes('beforeinstallprompt') ||
      errorStr.includes('banner not shown') ||
      errorStr.includes('preventdefault')
    ) {
      return;
    }
  }

  // Only process if we have a real error with meaningful information
  const hasErrorMessage = error && (
    (typeof error === 'object' && (error.message || error.stack || error.name)) ||
    (typeof error === 'string' && error.trim() !== '')
  );

  if (!hasErrorMessage) {
    // Not a real error - silently ignore
    return;
  }

  const errorMessage = formatErrorMessage(error);

  // Log error for debugging (only real errors)
  if (process.env.NODE_ENV === 'development') {
    console.error('[Global Error Handler] Unhandled Promise Rejection:', {
      message: error.message || error,
      stack: error.stack,
      name: error.name,
      reason: event.reason,
    });
  }

  // Show notification if available
  if (notificationContext?.showNotification) {
    notificationContext.showNotification(errorMessage, 'error', 8000);
  } else {
    // Fallback: Show alert if notification system not available
    console.error('Unhandled Promise Rejection:', errorMessage);
  }

  // Track error for monitoring
  if (typeof window !== 'undefined' && window.errorTracker) {
    try {
      window.errorTracker.captureError(error, {
        type: 'unhandled_promise_rejection',
        source: 'global_error_handler',
      });
    } catch (trackError) {
      // Don't throw if error tracking fails
    }
  }
};

/**
 * Initialize global error handlers
 */
export const setupGlobalErrorHandlers = (showNotification) => {
  if (typeof window === 'undefined') {
    return; // Server-side: skip
  }

  // Initialize notification context
  initializeGlobalErrorHandler(showNotification);

  // Handle unhandled errors
  window.addEventListener('error', handleError, true);

  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', handleUnhandledRejection);

  // Handle React errors (if ErrorBoundary catches them)
  window.addEventListener('react-error', (event) => {
    const { error, errorInfo } = event.detail || {};
    handleError({ error, errorInfo });
  });

  // Return cleanup function
  return () => {
    window.removeEventListener('error', handleError, true);
    window.removeEventListener('unhandledrejection', handleUnhandledRejection);
  };
};

/**
 * Safe async wrapper - catches and handles errors automatically
 */
export const safeAsync = async (asyncFn, errorHandler) => {
  try {
    return await asyncFn();
  } catch (error) {
    const errorMessage = formatErrorMessage(error);

    // Use provided error handler or default
    if (errorHandler) {
      errorHandler(errorMessage, error);
    } else if (notificationContext?.showNotification) {
      notificationContext.showNotification(errorMessage, 'error', 6000);
    }

    // Re-throw if needed for caller to handle
    throw error;
  }
};

export default {
  setupGlobalErrorHandlers,
  initializeGlobalErrorHandler,
  formatErrorMessage,
  safeAsync,
};

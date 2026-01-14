
let notificationContext = null;

export const initializeGlobalErrorHandler = (showNotification) => {
  notificationContext = { showNotification };
};


const formatErrorMessage = (error) => {
  if (!error) return 'An unexpected error occurred';

  
  if (error instanceof Error) {
    const message = error.message || error.toString();

    
    if (message.includes('fetch') || message.includes('Network')) {
      return 'Network error: Unable to connect to the server. Please check your internet connection and try again.';
    }

    
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

    
    if (message.includes('validation') || message.includes('required')) {
      return `Validation error: ${message}`;
    }

    
    return message || 'An unexpected error occurred';
  }

  
  if (typeof error === 'string') {
    return error;
  }

  
  if (error && typeof error === 'object' && error.error) {
    return formatErrorMessage(error.error);
  }

  
  if (error && typeof error === 'object' && error.message) {
    return formatErrorMessage(error.message);
  }

  
  return 'An unexpected error occurred';
};


const handleError = (event) => {
  
  event.preventDefault?.();

  const error = event.error || event.reason || event;

  
  if (error && typeof error === 'object' && Object.keys(error).length === 0) {
    return true; 
  }

  
  if (!error || (typeof error === 'string' && error.trim() === '')) {
    return true; 
  }

  
  if (error && typeof error === 'object' && error.message) {
    const message = String(error.message).toLowerCase();
    if (
      message.includes('beforeinstallprompt') ||
      message.includes('banner not shown') ||
      message.includes('preventdefault')
    ) {
      
      return true;
    }
  }

  
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

  
  const hasErrorMessage = error && (
    (typeof error === 'object' && (error.message || error.stack || error.name)) ||
    (typeof error === 'string' && error.trim() !== '')
  );

  if (!hasErrorMessage) {
    
    return true;
  }

  const errorMessage = formatErrorMessage(error);

  
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

  
  if (notificationContext?.showNotification) {
    notificationContext.showNotification(errorMessage, 'error', 8000);
  } else {
    
    console.error('Error:', errorMessage);
  }

  
  if (typeof window !== 'undefined' && window.errorTracker) {
    try {
      window.errorTracker.captureError(error, {
        type: 'unhandled_error',
        source: 'global_error_handler',
      });
    } catch (trackError) {
      
    }
  }

  return true;
};


const handleUnhandledRejection = (event) => {
  
  event.preventDefault?.();

  const error = event.reason || event;

  
  if (error && typeof error === 'object' && Object.keys(error).length === 0) {
    return; 
  }

  
  if (!error || (typeof error === 'string' && error.trim() === '')) {
    return; 
  }

  
  if (error && typeof error === 'object' && error.message) {
    const message = String(error.message).toLowerCase();
    if (
      message.includes('beforeinstallprompt') ||
      message.includes('banner not shown') ||
      message.includes('preventdefault')
    ) {
      
      return;
    }
  }

  
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

  
  const hasErrorMessage = error && (
    (typeof error === 'object' && (error.message || error.stack || error.name)) ||
    (typeof error === 'string' && error.trim() !== '')
  );

  if (!hasErrorMessage) {
    
    return;
  }

  const errorMessage = formatErrorMessage(error);

  
  if (process.env.NODE_ENV === 'development') {
    console.error('[Global Error Handler] Unhandled Promise Rejection:', {
      message: error.message || error,
      stack: error.stack,
      name: error.name,
      reason: event.reason,
    });
  }

  
  if (notificationContext?.showNotification) {
    notificationContext.showNotification(errorMessage, 'error', 8000);
  } else {
    
    console.error('Unhandled Promise Rejection:', errorMessage);
  }

  
  if (typeof window !== 'undefined' && window.errorTracker) {
    try {
      window.errorTracker.captureError(error, {
        type: 'unhandled_promise_rejection',
        source: 'global_error_handler',
      });
    } catch (trackError) {
      
    }
  }
};


export const setupGlobalErrorHandlers = (showNotification) => {
  if (typeof window === 'undefined') {
    return; 
  }

  
  initializeGlobalErrorHandler(showNotification);

  
  window.addEventListener('error', handleError, true);

  
  window.addEventListener('unhandledrejection', handleUnhandledRejection);

  
  window.addEventListener('react-error', (event) => {
    const { error, errorInfo } = event.detail || {};
    handleError({ error, errorInfo });
  });

  
  return () => {
    window.removeEventListener('error', handleError, true);
    window.removeEventListener('unhandledrejection', handleUnhandledRejection);
  };
};


export const safeAsync = async (asyncFn, errorHandler) => {
  try {
    return await asyncFn();
  } catch (error) {
    const errorMessage = formatErrorMessage(error);

    
    if (errorHandler) {
      errorHandler(errorMessage, error);
    } else if (notificationContext?.showNotification) {
      notificationContext.showNotification(errorMessage, 'error', 6000);
    }

    
    throw error;
  }
};

export default {
  setupGlobalErrorHandlers,
  initializeGlobalErrorHandler,
  formatErrorMessage,
  safeAsync,
};

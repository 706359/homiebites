/**
 * Error Tracker and Queue Monitor
 * Captures last pending operations and crash reasons for debugging
 */

class ErrorTracker {
  constructor() {
    this.queue = [];
    this.pendingOperations = new Map();
    this.errorLog = [];
    this.maxLogSize = 100; // Keep last 100 errors
    this.isInitialized = false;
    this.init();
  }

  init() {
    if (this.isInitialized) return;

    try {
      // Capture unhandled errors
      window.addEventListener('error', (event) => {
        try {
          this.captureError({
            type: 'unhandled_error',
            message: event.message,
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno,
            error: event.error,
            stack: event.error?.stack,
            timestamp: new Date().toISOString(),
          });
        } catch (e) {
          // Silently fail if error tracking itself fails
          console.warn('ErrorTracker: Failed to capture error', e);
        }
      });

      // Capture unhandled promise rejections
      window.addEventListener('unhandledrejection', (event) => {
        try {
          this.captureError({
            type: 'unhandled_promise_rejection',
            reason: event.reason,
            message: event.reason?.message || String(event.reason),
            stack: event.reason?.stack,
            timestamp: new Date().toISOString(),
          });
        } catch (e) {
          // Silently fail if error tracking itself fails
          console.warn('ErrorTracker: Failed to capture promise rejection', e);
        }
      });

      // Monitor React errors (if React Error Boundary is used)
      this.setupReactErrorBoundary();

      this.isInitialized = true;
      // Silent initialization - only log in development
      if (import.meta.env?.DEV) {
        console.log('[ErrorTracker] Initialized');
      }
    } catch (initError) {
      // If initialization fails, just mark as initialized to prevent retries
      this.isInitialized = true;
      console.warn('ErrorTracker: Initialization failed', initError);
    }
  }

  setupReactErrorBoundary() {
    try {
      // Store original console.error to capture React errors
      const originalConsoleError = console.error;
      console.error = (...args) => {
        try {
          // Check if it's a React error
          const errorString = args.join(' ');
          if (
            errorString.includes('Warning:') ||
            errorString.includes('Error:') ||
            errorString.includes('Uncaught')
          ) {
            this.captureError({
              type: 'react_error',
              message: errorString,
              args: args.map((arg) => {
                try {
                  if (arg instanceof Error) {
                    return {
                      message: arg.message,
                      stack: arg.stack,
                      name: arg.name,
                    };
                  }
                  return String(arg);
                } catch (e) {
                  return '[Error serializing argument]';
                }
              }),
              timestamp: new Date().toISOString(),
            });
          }
        } catch (e) {
          // Silently fail if error capture fails
        }
        originalConsoleError.apply(console, args);
      };
    } catch (e) {
      // Silently fail if setup fails
      console.warn('ErrorTracker: Failed to setup React error boundary', e);
    }
  }

  /**
   * Add operation to queue
   */
  addToQueue(operationId, operationName, details = {}) {
    const operation = {
      id: operationId,
      name: operationName,
      status: 'pending',
      startTime: Date.now(),
      details,
      timestamp: new Date().toISOString(),
    };

    this.pendingOperations.set(operationId, operation);
    this.queue.push(operation);

    // Only log in development mode
    if (import.meta.env?.DEV) {
      console.log(`[Queue] Added: ${operationName} (ID: ${operationId})`);
    }
    return operationId;
  }

  /**
   * Mark operation as completed
   */
  completeOperation(operationId, result = null) {
    const operation = this.pendingOperations.get(operationId);
    if (operation) {
      operation.status = 'completed';
      operation.endTime = Date.now();
      operation.duration = operation.endTime - operation.startTime;
      operation.result = result;
      this.pendingOperations.delete(operationId);
      // Only log in development mode
      if (import.meta.env?.DEV) {
        console.log(`[Queue] Completed: ${operation.name} (${operation.duration}ms)`);
      }
    }
  }

  /**
   * Mark operation as failed
   */
  failOperation(operationId, error) {
    const operation = this.pendingOperations.get(operationId);
    if (operation) {
      operation.status = 'failed';
      operation.endTime = Date.now();
      operation.duration = operation.endTime - operation.startTime;
      operation.error = {
        message: error?.message || String(error),
        stack: error?.stack,
        name: error?.name,
      };

      this.captureError({
        type: 'operation_failed',
        operationId,
        operationName: operation.name,
        error: operation.error,
        details: operation.details,
        timestamp: new Date().toISOString(),
      });

      this.pendingOperations.delete(operationId);
      // Always log errors, but use console.warn instead of console.error for less noise
      console.warn(`[Queue] Failed: ${operation.name}`, error);
    }
  }

  /**
   * Capture error with context
   */
  captureError(errorData) {
    try {
      const error = {
        ...errorData,
        id: `ERR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        pendingOperations: Array.from(this.pendingOperations.values()),
        queueLength: this.queue.length,
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown',
        url: typeof window !== 'undefined' ? window.location.href : 'Unknown',
        localStorageSize: this.getLocalStorageSize(),
        memoryInfo: this.getMemoryInfo(),
      };

      this.errorLog.push(error);

      // Keep only last N errors
      if (this.errorLog.length > this.maxLogSize) {
        this.errorLog.shift();
      }

      // Save to localStorage for persistence
      this.saveToLocalStorage();

      // Log to console (only in development or for critical errors)
      if (
        import.meta.env?.DEV ||
        errorData.type === 'unhandled_error' ||
        errorData.type === 'unhandled_promise_rejection'
      ) {
        console.error('[ErrorTracker] Error captured:', error);
      }

      return error.id;
    } catch (e) {
      // If error tracking itself fails, just return a dummy ID
      console.warn('ErrorTracker: Failed to capture error', e);
      return `ERR-FAILED-${Date.now()}`;
    }
  }

  /**
   * Get last pending operation
   */
  getLastPendingOperation() {
    const pending = Array.from(this.pendingOperations.values());
    if (pending.length === 0) {
      // Check queue for last pending item
      const lastPending = this.queue
        .filter((op) => op.status === 'pending')
        .sort((a, b) => b.startTime - a.startTime)[0];
      return lastPending || null;
    }
    // Return most recent pending operation
    return pending.sort((a, b) => b.startTime - a.startTime)[0];
  }

  /**
   * Get last error/crash reason
   */
  getLastError() {
    return this.errorLog.length > 0 ? this.errorLog[this.errorLog.length - 1] : null;
  }

  /**
   * Get all pending operations
   */
  getAllPendingOperations() {
    return Array.from(this.pendingOperations.values());
  }

  /**
   * Get error summary
   */
  getErrorSummary() {
    const lastError = this.getLastError();
    const lastPending = this.getLastPendingOperation();

    return {
      lastError,
      lastPendingOperation: lastPending,
      allPendingOperations: this.getAllPendingOperations(),
      totalErrors: this.errorLog.length,
      recentErrors: this.errorLog.slice(-10), // Last 10 errors
      queueLength: this.queue.length,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Get crash report
   */
  getCrashReport() {
    const summary = this.getErrorSummary();
    const lastError = summary.lastError;
    const lastPending = summary.lastPendingOperation;

    return {
      crashInfo: {
        timestamp: new Date().toISOString(),
        lastError: lastError
          ? {
              type: lastError.type,
              message: lastError.message || lastError.reason,
              operation: lastError.operationName,
              stack: lastError.stack || lastError.error?.stack,
            }
          : null,
        lastPendingOperation: lastPending
          ? {
              name: lastPending.name,
              duration: Date.now() - lastPending.startTime,
              details: lastPending.details,
              status: lastPending.status,
            }
          : null,
        pendingOperationsCount: summary.allPendingOperations.length,
        allPendingOperations: summary.allPendingOperations.map((op) => ({
          name: op.name,
          duration: Date.now() - op.startTime,
          details: op.details,
        })),
      },
      context: {
        url: window.location.href,
        userAgent: navigator.userAgent,
        localStorageSize: this.getLocalStorageSize(),
        memoryInfo: this.getMemoryInfo(),
        screenSize: {
          width: window.screen.width,
          height: window.screen.height,
        },
        viewportSize: {
          width: window.innerWidth,
          height: window.innerHeight,
        },
      },
      recentErrors: summary.recentErrors,
    };
  }

  /**
   * Get localStorage size
   */
  getLocalStorageSize() {
    try {
      let total = 0;
      for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          total += localStorage[key].length + key.length;
        }
      }
      return {
        size: total,
        sizeKB: (total / 1024).toFixed(2),
        sizeMB: (total / (1024 * 1024)).toFixed(2),
        itemCount: Object.keys(localStorage).length,
      };
    } catch (e) {
      return { error: e.message };
    }
  }

  /**
   * Get memory info (if available)
   */
  getMemoryInfo() {
    try {
      if (performance.memory) {
        return {
          usedJSHeapSize: performance.memory.usedJSHeapSize,
          totalJSHeapSize: performance.memory.totalJSHeapSize,
          jsHeapSizeLimit: performance.memory.jsHeapSizeLimit,
          usedMB: (performance.memory.usedJSHeapSize / (1024 * 1024)).toFixed(2),
          totalMB: (performance.memory.totalJSHeapSize / (1024 * 1024)).toFixed(2),
        };
      }
      return { available: false };
    } catch (e) {
      return { error: e.message };
    }
  }

  /**
   * Save error log to localStorage
   */
  saveToLocalStorage() {
    try {
      const data = {
        errorLog: this.errorLog.slice(-50), // Keep last 50 errors
        lastUpdate: new Date().toISOString(),
      };
      localStorage.setItem('homiebites_error_log', JSON.stringify(data));
    } catch (e) {
      console.warn('[ErrorTracker] Failed to save to localStorage:', e);
    }
  }

  /**
   * Load error log from localStorage and clean up old entries
   */
  loadFromLocalStorage() {
    try {
      const stored = localStorage.getItem('homiebites_error_log');
      if (stored) {
        const data = JSON.parse(stored);
        if (data.errorLog && Array.isArray(data.errorLog)) {
          const originalCount = data.errorLog.length;
          
          // Clean up old errors (older than 7 days or more than 50 entries)
          const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
          
          this.errorLog = data.errorLog
            .filter((error) => {
              const errorTime = new Date(error.timestamp || 0).getTime();
              return errorTime > sevenDaysAgo;
            })
            .slice(-50); // Keep only last 50 errors
          
          const removedCount = originalCount - this.errorLog.length;
          
          // Save cleaned log back to localStorage if we removed entries
          if (removedCount > 0) {
            this.saveToLocalStorage();
          }
          
          // Only log in development mode
          if (import.meta.env?.DEV) {
            if (removedCount > 0) {
              console.log(
                `[ErrorTracker] Loaded ${originalCount} errors, cleaned ${removedCount} old entries, kept ${this.errorLog.length}`
              );
            } else {
              console.log(`[ErrorTracker] Loaded ${this.errorLog.length} errors from localStorage`);
            }
          }
        }
      }
    } catch (e) {
      console.warn('[ErrorTracker] Failed to load from localStorage:', e);
      // If parsing fails, clear corrupted data
      try {
        localStorage.removeItem('homiebites_error_log');
        this.errorLog = [];
      } catch (clearError) {
        // Ignore
      }
    }
  }

  /**
   * Clear error log
   */
  clearErrorLog() {
    this.errorLog = [];
    this.queue = [];
    this.pendingOperations.clear();
    localStorage.removeItem('homiebites_error_log');
    // Only log in development mode
    if (import.meta.env?.DEV) {
      console.log('[ErrorTracker] Error log cleared');
    }
  }

  /**
   * Export error report as JSON
   */
  exportErrorReport() {
    const report = this.getCrashReport();
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `error-report-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  /**
   * Print error report to console
   */
  printErrorReport() {
    const report = this.getCrashReport();
    console.group('🔴 Crash Report');
    console.log('Last Error:', report.crashInfo.lastError);
    console.log('Last Pending Operation:', report.crashInfo.lastPendingOperation);
    console.log('All Pending Operations:', report.crashInfo.allPendingOperations);
    console.log('Context:', report.context);
    console.log('Recent Errors:', report.recentErrors);
    console.groupEnd();
    return report;
  }
}

// Create singleton instance
const errorTracker = new ErrorTracker();

// Load previous errors on init
errorTracker.loadFromLocalStorage();

// Export for use in other modules
export default errorTracker;

// Also expose globally for debugging (development only)
if (typeof window !== 'undefined' && import.meta.env?.DEV) {
  window.errorTracker = errorTracker;
  window.getCrashReport = () => errorTracker.getCrashReport();
  window.getLastError = () => errorTracker.getLastError();
  window.getLastPending = () => errorTracker.getLastPendingOperation();
  window.clearErrorLogs = () => {
    errorTracker.clearErrorLog();
    console.log('[ErrorTracker] All error logs cleared manually');
  };
  console.log(
    '[ErrorTracker] Available globally: window.errorTracker, window.getCrashReport(), window.getLastError(), window.getLastPending(), window.clearErrorLogs()'
  );
}

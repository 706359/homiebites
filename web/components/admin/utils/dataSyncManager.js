/**
 * Data Sync Manager
 * Fast, safe, and efficient data synchronization with:
 * - Request cancellation
 * - Debouncing
 * - Optimistic updates
 * - Error recovery
 * - Request queuing
 */

class DataSyncManager {
  constructor() {
    this.pendingRequests = new Map(); // Track active requests
    this.syncQueue = []; // Queue for sync operations
    this.debounceTimers = new Map(); // Debounce timers
    this.optimisticUpdates = new Map(); // Track optimistic updates for rollback
    this.isProcessing = false;
    
    // Configuration
    this.config = {
      debounceDelay: 300, // ms - wait before syncing
      maxRetries: 3,
      retryDelay: 1000, // ms
      batchSize: 50, // Max operations per batch
    };
  }

  /**
   * Create a cancellable request
   */
  createRequest(key, requestFn) {
    // Cancel existing request with same key
    this.cancelRequest(key);

    const abortController = new AbortController();
    const request = {
      key,
      abortController,
      promise: null,
      timestamp: Date.now(),
    };

    // Wrap request function with abort signal
    request.promise = requestFn(abortController.signal)
      .then((result) => {
        this.pendingRequests.delete(key);
        return result;
      })
      .catch((error) => {
        this.pendingRequests.delete(key);
        if (error.name === 'AbortError') {
          throw new Error('Request cancelled');
        }
        throw error;
      });

    this.pendingRequests.set(key, request);
    return request.promise;
  }

  /**
   * Cancel a specific request
   */
  cancelRequest(key) {
    const request = this.pendingRequests.get(key);
    if (request) {
      request.abortController.abort();
      this.pendingRequests.delete(key);
    }
  }

  /**
   * Cancel all pending requests
   */
  cancelAllRequests() {
    this.pendingRequests.forEach((request) => {
      request.abortController.abort();
    });
    this.pendingRequests.clear();
  }

  /**
   * Debounced sync - batches multiple rapid sync calls
   */
  debouncedSync(key, syncFn, delay = null) {
    const delayMs = delay || this.config.debounceDelay;
    
    // Clear existing timer
    if (this.debounceTimers.has(key)) {
      clearTimeout(this.debounceTimers.get(key));
    }

    // Cancel any pending request with same key
    this.cancelRequest(key);

    return new Promise((resolve, reject) => {
      const timer = setTimeout(async () => {
        this.debounceTimers.delete(key);
        try {
          const result = await this.createRequest(key, syncFn);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      }, delayMs);

      this.debounceTimers.set(key, timer);
    });
  }

  /**
   * Optimistic update - update UI immediately, sync in background
   */
  async optimisticUpdate(key, updateFn, syncFn, rollbackFn = null) {
    // Store original state for rollback
    let originalState = null;
    if (rollbackFn) {
      originalState = rollbackFn();
    }

    // Apply optimistic update immediately
    const optimisticResult = updateFn();

    // Track for potential rollback
    this.optimisticUpdates.set(key, {
      originalState,
      rollbackFn,
      timestamp: Date.now(),
    });

    try {
      // Sync in background
      const syncResult = await this.createRequest(key, syncFn);
      
      // Remove from optimistic updates (success)
      this.optimisticUpdates.delete(key);
      
      return { success: true, data: syncResult, optimistic: true };
    } catch (error) {
      // Rollback on error
      if (rollbackFn && originalState !== null) {
        rollbackFn(originalState);
      }
      
      // Remove from optimistic updates
      this.optimisticUpdates.delete(key);
      
      throw error;
    }
  }

  /**
   * Queue sync operation
   */
  queueSync(operation) {
    this.syncQueue.push({
      ...operation,
      timestamp: Date.now(),
    });

    // Process queue if not already processing
    if (!this.isProcessing) {
      this.processQueue();
    }
  }

  /**
   * Process sync queue
   */
  async processQueue() {
    if (this.isProcessing || this.syncQueue.length === 0) {
      return;
    }

    this.isProcessing = true;

    try {
      // Process operations in batches
      const batch = this.syncQueue.splice(0, this.config.batchSize);
      
      // Execute batch operations
      const results = await Promise.allSettled(
        batch.map((op) => op.execute())
      );

      // Handle results
      results.forEach((result, index) => {
        const operation = batch[index];
        if (result.status === 'rejected' && operation.onError) {
          operation.onError(result.reason);
        } else if (result.status === 'fulfilled' && operation.onSuccess) {
          operation.onSuccess(result.value);
        }
      });
    } catch (error) {
      console.error('[DataSyncManager] Queue processing error:', error);
    } finally {
      this.isProcessing = false;

      // Process remaining items
      if (this.syncQueue.length > 0) {
        setTimeout(() => this.processQueue(), 100);
      }
    }
  }

  /**
   * Clear all debounce timers
   */
  clearDebounceTimers() {
    this.debounceTimers.forEach((timer) => clearTimeout(timer));
    this.debounceTimers.clear();
  }

  /**
   * Get pending requests count
   */
  getPendingCount() {
    return this.pendingRequests.size;
  }

  /**
   * Check if there are pending operations
   */
  hasPendingOperations() {
    return (
      this.pendingRequests.size > 0 ||
      this.syncQueue.length > 0 ||
      this.debounceTimers.size > 0
    );
  }

  /**
   * Cleanup - cancel all operations
   */
  cleanup() {
    this.cancelAllRequests();
    this.clearDebounceTimers();
    this.syncQueue = [];
    this.optimisticUpdates.clear();
    this.isProcessing = false;
  }
}

// Singleton instance
const dataSyncManager = new DataSyncManager();

export default dataSyncManager;


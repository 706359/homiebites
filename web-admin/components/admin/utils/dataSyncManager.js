

class DataSyncManager {
  constructor() {
    this.pendingRequests = new Map(); 
    this.syncQueue = []; 
    this.debounceTimers = new Map(); 
    this.optimisticUpdates = new Map(); 
    this.isProcessing = false;
    
    
    this.config = {
      debounceDelay: 300, 
      maxRetries: 3,
      retryDelay: 1000, 
      batchSize: 50, 
    };
  }

  
  createRequest(key, requestFn) {
    
    this.cancelRequest(key);

    const abortController = new AbortController();
    const request = {
      key,
      abortController,
      promise: null,
      timestamp: Date.now(),
    };

    
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

  
  cancelRequest(key) {
    const request = this.pendingRequests.get(key);
    if (request) {
      request.abortController.abort();
      this.pendingRequests.delete(key);
    }
  }

  
  cancelAllRequests() {
    this.pendingRequests.forEach((request) => {
      request.abortController.abort();
    });
    this.pendingRequests.clear();
  }

  
  debouncedSync(key, syncFn, delay = null) {
    const delayMs = delay || this.config.debounceDelay;
    
    
    if (this.debounceTimers.has(key)) {
      clearTimeout(this.debounceTimers.get(key));
    }

    
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

  
  async optimisticUpdate(key, updateFn, syncFn, rollbackFn = null) {
    
    let originalState = null;
    if (rollbackFn) {
      originalState = rollbackFn();
    }

    
    const optimisticResult = updateFn();

    
    this.optimisticUpdates.set(key, {
      originalState,
      rollbackFn,
      timestamp: Date.now(),
    });

    try {
      
      const syncResult = await this.createRequest(key, syncFn);
      
      
      this.optimisticUpdates.delete(key);
      
      return { success: true, data: syncResult, optimistic: true };
    } catch (error) {
      
      if (rollbackFn && originalState !== null) {
        rollbackFn(originalState);
      }
      
      
      this.optimisticUpdates.delete(key);
      
      throw error;
    }
  }

  
  queueSync(operation) {
    this.syncQueue.push({
      ...operation,
      timestamp: Date.now(),
    });

    
    if (!this.isProcessing) {
      this.processQueue();
    }
  }

  
  async processQueue() {
    if (this.isProcessing || this.syncQueue.length === 0) {
      return;
    }

    this.isProcessing = true;

    try {
      
      const batch = this.syncQueue.splice(0, this.config.batchSize);
      
      
      const results = await Promise.allSettled(
        batch.map((op) => op.execute())
      );

      
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

      
      if (this.syncQueue.length > 0) {
        setTimeout(() => this.processQueue(), 100);
      }
    }
  }

  
  clearDebounceTimers() {
    this.debounceTimers.forEach((timer) => clearTimeout(timer));
    this.debounceTimers.clear();
  }

  
  getPendingCount() {
    return this.pendingRequests.size;
  }

  
  hasPendingOperations() {
    return (
      this.pendingRequests.size > 0 ||
      this.syncQueue.length > 0 ||
      this.debounceTimers.size > 0
    );
  }

  
  cleanup() {
    this.cancelAllRequests();
    this.clearDebounceTimers();
    this.syncQueue = [];
    this.optimisticUpdates.clear();
    this.isProcessing = false;
  }
}


const dataSyncManager = new DataSyncManager();

export default dataSyncManager;


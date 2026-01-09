/**
 * useOptimisticData Hook
 * Provides optimistic updates for fast UI response
 * Automatically syncs with backend and handles rollback on errors
 */
import { useState, useCallback, useRef, useEffect } from 'react';
import dataSyncManager from '../utils/dataSyncManager.js';
import api from '../lib/api.js';

/**
 * Hook for optimistic data management
 * @param {Object} options
 * @param {Function} options.loadData - Function to load data from backend
 * @param {Function} options.onError - Error handler
 * @param {boolean} options.enableOptimistic - Enable optimistic updates (default: true)
 */
export const useOptimisticData = (options = {}) => {
  const {
    loadData,
    onError,
    enableOptimistic = true,
  } = options;

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [syncing, setSyncing] = useState(false);
  
  const dataRef = useRef([]); // Keep ref for latest data
  const originalDataRef = useRef([]); // For rollback

  // Update refs when data changes
  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  /**
   * Load data from backend
   */
  const load = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);

    try {
      const result = await dataSyncManager.createRequest(
        'load-orders',
        async (signal) => {
          if (loadData) {
            return await loadData(filters, signal);
          }
          return await api.getAllOrders(filters);
        }
      );

      if (result.success && Array.isArray(result.data)) {
        setData(result.data);
        originalDataRef.current = [...result.data];
        return { success: true, data: result.data };
      }

      throw new Error(result.error || 'Failed to load data');
    } catch (err) {
      const errorMsg = err.message || 'Failed to load data';
      setError(errorMsg);
      if (onError) onError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, [loadData, onError]);

  /**
   * Optimistic create - add immediately, sync in background
   */
  const createOptimistic = useCallback(async (newItem, createFn) => {
    if (!enableOptimistic) {
      // Non-optimistic: wait for backend
      return await createFn();
    }

    // Store original state
    originalDataRef.current = [...dataRef.current];

    // Optimistically add to UI
    const tempId = `temp-${Date.now()}-${Math.random()}`;
    const optimisticItem = { ...newItem, _id: tempId, _optimistic: true };
    setData((prev) => [...prev, optimisticItem]);

    try {
      // Sync in background
      const result = await createFn();
      
      if (result.success && result.data) {
        // Replace optimistic item with real data
        setData((prev) =>
          prev.map((item) =>
            item._id === tempId ? result.data : item
          )
        );
        return { success: true, data: result.data };
      }

      // Rollback on failure
      setData(originalDataRef.current);
      throw new Error(result.error || 'Failed to create');
    } catch (err) {
      // Rollback on error
      setData(originalDataRef.current);
      throw err;
    }
  }, [enableOptimistic]);

  /**
   * Optimistic update - update immediately, sync in background
   */
  const updateOptimistic = useCallback(async (id, updates, updateFn) => {
    if (!enableOptimistic) {
      return await updateFn();
    }

    // Store original state
    originalDataRef.current = [...dataRef.current];

    // Find item
    const itemIndex = dataRef.current.findIndex(
      (item) => item._id === id || item.orderId === id || item.id === id
    );

    if (itemIndex === -1) {
      throw new Error('Item not found');
    }

    const originalItem = dataRef.current[itemIndex];

    // Optimistically update UI
    setData((prev) =>
      prev.map((item) =>
        item._id === id || item.orderId === id || item.id === id
          ? { ...item, ...updates, _optimistic: true }
          : item
      )
    );

    try {
      // Sync in background
      const result = await updateFn();
      
      if (result.success && result.data) {
        // Replace with real data
        setData((prev) =>
          prev.map((item) =>
            item._id === id || item.orderId === id || item.id === id
              ? result.data
              : item
          )
        );
        return { success: true, data: result.data };
      }

      // Rollback on failure
      setData(originalDataRef.current);
      throw new Error(result.error || 'Failed to update');
    } catch (err) {
      // Rollback on error
      setData(originalDataRef.current);
      throw err;
    }
  }, [enableOptimistic]);

  /**
   * Optimistic delete - remove immediately, sync in background
   */
  const deleteOptimistic = useCallback(async (id, deleteFn) => {
    if (!enableOptimistic) {
      return await deleteFn();
    }

    // Store original state
    originalDataRef.current = [...dataRef.current];

    // Find item
    const item = dataRef.current.find(
      (item) => item._id === id || item.orderId === id || item.id === id
    );

    if (!item) {
      throw new Error('Item not found');
    }

    // Optimistically remove from UI
    setData((prev) =>
      prev.filter(
        (item) => item._id !== id && item.orderId !== id && item.id !== id
      )
    );

    try {
      // Sync in background
      const result = await deleteFn();
      
      if (result.success) {
        return { success: true };
      }

      // Rollback on failure
      setData(originalDataRef.current);
      throw new Error(result.error || 'Failed to delete');
    } catch (err) {
      // Rollback on error
      setData(originalDataRef.current);
      throw err;
    }
  }, [enableOptimistic]);

  /**
   * Debounced sync - batches rapid sync calls
   */
  const syncDebounced = useCallback(async (syncFn, delay = 300) => {
    setSyncing(true);
    try {
      const result = await dataSyncManager.debouncedSync(
        'sync-orders',
        syncFn,
        delay
      );
      return result;
    } finally {
      setSyncing(false);
    }
  }, []);

  /**
   * Cancel all pending operations
   */
  const cancel = useCallback(() => {
    dataSyncManager.cancelRequest('load-orders');
    dataSyncManager.cancelRequest('sync-orders');
  }, []);

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      cancel();
    };
  }, [cancel]);

  return {
    data,
    loading,
    error,
    syncing,
    load,
    createOptimistic,
    updateOptimistic,
    deleteOptimistic,
    syncDebounced,
    cancel,
    setData, // Allow manual updates if needed
  };
};

export default useOptimisticData;


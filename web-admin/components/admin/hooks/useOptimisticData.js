import { useState, useCallback, useRef, useEffect } from 'react';
import dataSyncManager from '../utils/dataSyncManager.js';
import api from '../../../lib/api-admin.js';

export const useOptimisticData = (options = {}) => {
  const { loadData, onError, enableOptimistic = true } = options;

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [syncing, setSyncing] = useState(false);

  const dataRef = useRef([]);
  const originalDataRef = useRef([]);

  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  const load = useCallback(
    async (filters = {}) => {
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
    },
    [loadData, onError]
  );

  const createOptimistic = useCallback(
    async (newItem, createFn) => {
      if (!enableOptimistic) {
        return await createFn();
      }

      originalDataRef.current = [...dataRef.current];

      const tempId = `temp-${Date.now()}-${Math.random()}`;
      const optimisticItem = { ...newItem, _id: tempId, _optimistic: true };
      setData((prev) => [...prev, optimisticItem]);

      try {
        const result = await createFn();

        if (result.success && result.data) {
          setData((prev) =>
            prev.map((item) => (item._id === tempId ? result.data : item))
          );
          return { success: true, data: result.data };
        }

        setData(originalDataRef.current);
        throw new Error(result.error || 'Failed to create');
      } catch (err) {
        setData(originalDataRef.current);
        throw err;
      }
    },
    [enableOptimistic]
  );

  const updateOptimistic = useCallback(
    async (id, updates, updateFn) => {
      if (!enableOptimistic) {
        return await updateFn();
      }

      originalDataRef.current = [...dataRef.current];

      const itemIndex = dataRef.current.findIndex(
        (item) => item._id === id || item.orderId === id || item.id === id
      );

      if (itemIndex === -1) {
        throw new Error('Item not found');
      }

      const originalItem = dataRef.current[itemIndex];

      setData((prev) =>
        prev.map((item) =>
          item._id === id || item.orderId === id || item.id === id
            ? { ...item, ...updates, _optimistic: true }
            : item
        )
      );

      try {
        const result = await updateFn();

        if (result.success && result.data) {
          setData((prev) =>
            prev.map((item) =>
              item._id === id || item.orderId === id || item.id === id
                ? result.data
                : item
            )
          );
          return { success: true, data: result.data };
        }

        setData(originalDataRef.current);
        throw new Error(result.error || 'Failed to update');
      } catch (err) {
        setData(originalDataRef.current);
        throw err;
      }
    },
    [enableOptimistic]
  );

  const deleteOptimistic = useCallback(
    async (id, deleteFn) => {
      if (!enableOptimistic) {
        return await deleteFn();
      }

      originalDataRef.current = [...dataRef.current];

      const item = dataRef.current.find(
        (item) => item._id === id || item.orderId === id || item.id === id
      );

      if (!item) {
        throw new Error('Item not found');
      }

      setData((prev) =>
        prev.filter(
          (item) => item._id !== id && item.orderId !== id && item.id !== id
        )
      );

      try {
        const result = await deleteFn();

        if (
          result &&
          (result.success === true || result.message || result.data)
        ) {
          return { success: true, data: result.data || result.order || result };
        }

        setData(originalDataRef.current);
        throw new Error(result.error || result.message || 'Failed to delete');
      } catch (err) {
        setData(originalDataRef.current);
        const errorMessage = err.message || 'Failed to delete';
        throw new Error(errorMessage);
      }
    },
    [enableOptimistic]
  );

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

  const cancel = useCallback(() => {
    dataSyncManager.cancelRequest('load-orders');
    dataSyncManager.cancelRequest('sync-orders');
  }, []);

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
    setData,
  };
};

export default useOptimisticData;

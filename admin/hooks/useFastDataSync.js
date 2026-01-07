/**
 * useFastDataSync Hook
 * Combines useAdminData with optimistic updates and sync manager
 * Provides fast, safe data operations with automatic sync
 */
import { useCallback } from 'react';
import { useAdminData } from './useAdminData.js';
import useOptimisticData from './useOptimisticData.js';
import dataSyncManager from '../utils/dataSyncManager.js';
import api from '../lib/api.js';

/**
 * Enhanced hook for fast data sync
 */
export const useFastDataSync = () => {
  // Use existing useAdminData for initial load
  const adminData = useAdminData();
  
  // Use optimistic data hook for fast updates
  const optimisticData = useOptimisticData({
    loadData: async (filters, signal) => {
      const response = await api.getAllOrders(filters);
      return {
        success: response.success,
        data: response.data || [],
      };
    },
    enableOptimistic: true,
  });

  /**
   * Fast delete with optimistic update
   */
  const fastDelete = useCallback(async (orderId, onSuccess, onError) => {
    try {
      await optimisticData.deleteOptimistic(
        orderId,
        async () => {
          const response = await api.deleteOrder(orderId);
          return response;
        }
      );
      
      // Sync in background (debounced)
      await optimisticData.syncDebounced(async () => {
        const response = await api.getAllOrders({});
        if (response.success && response.data) {
          adminData.setOrders(response.data);
        }
        return response;
      }, 500);
      
      if (onSuccess) onSuccess();
    } catch (error) {
      if (onError) onError(error);
      throw error;
    }
  }, [optimisticData, adminData]);

  /**
   * Fast update with optimistic update
   */
  const fastUpdate = useCallback(async (orderId, updates, onSuccess, onError) => {
    try {
      await optimisticData.updateOptimistic(
        orderId,
        updates,
        async () => {
          const order = (adminData.orders || []).find(
            (o) => o._id === orderId || o.orderId === orderId || o.id === orderId
          );
          const apiOrderId = order?._id || order?.id || order?.orderId || orderId;
          
          const response = await api.updateOrder(apiOrderId, {
            ...order,
            ...updates,
          });
          return response;
        }
      );
      
      // Sync in background (debounced)
      await optimisticData.syncDebounced(async () => {
        const response = await api.getAllOrders({});
        if (response.success && response.data) {
          adminData.setOrders(response.data);
        }
        return response;
      }, 500);
      
      if (onSuccess) onSuccess();
    } catch (error) {
      if (onError) onError(error);
      throw error;
    }
  }, [optimisticData, adminData]);

  /**
   * Fast create with optimistic update
   */
  const fastCreate = useCallback(async (orderData, onSuccess, onError) => {
    try {
      await optimisticData.createOptimistic(
        orderData,
        async () => {
          const response = await api.createManualOrder(orderData);
          return response;
        }
      );
      
      // Sync in background (debounced)
      await optimisticData.syncDebounced(async () => {
        const response = await api.getAllOrders({});
        if (response.success && response.data) {
          adminData.setOrders(response.data);
        }
        return response;
      }, 500);
      
      if (onSuccess) onSuccess();
    } catch (error) {
      if (onError) onError(error);
      throw error;
    }
  }, [optimisticData, adminData]);

  /**
   * Debounced sync - batches multiple sync calls
   */
  const syncDebounced = useCallback(async (delay = 300) => {
    return await optimisticData.syncDebounced(async () => {
      const response = await api.getAllOrders({});
      if (response.success && response.data) {
        adminData.setOrders(response.data);
      }
      return response;
    }, delay);
  }, [optimisticData, adminData]);

  /**
   * Cancel all pending operations
   */
  const cancelAll = useCallback(() => {
    dataSyncManager.cancelAllRequests();
    optimisticData.cancel();
  }, [optimisticData]);

  return {
    // Original adminData
    ...adminData,
    
    // Fast operations
    fastDelete,
    fastUpdate,
    fastCreate,
    syncDebounced,
    cancelAll,
    
    // Optimistic data state
    syncing: optimisticData.syncing,
    hasPendingOps: dataSyncManager.hasPendingOperations(),
  };
};

export default useFastDataSync;


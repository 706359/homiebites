/**
 * useFastDataSync Hook
 * Combines useAdminData with optimistic updates and sync manager
 * Provides fast, safe data operations with automatic sync
 */
import { useCallback, useEffect } from 'react';
import api from '../lib/api.js';
import dataSyncManager from '../utils/dataSyncManager.js';
import { useAdminData } from './useAdminData.js';
import useOptimisticData from './useOptimisticData.js';

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

  // Sync optimisticData with adminData.orders when orders change
  useEffect(() => {
    if (adminData.orders && Array.isArray(adminData.orders)) {
      // Always sync optimisticData with adminData.orders to keep them in sync
      const currentOptimistic = optimisticData.data || [];
      const ordersChanged =
        currentOptimistic.length !== adminData.orders.length ||
        !adminData.orders.every((order) =>
          currentOptimistic.some(
            (item) =>
              (order._id && item._id === order._id) ||
              (order.orderId && item.orderId === order.orderId) ||
              (order.id && item.id === order.id)
          )
        );

      if (ordersChanged) {
        optimisticData.setData([...adminData.orders]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adminData.orders]);

  /**
   * Fast delete with optimistic update
   */
  const fastDelete = useCallback(
    async (orderId, onSuccess, onError) => {
      try {
        // Ensure optimisticData has the current orders before deleting
        const currentOrders = adminData.orders || [];
        const order = currentOrders.find(
          (o) => o._id === orderId || o.orderId === orderId || o.id === orderId
        );

        if (!order) {
          throw new Error(`Order with ID ${orderId} not found`);
        }

        // Sync optimisticData with adminData.orders if needed
        const optimisticOrders = optimisticData.data || [];
        const orderInOptimistic = optimisticOrders.find(
          (o) => o._id === orderId || o.orderId === orderId || o.id === orderId
        );

        if (!orderInOptimistic) {
          // Order not in optimistic data, sync it first
          optimisticData.setData([...currentOrders]);
        }

        // Get the API order ID (prefer _id, then id, then orderId, then fallback to orderId param)
        const apiOrderId = order._id || order.id || order.orderId || orderId;

        // Update adminData.orders immediately with optimistic delete
        adminData.setOrders((prevOrders) =>
          prevOrders.filter((o) => o._id !== orderId && o.orderId !== orderId && o.id !== orderId)
        );

        // Delete optimistically and call API
        await optimisticData.deleteOptimistic(
          orderId, // Use the original orderId for finding in optimistic data
          async () => {
            const response = await api.deleteOrder(apiOrderId); // Use apiOrderId for API call
            return response;
          }
        );

        // Call success immediately - don't wait for sync
        if (onSuccess) onSuccess();

        // Sync in background (non-blocking) with reduced delay
        optimisticData
          .syncDebounced(async () => {
            const response = await api.getAllOrders({});
            if (response.success && response.data) {
              adminData.setOrders(response.data);
              optimisticData.setData(response.data);
            }
            return response;
          }, 100)
          .catch((err) => {
            // Silently handle sync errors - operation already succeeded
            console.warn('Background sync error after delete:', err);
          });
      } catch (error) {
        if (onError) onError(error);
        throw error;
      }
    },
    [optimisticData, adminData]
  );

  /**
   * Fast update with optimistic update
   */
  const fastUpdate = useCallback(
    async (orderId, updates, onSuccess, onError) => {
      try {
        // Ensure optimisticData has the current orders before updating
        const currentOrders = adminData.orders || [];
        const order = currentOrders.find(
          (o) => o._id === orderId || o.orderId === orderId || o.id === orderId
        );

        if (!order) {
          throw new Error(`Order with ID ${orderId} not found`);
        }

        // Sync optimisticData with adminData.orders if needed
        const optimisticOrders = optimisticData.data || [];
        const orderInOptimistic = optimisticOrders.find(
          (o) => o._id === orderId || o.orderId === orderId || o.id === orderId
        );

        if (!orderInOptimistic) {
          // Order not in optimistic data, sync it first
          optimisticData.setData([...currentOrders]);
        }

        const apiOrderId = order._id || order.id || order.orderId || orderId;

        await optimisticData.updateOptimistic(orderId, updates, async () => {
          const response = await api.updateOrder(apiOrderId, {
            ...order,
            ...updates,
          });
          return response;
        });

        // Update adminData.orders immediately with optimistic update
        adminData.setOrders((prevOrders) =>
          prevOrders.map((o) =>
            o._id === orderId || o.orderId === orderId || o.id === orderId
              ? { ...o, ...updates }
              : o
          )
        );

        // Sync in background (debounced)
        await optimisticData.syncDebounced(async () => {
          const response = await api.getAllOrders({});
          if (response.success && response.data) {
            adminData.setOrders(response.data);
            optimisticData.setData(response.data);
          }
          return response;
        }, 500);

        if (onSuccess) onSuccess();
      } catch (error) {
        if (onError) onError(error);
        throw error;
      }
    },
    [optimisticData, adminData]
  );

  /**
   * Fast create with optimistic update
   */
  const fastCreate = useCallback(
    async (orderData, onSuccess, onError) => {
      try {
        // Create optimistically and call API
        const response = await optimisticData.createOptimistic(orderData, async () => {
          const response = await api.createManualOrder(orderData);
          return response;
        });

        // If API returned the created order, add it immediately
        if (response && response.data && response.data.order) {
          const newOrder = response.data.order;
          adminData.setOrders((prevOrders) => [...prevOrders, newOrder]);
        } else if (response && response.data && Array.isArray(response.data)) {
          // If response is an array, use it
          adminData.setOrders((prevOrders) => [...prevOrders, ...response.data]);
        }

        // Call success immediately - don't wait for sync
        if (onSuccess) onSuccess();

        // Sync in background (non-blocking) with reduced delay
        optimisticData
          .syncDebounced(async () => {
            const response = await api.getAllOrders({});
            if (response.success && response.data) {
              adminData.setOrders(response.data);
              optimisticData.setData(response.data);
            }
            return response;
          }, 100)
          .catch((err) => {
            // Silently handle sync errors - operation already succeeded
            console.warn('Background sync error after create:', err);
          });
      } catch (error) {
        if (onError) onError(error);
        throw error;
      }
    },
    [optimisticData, adminData]
  );

  /**
   * Debounced sync - batches multiple sync calls
   */
  const syncDebounced = useCallback(
    async (delay = 300) => {
      return await optimisticData.syncDebounced(async () => {
        const response = await api.getAllOrders({});
        if (response.success && response.data) {
          adminData.setOrders(response.data);
        }
        return response;
      }, delay);
    },
    [optimisticData, adminData]
  );

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

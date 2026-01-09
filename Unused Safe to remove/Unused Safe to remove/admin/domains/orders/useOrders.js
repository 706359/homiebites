/**
 * useOrders Hook
 * Manages order state and CRUD operations
 * Clean separation: state management only, no business logic
 */
import { useCallback, useState, useEffect } from "react";
import * as ordersService from "./orders.service.js";
import { normalizeOrder } from "./order.normalize.js";

/**
 * Hook for managing orders
 * @param {Object} options
 * @param {boolean} options.autoLoad - Auto-load orders on mount (default: true)
 * @returns {Object} Orders state and operations
 */
export const useOrders = (options = {}) => {
  const { autoLoad = true } = options;

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Load orders from backend
   */
  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await ordersService.loadOrders();

      if (result.success) {
        // Normalize all orders
        const normalized = result.data.map(normalizeOrder).filter(Boolean);
        setOrders(normalized);
        return { success: true, data: normalized };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (err) {
      const errorMsg = err.message || "Failed to load orders";
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Create a new order
   */
  const createOrder = useCallback(
    async (orderData) => {
      setLoading(true);
      setError(null);

      try {
        const result = await ordersService.createOrder(orderData);

        if (result.success) {
          // Reload orders to get the new one with backend-generated ID
          await loadOrders();
          return { success: true, data: result.data };
        } else {
          setError(result.error);
          return { success: false, error: result.error };
        }
      } catch (err) {
        const errorMsg = err.message || "Failed to create order";
        setError(errorMsg);
        return { success: false, error: errorMsg };
      } finally {
        setLoading(false);
      }
    },
    [loadOrders],
  );

  /**
   * Update an existing order
   */
  const updateOrder = useCallback(
    async (orderId, orderData) => {
      setLoading(true);
      setError(null);

      try {
        const result = await ordersService.updateOrder(orderId, orderData);

        if (result.success) {
          // Update local state optimistically
          setOrders((prev) =>
            prev.map((order) =>
              order.id === orderId ||
              order.orderId === orderId ||
              order._id === orderId
                ? normalizeOrder({ ...order, ...orderData, ...result.data })
                : order,
            ),
          );
          return { success: true, data: result.data };
        } else {
          setError(result.error);
          // Reload to get accurate state
          await loadOrders();
          return { success: false, error: result.error };
        }
      } catch (err) {
        const errorMsg = err.message || "Failed to update order";
        setError(errorMsg);
        await loadOrders(); // Reload on error
        return { success: false, error: errorMsg };
      } finally {
        setLoading(false);
      }
    },
    [loadOrders],
  );

  /**
   * Delete an order
   */
  const deleteOrder = useCallback(async (orderId) => {
    setLoading(true);
    setError(null);

    try {
      const result = await ordersService.deleteOrder(orderId);

      if (result.success) {
        // Update local state optimistically
        setOrders((prev) =>
          prev.filter(
            (order) =>
              order.id !== orderId &&
              order.orderId !== orderId &&
              order._id !== orderId,
          ),
        );
        return { success: true };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (err) {
      const errorMsg = err.message || "Failed to delete order";
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Update order status
   */
  const updateOrderStatus = useCallback(
    async (orderId, status) => {
      return updateOrder(orderId, { paymentStatus: status, status });
    },
    [updateOrder],
  );

  /**
   * Clear all orders
   */
  const clearAllOrders = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await ordersService.clearAllOrders();

      if (result.success) {
        setOrders([]);
        return { success: true };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (err) {
      const errorMsg = err.message || "Failed to clear orders";
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-load on mount if enabled
  useEffect(() => {
    if (autoLoad) {
      loadOrders();
    }
  }, [autoLoad, loadOrders]);

  return {
    // State
    orders,
    loading,
    error,
    // Operations
    loadOrders,
    createOrder,
    updateOrder,
    deleteOrder,
    updateOrderStatus,
    clearAllOrders,
  };
};

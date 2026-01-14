
import { useCallback, useEffect } from 'react';
import api from '../../../lib/api-admin.js';
import dataSyncManager from '../utils/dataSyncManager.js';
import { useAdminData } from './useAdminData.js';
import useOptimisticData from './useOptimisticData.js';


export const useFastDataSync = () => {
  
  const adminData = useAdminData();

  
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

  
  useEffect(() => {
    if (adminData.orders && Array.isArray(adminData.orders)) {
      
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
    
  }, [adminData.orders]);

  
  const fastDelete = useCallback(
    async (orderId, onSuccess, onError) => {
      try {
        
        const currentOrders = adminData.orders || [];
        const order = currentOrders.find(
          (o) => o._id === orderId || o.orderId === orderId || o.id === orderId
        );

        if (!order) {
          throw new Error(`Order with ID ${orderId} not found`);
        }

        
        const optimisticOrders = optimisticData.data || [];
        const orderInOptimistic = optimisticOrders.find(
          (o) => o._id === orderId || o.orderId === orderId || o.id === orderId
        );

        if (!orderInOptimistic) {
          
          optimisticData.setData([...currentOrders]);
        }

        
        const apiOrderId = order._id || order.id || order.orderId || orderId;

        
        adminData.setOrders((prevOrders) =>
          prevOrders.filter((o) => o._id !== orderId && o.orderId !== orderId && o.id !== orderId)
        );

        
        await optimisticData.deleteOptimistic(
          orderId, 
          async () => {
            const response = await api.deleteOrder(apiOrderId); 
            return response;
          }
        );

        
        if (onSuccess) onSuccess();

        
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
            
            console.warn('Background sync error after delete:', err);
          });
      } catch (error) {
        
        const errorMessage = error.message || 'Failed to delete order';
        const formattedError = new Error(errorMessage);
        if (onError) {
          onError(formattedError);
        } else {
          throw formattedError;
        }
      }
    },
    [optimisticData, adminData]
  );

  
  const fastUpdate = useCallback(
    async (orderId, updates, onSuccess, onError) => {
      try {
        
        const currentOrders = adminData.orders || [];
        const order = currentOrders.find(
          (o) => o._id === orderId || o.orderId === orderId || o.id === orderId
        );

        if (!order) {
          throw new Error(`Order with ID ${orderId} not found`);
        }

        
        const optimisticOrders = optimisticData.data || [];
        const orderInOptimistic = optimisticOrders.find(
          (o) => o._id === orderId || o.orderId === orderId || o.id === orderId
        );

        if (!orderInOptimistic) {
          
          optimisticData.setData([...currentOrders]);
        }

        const apiOrderId = order._id || order.id || order.orderId || orderId;

        const updatePayload = {};
        Object.keys(updates).forEach(key => {
          if (updates[key] !== undefined) {
            updatePayload[key] = updates[key];
          }
        });
        
        
        if (updatePayload.status && !updatePayload.paymentStatus) {
          const statusLower = String(updatePayload.status).toLowerCase().trim();
          if (statusLower === 'paid' || statusLower === 'delivered') {
            updatePayload.paymentStatus = 'Paid';
          } else {
            updatePayload.paymentStatus = 'Pending';
          }
        }

        
        await optimisticData.updateOptimistic(orderId, updates, async () => {
          const response = await api.updateOrder(apiOrderId, updatePayload);
          
          if (!response.success) {
            throw new Error(response.error || response.message || 'Update failed');
          }
          return response;
        });

        
        adminData.setOrders((prevOrders) =>
          prevOrders.map((o) =>
            o._id === orderId || o.orderId === orderId || o.id === orderId
              ? { ...o, ...updates }
              : o
          )
        );

        
        
        optimisticData
          .syncDebounced(async () => {
            const response = await api.getAllOrders({});
            if (response.success && response.data) {
              adminData.setOrders(response.data);
              optimisticData.setData(response.data);
            }
            return response;
          }, 500)
          .catch((err) => {
            
            console.warn('[useFastDataSync] Background sync error after update:', err);
          });

        
        
        if (onSuccess) onSuccess();
      } catch (error) {
        
        const errorMessage = error.message || 'Failed to update order';
        const formattedError = new Error(errorMessage);
        if (onError) {
          onError(formattedError);
        } else {
          throw formattedError;
        }
      }
    },
    [optimisticData, adminData]
  );

  
  const fastCreate = useCallback(
    async (orderData, onSuccess, onError) => {
      try {
        
        const response = await optimisticData.createOptimistic(orderData, async () => {
          const response = await api.createManualOrder(orderData);
          return response;
        });

        
        if (response && response.data && response.data.order) {
          const newOrder = response.data.order;
          adminData.setOrders((prevOrders) => [...prevOrders, newOrder]);
        } else if (response && response.data && Array.isArray(response.data)) {
          
          adminData.setOrders((prevOrders) => [...prevOrders, ...response.data]);
        }

        
        if (onSuccess) onSuccess();

        
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
            
            console.warn('Background sync error after create:', err);
          });
      } catch (error) {
        
        const errorMessage = error.message || 'Failed to create order';
        const formattedError = new Error(errorMessage);
        if (onError) {
          onError(formattedError);
        } else {
          throw formattedError;
        }
      }
    },
    [optimisticData, adminData]
  );

  
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

  
  const cancelAll = useCallback(() => {
    dataSyncManager.cancelAllRequests();
    optimisticData.cancel();
  }, [optimisticData]);

  return {
    
    ...adminData,

    
    fastDelete,
    fastUpdate,
    fastCreate,
    syncDebounced,
    cancelAll,

    
    syncing: optimisticData.syncing,
    hasPendingOps: dataSyncManager.hasPendingOperations(),
  };
};

export default useFastDataSync;

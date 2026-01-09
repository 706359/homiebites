import { useCallback, useState } from "react";
import api from "../../../lib/api-admin.js";
import {
  calculateTotalAmount,
  extractBillingMonth,
  extractBillingYear,
  getLastUnitPriceForAddress,
  getUniqueAddresses,
} from "../utils/orderUtils.js";

/**
 * Custom hook for order management operations
 * Provides reusable functions for CRUD operations on orders
 */
export const useOrderManagement = ({
  orders,
  setOrders,
  setOrdersHook,
  lastSyncedOrdersRef,
  showNotification,
  loadOrders,
  excelData,
  excelFileName,
  selectedSheet,
  setExcelData,
}) => {
  const [editingOrder, setEditingOrder] = useState(null);
  const [newOrder, setNewOrder] = useState({
    date: new Date().toISOString().split("T")[0],
    deliveryAddress: "",
    quantity: 1,
    unitPrice: 0,
    status: "Paid",
    paymentMode: "Online",
    source: "manual",
  });
  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const [showAddressSuggestions, setShowAddressSuggestions] = useState(false);

  // Initialize new order with defaults
  const initializeNewOrder = useCallback(() => {
    const today = new Date().toISOString().split("T")[0];
    setNewOrder({
      date: today,
      deliveryAddress: "",
      quantity: 1,
      unitPrice: 0,
      status: "Paid",
      paymentMode: "Online",
      source: "manual",
    });
    const uniqueAddresses = getUniqueAddresses(orders);
    setAddressSuggestions(uniqueAddresses);
  }, [orders]);

  // Handle new order field changes
  const handleNewOrderChange = useCallback(
    (field, value) => {
      setNewOrder((prev) => {
        const updated = { ...prev, [field]: value };

        // Auto-fill unit price when address changes (smart suggestion)
        if (field === "deliveryAddress" && value) {
          const lastPrice = getLastUnitPriceForAddress(orders, value);
          if (lastPrice && !prev.unitPrice) {
            updated.unitPrice = lastPrice;
          }
          // Update address suggestions
          const query = String(value).toLowerCase();
          const filtered = getUniqueAddresses(orders).filter((addr) =>
            addr.toLowerCase().includes(query),
          );
          setAddressSuggestions(filtered);
          setShowAddressSuggestions(filtered.length > 0 && query.length > 0);
        }

        return updated;
      });
    },
    [orders],
  );

  // Save new order (create or update)
  const saveOrder = useCallback(
    async (orderData, isEdit = false) => {
      if (!orderData.deliveryAddress || !orderData.date) {
        showNotification("Please fill in Delivery Address and Date", "warning");
        return false;
      }

      // Auto-calculate derived fields
      const quantity = parseInt(orderData.quantity) || 1;
      const unitPrice = parseFloat(orderData.unitPrice) || 0;
      const totalAmount = calculateTotalAmount(quantity, unitPrice);
      const orderDate = new Date(orderData.date);
      const billingMonth = extractBillingMonth(orderDate);
      const billingYear = extractBillingYear(orderDate);

      // Preserve Order ID if editing, otherwise backend will generate
      const orderId = isEdit
        ? orderData.orderId || orderData.order_id || orderData.id
        : null; // Backend will generate ID

      // Try API first
      const token = localStorage.getItem("homiebites_token");
      if (token && (isEdit ? orderData._id || orderData.id : true)) {
        try {
          // Validate date and clear dateNeedsReview if date is valid
          const orderDate = new Date(orderData.date);
          const isDateValid = !isNaN(orderDate.getTime());

          const apiOrder = {
            // orderId only for edits (preserve existing), backend generates for new orders
            ...(orderId ? { orderId } : {}),
            date: orderData.date,
            deliveryAddress: orderData.deliveryAddress,
            quantity: quantity,
            unitPrice: unitPrice,
            totalAmount: totalAmount,
            mode: orderData.mode || "Morning",
            status: orderData.status,
            paymentMode: orderData.paymentMode,
            billingMonth: billingMonth,
            billingYear: billingYear,
            source: orderData.source || "manual",
            // Clear dateNeedsReview flag if date is valid
            ...(isDateValid
              ? { dateNeedsReview: false, originalDateString: undefined }
              : {}),
          };

          if (isEdit) {
            const response = await api.updateOrder(
              orderData._id || orderData.id,
              apiOrder,
            );
            if (response.success) {
              await loadOrders();
              showNotification("Order updated successfully!", "success");
              return true;
            }
          } else {
            const response = await api.createOrder(apiOrder);
            if (response.success) {
              await loadOrders();
              showNotification("Order added successfully!", "success");
              return true;
            }
          }
        } catch (apiError) {
          console.error(
            `Failed to ${isEdit ? "update" : "save"} order via API:`,
            apiError.message,
          );
          showNotification(
            `Failed to ${isEdit ? "update" : "save"} order: ${apiError.message}`,
            "error",
          );
          return false;
        }
      } else {
        showNotification("Please login to save orders", "error");
        return false;
      }
    },
    [
      orders,
      setOrders,
      setOrdersHook,
      lastSyncedOrdersRef,
      showNotification,
      loadOrders,
    ],
  );

  // Delete order
  const deleteOrder = useCallback(
    async (orderId) => {
      const token = localStorage.getItem("homiebites_token");
      const order = orders.find(
        (o) => o.orderId === orderId || o.id === orderId || o._id === orderId,
      );
      const apiOrderId = order?.orderId || order?.id || order?._id;

      if (token && apiOrderId) {
        try {
          const response = await api.deleteOrder(apiOrderId);
          if (response.success) {
            await loadOrders();
            showNotification("Order deleted successfully!", "success");
            return true;
          }
        } catch (apiError) {
          console.error("Failed to delete order from API:", apiError.message);
          showNotification(
            `Failed to delete order: ${apiError.message}`,
            "error",
          );
          return false;
        }
      } else {
        showNotification("Please login to delete orders", "error");
        return false;
      }
    },
    [
      orders,
      setOrders,
      setOrdersHook,
      lastSyncedOrdersRef,
      showNotification,
      loadOrders,
    ],
  );

  // Update order status - now requires backend API call
  const updateOrderStatus = useCallback(
    async (orderId, newStatus) => {
      const token = localStorage.getItem("homiebites_token");
      if (!token) {
        showNotification("Please login to update order status", "error");
        return false;
      }

      const order = orders.find(
        (o) => o.orderId === orderId || o.id === orderId || o._id === orderId,
      );
      if (!order) {
        showNotification("Order not found", "error");
        return false;
      }

      const apiOrderId = order._id || order.id || order.orderId;

      try {
        const response = await api.updateOrder(apiOrderId, {
          ...order,
          status: newStatus,
        });

        if (response.success) {
          await loadOrders();
          showNotification("Order status updated successfully!", "success");
          return true;
        } else {
          showNotification("Failed to update order status", "error");
          return false;
        }
      } catch (apiError) {
        console.error(
          "Failed to update order status via API:",
          apiError.message,
        );
        showNotification(
          `Failed to update order status: ${apiError.message}`,
          "error",
        );
        return false;
      }
    },
    [orders, showNotification, loadOrders],
  );

  return {
    // State
    editingOrder,
    setEditingOrder,
    newOrder,
    setNewOrder,
    addressSuggestions,
    setAddressSuggestions,
    showAddressSuggestions,
    setShowAddressSuggestions,

    // Actions
    initializeNewOrder,
    handleNewOrderChange,
    saveOrder,
    deleteOrder,
    updateOrderStatus,
  };
};

export default useOrderManagement;

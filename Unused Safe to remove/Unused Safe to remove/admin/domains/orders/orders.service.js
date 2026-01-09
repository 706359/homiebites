/**
 * Orders Service
 * Handles all API communication for orders
 * Pure service layer - no React hooks, no state management
 */
import api from "../../../lib/api.js";

/**
 * Load all orders from backend
 * @param {Object} filters - Optional filters (currently unused but reserved for future)
 * @returns {Promise<{success: boolean, data: Array, error?: string}>}
 */
export const loadOrders = async (filters = {}) => {
  try {
    const token = localStorage.getItem("homiebites_token");
    const isAdmin = localStorage.getItem("homiebites_admin") === "true";

    if (!token || !isAdmin) {
      return {
        success: false,
        data: [],
        error: "Not authenticated",
      };
    }

    const response = await api.getAllOrders({});

    if (response.success && Array.isArray(response.data)) {
      return {
        success: true,
        data: response.data,
      };
    }

    return {
      success: false,
      data: [],
      error: response.error || "Unknown error",
    };
  } catch (error) {
    console.error("[orders.service] loadOrders error:", error);
    return {
      success: false,
      data: [],
      error: error.message || "Failed to load orders",
    };
  }
};

/**
 * Create a new order
 * @param {Object} orderData - Order data (source fields only)
 * @returns {Promise<{success: boolean, data?: Object, error?: string}>}
 */
export const createOrder = async (orderData) => {
  try {
    const response = await api.createOrder(orderData);

    if (response.success) {
      return {
        success: true,
        data: response.data,
      };
    }

    return {
      success: false,
      error: response.error || "Failed to create order",
    };
  } catch (error) {
    console.error("[orders.service] createOrder error:", error);
    return {
      success: false,
      error: error.message || "Failed to create order",
    };
  }
};

/**
 * Update an existing order
 * @param {string} orderId - Order ID
 * @param {Object} orderData - Updated order data
 * @returns {Promise<{success: boolean, data?: Object, error?: string}>}
 */
export const updateOrder = async (orderId, orderData) => {
  try {
    const response = await api.updateOrder(orderId, orderData);

    if (response.success) {
      return {
        success: true,
        data: response.data,
      };
    }

    return {
      success: false,
      error: response.error || "Failed to update order",
    };
  } catch (error) {
    console.error("[orders.service] updateOrder error:", error);
    return {
      success: false,
      error: error.message || "Failed to update order",
    };
  }
};

/**
 * Delete an order
 * @param {string} orderId - Order ID
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const deleteOrder = async (orderId) => {
  try {
    const response = await api.deleteOrder(orderId);

    if (response.success) {
      return {
        success: true,
      };
    }

    return {
      success: false,
      error: response.error || "Failed to delete order",
    };
  } catch (error) {
    console.error("[orders.service] deleteOrder error:", error);
    return {
      success: false,
      error: error.message || "Failed to delete order",
    };
  }
};

/**
 * Update order payment status
 * @param {string} orderId - Order ID
 * @param {string} status - New status ('Paid', 'Unpaid', 'Pending')
 * @returns {Promise<{success: boolean, data?: Object, error?: string}>}
 */
export const updateOrderStatus = async (orderId, status) => {
  return updateOrder(orderId, { paymentStatus: status, status });
};

/**
 * Bulk upload orders (Excel import)
 * @param {FormData} formData - FormData containing Excel file
 * @returns {Promise<{success: boolean, data?: {imported: number, errors: number}, error?: string}>}
 */
export const bulkUploadOrders = async (formData) => {
  try {
    const response = await api.uploadExcel(formData);

    if (response.success && response.data) {
      return {
        success: true,
        data: {
          imported: response.data.imported || 0,
          errors: response.data.errors || 0,
          validationErrors: response.data.validationErrors || 0,
          errorDetails: response.data.errorDetails || [],
        },
      };
    }

    return {
      success: false,
      error: response.error || "Failed to upload orders",
    };
  } catch (error) {
    console.error("[orders.service] bulkUploadOrders error:", error);
    return {
      success: false,
      error: error.message || "Failed to upload orders",
    };
  }
};

/**
 * Clear all orders (admin only)
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const clearAllOrders = async () => {
  try {
    const response = await api.clearAllOrders();

    if (response.success) {
      return {
        success: true,
      };
    }

    return {
      success: false,
      error: response.error || "Failed to clear orders",
    };
  } catch (error) {
    console.error("[orders.service] clearAllOrders error:", error);
    return {
      success: false,
      error: error.message || "Failed to clear orders",
    };
  }
};

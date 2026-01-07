/**
 * Order normalization utilities
 * Centralized business logic for order data transformations
 */

/**
 * Normalize order status/paymentStatus to a consistent format
 * Handles: 'paid', 'unpaid', 'pending', 'delivered', etc.
 * @param {Object} order - Order object
 * @returns {string} Normalized status: 'Paid' | 'Unpaid' | 'Pending'
 */
export const normalizeOrderStatus = (order) => {
  if (!order) return "Pending";

  const statusValue = order.status || order.paymentStatus || "";
  const statusLower = String(statusValue).toLowerCase().trim();

  if (statusLower === "paid" || statusLower === "delivered") {
    return "Paid";
  }
  if (statusLower === "unpaid") {
    return "Unpaid";
  }
  return "Pending";
};

/**
 * Normalize order date - handles various input formats
 * @param {Date|string|number} dateInput - Date in any format
 * @returns {Date|null} Valid Date object or null
 */
export const normalizeOrderDate = (dateInput) => {
  if (!dateInput) return null;

  try {
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return null;
    return date;
  } catch (error) {
    console.error("[normalizeOrderDate] Error:", error);
    return null;
  }
};

/**
 * Normalize delivery address - trim and standardize
 * @param {string} address - Raw address string
 * @returns {string} Normalized address or empty string
 */
export const normalizeAddress = (address) => {
  if (!address) return "";
  return String(address).trim();
};

/**
 * Normalize unit price - ensure valid number
 * @param {any} price - Price in any format
 * @returns {number} Valid price or 0
 */
export const normalizeUnitPrice = (price) => {
  if (typeof price === "number" && !isNaN(price)) {
    return Math.max(0, price);
  }

  try {
    const parsed = parseFloat(String(price || "").replace(/[₹,]/g, ""));
    return isNaN(parsed) ? 0 : Math.max(0, parsed);
  } catch {
    return 0;
  }
};

/**
 * Normalize quantity - ensure valid positive integer
 * @param {any} qty - Quantity in any format
 * @returns {number} Valid quantity or 1
 */
export const normalizeQuantity = (qty) => {
  if (typeof qty === "number" && !isNaN(qty) && qty > 0) {
    return Math.floor(qty);
  }

  try {
    const parsed = parseInt(String(qty || ""), 10);
    return isNaN(parsed) || parsed < 1 ? 1 : parsed;
  } catch {
    return 1;
  }
};

/**
 * Normalize a complete order object
 * @param {Object} order - Raw order object
 * @returns {Object} Normalized order object
 */
export const normalizeOrder = (order) => {
  if (!order) return null;

  const normalizedDate = normalizeOrderDate(order.date || order.createdAt);

  return {
    ...order,
    date: normalizedDate,
    deliveryAddress: normalizeAddress(
      order.deliveryAddress || order.customerAddress || order.address,
    ),
    quantity: normalizeQuantity(order.quantity),
    unitPrice: normalizeUnitPrice(order.unitPrice),
    paymentStatus: normalizeOrderStatus(order),
    status: normalizeOrderStatus(order), // Keep both for backward compatibility
    // Calculate totalAmount if not present
    totalAmount:
      order.totalAmount ||
      normalizeQuantity(order.quantity) * normalizeUnitPrice(order.unitPrice),
  };
};

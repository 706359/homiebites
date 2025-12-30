/**
 * Order-related utility functions and calculations
 */

/**
 * Generate a unique Order ID in format: ORD-YYYYMMDD-RANDOM6
 * @param {Date|string} date - Order date (optional, defaults to today)
 * @param {Array} existingOrders - Array of existing orders to check for uniqueness
 * @returns {string} Unique Order ID
 */
export const generateUniqueOrderId = (date = null, existingOrders = []) => {
  // Format: ORD-YYYYMMDD-RANDOM6-TIMESTAMP4
  // This ensures uniqueness even when multiple orders are created in the same millisecond
  const orderDate = date ? new Date(date) : new Date();
  const y = orderDate.getFullYear();
  const m = String(orderDate.getMonth() + 1).padStart(2, '0');
  const d = String(orderDate.getDate()).padStart(2, '0');

  // Create a Set of existing order IDs for fast lookup
  const existingOrderIds = new Set();
  existingOrders.forEach((order) => {
    if (order.orderId) existingOrderIds.add(String(order.orderId).toUpperCase());
    if (order.id && String(order.id).startsWith('ORD-'))
      existingOrderIds.add(String(order.id).toUpperCase());
    if (order.order_id) existingOrderIds.add(String(order.order_id).toUpperCase());
  });

  // Generate unique ID with timestamp + random + counter to guarantee uniqueness
  let attempts = 0;
  let orderId;
  do {
    // Generate random alphanumeric string (base36) - ensure at least 6 chars
    let randomPart = '';
    while (randomPart.length < 6) {
      const rand = Math.random().toString(36).substring(2).toUpperCase();
      randomPart += rand;
    }
    randomPart = randomPart.substring(0, 6);

    // Add timestamp component (last 6 digits of millisecond timestamp)
    const timestamp = Date.now().toString().slice(-6);

    // Add attempt counter and random component for extra uniqueness
    const counter = String(attempts).padStart(2, '0');
    const extraRandom = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, '0');

    orderId = `ORD-${y}${m}${d}-${randomPart}${timestamp.slice(-4)}${counter}${extraRandom}`;
    attempts++;

    // Safety break after reasonable attempts
    if (attempts > 20) {
      // Use full timestamp + microsecond if needed
      const fullTimestamp = Date.now();
      const microtime = performance.now
        ? performance.now().toString().replace('.', '').slice(-6)
        : Math.floor(Math.random() * 1000000).toString();
      orderId = `ORD-${y}${m}${d}-${randomPart}${fullTimestamp.toString().slice(-6)}${microtime.slice(-4)}`;
      break;
    }
  } while (existingOrderIds.has(orderId.toUpperCase()));

  return orderId;
};

/**
 * Format currency with 2 decimal places
 */
export const formatCurrency = (amount) => {
  try {
    const num = parseFloat(amount) || 0;
    return num.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  } catch (error) {
    console.error('Error formatting currency:', error);
    return '0.00';
  }
};

/**
 * Get total revenue (all orders)
 */
export const getTotalRevenue = (ordersList = []) => {
  try {
    return ordersList.reduce((sum, order) => {
      const amount = parseFloat(order.total || order.totalAmount || 0);
      return sum + (isNaN(amount) ? 0 : amount);
    }, 0);
  } catch (error) {
    console.error('Error calculating total revenue:', error);
    return 0;
  }
};

/**
 * Get delivered revenue (only delivered orders)
 */
export const getDeliveredRevenue = (ordersList = []) => {
  try {
    return ordersList
      .filter((order) => order && order.status === 'delivered')
      .reduce((sum, order) => {
        const amount = parseFloat(order.total || order.totalAmount || 0);
        return sum + (isNaN(amount) ? 0 : amount);
      }, 0);
  } catch (error) {
    console.error('Error calculating delivered revenue:', error);
    return 0;
  }
};

/**
 * Get order date only (no time component)
 */
export const getOrderDateOnly = (order) => {
  try {
    if (!order) return null;
    const dateValue = order.createdAt || order.date;
    if (!dateValue) return null;
    const orderDate = new Date(dateValue);
    if (isNaN(orderDate.getTime())) {
      return null;
    }
    const year = orderDate.getFullYear();
    const month = String(orderDate.getMonth() + 1).padStart(2, '0');
    const day = String(orderDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  } catch (error) {
    return null;
  }
};

/**
 * Get order year
 */
export const getOrderYear = (order) => {
  try {
    if (!order) return null;
    if (order.year) {
      return String(order.year);
    }
    const dateValue = order.createdAt || order.date;
    if (!dateValue) return null;
    const orderDate = new Date(dateValue);
    if (isNaN(orderDate.getTime())) {
      return null;
    }
    return String(orderDate.getFullYear());
  } catch (error) {
    return null;
  }
};

/**
 * Calculate total amount from quantity and unit price
 * This is the ONLY way total_amount should be calculated
 */
export const calculateTotalAmount = (quantity, unitPrice) => {
  try {
    const qty = parseInt(quantity) || 0;
    const price = parseFloat(unitPrice) || 0;
    return qty * price;
  } catch (error) {
    console.error('Error calculating total amount:', error);
    return 0;
  }
};

/**
 * Extract billing month (1-12) from order date
 */
export const extractBillingMonth = (orderDate) => {
  try {
    if (!orderDate) return null;
    const date = new Date(orderDate);
    if (isNaN(date.getTime())) return null;
    return date.getMonth() + 1; // 1-12
  } catch (error) {
    console.error('Error extracting billing month:', error);
    return null;
  }
};

/**
 * Extract billing year from order date
 */
export const extractBillingYear = (orderDate) => {
  try {
    if (!orderDate) return null;
    const date = new Date(orderDate);
    if (isNaN(date.getTime())) return null;
    return date.getFullYear();
  } catch (error) {
    console.error('Error extracting billing year:', error);
    return null;
  }
};

/**
 * Format billing month for display only (e.g., "February'24")
 * This is NEVER stored, only calculated for display
 */
export const formatBillingMonth = (month, year) => {
  try {
    if (!month || !year) return '';
    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    const monthIndex = parseInt(month) - 1;
    if (monthIndex < 0 || monthIndex > 11) return '';
    const yearStr = String(year).slice(-2);
    return `${monthNames[monthIndex]}'${yearStr}`;
  } catch (error) {
    console.error('Error formatting billing month:', error);
    return '';
  }
};

/**
 * Format reference month for display only (e.g., "2(Feb'24)")
 * This is NEVER stored, only calculated for display
 */
export const formatReferenceMonth = (month, year) => {
  try {
    if (!month || !year) return '';
    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    const monthIndex = parseInt(month) - 1;
    if (monthIndex < 0 || monthIndex > 11) return '';
    const yearStr = String(year).slice(-2);
    return `${String(month).padStart(2, '0')} - ${monthNames[monthIndex]}'${yearStr}`;
  } catch (error) {
    console.error('Error formatting reference month:', error);
    return '';
  }
};

/**
 * Normalize order date to YYYY-MM-DD format for comparison
 */
export const normalizeOrderDate = (dateValue) => {
  try {
    if (!dateValue) return null;
    const date = new Date(dateValue);
    if (isNaN(date.getTime())) return null;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  } catch (error) {
    console.error('Error normalizing order date:', error);
    return null;
  }
};

/**
 * Create composite key from date and address for duplicate detection
 */
export const createOrderKey = (orderDate, deliveryAddress) => {
  try {
    const normalizedDate = normalizeOrderDate(orderDate);
    const normalizedAddress = String(deliveryAddress || '')
      .trim()
      .toLowerCase();
    if (!normalizedDate || !normalizedAddress) return null;
    return `${normalizedDate}|${normalizedAddress}`;
  } catch (error) {
    console.error('Error creating order key:', error);
    return null;
  }
};

/**
 * Find existing order by date and address (for update/insert logic)
 */
export const findOrderByKey = (orders, orderDate, deliveryAddress) => {
  try {
    const key = createOrderKey(orderDate, deliveryAddress);
    if (!key) return null;
    return (
      orders.find((order) => {
        const orderKey = createOrderKey(
          order.date || order.createdAt,
          order.deliveryAddress || order.customerAddress
        );
        return orderKey === key;
      }) || null
    );
  } catch (error) {
    console.error('Error finding order by key:', error);
    return null;
  }
};

/**
 * Get last unit price used for a specific address (for auto-fill)
 */
export const getLastUnitPriceForAddress = (orders, deliveryAddress) => {
  try {
    if (!deliveryAddress || !Array.isArray(orders)) return null;
    const normalizedAddress = String(deliveryAddress).trim().toLowerCase();

    // Find most recent order for this address
    const addressOrders = orders
      .filter((order) => {
        const orderAddress = String(order.deliveryAddress || order.customerAddress || '')
          .trim()
          .toLowerCase();
        return orderAddress === normalizedAddress && order.unitPrice;
      })
      .sort((a, b) => {
        const dateA = new Date(a.createdAt || a.date || 0);
        const dateB = new Date(b.createdAt || b.date || 0);
        return dateB - dateA;
      });

    return addressOrders.length > 0 ? parseFloat(addressOrders[0].unitPrice) : null;
  } catch (error) {
    console.error('Error getting last unit price:', error);
    return null;
  }
};

/**
 * Get unique addresses for autocomplete
 */
export const getUniqueAddresses = (orders) => {
  try {
    if (!Array.isArray(orders)) return [];
    const addressSet = new Set();
    orders.forEach((order) => {
      const address = order.deliveryAddress || order.customerAddress;
      if (address && String(address).trim()) {
        addressSet.add(String(address).trim());
      }
    });
    return Array.from(addressSet).sort();
  } catch (error) {
    console.error('Error getting unique addresses:', error);
    return [];
  }
};

/**
 * Ensure all orders have unique Order IDs
 * DEPRECATED: This function should NOT be used. IDs are generated by backend only.
 * This is legacy code - orders without IDs should be synced to backend to get proper IDs.
 * @param {Array} orders - Array of orders to process
 * @returns {Array} Array of orders with temporary IDs (backend will generate proper IDs on sync)
 * @deprecated Use backend-generated IDs only. This function uses temporary IDs.
 */
export const ensureAllOrdersHaveUniqueIds = (orders) => {
  try {
    if (!Array.isArray(orders)) return [];

    // Create a Set to track all assigned Order IDs
    const assignedIds = new Set();
    const updatedOrders = [];

    orders.forEach((order, index) => {
      const updatedOrder = { ...order };

      // Check if order already has a valid Order ID (accept both old ORD- and new HB format)
      let existingId = order.orderId || order.order_id || order.id;
      const idStr = existingId ? String(existingId).toUpperCase() : '';
      const hasValidId = idStr && (idStr.startsWith('ORD-') || idStr.startsWith('HB'));
      
      if (hasValidId) {
        // Order already has valid ID (old ORD- or new HB format), use it
        if (!assignedIds.has(idStr)) {
          assignedIds.add(idStr);
          updatedOrder.orderId = existingId;
          updatedOrder.order_id = existingId;
          // Only update id field if it doesn't already have a valid ID
          const currentId = String(updatedOrder.id || '').toUpperCase();
          if (!currentId || (!currentId.startsWith('ORD-') && !currentId.startsWith('HB'))) {
            updatedOrder.id = existingId;
          }
        } else {
          // ID already exists in this batch, will generate temporary ID below
          existingId = null;
        }
      }

      // Use temporary ID if missing (backend will generate proper HB format ID on sync)
      // DEPRECATED: This function should not be used - backend generates IDs
      if (!hasValidId) {
        // Use temporary ID - backend will generate proper HB250412A9F format ID on sync
        const tempId = `TEMP-${Date.now()}-${index}-${Math.random().toString(36).substring(2, 9)}`;
        updatedOrder.orderId = tempId;
        updatedOrder.order_id = tempId;
        updatedOrder.id = tempId;
        assignedIds.add(tempId.toUpperCase());
      }

      updatedOrders.push(updatedOrder);
    });

    return updatedOrders;
  } catch (error) {
    console.error('Error ensuring Order IDs:', error);
    return orders; // Return original if error
  }
};

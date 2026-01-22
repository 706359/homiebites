import { parseOrderDate } from './dateUtils.js';

export const formatCurrency = (amount) => {
  try {
    const num = parseFloat(amount) || 0;
    return Math.round(num).toLocaleString('en-IN', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  } catch (error) {
    console.error('Error formatting currency:', error);
    return '0';
  }
};

export const formatNumberIndian = (amount) => {
  try {
    const num = parseFloat(amount) || 0;
    return Math.round(num).toLocaleString('en-IN');
  } catch (error) {
    console.error('Error formatting number:', error);
    return '0';
  }
};

/**
 * Get the amount for a single order. Prefers totalAmount/total; falls back to quantity * unitPrice.
 * @param {object} order
 * @returns {number}
 */
export const getOrderAmount = (order) => {
  if (!order) return 0;
  let amount = null;
  if (order.totalAmount !== undefined && order.totalAmount !== null) {
    const parsed = parseFloat(String(order.totalAmount));
    if (!isNaN(parsed) && isFinite(parsed) && parsed >= 0) amount = parsed;
  }
  if (amount === null && order.total !== undefined && order.total !== null) {
    const parsed = parseFloat(String(order.total));
    if (!isNaN(parsed) && isFinite(parsed) && parsed >= 0) amount = parsed;
  }
  if (amount === null) {
    const qty = parseFloat(String(order.quantity || 1));
    const price = parseFloat(String(order.unitPrice || 0));
    if (
      !isNaN(qty) &&
      !isNaN(price) &&
      isFinite(qty) &&
      isFinite(price) &&
      qty >= 0 &&
      price >= 0
    ) {
      amount = Math.round(qty * price);
    }
  }
  return amount !== null && !isNaN(amount) && isFinite(amount) && amount >= 0
    ? amount
    : 0;
};

/**
 * Pending orders with orderDate strictly before (today - 45 days). Used for overdue counts and badges.
 * @param {Array} ordersList
 * @returns {Array}
 */
export const getOverdueOrders = (ordersList = []) => {
  if (!Array.isArray(ordersList)) return [];
  try {
    const now = new Date();
    const fortyFiveDaysAgo = new Date(now);
    fortyFiveDaysAgo.setDate(fortyFiveDaysAgo.getDate() - 45);
    fortyFiveDaysAgo.setHours(0, 0, 0, 0);
    return ordersList.filter((o) => {
      if (!o || !isPendingStatus(o.status, o.paymentStatus)) return false;
      const orderDate = parseOrderDate(o.date || o.order_date || null);
      if (!orderDate) return false;
      const orderDateMidnight = new Date(orderDate);
      orderDateMidnight.setHours(0, 0, 0, 0);
      return orderDateMidnight < fortyFiveDaysAgo;
    });
  } catch (error) {
    if (process.env.NODE_ENV === 'development')
      console.error('Error in getOverdueOrders:', error);
    return [];
  }
};

export const getTotalRevenue = (ordersList = []) => {
  try {
    return ordersList.reduce((sum, order) => sum + getOrderAmount(order), 0);
  } catch (error) {
    console.error('Error calculating total revenue:', error);
    return 0;
  }
};

export const getDeliveredRevenue = (ordersList = []) => {
  try {
    return ordersList
      .filter((order) => order && order.status === 'delivered')
      .reduce((sum, order) => sum + getOrderAmount(order), 0);
  } catch (error) {
    console.error('Error calculating delivered revenue:', error);
    return 0;
  }
};

export const getOrderDateOnly = (order) => {
  try {
    if (!order) return null;
    const orderDate = parseOrderDate(order.date || order.order_date || null);
    if (!orderDate) return null;
    const year = orderDate.getFullYear();
    const month = String(orderDate.getMonth() + 1).padStart(2, '0');
    const day = String(orderDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  } catch (error) {
    return null;
  }
};

export const getOrderYear = (order) => {
  try {
    if (!order) return null;
    if (order.year) {
      return String(order.year);
    }
    const orderDate = parseOrderDate(order.date || order.order_date || null);
    if (!orderDate) return null;
    return String(orderDate.getFullYear());
  } catch (error) {
    return null;
  }
};

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

export const extractBillingMonth = (orderDate) => {
  try {
    if (!orderDate) return null;
    const date = new Date(orderDate);
    if (isNaN(date.getTime())) return null;
    return date.getMonth() + 1;
  } catch (error) {
    console.error('Error extracting billing month:', error);
    return null;
  }
};

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

export const findOrderByKey = (orders, orderDate, deliveryAddress) => {
  try {
    const key = createOrderKey(orderDate, deliveryAddress);
    if (!key) return null;
    return (
      orders.find((order) => {
        const orderKey = createOrderKey(
          order.date || order.order_date || null,
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

export const getLastUnitPriceForAddress = (orders, deliveryAddress) => {
  try {
    if (!deliveryAddress || !Array.isArray(orders)) return null;
    const normalizedAddress = String(deliveryAddress).trim().toLowerCase();

    const addressOrders = orders
      .filter((order) => {
        const orderAddress = String(
          order.deliveryAddress || order.customerAddress || ''
        )
          .trim()
          .toLowerCase();
        return orderAddress === normalizedAddress && order.unitPrice;
      })
      .sort((a, b) => {
        const dateA = parseOrderDate(a.date || a.order_date || null);
        const dateB = parseOrderDate(b.date || b.order_date || null);
        if (!dateA && !dateB) return 0;
        if (!dateA) return 1;
        if (!dateB) return -1;
        return dateB - dateA;
      });

    return addressOrders.length > 0
      ? parseFloat(addressOrders[0].unitPrice)
      : null;
  } catch (error) {
    console.error('Error getting last unit price:', error);
    return null;
  }
};

export const getLastOrderForAddress = (orders, deliveryAddress) => {
  try {
    if (!deliveryAddress || !Array.isArray(orders)) return null;
    const normalizedAddress = String(deliveryAddress).trim().toLowerCase();

    const addressOrders = orders
      .filter((order) => {
        const orderAddress = String(
          order.deliveryAddress || order.customerAddress || order.address || ''
        )
          .trim()
          .toLowerCase();
        return orderAddress === normalizedAddress;
      })
      .sort((a, b) => {
        const dateA = parseOrderDate(a.date || a.order_date || null);
        const dateB = parseOrderDate(b.date || b.order_date || null);
        if (!dateA && !dateB) return 0;
        if (!dateA) return 1;
        if (!dateB) return -1;
        if (dateB.getTime() !== dateA.getTime()) {
          return dateB.getTime() - dateA.getTime();
        }

        const idA = (a.orderId || '').toString();
        const idB = (b.orderId || '').toString();
        return idB.localeCompare(idA);
      });

    return addressOrders.length > 0 ? addressOrders[0] : null;
  } catch (error) {
    console.error('Error getting last order for address:', error);
    return null;
  }
};

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

export const isPaidStatus = (status, paymentStatus = null) => {
  if (paymentStatus) {
    const ps = String(paymentStatus).toLowerCase().trim();
    if (ps === 'paid') return true;
  }

  if (!status) return false;
  const s = String(status).toLowerCase().trim();
  return s === 'paid' || s === 'delivered';
};

export const isPendingStatus = (status, paymentStatus = null) => {
  if (paymentStatus) {
    const ps = String(paymentStatus).toLowerCase().trim();
    if (ps === 'pending' || ps === 'unpaid') return true;
    if (ps === 'paid') return false;
  }

  if (!status) return true;
  const s = String(status).toLowerCase().trim();
  return s === 'pending' || s === 'unpaid';
};

export const normalizeStatus = (status) => {
  if (!status) return 'Pending';
  const s = String(status).toLowerCase().trim();
  if (s === 'paid' || s === 'delivered') return 'Paid';
  if (s === 'pending' || s === 'unpaid') return 'Pending';
  return 'Pending';
};

export const ensureAllOrdersHaveUniqueIds = (orders) => {
  console.warn(
    '[DEPRECATED] ensureAllOrdersHaveUniqueIds: Order IDs are now generated by backend. This function is kept for backward compatibility only.'
  );

  return orders;
};

export const extractOrderIdSequence = (orderId) => {
  if (!orderId) return 0;
  const match = orderId.toString().match(/HB-\w+'?\d{2}-\d{2}-(\d+)$/);
  return match && match[1] ? parseInt(match[1], 10) : 0;
};

export const sortOrdersByOrderId = (orders) => {
  if (!Array.isArray(orders) || orders.length === 0) return orders;

  return [...orders].sort((a, b) => {
    const seqA = extractOrderIdSequence(a.orderId);
    const seqB = extractOrderIdSequence(b.orderId);

    if (seqA > 0 && seqB > 0) {
      return seqB - seqA;
    }

    if (seqA > 0) return -1;
    if (seqB > 0) return 1;

    const idA = (a.orderId || '').toString();
    const idB = (b.orderId || '').toString();

    if (idA && idB) {
      return idB.localeCompare(idA);
    }

    if (!idA && !idB) return 0;
    if (!idA) return 1;
    if (!idB) return -1;

    return 0;
  });
};

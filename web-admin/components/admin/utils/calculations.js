/**
 * Calculation utilities for dashboard statistics and reports
 */
import {
  formatCurrency,
  getDeliveredRevenue,
  getOrderDateOnly,
  getTotalRevenue,
} from "./orderUtils.js";

/**
 * Get today's statistics
 */
export const getTodayStats = (ordersList = []) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayOrders = ordersList.filter((order) => {
      try {
        if (!order || !order.orderId) return false;
        const orderDate = new Date(order.createdAt || order.date || Date.now());
        return orderDate >= today && orderDate < tomorrow;
      } catch (e) {
        return false;
      }
    });

    const todayRevenue = getDeliveredRevenue(todayOrders);
    const todayTotalRevenue = getTotalRevenue(todayOrders);
    const pending = todayOrders.filter((o) =>
      ["pending", "confirmed", "preparing"].includes(o.status),
    ).length;

    return {
      orders: todayOrders.length,
      pending: pending,
      revenue: todayRevenue,
      totalRevenue: todayTotalRevenue,
    };
  } catch (error) {
    console.error("Error calculating today stats:", error);
    return {
      orders: 0,
      pending: 0,
      revenue: 0,
      totalRevenue: 0,
    };
  }
};

/**
 * Get weekly statistics
 */
export const getWeeklyStats = (ordersList = []) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay()); // Start of week (Sunday)
    const weekEnd = new Date(today);
    weekEnd.setDate(today.getDate() + (6 - today.getDay())); // End of week (Saturday)
    weekEnd.setHours(23, 59, 59, 999);

    const weekOrders = ordersList.filter((order) => {
      try {
        if (!order || !order.orderId) return false;
        const orderDate = new Date(order.createdAt || order.date);
        return orderDate >= weekStart && orderDate <= weekEnd;
      } catch (e) {
        return false;
      }
    });

    const weekRevenue = getTotalRevenue(weekOrders);
    const weekDeliveredRevenue = getDeliveredRevenue(weekOrders);
    const deliveredWeekOrders = weekOrders.filter(
      (o) => o && o.status === "delivered",
    );

    return {
      orders: weekOrders.length,
      revenue: weekDeliveredRevenue, // Only delivered for stats
      totalRevenue: weekRevenue, // All orders for total
      deliveredRevenue: weekDeliveredRevenue,
      avgOrderValue:
        deliveredWeekOrders.length > 0
          ? Math.round(weekDeliveredRevenue / deliveredWeekOrders.length)
          : 0,
      avgOrderValueAll:
        weekOrders.length > 0 ? Math.round(weekRevenue / weekOrders.length) : 0,
      formattedRevenue: formatCurrency(weekDeliveredRevenue),
      formattedDeliveredRevenue: formatCurrency(weekDeliveredRevenue),
    };
  } catch (error) {
    console.error("Error calculating weekly stats:", error);
    return {
      orders: 0,
      revenue: 0,
      deliveredRevenue: 0,
      formattedRevenue: formatCurrency(0),
      formattedDeliveredRevenue: formatCurrency(0),
    };
  }
};

/**
 * Get pending orders count
 */
export const getPendingOrders = (ordersList = []) => {
  try {
    return ordersList.filter((o) =>
      ["pending", "confirmed", "preparing"].includes(o.status),
    ).length;
  } catch (error) {
    console.error("Error calculating pending orders:", error);
    return 0;
  }
};

/**
 * Filter orders by date range
 */
export const getFilteredOrdersByDate = (
  ordersList,
  dateRange,
  customStartDate,
  customEndDate,
) => {
  try {
    if (!Array.isArray(ordersList)) {
      return [];
    }

    if (dateRange === "all") {
      return ordersList;
    }

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    let startDate, endDate;

    switch (dateRange) {
      case "today":
        startDate = new Date(today);
        endDate = new Date(today);
        endDate.setHours(23, 59, 59, 999);
        break;
      case "week":
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 7);
        endDate = new Date(today);
        endDate.setHours(23, 59, 59, 999);
        break;
      case "month":
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        endDate.setHours(23, 59, 59, 999);
        break;
      case "custom":
        if (customStartDate && customEndDate) {
          startDate = new Date(customStartDate);
          startDate.setHours(0, 0, 0, 0);
          endDate = new Date(customEndDate);
          endDate.setHours(23, 59, 59, 999);
        } else {
          return ordersList;
        }
        break;
      default:
        return ordersList;
    }

    return ordersList.filter((order) => {
      try {
        if (!order) return false;
        // Support all possible date fields (check multiple field names)
        const dateValue =
          order.order_date ||
          order.createdAt ||
          order.date ||
          order.orderDate ||
          order.created_at;
        if (!dateValue) return false;

        // Try to parse the date
        let orderDate = new Date(dateValue);

        // If parsing fails, try parsing as DD-MMM-YY format (e.g., "31-Dec-25")
        if (isNaN(orderDate.getTime()) && typeof dateValue === "string") {
          const dateStr = dateValue.trim();
          // Try to parse DD-MMM-YY or DD-MMM-YYYY format
          const dateMatch = dateStr.match(/(\d{1,2})-([A-Za-z]{3})-(\d{2,4})/i);
          if (dateMatch) {
            const day = parseInt(dateMatch[1], 10);
            const monthNames = [
              "jan",
              "feb",
              "mar",
              "apr",
              "may",
              "jun",
              "jul",
              "aug",
              "sep",
              "oct",
              "nov",
              "dec",
            ];
            const month = monthNames.indexOf(dateMatch[2].toLowerCase());
            let year = parseInt(dateMatch[3], 10);
            // Handle 2-digit years: 25 -> 2025, 24 -> 2024
            if (year < 100) {
              year = year < 50 ? 2000 + year : 1900 + year;
            }
            if (month >= 0 && day > 0 && day <= 31 && year > 1900) {
              orderDate = new Date(year, month, day);
            }
          }
        }

        if (isNaN(orderDate.getTime())) return false;
        // Compare dates (ignore time for date-only comparison)
        orderDate.setHours(0, 0, 0, 0);
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        return orderDate >= start && orderDate <= end;
      } catch (e) {
        return false;
      }
    });
  } catch (error) {
    console.error("Error filtering orders by date:", error);
    return ordersList;
  }
};

/**
 * Generate summary report grouped by month/year
 */
export const getSummaryReport = (ordersList = []) => {
  try {
    if (!Array.isArray(ordersList) || ordersList.length === 0) {
      return [];
    }

    const reportMap = new Map();

    ordersList.forEach((order) => {
      try {
        if (!order) return;

        const dateOnly = getOrderDateOnly(order);
        if (!dateOnly) return;

        const orderDate = new Date(dateOnly);
        if (isNaN(orderDate.getTime())) return;

        const year = orderDate.getFullYear();
        const month = orderDate.getMonth() + 1;
        const key = `${year}-${String(month).padStart(2, "0")}`;

        if (!reportMap.has(key)) {
          reportMap.set(key, {
            year: String(year),
            month: String(month).padStart(2, "0"),
            monthName: orderDate.toLocaleString("en-US", { month: "long" }),
            totalOrders: 0,
            totalRevenue: 0,
            deliveredOrders: 0,
            deliveredRevenue: 0,
          });
        }

        const report = reportMap.get(key);
        
        let amount = null;
        if (order.totalAmount !== undefined && order.totalAmount !== null) {
          amount = parseFloat(order.totalAmount);
        } else if (order.total !== undefined && order.total !== null) {
          amount = parseFloat(order.total);
        }
        
        if (amount === null || isNaN(amount)) {
          const qty = parseFloat(order.quantity || 1);
          const price = parseFloat(order.unitPrice || 0);
          amount = qty * price;
        }
        
        const isDelivered =
          String(order.status || "").toLowerCase() === "delivered";

        report.totalOrders++;
        report.totalRevenue += isNaN(amount) ? 0 : amount;

        if (isDelivered) {
          report.deliveredOrders++;
          report.deliveredRevenue += isNaN(amount) ? 0 : amount;
        }
      } catch (orderError) {
        console.warn("Error processing order in summary report:", orderError);
      }
    });

    const reportArray = Array.from(reportMap.values());
    return reportArray.sort((a, b) => {
      if (a.year !== b.year) {
        return parseInt(b.year) - parseInt(a.year);
      }
      return parseInt(b.month) - parseInt(a.month);
    });
  } catch (error) {
    console.error("Error generating summary report:", error);
    return [];
  }
};

/**
 * Get all unique customers (by address)
 */
export const getAllCustomers = (ordersList = []) => {
  try {
    if (!Array.isArray(ordersList) || ordersList.length === 0) {
      return [];
    }

    const customerMap = new Map();

    ordersList.forEach((order) => {
      try {
        if (!order) return;

        const address = String(
          order.deliveryAddress || order.customerAddress || "",
        ).trim();
        if (!address) return;

        if (!customerMap.has(address)) {
          customerMap.set(address, {
            address: address,
            customerName: order.customerName || order.name || address,
            totalOrders: 0,
            totalAmount: 0,
            lastOrderDate: null,
            firstOrderDate: null,
            orders: [],
          });
        }

        const customer = customerMap.get(address);
        
        let amount = null;
        if (order.totalAmount !== undefined && order.totalAmount !== null) {
          amount = parseFloat(order.totalAmount);
        } else if (order.total !== undefined && order.total !== null) {
          amount = parseFloat(order.total);
        }
        
        if (amount === null || isNaN(amount)) {
          const qty = parseFloat(order.quantity || 1);
          const price = parseFloat(order.unitPrice || 0);
          amount = qty * price;
        }
        
        const orderDate = new Date(order.createdAt || order.date);

        customer.totalOrders++;
        customer.totalAmount += isNaN(amount) ? 0 : amount;
        customer.orders.push(order);

        if (!customer.lastOrderDate || orderDate > customer.lastOrderDate) {
          customer.lastOrderDate = orderDate;
        }
        if (!customer.firstOrderDate || orderDate < customer.firstOrderDate) {
          customer.firstOrderDate = orderDate;
        }
      } catch (orderError) {
        console.warn("Error processing order in getAllCustomers:", orderError);
      }
    });

    return Array.from(customerMap.values());
  } catch (error) {
    console.error("Error generating customer list:", error);
    return [];
  }
};

/**
 * Calculate total expenses based on revenue
 * Uses configurable expense percentage (default 70% for food business)
 * This includes COGS, operational costs, delivery, etc.
 * @param {number} revenue - Total revenue
 * @param {number} expensePercentage - Percentage of revenue that goes to expenses (default: 70)
 * @returns {number} Total expenses
 */
export const calculateTotalExpenses = (revenue, expensePercentage = 70) => {
  try {
    const revenueNum = parseFloat(revenue) || 0;
    const expensePercent = parseFloat(expensePercentage) || 70;
    return (revenueNum * expensePercent) / 100;
  } catch (error) {
    console.error("Error calculating total expenses:", error);
    return 0;
  }
};

/**
 * Calculate profit after expenses
 * @param {number} revenue - Total revenue
 * @param {number} expenses - Total expenses (optional, will calculate if not provided)
 * @param {number} expensePercentage - Percentage of revenue for expenses (default: 70)
 * @returns {number} Profit after expenses
 */
export const calculateProfit = (
  revenue,
  expenses = null,
  expensePercentage = 70,
) => {
  try {
    const revenueNum = parseFloat(revenue) || 0;
    const expensesNum =
      expenses !== null
        ? parseFloat(expenses)
        : calculateTotalExpenses(revenueNum, expensePercentage);
    return Math.max(0, revenueNum - expensesNum);
  } catch (error) {
    console.error("Error calculating profit:", error);
    return 0;
  }
};

/**
 * Calculate profit with 30% margin
 * This represents the profit after covering all expenses, with a 30% margin on the profit
 * @param {number} revenue - Total revenue
 * @param {number} expenses - Total expenses (optional, will calculate if not provided)
 * @param {number} expensePercentage - Percentage of revenue for expenses (default: 70)
 * @param {number} profitMargin - Profit margin percentage (default: 30)
 * @returns {number} Profit with margin applied
 */
export const calculateProfitWithMargin = (
  revenue,
  expenses = null,
  expensePercentage = 70,
  profitMargin = 30,
) => {
  try {
    const profit = calculateProfit(revenue, expenses, expensePercentage);
    const marginPercent = parseFloat(profitMargin) || 30;
    return (profit * marginPercent) / 100;
  } catch (error) {
    console.error("Error calculating profit with margin:", error);
    return 0;
  }
};

/**
 * Calculate profit margin percentage
 * @param {number} revenue - Total revenue
 * @param {number} expenses - Total expenses (optional, will calculate if not provided)
 * @param {number} expensePercentage - Percentage of revenue for expenses (default: 70)
 * @returns {number} Profit margin as percentage
 */
export const calculateProfitMarginPercentage = (
  revenue,
  expenses = null,
  expensePercentage = 70,
) => {
  try {
    const revenueNum = parseFloat(revenue) || 0;
    if (revenueNum === 0) return 0;
    const profit = calculateProfit(revenue, expenses, expensePercentage);
    return (profit / revenueNum) * 100;
  } catch (error) {
    console.error("Error calculating profit margin percentage:", error);
    return 0;
  }
};

/**
 * Get comprehensive profit statistics
 * @param {number} revenue - Total revenue
 * @param {number} expensePercentage - Percentage of revenue for expenses (default: 70)
 * @param {number} targetProfitMargin - Target profit margin percentage (default: 30)
 * @returns {Object} Object containing all profit-related statistics
 */
export const getProfitStats = (
  revenue,
  expensePercentage = 70,
  targetProfitMargin = 30,
) => {
  try {
    const revenueNum = parseFloat(revenue) || 0;
    const expenses = calculateTotalExpenses(revenueNum, expensePercentage);
    const profit = calculateProfit(revenueNum, expenses, expensePercentage);
    const profitWithMargin = calculateProfitWithMargin(
      revenueNum,
      expenses,
      expensePercentage,
      targetProfitMargin,
    );
    const profitMarginPercent = calculateProfitMarginPercentage(
      revenueNum,
      expenses,
      expensePercentage,
    );
    const targetProfit = (revenueNum * targetProfitMargin) / 100;

    return {
      revenue: revenueNum,
      expenses: expenses,
      profit: profit,
      profitWithMargin: profitWithMargin,
      profitMarginPercent: profitMarginPercent,
      targetProfit: targetProfit,
      targetProfitMargin: targetProfitMargin,
      expensePercentage: expensePercentage,
    };
  } catch (error) {
    console.error("Error calculating profit stats:", error);
    return {
      revenue: 0,
      expenses: 0,
      profit: 0,
      profitWithMargin: 0,
      profitMarginPercent: 0,
      targetProfit: 0,
      targetProfitMargin: targetProfitMargin || 30,
      expensePercentage: expensePercentage || 70,
    };
  }
};


import {
  formatCurrency,
  getDeliveredRevenue,
  getOrderDateOnly,
  getTotalRevenue,
  isPendingStatus,
} from './orderUtils.js';
import { parseOrderDate } from './dateUtils.js';


export const getTodayStats = (ordersList = []) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayOrders = ordersList.filter((order) => {
      try {
        if (!order || !order.orderId) return false;
        const orderDate = parseOrderDate(order.date || order.order_date || null);
        if (!orderDate) return false;
        return orderDate >= today && orderDate < tomorrow;
      } catch (e) {
        return false;
      }
    });

    const todayRevenue = getDeliveredRevenue(todayOrders);
    const todayTotalRevenue = getTotalRevenue(todayOrders);
    const pending = todayOrders.filter((o) => isPendingStatus(o.status, o.paymentStatus)).length;

    return {
      orders: todayOrders.length,
      pending: pending,
      revenue: todayRevenue,
      totalRevenue: todayTotalRevenue,
    };
  } catch (error) {
    console.error('Error calculating today stats:', error);
    return {
      orders: 0,
      pending: 0,
      revenue: 0,
      totalRevenue: 0,
    };
  }
};


export const getWeeklyStats = (ordersList = []) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay()); 
    const weekEnd = new Date(today);
    weekEnd.setDate(today.getDate() + (6 - today.getDay())); 
    weekEnd.setHours(23, 59, 59, 999);

    const weekOrders = ordersList.filter((order) => {
      try {
        if (!order || !order.orderId) return false;
        const orderDate = parseOrderDate(order.date || order.order_date || null);
        if (!orderDate) return false;
        return orderDate >= weekStart && orderDate <= weekEnd;
      } catch (e) {
        return false;
      }
    });

    const weekRevenue = getTotalRevenue(weekOrders);
    const weekDeliveredRevenue = getDeliveredRevenue(weekOrders);
    const deliveredWeekOrders = weekOrders.filter((o) => o && o.status === 'delivered');

    return {
      orders: weekOrders.length,
      revenue: weekDeliveredRevenue, 
      totalRevenue: weekRevenue, 
      deliveredRevenue: weekDeliveredRevenue,
      avgOrderValue:
        deliveredWeekOrders.length > 0
          ? Math.round(weekDeliveredRevenue / deliveredWeekOrders.length)
          : 0,
      avgOrderValueAll: weekOrders.length > 0 ? Math.round(weekRevenue / weekOrders.length) : 0,
      formattedRevenue: formatCurrency(weekDeliveredRevenue),
      formattedDeliveredRevenue: formatCurrency(weekDeliveredRevenue),
    };
  } catch (error) {
    console.error('Error calculating weekly stats:', error);
    return {
      orders: 0,
      revenue: 0,
      deliveredRevenue: 0,
      formattedRevenue: formatCurrency(0),
      formattedDeliveredRevenue: formatCurrency(0),
    };
  }
};


export const getPendingOrders = (ordersList = []) => {
  try {
    return ordersList.filter((o) => isPendingStatus(o.status, o.paymentStatus)).length;
  } catch (error) {
    console.error('Error calculating pending orders:', error);
    return 0;
  }
};


export const getFilteredOrdersByDate = (ordersList, dateRange, customStartDate, customEndDate) => {
  try {
    if (!Array.isArray(ordersList)) {
      return [];
    }

    if (dateRange === 'all') {
      return ordersList;
    }

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    let startDate, endDate;

    switch (dateRange) {
      case 'today':
        startDate = new Date(today);
        endDate = new Date(today);
        endDate.setHours(23, 59, 59, 999);
        break;
      case 'week':
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 7);
        endDate = new Date(today);
        endDate.setHours(23, 59, 59, 999);
        break;
      case 'month':
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        endDate.setHours(23, 59, 59, 999);
        break;
      case 'year':
        startDate = new Date(today.getFullYear(), 0, 1);
        endDate = new Date(today.getFullYear(), 11, 31);
        endDate.setHours(23, 59, 59, 999);
        break;
      case 'custom':
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
        
        const orderDate = parseOrderDate(order.date || order.order_date || order.orderDate || null);
        if (!orderDate) return false;
        
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
    console.error('Error filtering orders by date:', error);
    return ordersList;
  }
};


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
        const key = `${year}-${String(month).padStart(2, '0')}`;

        if (!reportMap.has(key)) {
          reportMap.set(key, {
            year: String(year),
            month: String(month).padStart(2, '0'),
            monthName: orderDate.toLocaleString('en-US', { month: 'long' }),
            totalOrders: 0,
            totalRevenue: 0,
            deliveredOrders: 0,
            deliveredRevenue: 0,
          });
        }

        const report = reportMap.get(key);

        let amount = null;
        // Always use stored totalAmount/total if it exists - don't recalculate from qty * price
        if (order.totalAmount !== undefined && order.totalAmount !== null) {
          // Use exact totalAmount value as stored (even if 0)
          amount = parseFloat(order.totalAmount);
        } else if (order.total !== undefined && order.total !== null) {
          // Use exact total value as stored (even if 0)
          amount = parseFloat(order.total);
        }

        // Only calculate from qty * price if totalAmount and total are both missing/null
        if (amount === null || isNaN(amount)) {
          const qty = parseFloat(order.quantity || 1);
          const price = parseFloat(order.unitPrice || 0);
          // Only round when calculating from qty * price to avoid floating-point precision issues
          amount = Math.round(qty * price);
        }

        const isDelivered = String(order.status || '').toLowerCase() === 'delivered';

        report.totalOrders++;
        report.totalRevenue += isNaN(amount) ? 0 : amount;

        if (isDelivered) {
          report.deliveredOrders++;
          report.deliveredRevenue += isNaN(amount) ? 0 : amount;
        }
      } catch (orderError) {
        console.warn('Error processing order in summary report:', orderError);
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
    console.error('Error generating summary report:', error);
    return [];
  }
};


export const getAllCustomers = (ordersList = []) => {
  try {
    if (!Array.isArray(ordersList) || ordersList.length === 0) {
      return [];
    }

    const customerMap = new Map();

    ordersList.forEach((order) => {
      try {
        if (!order) return;

        const address = String(order.deliveryAddress || order.customerAddress || '').trim();
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
        // Always use stored totalAmount/total if it exists - don't recalculate from qty * price
        if (order.totalAmount !== undefined && order.totalAmount !== null) {
          // Use exact totalAmount value as stored (even if 0)
          amount = parseFloat(order.totalAmount);
        } else if (order.total !== undefined && order.total !== null) {
          // Use exact total value as stored (even if 0)
          amount = parseFloat(order.total);
        }

        // Only calculate from qty * price if totalAmount and total are both missing/null
        if (amount === null || isNaN(amount)) {
          const qty = parseFloat(order.quantity || 1);
          const price = parseFloat(order.unitPrice || 0);
          // Only round when calculating from qty * price to avoid floating-point precision issues
          amount = Math.round(qty * price);
        }

        const orderDate = parseOrderDate(order.date || order.order_date || null);

        customer.totalOrders++;
        customer.totalAmount += isNaN(amount) ? 0 : amount;
        customer.orders.push(order);

        if (orderDate) {
          if (!customer.lastOrderDate || orderDate > customer.lastOrderDate) {
            customer.lastOrderDate = orderDate;
          }
          if (!customer.firstOrderDate || orderDate < customer.firstOrderDate) {
            customer.firstOrderDate = orderDate;
          }
        }
      } catch (orderError) {
        console.warn('Error processing order in getAllCustomers:', orderError);
      }
    });

    return Array.from(customerMap.values());
  } catch (error) {
    console.error('Error generating customer list:', error);
    return [];
  }
};


export const calculateTotalExpenses = (revenue, expensePercentage = 70) => {
  try {
    const revenueNum = parseFloat(revenue) || 0;
    const expensePercent = parseFloat(expensePercentage) || 70;
    return (revenueNum * expensePercent) / 100;
  } catch (error) {
    console.error('Error calculating total expenses:', error);
    return 0;
  }
};


export const calculateProfit = (revenue, expenses = null, expensePercentage = 70) => {
  try {
    const revenueNum = parseFloat(revenue) || 0;
    const expensesNum =
      expenses !== null
        ? parseFloat(expenses)
        : calculateTotalExpenses(revenueNum, expensePercentage);
    return Math.max(0, revenueNum - expensesNum);
  } catch (error) {
    console.error('Error calculating profit:', error);
    return 0;
  }
};


export const calculateProfitWithMargin = (
  revenue,
  expenses = null,
  expensePercentage = 70,
  profitMargin = 30
) => {
  try {
    const profit = calculateProfit(revenue, expenses, expensePercentage);
    const marginPercent = parseFloat(profitMargin) || 30;
    return (profit * marginPercent) / 100;
  } catch (error) {
    console.error('Error calculating profit with margin:', error);
    return 0;
  }
};


export const calculateProfitMarginPercentage = (
  revenue,
  expenses = null,
  expensePercentage = 70
) => {
  try {
    const revenueNum = parseFloat(revenue) || 0;
    if (revenueNum === 0) return 0;
    const profit = calculateProfit(revenue, expenses, expensePercentage);
    return (profit / revenueNum) * 100;
  } catch (error) {
    console.error('Error calculating profit margin percentage:', error);
    return 0;
  }
};


export const getProfitStats = (revenue, expensePercentage = 70, targetProfitMargin = 30) => {
  try {
    const revenueNum = parseFloat(revenue) || 0;
    const expenses = calculateTotalExpenses(revenueNum, expensePercentage);
    const profit = calculateProfit(revenueNum, expenses, expensePercentage);
    const profitWithMargin = calculateProfitWithMargin(
      revenueNum,
      expenses,
      expensePercentage,
      targetProfitMargin
    );
    const profitMarginPercent = calculateProfitMarginPercentage(
      revenueNum,
      expenses,
      expensePercentage
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
    console.error('Error calculating profit stats:', error);
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

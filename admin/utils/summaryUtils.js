/**
 * Summary report utilities - MASTER ORDERS MODEL
 * All calculations read from master orders table
 */
import { formatCurrency } from './orderUtils.js';
import { extractBillingMonth, extractBillingYear } from './orderUtils.js';

/**
 * Generate summary report grouped by address and month
 * Reads from master orders table - uses billingMonth/billingYear (INT) from backend
 */
export const generateSummaryReport = (ordersList = []) => {
  try {
    if (!Array.isArray(ordersList) || ordersList.length === 0) {
      return {
        data: [],
        months: [],
        grandTotal: 0,
      };
    }

    const addressDataMap = new Map();
    const monthSet = new Set();

    ordersList.forEach((order) => {
      try {
        if (!order) return;

        const address = String(order.deliveryAddress || order.customerAddress || '').trim();
        if (!address) return;

        // MASTER ORDERS MODEL: Use billingMonth/billingYear (INT) from backend
        // If not available, calculate from date
        let billingMonth, billingYear;
        if (order.billingMonth && order.billingYear) {
          billingMonth = parseInt(order.billingMonth);
          billingYear = parseInt(order.billingYear);
        } else {
          const orderDate = new Date(order.date || order.createdAt);
          if (isNaN(orderDate.getTime())) return;
          billingMonth = extractBillingMonth(orderDate);
          billingYear = extractBillingYear(orderDate);
        }

        if (!billingMonth || !billingYear) return;

        const monthKey = `${String(billingMonth).padStart(2, '0')}-${billingYear}`;
        const monthLabel = `${String(billingMonth).padStart(2, '0')}'${String(billingYear).slice(-2)}`;
        monthSet.add(monthLabel);

        if (!addressDataMap.has(address)) {
          addressDataMap.set(address, {
            address: address,
            monthlyTotals: {},
            grandTotal: 0,
          });
        }

        const addressData = addressDataMap.get(address);
        const amount = parseFloat(order.totalAmount || order.total || 0);

        if (!addressData.monthlyTotals[monthLabel]) {
          addressData.monthlyTotals[monthLabel] = 0;
        }
        addressData.monthlyTotals[monthLabel] += isNaN(amount) ? 0 : amount;
        addressData.grandTotal += isNaN(amount) ? 0 : amount;
      } catch (orderError) {
        console.warn('Error processing order in summary report:', orderError);
      }
    });

    const months = Array.from(monthSet).sort();
    const data = Array.from(addressDataMap.values()).sort((a, b) => b.grandTotal - a.grandTotal);
    const grandTotal = data.reduce((sum, row) => sum + row.grandTotal, 0);

    return {
      data,
      months,
      grandTotal,
    };
  } catch (error) {
    console.error('Error generating summary report:', error);
    return {
      data: [],
      months: [],
      grandTotal: 0,
    };
  }
};

import assert from 'assert';
import {
  getAllCustomers,
  getFilteredOrdersByDate,
  getPendingOrders,
  getSummaryReport,
  getTodayStats,
  getWeeklyStats,
} from './calculations.js';
import {
  calculateTotalAmount,
  formatCurrency,
  getDeliveredRevenue,
  getTotalRevenue,
} from './orderUtils.js';

const now = new Date();
const isoNow = now.toISOString();
const yesterday = new Date(now);
yesterday.setDate(now.getDate() - 1);
const isoYesterday = yesterday.toISOString();
const lastWeek = new Date(now);
lastWeek.setDate(now.getDate() - 5);
const isoLastWeek = lastWeek.toISOString();
const lastMonth = new Date(now);
lastMonth.setMonth(now.getMonth() - 1);
lastMonth.setDate(5);
const isoLastMonth = lastMonth.toISOString();

const sampleOrders = [
  {
    orderId: 'o1',
    createdAt: isoNow,
    total: 250,
    status: 'delivered',
    customerName: 'Alice',
    deliveryAddress: 'Addr1',
  },
  {
    orderId: 'o2',
    createdAt: isoNow,
    total: '150.5',
    status: 'pending',
    customerName: 'Bob',
    deliveryAddress: 'Addr2',
  },
  {
    orderId: 'o3',
    createdAt: isoYesterday,
    total: 100,
    status: 'delivered',
    customerName: 'Charlie',
    deliveryAddress: 'Addr3',
  },
  {
    orderId: 'o4',
    createdAt: isoLastWeek,
    total: 500,
    status: 'delivered',
    customerName: 'Alice',
    deliveryAddress: 'Addr1',
  },
  {
    orderId: 'o5',
    createdAt: isoLastMonth,
    total: 75,
    status: 'delivered',
    customerName: 'Eve',
    deliveryAddress: 'Addr4',
  },
  {
    orderId: 'o6',
    createdAt: isoNow,
    total: 0,
    status: 'preparing',
    customerName: 'Fred',
    deliveryAddress: 'Addr5',
  },
];

// getTodayStats
const todayStats = getTodayStats(sampleOrders);
assert.strictEqual(typeof todayStats.orders, 'number');
assert(todayStats.orders >= 0);
assert.strictEqual(todayStats.orders, 3);
assert.strictEqual(todayStats.pending, 2);
assert.strictEqual(todayStats.revenue, 250);

// getWeeklyStats
const weeklyStats = getWeeklyStats(sampleOrders);
assert.strictEqual(typeof weeklyStats.orders, 'number');
assert(weeklyStats.orders >= 0);
assert.strictEqual(weeklyStats.revenue, 250);

// getPendingOrders
assert.strictEqual(getPendingOrders(sampleOrders), 2);

// getSummaryReport
const summary = getSummaryReport(sampleOrders);
assert(Array.isArray(summary));
assert(summary.length > 0);

// getAllCustomers
const customers = getAllCustomers(sampleOrders);
assert(Array.isArray(customers));
assert(customers.length > 0);

// getTotalRevenue
assert.strictEqual(getTotalRevenue(sampleOrders), 1075.5);

// getDeliveredRevenue
assert.strictEqual(getDeliveredRevenue(sampleOrders), 925);

// calculateTotalAmount
assert.strictEqual(calculateTotalAmount(3, 99.5), 298.5);

// formatCurrency
assert.strictEqual(formatCurrency(1234.5), '1,234.50');

// getFilteredOrdersByDate
const filteredToday = getFilteredOrdersByDate(sampleOrders, 'today');
assert(Array.isArray(filteredToday));

console.log('All admin calculation utility tests passed!');

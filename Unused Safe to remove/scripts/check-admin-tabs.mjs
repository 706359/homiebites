import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const calcPath = path.join(__dirname, '..', 'admin', 'utils', 'calculations.js');
const orderUtilsPath = path.join(__dirname, '..', 'admin', 'utils', 'orderUtils.js');

(async () => {
  try {
    const {
      getTodayStats,
      getWeeklyStats,
      getSummaryReport,
      getAllCustomers,
      getFilteredOrdersByDate,
    } = await import('file://' + calcPath);
    const { getTotalRevenue, getDeliveredRevenue, calculateTotalAmount, formatCurrency } =
      await import('file://' + orderUtilsPath);

    const now = new Date();
    const isoNow = now.toISOString();
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const isoYesterday = yesterday.toISOString();
    const lastWeek = new Date(now);
    lastWeek.setDate(now.getDate() - 5); // within same week
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

    console.log('--- SAMPLE ORDERS ---');
    sampleOrders.forEach((o) => console.log(o.orderId, o.createdAt, o.total, o.status));

    console.log('\n--- getTodayStats ---');
    console.log(getTodayStats(sampleOrders));

    console.log('\n--- getWeeklyStats ---');
    console.log(getWeeklyStats(sampleOrders));

    console.log('\n--- getSummaryReport ---');
    console.log(getSummaryReport(sampleOrders));

    console.log('\n--- getAllCustomers ---');
    console.log(getAllCustomers(sampleOrders));

    console.log('\n--- Revenue utils ---');
    console.log('TotalRevenue:', getTotalRevenue(sampleOrders));
    console.log('DeliveredRevenue:', getDeliveredRevenue(sampleOrders));
    console.log('calculateTotalAmount(3, 99.5):', calculateTotalAmount(3, 99.5));
    console.log('formatCurrency(1234.5):', formatCurrency(1234.5));

    console.log('\n--- Filtered orders by date (today) ---');
    console.log(getFilteredOrdersByDate(sampleOrders, 'today').map((o) => o.orderId));

    process.exit(0);
  } catch (e) {
    console.error('Error running checks:', e);
    process.exit(2);
  }
})();

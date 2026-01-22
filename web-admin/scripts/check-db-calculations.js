import connectDB from '../lib/db.js';
import Order from '../lib/models/Order.js';

// Replicate getTotalRevenue logic
function getTotalRevenue(ordersList) {
  return ordersList.reduce((sum, order) => {
    if (!order) return sum;

    let amount = null;

    if (
      order.totalAmount !== undefined &&
      order.totalAmount !== null &&
      order.totalAmount !== 0
    ) {
      amount = parseFloat(order.totalAmount);
    } else if (
      order.total !== undefined &&
      order.total !== null &&
      order.total !== 0
    ) {
      amount = parseFloat(order.total);
    }

    if (amount === null || isNaN(amount) || amount === 0) {
      const qty = parseFloat(order.quantity || 1);
      const price = parseFloat(order.unitPrice || 0);
      amount = Math.round(qty * price);
    }

    return sum + (isNaN(amount) ? 0 : amount);
  }, 0);
}

// Replicate isPendingStatus logic
function isPendingStatus(status, paymentStatus = null) {
  if (paymentStatus) {
    const ps = String(paymentStatus).toLowerCase().trim();
    if (ps === 'pending' || ps === 'unpaid') return true;
    if (ps === 'paid') return false;
  }

  if (!status) return true;
  const s = String(status).toLowerCase().trim();
  return s === 'pending' || s === 'unpaid';
}

async function checkCalculations() {
  try {
    await connectDB();
    console.log('Connected to database\n');

    const orders = await Order.find({}).lean();
    console.log(`Total orders in database: ${orders.length}\n`);

    // Calculate total revenue
    const totalRevenue = getTotalRevenue(orders);
    console.log(`Total Revenue (from DB): ${totalRevenue}`);
    console.log(`Expected Total Revenue: 374345`);
    console.log(`Difference: ${374345 - totalRevenue}\n`);

    // Calculate pending amount
    const pendingOrders = orders.filter((o) =>
      isPendingStatus(o.status, o.paymentStatus)
    );
    const pendingAmount = pendingOrders.reduce((sum, o) => {
      if (!o) return sum;

      let amount = null;

      if (
        o.totalAmount !== undefined &&
        o.totalAmount !== null &&
        o.totalAmount !== 0
      ) {
        amount = parseFloat(o.totalAmount);
      } else if (o.total !== undefined && o.total !== null && o.total !== 0) {
        amount = parseFloat(o.total);
      }

      if (amount === null || isNaN(amount) || amount === 0) {
        const qty = parseFloat(o.quantity || 1);
        const price = parseFloat(o.unitPrice || 0);
        amount = Math.round(qty * price);
      }

      return sum + (isNaN(amount) ? 0 : amount);
    }, 0);

    console.log(`Pending Orders Count: ${pendingOrders.length}`);
    console.log(`Pending Amount (from DB): ${pendingAmount}`);
    console.log(`Expected Pending Amount: 7858`);
    console.log(`Difference: ${7858 - pendingAmount}\n`);

    // Debug: Show orders with issues
    const zeroAmountOrders = orders.filter((o) => o.totalAmount === 0);
    console.log(`Orders with totalAmount = 0: ${zeroAmountOrders.length}`);

    const missingTotalOrders = orders.filter(
      (o) =>
        (!o.totalAmount || o.totalAmount === 0) && (!o.quantity || !o.unitPrice)
    );
    console.log(
      `Orders missing both totalAmount and qty/price: ${missingTotalOrders.length}\n`
    );

    // Status distribution
    const statusCounts = {};
    orders.forEach((o) => {
      const s = (o.status || '').toLowerCase().trim();
      const ps = (o.paymentStatus || '').toLowerCase().trim();
      const key = `${s}|${ps}`;
      statusCounts[key] = (statusCounts[key] || 0) + 1;
    });
    console.log('Status distribution (status|paymentStatus):');
    Object.entries(statusCounts)
      .slice(0, 10)
      .forEach(([status, count]) => {
        console.log(`  ${status}: ${count}`);
      });

    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

checkCalculations();

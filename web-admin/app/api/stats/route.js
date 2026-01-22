import connectDB from '../../../lib/db.js';
import Order from '../../../lib/models/Order.js';

export async function GET() {
  try {
    await connectDB();

    // Get all orders
    const orders = await Order.find({}).lean();

    // Calculate unique customers (by delivery address)
    const uniqueAddresses = new Set();
    orders.forEach((order) => {
      const address =
        order.deliveryAddress ||
        order.customerAddress ||
        order.address ||
        order['Delivery Address'] ||
        order.delivery_address;
      if (address && address.trim()) {
        uniqueAddresses.add(address.trim());
      }
    });

    const totalCustomers = uniqueAddresses.size;

    // Calculate total orders
    const totalOrders = orders.length;

    // Calculate orders delivered today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayOrders = orders.filter((order) => {
      try {
        if (!order.date) return false;
        const orderDate = new Date(order.date);
        return orderDate >= today && orderDate < tomorrow;
      } catch (e) {
        return false;
      }
    });

    const dailyMeals = todayOrders.length;

    // Calculate total orders in last 30 days (for "active" metric)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentOrders = orders.filter((order) => {
      try {
        if (!order.date) return false;
        const orderDate = new Date(order.date);
        return orderDate >= thirtyDaysAgo;
      } catch (e) {
        return false;
      }
    });

    return Response.json({
      success: true,
      data: {
        totalCustomers,
        totalOrders,
        dailyMeals,
        recentOrders: recentOrders.length,
      },
    });
  } catch (error) {
    console.error('[Stats API] Error:', error);
    return Response.json(
      {
        success: false,
        error: 'Failed to fetch statistics',
        data: {
          totalCustomers: 0,
          totalOrders: 0,
          dailyMeals: 0,
          recentOrders: 0,
        },
      },
      { status: 500 }
    );
  }
}

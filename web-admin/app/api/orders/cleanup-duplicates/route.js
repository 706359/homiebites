/**
 * Next.js API Route: Cleanup Duplicate Orders
 * Migrated from Express backend
 */
import connectDB from '../../../../lib/db.js';
import Order from '../../../../lib/models/Order.js';
import { isAdmin, createErrorResponse } from '../../../../lib/middleware/auth.js';

export async function POST(request) {
  try {
    await connectDB();
    await isAdmin(request);

    const allOrders = await Order.find({});
    const seenIds = new Map();
    const uniqueOrders = [];
    const duplicates = [];
    const duplicateIds = [];

    allOrders.forEach((order, index) => {
      const orderId = order.orderId;

      if (!orderId) {
        duplicates.push({
          orderId: null,
          reason: 'Missing Order ID',
          index,
          _id: order._id,
        });
        duplicateIds.push(order._id);
      } else if (seenIds.has(orderId)) {
        duplicates.push({
          orderId,
          reason: 'Duplicate of existing order',
          index,
          _id: order._id,
        });
        duplicateIds.push(order._id);
      } else {
        seenIds.set(orderId, index + 1);
        uniqueOrders.push(order);
      }
    });

    if (duplicates.length > 0) {
      await Order.deleteMany({ _id: { $in: duplicateIds } });
    }

    return Response.json({
      success: true,
      removed: duplicates.length,
      remaining: uniqueOrders.length,
      duplicates: duplicates.slice(0, 10).map((d) => ({
        orderId: d.orderId,
        reason: d.reason,
      })),
    });
  } catch (error) {
    if (error.status) {
      return createErrorResponse(error.status, error.message);
    }
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}


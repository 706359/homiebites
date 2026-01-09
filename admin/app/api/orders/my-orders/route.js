/**
 * Next.js API Route: Get User's Orders
 * Migrated from Express backend
 */
import connectDB from '../../../../lib/db.js';
import Order from '../../../../lib/models/Order.js';
import { authenticate, createErrorResponse } from '../../../../lib/middleware/auth.js';

// GET /api/orders/my-orders - Get orders for authenticated user
export async function GET(request) {
  try {
    await connectDB();
    const user = await authenticate(request);
    
    if (!user || !user.id) {
      return Response.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = user.id === 'admin' ? null : user.id; // Admin doesn't have user orders
    const orders = await Order.find(userId ? { user: userId } : {});

    return Response.json({ success: true, data: orders });
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


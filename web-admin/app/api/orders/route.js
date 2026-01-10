/**
 * Next.js API Route: Orders (Admin)
 * Migrated from Express backend - Full implementation
 */
import connectDB from '../../../lib/db.js';
import { createErrorResponse, isAdmin } from '../../../lib/middleware/auth.js';
import Order from '../../../lib/models/Order.js';

// Utility: Normalize payment mode
const normalizePaymentMode = (pm) => {
  if (!pm) return 'Online';
  const s = String(pm).toLowerCase();
  if (s.includes('cash')) return 'Cash';
  if (s.includes('upi')) return 'UPI';
  if (s.includes('card')) return 'Card';
  return 'Online';
};

// GET /api/orders - Get all orders (admin only)
export async function GET(request) {
  try {
    await connectDB();
    await isAdmin(request);

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');
    const search = searchParams.get('search');

    // Build query
    const query = {};
    if (status) query.paymentStatus = status;
    if (dateFrom || dateTo) {
      query.date = {};
      if (dateFrom) query.date.$gte = new Date(dateFrom);
      if (dateTo) query.date.$lte = new Date(dateTo);
    }
    if (search) {
      query.$or = [
        { orderId: { $regex: search, $options: 'i' } },
        { deliveryAddress: { $regex: search, $options: 'i' } },
      ];
    }

    // CRITICAL FOR PRODUCTION: Sort by orderId descending (newest first)
    // Order IDs have sequence numbers: HB-Jan'25-15-000079 (higher number = newer)
    // We'll sort on the client side using extractOrderIdSequence since MongoDB
    // can't directly parse the sequence from the orderId string format
    // For now, sort by createdAt descending as fallback, client will re-sort by orderId
    let orders = await Order.find(query).sort({ createdAt: -1 });

    // Normalize orders
    const normalizedOrders = orders
      .filter((order) => order != null)
      .map((order) => {
        try {
          const normalized = order.toObject ? order.toObject() : { ...order };

          // Normalize date
          if (!normalized.date) {
            normalized.date =
              normalized.Date || normalized.order_date || normalized.orderDate || null;
          }
          if (normalized.Date) delete normalized.Date;

          // Normalize other fields
          if (!normalized.deliveryAddress) {
            normalized.deliveryAddress =
              normalized['Delivery Address'] ||
              normalized.delivery_address ||
              normalized.address ||
              '';
          }
          if (normalized['Delivery Address']) delete normalized['Delivery Address'];

          if (!normalized.quantity && normalized.Quantity !== undefined) {
            normalized.quantity = parseInt(normalized.Quantity) || 1;
          }
          if (normalized.Quantity !== undefined) delete normalized.Quantity;

          if (
            !normalized.unitPrice &&
            (normalized['Unit Price'] !== undefined || normalized.unit_price !== undefined)
          ) {
            normalized.unitPrice =
              parseFloat(normalized['Unit Price'] || normalized.unit_price) || 0;
          }
          if (normalized['Unit Price'] !== undefined) delete normalized['Unit Price'];
          if (normalized.unit_price !== undefined) delete normalized.unit_price;

          if (
            !normalized.totalAmount &&
            (normalized['Total Amount'] !== undefined || normalized.total_amount !== undefined)
          ) {
            normalized.totalAmount =
              parseFloat(normalized['Total Amount'] || normalized.total_amount) || 0;
          }
          if (normalized['Total Amount'] !== undefined) delete normalized['Total Amount'];
          if (normalized.total_amount !== undefined) delete normalized.total_amount;

          if (!normalized.status && normalized.Status) {
            normalized.status = normalized.Status;
          }
          if (normalized.Status) delete normalized.Status;

          if (normalized.status && !normalized.paymentStatus) {
            const statusLower = String(normalized.status).toLowerCase();
            if (statusLower === 'paid' || statusLower === 'delivered') {
              normalized.paymentStatus = 'Paid';
            } else if (statusLower === 'unpaid') {
              normalized.paymentStatus = 'Unpaid';
            } else {
              normalized.paymentStatus = 'Pending';
            }
          }

          if (!normalized.paymentMode && (normalized['Payment Mode'] || normalized.payment_mode)) {
            normalized.paymentMode = normalized['Payment Mode'] || normalized.payment_mode;
          }
          if (normalized['Payment Mode']) delete normalized['Payment Mode'];
          if (normalized.payment_mode) delete normalized.payment_mode;

          if (!normalized.mode && normalized['Mode']) {
            normalized.mode = normalized['Mode'];
          }
          if (normalized['Mode']) delete normalized['Mode'];

          if (!normalized.orderId) {
            normalized.orderId =
              normalized.order_id ||
              normalized['Order ID'] ||
              normalized['OrderID'] ||
              normalized.id ||
              normalized._id;
          }

          // Convert date to YYYY-MM-DD string if it's a Date object
          if (normalized.date instanceof Date) {
            if (!isNaN(normalized.date.getTime())) {
              const year = normalized.date.getFullYear();
              const month = String(normalized.date.getMonth() + 1).padStart(2, '0');
              const day = String(normalized.date.getDate()).padStart(2, '0');
              normalized.date = `${year}-${month}-${day}`;
            }
          } else if (typeof normalized.date === 'string' && normalized.date.includes('T')) {
            // ISO string - convert to YYYY-MM-DD
            const d = new Date(normalized.date);
            if (!isNaN(d.getTime())) {
              const year = d.getFullYear();
              const month = String(d.getMonth() + 1).padStart(2, '0');
              const day = String(d.getDate()).padStart(2, '0');
              normalized.date = `${year}-${month}-${day}`;
            }
          }

          // Skip orders without orderId
          if (!normalized.orderId || normalized.orderId === 'N/A' || normalized.orderId === '') {
            return null;
          }

          return normalized;
        } catch (error) {
          return null;
        }
      })
      .filter((order) => order != null);

    // Deduplicate by orderId
    const seenIds = new Set();
    const deduplicatedOrders = normalizedOrders.filter((order) => {
      if (!order.orderId || seenIds.has(order.orderId)) {
        return false;
      }
      seenIds.add(order.orderId);
      return true;
    });

    return Response.json({ success: true, data: deduplicatedOrders });
  } catch (error) {
    // Handle authentication/authorization errors
    if (error.status === 401 || error.status === 403) {
      return createErrorResponse(error.status, error.message || 'Authentication failed');
    }
    return Response.json(
      { 
        success: false, 
        error: error.message || 'Failed to fetch orders',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: error.status || 500 }
    );
  }
}

// POST /api/orders - Create new order (admin only)
export async function POST(request) {
  try {
    await connectDB();
    await isAdmin(request);
    const orderData = await request.json();

    if (!orderData.date || !orderData.deliveryAddress) {
      return Response.json(
        { success: false, error: 'Missing required fields: date or deliveryAddress' },
        { status: 400 }
      );
    }

    if (!orderData.orderId || !orderData.orderId.trim()) {
      return Response.json(
        { success: false, error: 'Order ID is required. Please provide Order ID.' },
        { status: 400 }
      );
    }

    const quantity = Number(orderData.quantity) || 1;
    const unitPrice = Number(orderData.unitPrice) || 0;
    const totalAmount = unitPrice * quantity;

    const order = await Order.create({
      ...orderData,
      quantity,
      unitPrice,
      totalAmount,
      paymentMode: normalizePaymentMode(orderData.paymentMode || orderData.payment_mode),
      paymentStatus: orderData.paymentStatus || orderData.status || 'Pending',
      status: orderData.status || 'PENDING',
      source: 'manual',
    });

    return Response.json({ success: true, data: order }, { status: 201 });
  } catch (error) {
    // Handle validation errors
    if (error.name === 'ValidationError') {
      return Response.json(
        { 
          success: false, 
          error: 'Validation failed',
          details: Object.values(error.errors || {}).map(e => e.message).join(', ')
        },
        { status: 400 }
      );
    }
    // Handle duplicate key errors
    if (error.code === 11000 || error.message?.includes('duplicate')) {
      return Response.json(
        { 
          success: false, 
          error: `Order with ID "${orderData.orderId || 'unknown'}" already exists`
        },
        { status: 409 }
      );
    }
    // Handle authentication/authorization errors
    if (error.status === 401 || error.status === 403) {
      return createErrorResponse(error.status, error.message || 'Authentication failed');
    }
    return Response.json(
      { 
        success: false, 
        error: error.message || 'Failed to create order',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: error.status || 500 }
    );
  }
}

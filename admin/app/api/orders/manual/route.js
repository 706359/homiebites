/**
 * Next.js API Route: Create Manual Order
 * Migrated from Express backend
 */
import connectDB from '../../../../lib/db.js';
import Order from '../../../../lib/models/Order.js';
import { isAdmin, createErrorResponse } from '../../../../lib/middleware/auth.js';

const normalizePaymentMode = (pm) => {
  if (!pm) return 'Online';
  const s = String(pm).toLowerCase();
  if (s.includes('cash')) return 'Cash';
  if (s.includes('upi')) return 'UPI';
  if (s.includes('card')) return 'Card';
  return 'Online';
};

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

    let parsedDate = orderData.date;
    if (typeof orderData.date === 'string') {
      parsedDate = new Date(orderData.date);
      if (isNaN(parsedDate.getTime())) {
        return Response.json(
          { success: false, error: 'Invalid date format' },
          { status: 400 }
        );
      }
    }

    const quantity = Number(orderData.quantity) || 1;
    const unitPrice = Number(orderData.unitPrice) || 0;

    if (quantity <= 0) {
      return Response.json(
        { success: false, error: 'Quantity must be greater than 0' },
        { status: 400 }
      );
    }

    if (unitPrice < 0) {
      return Response.json(
        { success: false, error: 'Unit price cannot be negative' },
        { status: 400 }
      );
    }

    const totalAmount = unitPrice * quantity;

    if (!orderData.orderId || !orderData.orderId.trim()) {
      return Response.json(
        { success: false, error: 'Order ID is required. Please provide Order ID.' },
        { status: 400 }
      );
    }

    let paymentStatus = 'Pending';
    if (orderData.paymentStatus) {
      const statusLower = String(orderData.paymentStatus).toLowerCase();
      if (statusLower === 'paid') {
        paymentStatus = 'Paid';
      } else if (statusLower === 'unpaid') {
        paymentStatus = 'Unpaid';
      }
    } else if (orderData.status) {
      const statusLower = String(orderData.status).toLowerCase();
      if (statusLower === 'paid' || statusLower === 'delivered') {
        paymentStatus = 'Paid';
      } else if (statusLower === 'unpaid') {
        paymentStatus = 'Unpaid';
      }
    }

    const order = await Order.create({
      orderId: orderData.orderId.trim(),
      date: parsedDate,
      deliveryAddress: orderData.deliveryAddress,
      quantity,
      unitPrice,
      totalAmount,
      mode: orderData.mode || 'Lunch',
      status: orderData.status || 'PENDING',
      paymentMode: normalizePaymentMode(orderData.paymentMode || 'Online'),
      paymentStatus,
      source: 'manual',
      notes: orderData.notes || '',
    });

    return Response.json({
      success: true,
      data: order,
      message: `Order created successfully with ID: ${order.orderId}`,
    }, { status: 201 });
  } catch (error) {
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}


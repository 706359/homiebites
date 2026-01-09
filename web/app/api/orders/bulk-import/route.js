/**
 * Next.js API Route: Bulk Import Orders
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
    const ordersData = await request.json();

    if (!Array.isArray(ordersData) || ordersData.length === 0) {
      return Response.json(
        { success: false, error: 'No orders provided' },
        { status: 400 }
      );
    }

    const imported = [];
    const errors = [];
    const allOrderIds = new Set();

    const existingOrders = await Order.find({}, { orderId: 1 });
    existingOrders.forEach((order) => {
      if (order.orderId) allOrderIds.add(order.orderId);
    });

    for (let i = 0; i < ordersData.length; i++) {
      const orderData = ordersData[i];
      try {
        const normalized = {
          sNo: orderData['S No.'] || orderData.sNo || orderData.s_no,
          date: orderData.Date || orderData.date,
          deliveryAddress: orderData['Delivery Address'] || orderData.deliveryAddress,
          quantity: Number(orderData.Quantity || orderData.quantity) || 1,
          unitPrice: Number(orderData['Unit Price'] || orderData.unitPrice) || 0,
          totalAmount: Number(orderData['Total Amount'] || orderData.totalAmount) || 0,
          mode: orderData.Mode || orderData.mode || 'Lunch',
          status: orderData.Status || orderData.status || 'Pending',
          paymentMode: orderData['Payment Mode'] || orderData.paymentMode || 'Online',
          billingMonth: orderData['Billing Month'] || orderData.billingMonth,
          year: orderData.Year || orderData.year,
          orderId: orderData['Order ID'] || orderData.orderId || orderData.order_id,
        };

        if (!normalized.date || !normalized.deliveryAddress) {
          errors.push({
            index: i + 2,
            error: 'Missing required: Date or Delivery Address',
            data: orderData,
          });
          continue;
        }

        const orderId = normalized.orderId ? String(normalized.orderId).trim() : '';
        if (!orderId) {
          errors.push({
            index: i + 2,
            error: 'Missing Order ID',
            data: orderData,
          });
          continue;
        }

        if (allOrderIds.has(orderId)) {
          errors.push({
            index: i + 2,
            error: `Duplicate Order ID: ${orderId}`,
            data: orderData,
          });
          continue;
        }

        allOrderIds.add(orderId);

        let parsedDate = normalized.date;
        if (typeof normalized.date === 'string') {
          const dateStr = normalized.date.trim();
          if (dateStr.match(/^\d{1,2}-[A-Za-z]{3}-\d{2,4}$/)) {
            const [day, monthStr, yearStr] = dateStr.split('-');
            const monthNames = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
            const monthIndex = monthNames.findIndex((m) => monthStr.toLowerCase().startsWith(m));
            let year = parseInt(yearStr);
            if (year < 100) year = year < 50 ? 2000 + year : 1900 + year;
            if (monthIndex !== -1) {
              parsedDate = new Date(year, monthIndex, parseInt(day));
            }
          } else {
            parsedDate = new Date(dateStr);
          }
        }

        if (isNaN(parsedDate.getTime())) {
          normalized.dateNeedsReview = true;
          normalized.originalDateString = String(normalized.date);
          normalized.date = String(normalized.date);
        } else {
          const year = parsedDate.getFullYear();
          const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
          const day = String(parsedDate.getDate()).padStart(2, '0');
          normalized.date = `${year}-${month}-${day}`;
        }

        normalized.totalAmount = normalized.unitPrice * normalized.quantity;
        normalized.paymentMode = normalizePaymentMode(normalized.paymentMode);

        if (normalized.status) {
          const statusLower = String(normalized.status).toLowerCase();
          normalized.paymentStatus =
            statusLower === 'paid' ? 'Paid' : statusLower === 'unpaid' ? 'Unpaid' : 'Pending';
        }

        normalized.source = 'excel';
        imported.push(normalized);
      } catch (error) {
        errors.push({
          index: i + 2,
          error: error.message,
          data: orderData,
        });
      }
    }

    if (imported.length > 0) {
      const bulkOps = imported.map((order) => {
        const { _id, ...orderData } = order;
        if (orderData.date && typeof orderData.date === 'string' && orderData.date.match(/^\d{4}-\d{2}-\d{2}$/)) {
          const [year, month, day] = orderData.date.split('-').map(Number);
          orderData.date = new Date(year, month - 1, day);
        }
        return {
          updateOne: {
            filter: { orderId: orderData.orderId },
            update: { $set: orderData },
            upsert: true,
          },
        };
      });

      if (bulkOps.length > 0) {
        await Order.bulkWrite(bulkOps, { ordered: false });
      }
    }

    return Response.json({
      success: true,
      data: {
        imported: imported.length,
        errors: errors.length,
        total: ordersData.length,
        errorDetails: errors,
      },
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


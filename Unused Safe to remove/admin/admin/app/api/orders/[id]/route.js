/**
 * Next.js API Route: Order by ID (Update/Delete)
 * Migrated from Express backend
 */
import connectDB from '../../../../lib/db.js';
import Order from '../../../../lib/models/Order.js';
import Settings from '../../../../lib/models/Settings.js';
import mongoose from 'mongoose';
import { isAdmin, createErrorResponse } from '../../../../lib/middleware/auth.js';

async function findOrderById(id) {
  if (mongoose.Types.ObjectId.isValid(id)) {
    const order = await Order.findById(id);
    if (order) return order;
  }
  return await Order.findOne({ orderId: id });
}

// PUT /api/orders/:id - admin only
export async function PUT(request, { params }) {
  try {
    await connectDB();
    await isAdmin(request);
    const orderId = params.id;
    const existingOrder = await findOrderById(orderId);

    if (!existingOrder) {
      return Response.json(
        { success: false, message: 'Order not found' },
        { status: 404 }
      );
    }

    // Month lock check
    try {
      const settings = await Settings.getSettings();
      if (settings.monthLockedTill) {
        const [lockedYear, lockedMonth] = settings.monthLockedTill.split('-').map(Number);
        const orderDate = new Date(existingOrder.date);
        const orderYear = orderDate.getFullYear();
        const orderMonth = orderDate.getMonth() + 1;

        if (orderYear < lockedYear || (orderYear === lockedYear && orderMonth < lockedMonth)) {
          return Response.json(
            {
              success: false,
              error: `Cannot edit orders from ${orderMonth}/${orderYear}. Month is locked until ${settings.monthLockedTill}`,
            },
            { status: 403 }
          );
        }
      }
    } catch (settingsError) {
      // Continue without month lock check
    }

    const update = await request.json();
    delete update.orderId; // Immutable

    if (update.date) {
      const newDate = new Date(update.date);
      if (!isNaN(newDate.getTime())) {
        update.dateNeedsReview = false;
        update.originalDateString = undefined;
      }
    }

    if (update.quantity !== undefined || update.unitPrice !== undefined) {
      const quantity = Number(update.quantity !== undefined ? update.quantity : existingOrder.quantity) || 1;
      const unitPrice = Number(update.unitPrice !== undefined ? update.unitPrice : existingOrder.unitPrice) || 0;
      update.totalAmount = quantity * unitPrice;

      try {
        const settings = await Settings.getSettings();
        const defaultUnitPrice = settings.defaultUnitPrice || 0;
        update.priceOverride = unitPrice !== defaultUnitPrice;
      } catch (e) {
        update.priceOverride = false;
      }
    }

    delete update.totalAmount;

    let updatedOrder;
    if (mongoose.Types.ObjectId.isValid(orderId)) {
      updatedOrder = await Order.findByIdAndUpdate(orderId, update, {
        new: true,
        runValidators: true,
      });
    } else {
      updatedOrder = await Order.findOneAndUpdate(
        { orderId: orderId },
        update,
        { new: true, runValidators: true }
      );
    }

    if (!updatedOrder) {
      return Response.json(
        { success: false, message: 'Order not found' },
        { status: 404 }
      );
    }

    return Response.json({ success: true, data: updatedOrder });
  } catch (error) {
    if (error.status) {
      return createErrorResponse(error.status, error.message);
    }
    return Response.json(
      { success: false, message: 'Failed to update order', error: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/orders/:id - admin only
export async function DELETE(request, { params }) {
  try {
    await connectDB();
    await isAdmin(request);
    const orderId = params.id;
    let deletedOrder;

    if (mongoose.Types.ObjectId.isValid(orderId)) {
      deletedOrder = await Order.findByIdAndDelete(orderId);
    } else {
      deletedOrder = await Order.findOneAndDelete({ orderId: orderId });
    }

    if (!deletedOrder) {
      return Response.json(
        { message: 'Order not found' },
        { status: 404 }
      );
    }

    return Response.json({ message: 'Order deleted', order: deletedOrder });
  } catch (error) {
    if (error.status) {
      return createErrorResponse(error.status, error.message);
    }
    return Response.json(
      { message: 'Failed to delete order', error: error.message },
      { status: 500 }
    );
  }
}


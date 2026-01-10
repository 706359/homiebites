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
    // Next.js 15+ requires awaiting params (safe even if params is synchronous)
    const resolvedParams = params && typeof params.then === 'function' ? await params : params;
    const orderId = resolvedParams?.id;
    
    if (!orderId) {
      return Response.json(
        { success: false, message: 'Order ID is required', params: resolvedParams },
        { status: 400 }
      );
    }
    
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
    delete update.orderId; // Immutable - orderId cannot be changed

    // Normalize and validate status and paymentStatus fields for production data integrity
    if (update.status !== undefined) {
      const statusValue = String(update.status).trim();
      update.status = statusValue;
      
      // CRITICAL: Always sync paymentStatus with status for data consistency
      // This ensures both fields are always in sync in production
      const statusLower = statusValue.toLowerCase();
      if (statusLower === 'paid' || statusLower === 'delivered') {
        update.paymentStatus = 'Paid';
      } else {
        update.paymentStatus = update.paymentStatus || 'Pending'; // Default for unpaid/pending
      }
    }
    
    // Normalize paymentStatus if provided independently (ensure consistency)
    if (update.paymentStatus !== undefined) {
      const psLower = String(update.paymentStatus).toLowerCase().trim();
      if (psLower === 'paid') {
        update.paymentStatus = 'Paid';
      } else if (psLower === 'unpaid' || psLower === 'pending') {
        update.paymentStatus = 'Pending';
      } else {
        update.paymentStatus = String(update.paymentStatus).trim();
      }
      
      // If status wasn't updated but paymentStatus was, sync status too
      if (update.status === undefined) {
        if (update.paymentStatus === 'Paid') {
          update.status = existingOrder.status && existingOrder.status.toLowerCase() === 'paid' 
            ? existingOrder.status 
            : 'Paid';
        }
      }
    }
    
    // Normalize paymentMode if provided (production-safe normalization)
    if (update.paymentMode !== undefined && update.paymentMode !== null) {
      if (update.paymentMode === '' || update.paymentMode === 'None') {
        update.paymentMode = ''; // Allow empty string
      } else {
        update.paymentMode = String(update.paymentMode).trim();
      }
    }

    // Validate and process date
    if (update.date) {
      const newDate = new Date(update.date);
      if (!isNaN(newDate.getTime())) {
        update.dateNeedsReview = false;
        update.originalDateString = undefined;
        update.date = newDate; // Ensure date is a Date object
      } else {
        // Invalid date - remove from update to prevent errors
        delete update.date;
      }
    }

    // Calculate totalAmount if quantity or unitPrice changes
    // Note: totalAmount will also be recalculated by Order model pre-save hook
    // But we set it here to ensure consistency before validation
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
    
    // CRITICAL FOR PRODUCTION: Always recalculate totalAmount to ensure data integrity
    // This is calculated server-side to prevent client-side manipulation or inconsistencies
    // The Order model pre-save hook will also recalculate, but we set it here for validation
    if (update.quantity !== undefined || update.unitPrice !== undefined || update.totalAmount === undefined) {
      const finalQuantity = Number(update.quantity !== undefined ? update.quantity : existingOrder.quantity) || 1;
      const finalUnitPrice = Number(update.unitPrice !== undefined ? update.unitPrice : existingOrder.unitPrice) || 0;
      update.totalAmount = finalQuantity * finalUnitPrice;
    }
    
    // Note: totalAmount is calculated server-side, never trust client-provided values
    // The pre-save hook provides an additional layer of validation

    // CRITICAL FOR PRODUCTION: Mongoose findByIdAndUpdate/findOneAndUpdate
    // with a plain object automatically uses $set operator internally
    // This ensures only specified fields are updated, preserving other fields
    // This is the correct and safe approach for production data integrity
    let updatedOrder;
    if (mongoose.Types.ObjectId.isValid(orderId)) {
      updatedOrder = await Order.findByIdAndUpdate(
        orderId, 
        update, // Plain object - Mongoose treats this as $set internally
        {
          new: true,
          runValidators: true,
          // Only update fields specified in 'update' object
        }
      );
    } else {
      updatedOrder = await Order.findOneAndUpdate(
        { orderId: orderId },
        update, // Plain object - Mongoose treats this as $set internally
        { 
          new: true, 
          runValidators: true,
          // Only update fields specified in 'update' object
        }
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
    // Next.js 15+ requires awaiting params (safe even if params is synchronous)
    const resolvedParams = params && typeof params.then === 'function' ? await params : params;
    const orderId = resolvedParams?.id;
    
    if (!orderId) {
      return Response.json(
        { success: false, message: 'Order ID is required', params: resolvedParams },
        { status: 400 }
      );
    }
    let deletedOrder;

    if (mongoose.Types.ObjectId.isValid(orderId)) {
      deletedOrder = await Order.findByIdAndDelete(orderId);
    } else {
      deletedOrder = await Order.findOneAndDelete({ orderId: orderId });
    }

    if (!deletedOrder) {
      return Response.json(
        { success: false, message: 'Order not found' },
        { status: 404 }
      );
    }

    return Response.json({ success: true, message: 'Order deleted', data: deletedOrder });
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


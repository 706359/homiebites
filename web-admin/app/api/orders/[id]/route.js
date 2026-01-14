
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


export async function PUT(request, { params }) {
  try {
    await connectDB();
    await isAdmin(request);
    
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
      
    }

    const update = await request.json();
    delete update.orderId; 

    
    if (update.status !== undefined) {
      const statusValue = String(update.status).trim();
      update.status = statusValue;
      
      
      
      const statusLower = statusValue.toLowerCase();
      if (statusLower === 'paid' || statusLower === 'delivered') {
        update.paymentStatus = 'Paid';
      } else {
        update.paymentStatus = update.paymentStatus || 'Pending'; 
      }
    }
    
    
    if (update.paymentStatus !== undefined) {
      const psLower = String(update.paymentStatus).toLowerCase().trim();
      if (psLower === 'paid') {
        update.paymentStatus = 'Paid';
      } else if (psLower === 'unpaid' || psLower === 'pending') {
        update.paymentStatus = 'Pending';
      } else {
        update.paymentStatus = String(update.paymentStatus).trim();
      }
      
      
      if (update.status === undefined) {
        if (update.paymentStatus === 'Paid') {
          update.status = existingOrder.status && existingOrder.status.toLowerCase() === 'paid' 
            ? existingOrder.status 
            : 'Paid';
        }
      }
    }
    
    
    if (update.paymentMode !== undefined && update.paymentMode !== null) {
      if (update.paymentMode === '' || update.paymentMode === 'None') {
        update.paymentMode = ''; 
      } else {
        update.paymentMode = String(update.paymentMode).trim();
      }
    }

    
    if (update.date) {
      const newDate = new Date(update.date);
      if (!isNaN(newDate.getTime())) {
        update.dateNeedsReview = false;
        update.originalDateString = undefined;
        update.date = newDate; 
      } else {
        
        delete update.date;
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
    
    
    
    
    if (update.quantity !== undefined || update.unitPrice !== undefined || update.totalAmount === undefined) {
      const finalQuantity = Number(update.quantity !== undefined ? update.quantity : existingOrder.quantity) || 1;
      const finalUnitPrice = Number(update.unitPrice !== undefined ? update.unitPrice : existingOrder.unitPrice) || 0;
      update.totalAmount = finalQuantity * finalUnitPrice;
    }
    
    
    

    
    
    
    
    let updatedOrder;
    if (mongoose.Types.ObjectId.isValid(orderId)) {
      updatedOrder = await Order.findByIdAndUpdate(
        orderId, 
        update, 
        {
          new: true,
          runValidators: true,
          
        }
      );
    } else {
      updatedOrder = await Order.findOneAndUpdate(
        { orderId: orderId },
        update, 
        { 
          new: true, 
          runValidators: true,
          
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


export async function DELETE(request, { params }) {
  try {
    await connectDB();
    await isAdmin(request);
    
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


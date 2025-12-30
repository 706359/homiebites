import Order from '../models/Order.js';
import Settings from '../models/Settings.js';
import mongoose from 'mongoose';

// Helper function to find order by ID (handles both ObjectId and custom orderId)
async function findOrderById(id) {
  // Check if it's a valid MongoDB ObjectId
  if (mongoose.Types.ObjectId.isValid(id)) {
    const order = await Order.findById(id);
    if (order) return order;
  }
  // If not found by ObjectId, try finding by custom orderId
  return await Order.findOne({ orderId: id });
}

// Update an order by ID
export async function updateOrder(req, res) {
  try {
    const orderId = req.params.id;
    const existingOrder = await findOrderById(orderId);
    if (!existingOrder) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // MONTH LOCK: Check if order's month is locked
    try {
      const settings = await Settings.getSettings();
      if (settings.monthLockedTill) {
        const [lockedYear, lockedMonth] = settings.monthLockedTill.split('-').map(Number);
        const orderDate = new Date(existingOrder.date);
        const orderYear = orderDate.getFullYear();
        const orderMonth = orderDate.getMonth() + 1;
        
        // If order is before locked month, prevent editing
        if (orderYear < lockedYear || (orderYear === lockedYear && orderMonth < lockedMonth)) {
          return res.status(403).json({
            success: false,
            error: `Cannot edit orders from ${orderMonth}/${orderYear}. Month is locked until ${settings.monthLockedTill}`,
          });
        }
      }
    } catch (settingsError) {
      // If Settings model doesn't exist or error, continue without month lock check
      console.warn('Month lock check failed:', settingsError);
    }

    const update = { ...req.body };
    
    // CRITICAL: orderId is immutable - never allow it to be changed
    delete update.orderId;
    
    // CRITICAL: totalAmount is ALWAYS calculated on backend (quantity * unitPrice)
    // Never trust totalAmount from request body
    if (update.quantity !== undefined || update.unitPrice !== undefined) {
      const quantity = Number(update.quantity !== undefined ? update.quantity : existingOrder.quantity) || 1;
      const unitPrice = Number(update.unitPrice !== undefined ? update.unitPrice : existingOrder.unitPrice) || 0;
      update.totalAmount = quantity * unitPrice;
      
      // Set priceOverride flag if unitPrice differs from default
      try {
        const settings = await Settings.getSettings();
        const defaultUnitPrice = settings.defaultUnitPrice || 0;
        update.priceOverride = unitPrice !== defaultUnitPrice;
      } catch (e) {
        update.priceOverride = false;
      }
    }
    
    // Remove totalAmount from update if present (always calculate on backend)
    delete update.totalAmount;
    
    // Update using the correct ID field
    let updatedOrder;
    if (mongoose.Types.ObjectId.isValid(orderId)) {
      updatedOrder = await Order.findByIdAndUpdate(orderId, update, { new: true, runValidators: true });
    } else {
      updatedOrder = await Order.findOneAndUpdate({ orderId: orderId }, update, { new: true, runValidators: true });
    }
    
    if (!updatedOrder) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    
    res.json({ success: true, data: updatedOrder });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update order', error: err.message });
  }
}

// Delete an order by ID
export async function deleteOrder(req, res) {
  try {
    const orderId = req.params.id;
    let deletedOrder;
    if (mongoose.Types.ObjectId.isValid(orderId)) {
      deletedOrder = await Order.findByIdAndDelete(orderId);
    } else {
      deletedOrder = await Order.findOneAndDelete({ orderId: orderId });
    }
    if (!deletedOrder) return res.status(404).json({ message: 'Order not found' });
    res.json({ message: 'Order deleted', order: deletedOrder });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete order', error: err.message });
  }
}

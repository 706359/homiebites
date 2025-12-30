// POST /api/orders/bulk-import (admin) - Bulk import orders
// Rules:
// - If Excel row has Order ID → Backend validates & keeps it
// - If Excel row has NO Order ID → Backend auto-generates
// - Duplicate Order ID → Reject import
export async function bulkImportOrders(req, res) {
  try {
    const ordersData = req.body;

    if (!Array.isArray(ordersData)) {
      return res.status(400).json({
        success: false,
        error: 'Request body must be an array of orders',
      });
    }

    if (ordersData.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No orders provided',
      });
    }

    const imported = [];
    const errors = [];
    const seenOrderIds = new Set(); // Track IDs in this batch to detect duplicates

    for (let i = 0; i < ordersData.length; i++) {
      const orderData = ordersData[i];

      try {
        // Validate required fields
        if (!orderData.date || !orderData.deliveryAddress) {
          errors.push({
            index: i,
            error: 'Missing required fields: date or deliveryAddress',
            data: orderData,
          });
          continue;
        }

        // Check for duplicate Order ID in this batch
        if (orderData.orderId) {
          const orderId = String(orderData.orderId).trim();
          if (seenOrderIds.has(orderId)) {
            errors.push({
              index: i,
              error: `Duplicate Order ID in batch: ${orderId}`,
              data: orderData,
            });
            continue;
          }

          // Check if Order ID already exists in database
          const existing = await Order.findOne({ orderId });
          if (existing) {
            errors.push({
              index: i,
              error: `Order ID already exists: ${orderId}`,
              data: orderData,
            });
            continue;
          }

          seenOrderIds.add(orderId);
        }

        // Calculate fields
        const quantity = Number(orderData.quantity) || 1;
        const unitPrice = Number(orderData.unitPrice) || 0;
        const totalAmount = unitPrice * quantity;
        const priceOverride = false; // TODO: Compare with defaultUnitPrice from Settings

        // Prepare order data
        // If orderId is provided and valid, use it; otherwise backend will generate
        const orderDataToCreate = {
          ...orderData,
          quantity,
          unitPrice,
          // totalAmount will be calculated in pre-save hook (don't set it here)
          priceOverride,
          paymentMode: normalizePaymentMode(orderData.paymentMode || orderData.payment_mode),
          paymentStatus: orderData.paymentStatus || orderData.status || 'Pending',
          status: orderData.status || 'PENDING', // Legacy field
          source: orderData.source || 'excel',
        };

        // Remove totalAmount from body (will be recalculated in pre-save hook)
        // Keep orderId if provided (will be validated by model)
        delete orderDataToCreate.totalAmount;

        // Create order (backend will generate orderId if not provided)
        const order = await Order.create(orderDataToCreate);
        imported.push(order);
      } catch (error) {
        errors.push({
          index: i,
          error: error.message || 'Unknown error',
          data: orderData,
        });
      }
    }

    res.status(200).json({
      success: true,
      data: {
        imported: imported.length,
        errors: errors.length,
        total: ordersData.length,
        importedOrders: imported,
        errorDetails: errors,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || 'Bulk import failed',
    });
  }
}
// GET /api/orders (admin) - Get all orders
export async function getAllOrders(req, res) {
  try {
    const orders = await Order.find({});

    // Normalize orders to ensure consistent field names (handle both old Excel format and new format)
    const normalizedOrders = orders.map((order) => {
      const normalized = order.toObject();

      // Normalize date field (handle multiple formats)
      if (!normalized.date) {
        // Try different field names
        normalized.date =
          normalized.Date ||
          normalized.order_date ||
          normalized.orderDate ||
          normalized.createdAt ||
          new Date();
      }
      if (normalized.Date) delete normalized.Date; // Remove old field

      // Normalize address field
      if (!normalized.deliveryAddress) {
        normalized.deliveryAddress =
          normalized['Delivery Address'] || normalized.delivery_address || normalized.address || '';
      }
      if (normalized['Delivery Address']) delete normalized['Delivery Address'];

      // Normalize quantity
      if (!normalized.quantity && normalized.Quantity !== undefined) {
        normalized.quantity = parseInt(normalized.Quantity) || 1;
      }
      if (normalized.Quantity !== undefined) delete normalized.Quantity;

      // Normalize unit price
      if (
        !normalized.unitPrice &&
        (normalized['Unit Price'] !== undefined || normalized.unit_price !== undefined)
      ) {
        normalized.unitPrice = parseFloat(normalized['Unit Price'] || normalized.unit_price) || 0;
      }
      if (normalized['Unit Price'] !== undefined) delete normalized['Unit Price'];
      if (normalized.unit_price !== undefined) delete normalized.unit_price;

      // Normalize total amount
      if (
        !normalized.totalAmount &&
        (normalized['Total Amount'] !== undefined || normalized.total_amount !== undefined)
      ) {
        normalized.totalAmount =
          parseFloat(normalized['Total Amount'] || normalized.total_amount) || 0;
      }
      if (normalized['Total Amount'] !== undefined) delete normalized['Total Amount'];
      if (normalized.total_amount !== undefined) delete normalized.total_amount;

      // Normalize status
      if (!normalized.status && normalized.Status) {
        normalized.status = normalized.Status;
      }
      if (normalized.Status) delete normalized.Status;
      // Also check paymentStatus
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

      // Normalize payment mode
      if (!normalized.paymentMode && (normalized['Payment Mode'] || normalized.payment_mode)) {
        normalized.paymentMode = normalized['Payment Mode'] || normalized.payment_mode;
      }
      if (normalized['Payment Mode']) delete normalized['Payment Mode'];
      if (normalized.payment_mode) delete normalized.payment_mode;

      // Normalize billing month/year if missing
      if (!normalized.billingMonth || !normalized.billingYear) {
        try {
          const orderDate = normalized.date ? new Date(normalized.date) : new Date();
          if (!isNaN(orderDate.getTime())) {
            normalized.billingMonth = orderDate.getMonth() + 1;
            normalized.billingYear = orderDate.getFullYear();
          }
        } catch (e) {
          // If date parsing fails, try to extract from billing month string
          const billingMonthStr = normalized['Billing Month'] || normalized.billing_month;
          if (billingMonthStr) {
            // Try to parse "February'24" format
            const monthMatch = String(billingMonthStr).match(
              /February|March|April|May|June|July|August|September|October|November|December|January/i
            );
            if (monthMatch) {
              const months = [
                'january',
                'february',
                'march',
                'april',
                'may',
                'june',
                'july',
                'august',
                'september',
                'october',
                'november',
                'december',
              ];
              normalized.billingMonth = months.indexOf(monthMatch[0].toLowerCase()) + 1;
              const yearMatch = String(billingMonthStr).match(/'?(\d{2,4})/);
              if (yearMatch) {
                let year = parseInt(yearMatch[1]);
                if (year < 100) year = year < 50 ? 2000 + year : 1900 + year;
                normalized.billingYear = year;
              }
            }
          }
        }
      }
      if (normalized['Billing Month']) delete normalized['Billing Month'];
      if (normalized.billing_month) delete normalized.billing_month;

      // Ensure orderId exists
      if (!normalized.orderId) {
        // Generate from _id or date
        const datePart = normalized.date ? new Date(normalized.date) : new Date();
        const yy = String(datePart.getFullYear()).slice(-2);
        const mm = String(datePart.getMonth() + 1).padStart(2, '0');
        const dd = String(datePart.getDate()).padStart(2, '0');
        const random = Math.random().toString(36).substring(2, 5).toUpperCase();
        normalized.orderId = `HB${yy}${mm}${dd}${random}`;
      }

      // Convert date strings to Date objects if needed
      if (normalized.date) {
        if (typeof normalized.date === 'string') {
          // Handle MM/DD/YYYY format (e.g., "02/05/2024")
          if (normalized.date.includes('/')) {
            const parts = normalized.date.split('/');
            if (parts.length === 3) {
              // MM/DD/YYYY -> new Date(YYYY, MM-1, DD)
              const month = parseInt(parts[0]) - 1; // JS months are 0-indexed
              const day = parseInt(parts[1]);
              const year = parseInt(parts[2]);
              normalized.date = new Date(year, month, day);
            } else {
              normalized.date = new Date(normalized.date);
            }
          } else {
            normalized.date = new Date(normalized.date);
          }
        }
        // If date is already a Date object from MongoDB, ensure it's a valid date
        if (normalized.date instanceof Date) {
          if (isNaN(normalized.date.getTime())) {
            // Invalid date, set to current date as fallback
            normalized.date = new Date();
          }
        }
      } else {
        // No date at all, set to current date
        normalized.date = new Date();
      }

      return normalized;
    });

    res.json({ success: true, data: normalizedOrders });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

// GET /api/orders/my-orders - Get orders for the authenticated user
export async function getMyOrders(req, res) {
  try {
    const userId = req.user && req.user.id;
    if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });
    const orders = await Order.find({ user: userId });
    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}
import Order from '../models/Order.js';

// Utility: Normalize payment mode
const normalizePaymentMode = (pm) => {
  if (!pm) return 'Online';
  const s = String(pm).toLowerCase();
  if (s.includes('cash')) return 'Cash';
  if (s.includes('upi')) return 'UPI';
  if (s.includes('card')) return 'Card';
  return 'Online';
};

// POST /api/orders (admin) - Create new order manually
export async function createOrder(req, res) {
  try {
    const orderData = req.body;
    if (!orderData.date || !orderData.deliveryAddress) {
      return res
        .status(400)
        .json({ success: false, error: 'Missing required fields: date or deliveryAddress' });
    }

    // Get default unit price from settings (if available)
    // For now, we'll use the provided unitPrice or 0
    const quantity = Number(orderData.quantity) || 1;
    const unitPrice = Number(orderData.unitPrice) || 0;

    // CRITICAL: totalAmount is ALWAYS calculated on backend (quantity * unitPrice)
    // Never trust totalAmount from request body
    const totalAmount = unitPrice * quantity;

    // Set priceOverride flag if unitPrice differs from default (would need Settings lookup)
    const priceOverride = false; // TODO: Compare with defaultUnitPrice from Settings

    // Remove orderId and totalAmount from body to prevent manual override
    const orderDataWithoutId = { ...orderData };
    delete orderDataWithoutId.orderId;
    delete orderDataWithoutId.totalAmount; // Always calculate on backend

    const order = await Order.create({
      ...orderDataWithoutId,
      quantity,
      unitPrice,
      // totalAmount will be calculated in pre-save hook, but we set it here too
      totalAmount,
      priceOverride,
      paymentMode: normalizePaymentMode(
        orderDataWithoutId.paymentMode || orderDataWithoutId.payment_mode
      ),
      paymentStatus: orderDataWithoutId.paymentStatus || orderDataWithoutId.status || 'Pending',
      status: orderDataWithoutId.status || 'PENDING', // Legacy field
      source: 'manual',
    });
    res.status(201).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

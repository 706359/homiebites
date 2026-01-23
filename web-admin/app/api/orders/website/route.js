import connectDB from '../../../../lib/db.js';
import Order from '../../../../lib/models/Order.js';
import { createErrorResponse } from '../../../../lib/middleware/auth.js';

const normalizePaymentMode = (pm) => {
  if (!pm) return 'Online';
  const s = String(pm).toLowerCase();
  if (s.includes('cash')) return 'Cash';
  if (s.includes('upi')) return 'UPI';
  if (s.includes('card')) return 'Card';
  return 'Online';
};

// Generate order ID in format: HB-{MonthAbbr}'{YY}-{MM}-{Sequence}
const generateOrderId = async (orderDate) => {
  try {
    const date = new Date(orderDate);
    if (isNaN(date.getTime())) {
      throw new Error('Invalid date');
    }

    const monthAbbr = date.toLocaleString('en-US', { month: 'short' });
    const year = date.getFullYear().toString().slice(-2);
    const monthNum = String(date.getMonth() + 1).padStart(2, '0');

    // Find the highest sequence number for this month/year
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59);

    const existingOrders = await Order.find({
      date: {
        $gte: startOfMonth,
        $lte: endOfMonth,
      },
      orderId: { $exists: true, $ne: null },
    }).select('orderId');

    let maxSequence = 0;
    const pattern = new RegExp(`HB-${monthAbbr}'${year}-${monthNum}-(\\d+)$`);

    existingOrders.forEach((order) => {
      if (order.orderId) {
        const match = order.orderId.match(pattern);
        if (match && match[1]) {
          const seq = parseInt(match[1], 10);
          if (seq > maxSequence) {
            maxSequence = seq;
          }
        }
      }
    });

    const nextSequence = String(maxSequence + 1).padStart(6, '0');
    return `HB-${monthAbbr}'${year}-${monthNum}-${nextSequence}`;
  } catch (error) {
    // Fallback to timestamp-based ID if generation fails
    const timestamp = Date.now().toString().slice(-8);
    return `HB-WEB-${timestamp}`;
  }
};

export async function POST(request) {
  let orderData;
  try {
    await connectDB();
    orderData = await request.json();

    // Validate required fields
    if (!orderData.date || !orderData.deliveryAddress || !orderData.customerName) {
      return Response.json(
        {
          success: false,
          error: 'Missing required fields: date, deliveryAddress, or customerName',
        },
        { status: 400 }
      );
    }

    // Parse date
    let parsedDate = orderData.date;
    if (typeof orderData.date === 'string') {
      // Handle DD/MM/YYYY format
      if (/^\d{2}\/\d{2}\/\d{4}$/.test(orderData.date)) {
        const [day, month, year] = orderData.date.split('/').map(Number);
        parsedDate = new Date(year, month - 1, day);
      } else {
        parsedDate = new Date(orderData.date);
      }
      
      if (isNaN(parsedDate.getTime())) {
        return Response.json(
          { success: false, error: 'Invalid date format' },
          { status: 400 }
        );
      }
    }

    // Calculate totals
    const totalAmount = Number(orderData.totalAmount) || Number(orderData.grandTotal) || 0;
    const quantity = Number(orderData.quantity) || 1;
    const unitPrice = totalAmount / quantity;

    // Generate order ID
    const orderId = await generateOrderId(parsedDate);

    // Determine mode from deliveryTime
    let mode = 'Lunch';
    if (orderData.deliveryTime) {
      const time = String(orderData.deliveryTime).toLowerCase();
      if (time.includes('morning')) mode = 'Morning';
      else if (time.includes('noon') || time.includes('lunch')) mode = 'Lunch';
      else if (time.includes('night') || time.includes('dinner')) mode = 'Dinner';
    }

    // Create order items notes
    let notes = '';
    if (orderData.items && Array.isArray(orderData.items)) {
      notes = orderData.items.map(item => `${item.name} x${item.quantity}`).join(', ');
    } else if (orderData.orderItems) {
      notes = orderData.orderItems.map(item => `${item.name} x${item.quantity}`).join(', ');
    }
    
    // Add delivery mode to notes if provided
    if (orderData.deliveryMode) {
      let deliveryModeText = 'Home Delivery';
      if (orderData.deliveryMode === 'pickup') {
        deliveryModeText = 'Self-Pickup';
      } else if (orderData.deliveryMode === 'outside') {
        deliveryModeText = 'Main Gate Pickup (Outside Panchsheel Greens-1)';
      }
      notes = notes ? `${notes} | Delivery: ${deliveryModeText}` : `Delivery: ${deliveryModeText}`;
    }
    
    // Add preferred delivery time to notes if provided
    if (orderData.preferredDeliveryTime) {
      const [hours, minutes] = orderData.preferredDeliveryTime.split(':');
      const hour12 = parseInt(hours) % 12 || 12;
      const ampm = parseInt(hours) >= 12 ? 'PM' : 'AM';
      const preferredTimeFormatted = `${hour12}:${minutes} ${ampm}`;
      notes = notes ? `${notes} | Preferred Time: ${preferredTimeFormatted} (±10 mins)` : `Preferred Time: ${preferredTimeFormatted} (±10 mins)`;
    }

    // Create the order
    const order = await Order.create({
      orderId,
      date: parsedDate,
      deliveryAddress: orderData.deliveryAddress,
      customerName: orderData.customerName,
      quantity,
      unitPrice,
      totalAmount,
      mode,
      status: 'Pending',
      paymentMode: normalizePaymentMode(orderData.paymentMode || 'Online'),
      paymentStatus: 'Pending',
      source: 'website',
      notes: notes || orderData.notes || '',
    });

    return Response.json(
      {
        success: true,
        data: order,
        message: `Order created successfully with ID: ${order.orderId}`,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error.name === 'ValidationError') {
      return Response.json(
        {
          success: false,
          error: 'Validation failed',
          details: Object.values(error.errors || {})
            .map((e) => e.message)
            .join(', '),
        },
        { status: 400 }
      );
    }

    if (error.code === 11000 || error.message?.includes('duplicate')) {
      // If duplicate order ID, try generating a new one
      try {
        if (orderData && orderData.date) {
          const newOrderId = await generateOrderId(orderData.date);
          // Retry with new order ID (but this is recursive, so we'll just return error)
          return Response.json(
            {
              success: false,
              error: `Order ID conflict. Please try again.`,
            },
            { status: 409 }
          );
        }
      } catch (retryError) {
        // Fall through to main error
      }
      
      return Response.json(
        {
          success: false,
          error: `Order with ID "${orderData?.orderId || 'unknown'}" already exists`,
        },
        { status: 409 }
      );
    }

    if (
      error.message &&
      (error.message.includes('connect') ||
        error.message.includes('ECONNREFUSED'))
    ) {
      return Response.json(
        {
          success: false,
          error:
            'Database connection failed. Please check your database configuration.',
        },
        { status: 503 }
      );
    }

    return Response.json(
      {
        success: false,
        error: error.message || 'Failed to create order',
        details:
          process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: error.status || 500 }
    );
  }
}

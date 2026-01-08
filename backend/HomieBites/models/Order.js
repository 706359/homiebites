// HomieBites Order model
import mongoose from 'mongoose';
const OrderSchema = new mongoose.Schema(
  {
    orderId: { type: String, unique: true, index: true, required: false },
    date: { type: Date, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    deliveryAddress: { type: String, required: true }, // Legacy field - kept for backward compatibility
    addressId: { type: String }, // Address name/code reference
    customerName: { type: String },
    quantity: { type: Number, default: 1 },
    unitPrice: { type: Number, default: 0 },
    totalAmount: { type: Number, default: 0 }, // Calculated on backend: quantity * unitPrice
    paymentStatus: { type: String, default: 'Pending' }, // Paid, Pending, Unpaid
    paymentMode: { type: String, default: 'Online' }, // Cash, Online, UPI, Bank Transfer
    mode: { type: String, default: 'Morning' }, // Delivery slot: Can be any value from Excel (Lunch, Dinner, Breakfast, Morning, Noon, Night, etc.)
    status: { type: String, default: 'PENDING' }, // Legacy field - kept for backward compatibility
    source: {
      type: String,
      enum: ['manual', 'excel', 'api'],
      default: 'manual',
    },
    billingMonth: { type: Number }, // 1-12 (INT)
    billingYear: { type: Number }, // YYYY (INT)
    notes: { type: String },
    priceOverride: { type: Boolean, default: false }, // true when unitPrice ≠ default unit price
    dateNeedsReview: { type: Boolean, default: false }, // true if date format was invalid and needs manual correction
    originalDateString: { type: String }, // Store original invalid date string for manual correction
  },
  {
    timestamps: true, // createdAt, updatedAt
    collection: 'orders', // Explicitly set collection name to 'orders' (lowercase)
  }
);

// Order ID auto-generation removed - Order IDs must be provided manually

// Pre-save: derive billingMonth and billingYear and compute totalAmount (ALWAYS calculated on backend)
OrderSchema.pre('save', function (next) {
  if (this.date) {
    // Only calculate billingMonth/billingYear if not already set (preserve values from upload)
    if (this.billingMonth === undefined || this.billingYear === undefined) {
      // Parse date safely - handle ISO strings and Date objects
      let d;
      if (this.date instanceof Date) {
        d = this.date;
      } else if (typeof this.date === 'string') {
        // For ISO format YYYY-MM-DD, parse as UTC to avoid timezone issues
        if (/^\d{4}-\d{2}-\d{2}$/.test(this.date)) {
          d = new Date(this.date + 'T00:00:00Z'); // Z indicates UTC
        } else {
          d = new Date(this.date);
        }
      } else {
        d = new Date(this.date);
      }

      // Only set if date is valid
      // Use UTC methods to avoid timezone issues when MongoDB stores dates in UTC
      if (!isNaN(d.getTime())) {
        this.billingMonth = d.getUTCMonth() + 1;
        this.billingYear = d.getUTCFullYear();
      }
    }
  }
  // ALWAYS calculate totalAmount on backend (quantity * unitPrice)
  if (this.unitPrice !== undefined && this.quantity !== undefined) {
    this.totalAmount = Number(this.unitPrice) * (Number(this.quantity) || 1);
  }
  // Set addressId from deliveryAddress if not provided
  if (!this.addressId && this.deliveryAddress) {
    this.addressId = this.deliveryAddress;
  }
  // Set paymentStatus from status if not provided (backward compatibility)
  if (!this.paymentStatus && this.status) {
    const statusLower = String(this.status).toLowerCase();
    if (statusLower === 'paid' || statusLower === 'delivered') {
      this.paymentStatus = 'Paid';
    } else if (statusLower === 'unpaid') {
      this.paymentStatus = 'Unpaid';
    } else {
      this.paymentStatus = 'Pending';
    }
  }
  next();
});

export default mongoose.model('Order', OrderSchema);

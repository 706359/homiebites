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
    deliveryAddress: { type: String, required: true },
    addressId: { type: String },
    customerName: { type: String },
    quantity: { type: Number, default: 1 },
    unitPrice: { type: Number, default: 0 },
    totalAmount: { type: Number, default: 0 },
    paymentStatus: { type: String, default: 'Pending' },
    paymentMode: { type: String, default: 'Online' },
    mode: { type: String, default: 'Morning' },
    status: { type: String, default: 'PENDING' },
    source: {
      type: String,
      enum: ['manual', 'excel', 'api', 'website', 'google_sheet'],
      default: 'manual',
    },
    billingMonth: { type: Number },
    billingYear: { type: Number },
    notes: { type: String },
    priceOverride: { type: Boolean, default: false },
    dateNeedsReview: { type: Boolean, default: false },
    originalDateString: { type: String },
  },
  {
    timestamps: true,
    collection: 'orders',
  }
);

OrderSchema.pre('save', function (next) {
  if (this.date) {
    if (this.billingMonth === undefined || this.billingYear === undefined) {
      let d;
      if (this.date instanceof Date) {
        d = this.date;
      } else if (typeof this.date === 'string') {
        // Parse date string without forcing UTC to preserve date components
        if (/^\d{4}-\d{2}-\d{2}$/.test(this.date)) {
          // Extract components directly from string to avoid timezone issues
          const [y, m, day] = this.date.split('-').map(Number);
          d = new Date(y, m - 1, day, 0, 0, 0, 0);
        } else {
          d = new Date(this.date);
        }
      } else {
        d = new Date(this.date);
      }

      if (!isNaN(d.getTime())) {
        // Use local date components (not UTC) to preserve the exact date
        this.billingMonth = d.getMonth() + 1;
        this.billingYear = d.getFullYear();
      }
    }
  }

  // Only calculate totalAmount if it's not already explicitly set
  // This allows manual overrides (e.g., when totalAmount should be different from quantity * unitPrice)
  if (
    (this.totalAmount === undefined || this.totalAmount === null) &&
    this.unitPrice !== undefined &&
    this.quantity !== undefined
  ) {
    this.totalAmount = Number(this.unitPrice) * (Number(this.quantity) || 1);
  }

  if (!this.addressId && this.deliveryAddress) {
    this.addressId = this.deliveryAddress;
  }

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

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);

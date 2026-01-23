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
      enum: ['manual', 'excel', 'api', 'website'],
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
        if (/^\d{4}-\d{2}-\d{2}$/.test(this.date)) {
          d = new Date(this.date + 'T00:00:00Z');
        } else {
          d = new Date(this.date);
        }
      } else {
        d = new Date(this.date);
      }

      if (!isNaN(d.getTime())) {
        this.billingMonth = d.getUTCMonth() + 1;
        this.billingYear = d.getUTCFullYear();
      }
    }
  }

  if (this.unitPrice !== undefined && this.quantity !== undefined) {
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

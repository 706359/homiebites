import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    sNo: {
      type: String,
    },
    date: {
      type: String,
      required: true,
    },
    deliveryAddress: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      default: 1,
    },
    unitPrice: {
      type: Number,
      default: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    orderType: {
      type: String,
      enum: ['ONE_TIME', 'TRIAL', 'DAILY', 'WEEKLY', 'MONTHLY', 'CUSTOM'],
      default: 'ONE_TIME',
    },
    status: {
      type: String,
      enum: ['CREATED', 'WHATSAPP_SENT', 'CONFIRMED', 'PREPARING', 'READY', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED', 'REFUNDED'],
      default: 'CREATED',
    },
    deliverySlot: {
      type: String,
      enum: ['LUNCH', 'DINNER', 'BREAKFAST'],
      default: 'LUNCH',
    },
    subscriptionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subscription',
    },
    whatsappMessage: {
      type: String,
    },
    whatsappSentAt: {
      type: Date,
    },
    paymentMode: {
      type: String,
      enum: ['Online', 'Cash', 'UPI', 'Card'],
      default: 'Online',
    },
    billingMonth: {
      type: String,
    },
    referenceMonth: {
      type: String,
    },
    elapsedDays: {
      type: Number,
      default: 0,
    },
    year: {
      type: String,
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    customerName: {
      type: String,
    },
    customerPhone: {
      type: String,
    },
    items: [
      {
        name: String,
        quantity: Number,
        price: Number,
      },
    ],
    // Backward compatibility fields
    customerAddress: String,
    total: Number,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
orderSchema.index({ date: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ deliveryAddress: 1 });

export default mongoose.model('HomieBites_Order', orderSchema);


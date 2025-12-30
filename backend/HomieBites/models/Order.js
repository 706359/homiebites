// HomieBites Order model
import mongoose from 'mongoose';
const OrderSchema = new mongoose.Schema(
  {
    orderId: { type: String, unique: true, index: true, required: true },
    date: { type: Date, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
    deliveryAddress: { type: String, required: true }, // Legacy field - kept for backward compatibility
    addressId: { type: String }, // Address name/code reference
    customerName: { type: String },
    quantity: { type: Number, default: 1 },
    unitPrice: { type: Number, default: 0 },
    totalAmount: { type: Number, default: 0 }, // Calculated on backend: quantity * unitPrice
    paymentStatus: { type: String, default: 'Pending' }, // Paid, Pending, Unpaid
    paymentMode: { type: String, default: 'Online' }, // Cash, Online, UPI, Bank Transfer
    status: { type: String, default: 'PENDING' }, // Legacy field - kept for backward compatibility
    source: { type: String, enum: ['manual', 'excel', 'api'], default: 'manual' },
    billingMonth: { type: Number }, // 1-12 (INT)
    billingYear: { type: Number }, // YYYY (INT)
    notes: { type: String },
    priceOverride: { type: Boolean, default: false }, // true when unitPrice ≠ default unit price
  },
  { timestamps: true } // createdAt, updatedAt
);

// Generate a unique orderId if not present
// FORMAT: HB250412A9F (HB + YYMMDD + random base36)
// Short, clean, Excel-safe, zero thinking required
OrderSchema.pre('validate', async function (next) {
  if (!this.orderId) {
    const datePart = this.date ? new Date(this.date) : new Date();
    // Format: YYMMDD (2-digit year, month, day)
    const yy = String(datePart.getFullYear()).slice(-2);
    const mm = String(datePart.getMonth() + 1).padStart(2, '0');
    const dd = String(datePart.getDate()).padStart(2, '0');
    const dateStr = `${yy}${mm}${dd}`;

    // Generate random base36 string (3 characters for collision protection)
    // Base36 uses 0-9 and A-Z (36 characters total)
    let randomPart = '';
    while (randomPart.length < 3) {
      const rand = Math.random().toString(36).substring(2).toUpperCase();
      randomPart += rand;
    }
    randomPart = randomPart.substring(0, 3);

    // Format: HB250412A9F
    let orderId = `HB${dateStr}${randomPart}`;

    // Check for uniqueness in database (only if model exists)
    try {
      let isUnique = false;
      let attempts = 0;
      while (!isUnique && attempts < 10) {
        const existing = await mongoose.model('Order').findOne({ orderId });
        if (!existing) {
          isUnique = true;
        } else {
          // Regenerate random part if collision found
          randomPart = '';
          while (randomPart.length < 3) {
            const rand = Math.random().toString(36).substring(2).toUpperCase();
            randomPart += rand;
          }
          randomPart = randomPart.substring(0, 3);
          orderId = `HB${dateStr}${randomPart}`;
          attempts++;
        }
      }
    } catch (error) {
      // If model not available or error, use generated ID anyway (database unique index will catch duplicates)
      console.warn('Could not check Order ID uniqueness:', error.message);
    }

    this.orderId = orderId;
  }
  next();
});

// Pre-save: derive billingMonth and billingYear and compute totalAmount (ALWAYS calculated on backend)
OrderSchema.pre('save', function (next) {
  if (this.date) {
    const d = new Date(this.date);
    this.billingMonth = d.getMonth() + 1;
    this.billingYear = d.getFullYear();
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

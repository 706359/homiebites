// HomieBites Order model
import mongoose from "mongoose";
const OrderSchema = new mongoose.Schema(
  {
    orderId: { type: String, unique: true, index: true, required: true },
    date: { type: Date, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    deliveryAddress: { type: String, required: true }, // Legacy field - kept for backward compatibility
    addressId: { type: String }, // Address name/code reference
    customerName: { type: String },
    quantity: { type: Number, default: 1 },
    unitPrice: { type: Number, default: 0 },
    totalAmount: { type: Number, default: 0 }, // Calculated on backend: quantity * unitPrice
    paymentStatus: { type: String, default: "Pending" }, // Paid, Pending, Unpaid
    paymentMode: { type: String, default: "Online" }, // Cash, Online, UPI, Bank Transfer
    mode: { type: String, default: "Morning" }, // Delivery slot: Can be any value from Excel (Lunch, Dinner, Breakfast, Morning, Noon, Night, etc.)
    status: { type: String, default: "PENDING" }, // Legacy field - kept for backward compatibility
    source: {
      type: String,
      enum: ["manual", "excel", "api"],
      default: "manual",
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
    collection: "orders", // Explicitly set collection name to 'orders' (lowercase)
  },
);

// Generate a unique orderId if not present
// NEW FORMAT: HB-Jan'25-15-000079 (HB-{Month}'{YY}-{DD}-{SequenceNo})
// Format: HB-{MonthAbbr}'{YY}-{DD}-{6-digit-sequence}
OrderSchema.pre("validate", async function (next) {
  if (!this.orderId) {
    const datePart = this.date ? new Date(this.date) : new Date();

    // Get month abbreviation (Jan, Feb, Mar, etc.)
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const month = monthNames[datePart.getMonth()];

    // Get 2-digit year
    const year = String(datePart.getFullYear()).slice(-2);

    // Get 2-digit day
    const day = String(datePart.getDate()).padStart(2, "0");

    // Get start and end of day for counting orders
    const startOfDay = new Date(datePart);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(datePart);
    endOfDay.setHours(23, 59, 59, 999);

    try {
      // Count existing orders for this day
      const Order = mongoose.model("Order");
      const todayCount = await Order.countDocuments({
        date: { $gte: startOfDay, $lte: endOfDay },
      });

      // Generate sequence number (today's count + 1, padded to 6 digits)
      const sequence = String(todayCount + 1).padStart(6, "0");

      // Format: HB-Jan'25-15-000079
      this.orderId = `HB-${month}'${year}-${day}-${sequence}`;
    } catch (error) {
      // Fallback: use timestamp-based sequence if count fails
      console.warn(
        "Could not count orders for Order ID generation:",
        error.message,
      );
      const fallbackSequence = String(Date.now()).slice(-6);
      this.orderId = `HB-${month}'${year}-${day}-${fallbackSequence}`;
    }
  }
  next();
});

// Pre-save: derive billingMonth and billingYear and compute totalAmount (ALWAYS calculated on backend)
OrderSchema.pre("save", function (next) {
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
    if (statusLower === "paid" || statusLower === "delivered") {
      this.paymentStatus = "Paid";
    } else if (statusLower === "unpaid") {
      this.paymentStatus = "Unpaid";
    } else {
      this.paymentStatus = "Pending";
    }
  }
  next();
});

export default mongoose.model("Order", OrderSchema);

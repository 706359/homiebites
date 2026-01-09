// HomieBites Settings model
import mongoose from "mongoose";

const SettingsSchema = new mongoose.Schema(
  {
    businessName: { type: String, default: "HomieBites" },
    defaultUnitPrice: { type: Number, default: 0 },
    paymentModes: [{ type: String }], // Array of payment modes: ['Cash', 'Online', 'UPI', 'Bank Transfer']
    monthLockedTill: { type: String }, // YYYY-MM format, orders before this month cannot be edited
    // Business info
    contact: String,
    email: String,
    address: String,
    // Pricing
    lunchPrice: Number,
    dinnerPrice: Number,
    minimumOrderQty: { type: Number, default: 1 },
    // Order settings
    orderIdPrefix: { type: String, default: "HB-" },
    autoGenerateOrderId: { type: Boolean, default: true },
    allowDuplicateAddress: { type: Boolean, default: true },
    requirePaymentConfirmation: { type: Boolean, default: false },
    statusOptions: [{ type: String }],
    // Notification preferences
    emailDailySummary: { type: Boolean, default: true },
    emailNewOrderAlert: { type: Boolean, default: true },
    emailPaymentReceived: { type: Boolean, default: true },
    emailLowOrderDayWarning: { type: Boolean, default: false },
    smsPaymentReminders: { type: Boolean, default: true },
    smsOrderConfirmations: { type: Boolean, default: false },
    // Data settings
    autoBackup: { type: Boolean, default: true },
    autoBackupTime: { type: String, default: "02:00" },
    // User profile
    userName: String,
    userEmail: String,
    userPhone: String,
    // Theme settings (applies to website)
    fontFamily: { type: String, default: "Baloo 2" },
    fontSize: { type: String, default: "medium" }, // small, medium, large, extra-large
    primaryColor: { type: String, default: "#449031" },
    theme: { type: String, default: "light" }, // light, dark, auto
    // Legacy fields (kept for backward compatibility)
    whatsappNumber: String,
    deliveryTimings: String,
    minOrderValue: Number,
    deliveryCharge: Number,
    announcement: String,
  },
  { timestamps: true, strict: false }, // Allow additional fields for flexibility
);

// Ensure only one settings document exists
SettingsSchema.statics.getSettings = async function () {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

export default mongoose.model("Settings", SettingsSchema);

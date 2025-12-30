// HomieBites Settings model
import mongoose from 'mongoose';

const SettingsSchema = new mongoose.Schema(
  {
    businessName: { type: String, default: 'HomieBites' },
    defaultUnitPrice: { type: Number, default: 0 },
    paymentModes: [{ type: String }], // Array of payment modes: ['Cash', 'Online', 'UPI', 'Bank Transfer']
    monthLockedTill: { type: String }, // YYYY-MM format, orders before this month cannot be edited
    // Legacy fields (kept for backward compatibility)
    whatsappNumber: String,
    deliveryTimings: String,
    minOrderValue: Number,
    deliveryCharge: Number,
    announcement: String,
  },
  { timestamps: true }
);

// Ensure only one settings document exists
SettingsSchema.statics.getSettings = async function () {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

export default mongoose.model('Settings', SettingsSchema);


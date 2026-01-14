
import mongoose from 'mongoose';

const SettingsSchema = new mongoose.Schema(
  {
    businessName: { type: String, default: 'HomieBites' },
    defaultUnitPrice: { type: Number, default: 0 },
    paymentModes: [{ type: String }], 
    monthLockedTill: { type: String }, 
    
    contact: String,
    email: String,
    address: String,
    
    lunchPrice: Number,
    dinnerPrice: Number,
    minimumOrderQty: { type: Number, default: 1 },
    
    orderIdPrefix: { type: String, default: 'HB-' },
    autoGenerateOrderId: { type: Boolean, default: true },
    allowDuplicateAddress: { type: Boolean, default: true },
    requirePaymentConfirmation: { type: Boolean, default: false },
    statusOptions: [{ type: String }],
    
    emailDailySummary: { type: Boolean, default: true },
    emailNewOrderAlert: { type: Boolean, default: true },
    emailPaymentReceived: { type: Boolean, default: true },
    emailLowOrderDayWarning: { type: Boolean, default: false },
    smsPaymentReminders: { type: Boolean, default: true },
    smsOrderConfirmations: { type: Boolean, default: false },
    
    autoBackup: { type: Boolean, default: true },
    autoBackupTime: { type: String, default: '02:00' },
    
    userName: String,
    userEmail: String,
    userPhone: String,
    
    fontFamily: { type: String, default: 'Baloo 2' },
    fontSize: { type: String, default: 'medium' }, 
    primaryColor: { type: String, default: '#449031' },
    secondaryColor: { type: String, default: '#c45c2d' },
    theme: { type: String, default: 'light' }, 
    
    whatsappNumber: String,
    deliveryTimings: String,
    minOrderValue: Number,
    deliveryCharge: Number,
    announcement: String,
  },
  { timestamps: true, strict: false } 
);


SettingsSchema.statics.getSettings = async function () {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

export default mongoose.models.Settings || mongoose.model('Settings', SettingsSchema);

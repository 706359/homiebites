// HomieBites User model
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    username: { type: String, unique: true, sparse: true },
    password: { type: String }, // Hashed with bcrypt
    phone: { type: String },
    mobile: { type: String },
    role: { type: String, default: 'user' },
    firstName: { type: String },
    lastName: { type: String },
    // Password management fields
    isTemporaryPassword: { type: Boolean, default: false },
    passwordResetToken: { type: String },
    passwordResetExpires: { type: Date },
    lastPasswordChange: { type: Date },
    loginAttempts: { type: Number, default: 0 },
    lockUntil: { type: Date },
    isActive: { type: Boolean, default: true },
    twoFactorEnabled: { type: Boolean, default: false },
    twoFactorSecret: { type: String },
    // Legacy password recovery fields (kept for backward compatibility)
    adminId: { type: String },
    panCard: { type: String },
    otp: { type: String },
    otpExpiresAt: { type: Date },
    verificationToken: { type: String },
    verificationTokenExpiresAt: { type: Date },
    resetToken: { type: String },
    resetTokenExpiresAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model('User', UserSchema);

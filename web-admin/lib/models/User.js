// HomieBites User model
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    username: { type: String, unique: true, sparse: true },
    password: { type: String },
    phone: { type: String },
    mobile: { type: String },
    role: { type: String, default: 'user' },
    firstName: { type: String },
    lastName: { type: String },
    // Password recovery fields
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

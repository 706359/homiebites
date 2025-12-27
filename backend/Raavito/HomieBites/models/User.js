import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    addresses: [
      {
        address: String,
        city: String,
        state: String,
        pincode: String,
        isDefault: { type: Boolean, default: false },
      },
    ],
    role: {
      type: String,
      enum: ['customer', 'admin'],
      default: 'customer',
    },
    // Admin verification fields (only for admin accounts)
    adminId: {
      type: String,
      trim: true,
      sparse: true, // Allows null/undefined, but unique when present
    },
    panCardHash: {
      type: String,
      // Hashed PAN card for verification (never store plain text)
    },
    // Password recovery fields
    passwordResetToken: {
      type: String,
    },
    passwordResetExpires: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password and PAN card before saving
userSchema.pre('save', async function (next) {
  // Hash password if modified
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }

  // Hash PAN card if it's being set/modified and user is admin
  if (this.isModified('panCardHash') && this.panCardHash && this.role === 'admin') {
    // If panCardHash is not already hashed (doesn't start with $2), hash it
    if (!this.panCardHash.startsWith('$2')) {
      this.panCardHash = await bcrypt.hash(this.panCardHash.toUpperCase(), 10);
    }
  }

  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Compare PAN card method (for admin verification)
userSchema.methods.comparePanCard = async function (candidatePan) {
  if (!this.panCardHash) return false;
  return await bcrypt.compare(candidatePan.toUpperCase(), this.panCardHash);
};

export default mongoose.model('HomieBites_User', userSchema);

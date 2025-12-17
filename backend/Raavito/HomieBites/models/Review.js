import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'HomieBites_User',
    },
    userName: {
      type: String,
      required: true,
    },
    userEmail: {
      type: String,
    },
    userPhone: {
      type: String,
    },
    userLocation: {
      type: String,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'HomieBites_Order',
    },
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
reviewSchema.index({ status: 1 });
reviewSchema.index({ isFeatured: 1 });
reviewSchema.index({ createdAt: -1 });

export default mongoose.model('HomieBites_Review', reviewSchema);


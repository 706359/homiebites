// HomieBites Review model
import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true },
    userEmail: { type: String },
    userPhone: { type: String },
    userLocation: { type: String },
    rating: { type: Number, required: true, min: 1, max: 5, default: 5 },
    comment: { type: String, required: true },
    featured: { type: Boolean, default: false },
    isApproved: { type: Boolean, default: false }, // Admin approval required
  },
  { timestamps: true }
);

export default mongoose.models.Review || mongoose.model('Review', ReviewSchema);

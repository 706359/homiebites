// HomieBites Offers model
import mongoose from 'mongoose';

const OfferSchema = new mongoose.Schema(
  {
    title: { type: String, required: true }, // Offer title
    type: { type: String, enum: ['Flat', 'Percentage'], default: 'Flat' }, // Flat ₹ off or Percentage discount
    value: { type: Number, default: 0 }, // Numeric value (₹ amount or %)
    description: String, // Legacy field
    discount: String, // Legacy field for display
    badge: String,
    terms: [String],
    startDate: { type: Date }, // Valid from
    endDate: { type: Date }, // Valid to
    whatsappMessage: String,
    ctaText: String,
    isActive: { type: Boolean, default: true }, // Active toggle
  },
  { timestamps: true }
);

export default mongoose.model('Offer', OfferSchema);

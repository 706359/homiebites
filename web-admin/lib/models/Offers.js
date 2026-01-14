
import mongoose from 'mongoose';

const OfferSchema = new mongoose.Schema(
  {
    title: { type: String, required: true }, 
    type: { type: String, enum: ['Flat', 'Percentage'], default: 'Flat' }, 
    value: { type: Number, default: 0 }, 
    description: String, 
    discount: String, 
    badge: String,
    terms: [String],
    startDate: { type: Date }, 
    endDate: { type: Date }, 
    whatsappMessage: String,
    ctaText: String,
    isActive: { type: Boolean, default: true }, 
  },
  { timestamps: true }
);

export default mongoose.models.Offer || mongoose.model('Offer', OfferSchema);


import mongoose from 'mongoose';

const GallerySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    imageUrl: { type: String, required: true },
    alt: { type: String, default: '' },
    caption: { type: String, default: '' },
    price: { type: Number }, 
    category: { type: String }, 
    details: { type: [String], default: [] }, 
    order: { type: Number, default: 0 }, 
    isActive: { type: Boolean, default: true }, 
  },
  { timestamps: true }
);

export default mongoose.models.Gallery || mongoose.model('Gallery', GallerySchema);

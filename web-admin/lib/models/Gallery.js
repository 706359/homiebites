// HomieBites Gallery model
import mongoose from 'mongoose';

const GallerySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    imageUrl: { type: String, required: true },
    alt: { type: String, default: '' },
    caption: { type: String, default: '' },
    price: { type: Number }, // Optional price if it's a menu item
    category: { type: String }, // Optional category
    details: { type: [String], default: [] }, // Array of detail strings (e.g., ["Dry Sabji", "Gravy Sabji", "4 Roti (6 without Rice)", "Rice"])
    order: { type: Number, default: 0 }, // For ordering gallery items
    isActive: { type: Boolean, default: true }, // To show/hide items
  },
  { timestamps: true }
);

export default mongoose.models.Gallery || mongoose.model('Gallery', GallerySchema);

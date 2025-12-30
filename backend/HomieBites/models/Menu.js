// HomieBites Menu model
import mongoose from 'mongoose';

const MenuSchema = new mongoose.Schema(
  {
    key: { type: String, default: 'default', unique: true },
    data: { type: Array, default: [] },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model('Menu', MenuSchema);

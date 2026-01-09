// HomieBites Address model
import mongoose from "mongoose";

const AddressSchema = new mongoose.Schema(
  {
    addressName: { type: String, required: true, unique: true, index: true }, // Address name/code
    isActive: { type: Boolean, default: true }, // Active / Inactive
    notes: { type: String }, // Delivery/payment habits, special instructions
  },
  { timestamps: true },
);

export default mongoose.model("Address", AddressSchema);

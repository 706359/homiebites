// HomieBites Review model
import mongoose from "mongoose";
const ReviewSchema = new mongoose.Schema({
  // ...fields as in previous Review.js...
});
export default mongoose.model("Review", ReviewSchema);

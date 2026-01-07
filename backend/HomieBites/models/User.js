// HomieBites User model
import mongoose from "mongoose";
const UserSchema = new mongoose.Schema({
  // ...fields as in previous User.js...
});
export default mongoose.model("User", UserSchema);

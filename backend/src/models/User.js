import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String }, // remove required: true
    googleId: { type: String, sparse: true, unique: true }, // store Google profile ID
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
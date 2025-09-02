import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    mongoose.connect(MONGO_URI)
      .then(() => console.log("MongoDB connected"))
      .catch((err) => console.error("MongoDB connection failed:", err.message));
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};
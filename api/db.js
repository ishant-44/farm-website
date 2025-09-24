import mongoose from "mongoose";

let isConnected = false;

export const connectDB = async (MONGO_URI) => {
  if (isConnected) return;
  try {
    await mongoose.connect(MONGO_URI);
    isConnected = true;
    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("❌ MongoDB Error:", err);
    throw err;
  }
};

import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  address: String,
  product: String,
  quantity: Number,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Order", orderSchema);

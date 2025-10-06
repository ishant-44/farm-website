import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  customer: {
    name: String,
    email: String,
    phone: String,
    address: String
  },
  products: [
    {
      name: String,
      quantity: Number,
      price: Number
    }
  ],
  totalAmount: Number,
  paymentStatus: { type: String, default: "pending" },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Order", orderSchema);

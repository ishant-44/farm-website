import { connectDB } from "./db.js";
import Order from "../models/Order.js";
import dotenv from "dotenv";

dotenv.config();

export default async function handler(req, res) {
  await connectDB(process.env.MONGO_URI);

  if (req.method === "POST") {
    try {
      const order = new Order(req.body);
      await order.save();
      res.status(201).json({ message: "✅ Order placed successfully!", order });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}

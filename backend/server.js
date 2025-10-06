import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import dotenv from "dotenv";

import Order from "./models/Order.js";
import User from "./models/User.js";

// ---------------- Environment Variables ----------------
dotenv.config();

// ---------------- App Setup ----------------
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---------------- Middleware ----------------
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ---------------- Static Files ----------------
app.use(express.static(path.join(__dirname, "../frontend")));
app.use(express.static(path.join(__dirname, "../public")));
app.use("/images", express.static(path.join(__dirname, "../public/images")));

// ---------------- MongoDB Connection ----------------
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.error("❌ MongoDB Error:", err));

// ---------------- API Routes ----------------

// Create a new order
app.post("/api/orders", async (req, res) => {
  try {
    const order = new Order({ ...req.body, paymentStatus: "pending" });
    await order.save();
    res.status(201).json({ message: "✅ Order placed successfully!", order });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Mark an order as paid (pseudo payment)
app.post("/api/orders/:id/pay", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.paymentStatus = "paid";
    await order.save();

    res.json({ message: "✅ Payment successful!", order });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Signup
app.post("/api/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "Email already registered" });

    const user = new User({ name, email, password }); // ⚠️ password not hashed
    await user.save();

    res.status(201).json({ 
      message: "✅ Signup successful!", 
      user: { _id: user._id, name: user.name, email: user.email } 
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Login
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.status(200).json({ 
      message: "✅ Login successful!", 
      user: { _id: user._id, name: user.name, email: user.email } 
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update order payment status
app.patch("/api/orders/:id", async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { paymentStatus: req.body.paymentStatus },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json({ message: "Payment status updated!", order });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


// ---------------- Fallback Route ----------------
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

// ---------------- Server ----------------
const PORT = process.env.PORT || 3030;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

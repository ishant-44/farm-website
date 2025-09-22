import express from "express";
import path from "path";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import dotenv from "dotenv";

import Order from "./models/Order.js";
import User from "./models/User.js";

// ---------------- Environment Variables ----------------
dotenv.config();

// ---------------- App Setup ----------------
const app = express();

// ---------------- Middleware ----------------
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ---------------- Static Files ----------------
// Serve public assets (images, css, js, etc.)
app.use(express.static(path.join(process.cwd(), "public")));
app.use("/images", express.static(path.join(process.cwd(), "public/images")));

// ---------------- MongoDB Connection ----------------
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Error:", err));

// ---------------- API Routes ----------------

// Orders
app.post("/api/orders", async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();
    res.status(201).json({ message: "✅ Order placed successfully!", order });
  } catch (error) {
    res.status(400).json({ error: error.message });
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
      return res.status(401).json({ message: "Invalid email or passwor

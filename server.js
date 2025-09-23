import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import Order from "./models/Order.js";
import User from "./models/User.js";




dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static frontend
app.use(express.static(path.join(__dirname, "frontend")));
app.use("/images", express.static(path.join(__dirname, "public/images")));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Error:", err));

// API Routes
app.post("/api/orders", async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();
    res.status(201).json({ message: "✅ Order placed successfully!", order });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post("/api/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "Email already registered" });

    const user = new User({ name, email, password }); // ⚠️ consider hashing later
    await user.save();
    res.status(201).json({
      message: "✅ Signup successful!",
      user: { _id: user._id, name: user.name, email: user.email }
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

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

// Fallback to SPA index.html
app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend/index.html"));
});

// ---------------- Export app as serverless handler ----------------
export default app;

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
// Serve frontend files
app.use(express.static(path.resolve(__dirname, "../frontend")));

// Serve public assets (images, css, js, etc.)
app.use(express.static(path.resolve(__dirname, "../public")));
app.use("/images", express.static(path.resolve(__dirname, "../public/images")));

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

// ---------------- Fallback Route ----------------
// Send frontend index.html for all other routes (SPA support)
app.get("/*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../frontend/index.html"));
});

// ---------------- Server ----------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

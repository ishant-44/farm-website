// api/server.js
import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import Order from "../models/Order.js";
import User from "../models/User.js";

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static frontend
app.use(express.static(path.join(__dirname, "../frontend")));
app.use("/images", express.static(path.join(__dirname, "../public/images")));

// MongoDB
mongoose.connect(process.env.MONGO_URI).then(() => console.log("MongoDB connected"));

// API routes
app.post("/api/orders", async (req, res) => { /* same as before */ });
app.post("/api/signup", async (req, res) => { /* same as before */ });
app.post("/api/login", async (req, res) => { /* same as before */ });

// SPA fallback
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

export default app;

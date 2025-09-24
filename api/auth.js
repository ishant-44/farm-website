import { connectDB } from "./db.js";
import User from "../models/User.js";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

dotenv.config();

export default async function handler(req, res) {
  await connectDB(process.env.MONGO_URI);

  if (req.method === "POST") {
    const { action } = req.query; // /api/auth?action=signup or login
    const { name, email, password } = req.body;

    try {
      if (action === "signup") {
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: "Email already registered" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashedPassword });
        await user.save();

        res.status(201).json({
          message: "✅ Signup successful!",
          user: { _id: user._id, name: user.name, email: user.email },
        });
      } else if (action === "login") {
        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ message: "Invalid email or password" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: "Invalid email or password" });

        res.status(200).json({
          message: "✅ Login successful!",
          user: { _id: user._id, name: user.name, email: user.email },
        });
      } else {
        res.status(400).json({ message: "Invalid action" });
      }
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}

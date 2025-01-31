import express from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User";
import { auth } from "../middlewares/auth";
import { AuthRequest } from "../types/LocalTypes";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = new User({ name, email, password });
    await user.save();

    const token = jwt.sign({ id: user._id }, JWT_SECRET);
    res.status(201).json({ user, token });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Registration failed" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      throw new Error();
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET);
    res.json({ user, token });
  } catch (error) {
    res.status(401).json({ error: "Login failed" });
  }
});

// Me endpoint
router.get("/me", auth, async (req: AuthRequest, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user data" });
  }
});

export default router;

import express, { Request, Response, NextFunction } from "express";
import { auth, AuthRequest } from "../middlewares/auth";
import { User } from "../models/User";

const router = express.Router();

// Get all users
router.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find({ role: { $ne: "admin" } }).select(
      "name email role createdAt"
    );
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Delete a user
router.delete(
  "/:id",
  auth,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const user = await User.findById(req.params.id);

      if (!user) {
        res.status(404).json({ error: "User not found" });
        return; // Ensure we stop further execution
      }

      // Check if the user is authorized to delete
      if (
        req.user.role !== "admin" &&
        req.user._id.toString() !== user._id.toString()
      ) {
        res.status(403).json({ error: "Unauthorized to delete this user" });
        return;
      }

      await User.deleteOne({ _id: req.params.id });
      res.json({ message: "User deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Delete failed" });
    }
  }
);

export default router;

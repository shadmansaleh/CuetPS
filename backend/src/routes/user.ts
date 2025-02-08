import express, { Request, Response, NextFunction } from "express";
import { auth } from "../middlewares/auth";
import { AuthRequest } from "../types/LocalTypes";
import { User } from "../models/User";
import StorageUpload from "../middlewares/StorageUpload";

const router = express.Router();

// Get all users
router.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find({ role: { $ne: "admin" } }).select(
      "name email role createdAt avatar_url"
    );
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.params.id).select(
      "name email role createdAt avatar_url"
    );

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

router.get(
  "/username/:username",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const user = await User.findOne({ name: req.params.username }).select(
        "name email avatar_url avatar_storage_id"
      );

      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  }
);

// Upload/Update Profile Picture
router.post(
  "/:id/upload-profile-picture",
  auth,
  StorageUpload,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const user = await User.findById(req.params.id);

      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      if (
        // @ts-ignore
        req.user.role !== "admin" &&
        req.user?.id.toString() !== user._id.toString()
      ) {
        res.status(403).json({ error: "Unauthorized to update this user" });
        return;
      }

      if (req.uploadedFile) {
        // @ts-ignore
        user.avatar_storage_id = req.uploadedFile._id;
        await user.save();

        res.status(200).json({
          message: "Profile picture updated",
        });
        return; // Add return to prevent TypeScript error
      } else {
        res.status(400).json({ error: "No file uploaded" });
        return; // Add return to prevent TypeScript error
      }
    } catch (error) {
      console.error(error);
      console.log("Error uploading profile picture", error);
      res.status(500).json({ error: "Server error" });
      return; // Add return to prevent TypeScript error
    }
  }
);

// Delete a user
router.delete(
  "/:id",
  auth,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const user = await User.findById(req.params.id);

      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      if (
        req?.user?.role !== "admin" &&
        req?.user?._id.toString() !== user._id.toString()
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

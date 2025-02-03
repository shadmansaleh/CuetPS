import express, { Request, Response, NextFunction } from "express";
import { auth, AuthRequest } from "../middlewares/auth";
import { User } from "../models/User";
import multer from "multer";
import path from "path";

const router = express.Router();

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/profile_pictures"); // Folder to store uploaded images
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

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
        "name email avatar_url"
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
  upload.single("profilePicture"),
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const user = await User.findById(req.params.id);

      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      if (
        req.user?.role !== "admin" &&
        req.user?._id.toString() !== user._id.toString()
      ) {
        res.status(403).json({ error: "Unauthorized to update this user" });
        return;
      }

      if (req.file) {
        const avatarUrl = `/uploads/profile_pictures/${req.file.filename}`;
        user.avatar_url = avatarUrl;
        await user.save();

        res.status(200).json({ message: "Profile picture updated", avatar_url: avatarUrl });
        return; // Add return to prevent TypeScript error
      } else {
        res.status(400).json({ error: "No file uploaded" });
        return; // Add return to prevent TypeScript error
      }
    } catch (error) {
      console.error(error);
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
        req.user.role !== "admin" &&
        req.user.id.toString() !== user._id.toString()
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
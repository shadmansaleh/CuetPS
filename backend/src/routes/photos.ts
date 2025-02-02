import express from "express";
import { auth, AuthRequest } from "../middlewares/auth";
import { Photo } from "../models/Photo";
import { RequestHandler } from "express";
import { getRandomK } from "../utils/utils";

const router = express.Router();

router.get("/all/:count?", (async (req, res) => {
  const count = parseInt(req.params.count) || null;
  try {
    let photos = null;
    if (count) photos = await getRandomK(Photo, count);
    else photos = await Photo.find().sort({ votes: -1 }).populate("user");
    res.json(photos);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
}) as RequestHandler);

router.get("/user/:id", async (req, res) => {
  try {
    const photos = await Photo.find({ user: req.params.id });
    res.json(photos);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Upload a photo
router.post("/upload", auth, (async (req: AuthRequest, res) => {
  try {
    const photo = new Photo({
      ...req.body,
      user: req.user._id,
    });
    await photo.save();
    res.status(201).json(photo);
  } catch (error) {
    res.status(400).json({ error: "Upload failed" });
  }
}) as RequestHandler);

router.get("/:id", (async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);
    if (!photo) {
      return res.status(404).json({ error: "Photo not found" });
    }
    res.json(photo.image_url);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
}) as RequestHandler);

router.get("/:id/details", (async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);
    if (!photo) {
      return res.status(404).json({ error: "Photo not found" });
    }
    res.json(photo);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
}) as RequestHandler);

router.get("/:id/download", (async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);
    if (!photo) {
      return res.status(404).json({ error: "Photo not found" });
    }
    res.redirect(photo.image_url);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
}) as RequestHandler);

// Vote for a photo
router.post("/:id/vote", auth, (async (req: AuthRequest, res) => {
  try {
    const photo = await Photo.findById(req.params.id);
    if (!photo) {
      return res.status(404).json({ error: "Photo not found" });
    }
    if (photo?.votes.includes(req.user._id)) {
      return res.status(400).json({ error: "Already voted" });
    } else {
      photo?.votes.push(req.user._id);
    }
    await photo.save();
    res.status(200).json(photo);
  } catch (error) {
    res.status(400).json({ error: "Vote failed" });
  }
}) as RequestHandler);

router.post("/:id/unvote", auth, (async (req: AuthRequest, res) => {
  try {
    const photo = await Photo.findById(req.params.id);
    if (!photo) {
      return res.status(404).json({ error: "Photo not found" });
    }
    if (photo?.votes.includes(req.user._id)) {
      photo.votes = photo.votes.filter((id) => !id.equals(req.user._id));
    } else {
      return res.status(400).json({ error: "Not voted yet" });
    }
    photo.save();
    res.status(200).json(photo);
  } catch (error) {
    res.status(400).json({ error: "Vote failed" });
  }
}) as RequestHandler);

// Delete a photo
router.delete("/:id", auth, (async (req: AuthRequest, res) => {
  try {
    const photo = await Photo.findById(req.params.id);

    if (!photo) {
      return res.status(404).json({ error: "Photo not found" });
    }

    // Check if the user is the owner of the photo
    if (photo.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ error: "Unauthorized to delete this photo" });
    }

    await Photo.deleteOne({ _id: req.params.id });
    res.json({ message: "Photo deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Delete failed" });
  }
}) as RequestHandler);

export default router;

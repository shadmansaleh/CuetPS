import express from "express";
import { auth, AuthRequest } from "../middlewares/auth";
import { Exhibition } from "../models/Exhibition";

const router = express.Router();

// Get all exhibitions
router.get("/", async (req, res) => {
  try {
    const exhibitions = await Exhibition.find();
    res.json(exhibitions);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/:id", async (req, res): Promise<any> => {
  try {
    const exhibition = await Exhibition.findById(req.params.id).populate(
      "photos"
    );
    if (!exhibition) {
      return res.status(404).json({ error: "Exhibition not found" });
    }
    res.json(exhibition);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Create exhibition (admin only)
router.post("/", auth, async (req: AuthRequest, res): Promise<any> => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Not authorized" });
    }

    const exhibition = new Exhibition(req.body);
    await exhibition.save();
    res.status(201).json(exhibition);
  } catch (error) {
    res.status(400).json({ error: "Creation failed" });
  }
});

// Submit photo to exhibition
router.post(
  "/:id/submit",
  auth,
  async (req: AuthRequest, res): Promise<any> => {
    try {
      const exhibition = await Exhibition.findById(req.params.id);
      if (!exhibition) {
        return res.status(404).json({ error: "Exhibition not found" });
      }

      exhibition.photos.push({
        photo: req.body.photoId,
        selected: false,
      });

      await exhibition.save();
      res.json(exhibition);
    } catch (error) {
      res.status(400).json({ error: "Submission failed" });
    }
  }
);

export default router;

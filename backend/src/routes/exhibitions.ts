import express, { Response } from "express";
import { auth, authAdmin, AuthRequest } from "../middlewares/auth";
import { Exhibition } from "../models/Exhibition";
import { populate } from "dotenv";
import Photo from "../models/Photo";

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
    const exhibition = await Exhibition.findById(req.params.id).populate({
      path: "photos",
      match: { selected: true },
      populate: { path: "image" },
    });
    if (!exhibition) {
      return res.status(404).json({ error: "Exhibition not found" });
    }
    exhibition.photos = exhibition.photos
      .filter((photo: any) => photo.selected)
      .map((photo: any) => photo.image);
    res.status(200).json(exhibition);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/:id/photos", async (req, res): Promise<any> => {
  try {
    const exhibition = await Exhibition.findById(req.params.id).populate({
      path: "photos",
      match: { selected: true },
      populate: { path: "image", populate: "user" },
    });
    if (!exhibition) {
      return res.status(404).json({ error: "Exhibition not found" });
    }
    res
      .status(200)
      .json(
        exhibition.photos
          .filter((photo: any) => photo.selected)
          .map((photo: any) => photo.image)
      );
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

router.get(
  "/:id/approval",
  authAdmin,
  async (req: AuthRequest, res: Response): Promise<any> => {
    try {
      const exhibition = await Exhibition.findById(req.params.id)
        .populate({
          path: "photos",
          match: { selected: false },
          populate: { path: "image", populate: "user" },
        })
        .select("photos");
      if (!exhibition) {
        return res.status(404).json({ error: "Exhibition not found" });
      }
      res
        .status(200)
        .json(
          exhibition.photos
            .filter((photo: any) => !photo.selected)
            .map((photo: any) => photo.image)
        );
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  }
);

router.get(
  "/:id/approve/:photoId",
  authAdmin,
  async (req: AuthRequest, res: Response): Promise<any> => {
    try {
      const exhibition = await Exhibition.findById(req.params.id);
      if (!exhibition) {
        return res.status(404).json({ error: "Exhibition not found" });
      }

      const photo = exhibition.photos.id(req.params.photoId);
      if (!photo) {
        return res.status(404).json({ error: "Photo not found" });
      }

      photo.selected = true;
      await exhibition.save();
      res.json(photo);
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  }
);

router.get(
  "/:id/reject/:photoId",
  authAdmin,
  async (req: AuthRequest, res: Response): Promise<any> => {
    try {
      const exhibition = await Exhibition.findById(req.params.id);
      if (!exhibition) {
        return res.status(404).json({ error: "Exhibition not found" });
      }

      const photo = exhibition.photos.id(req.params.photoId);
      if (!photo) {
        return res.status(404).json({ error: "Photo not found" });
      }

      exhibition.photos.id(req.params.photoId).remove();
      await exhibition.save();
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  }
);

// Create exhibition (admin only)
router.post("/create", auth, async (req: AuthRequest, res): Promise<any> => {
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

      const photo = new Photo({ ...req.body, user: req.user._id });
      if (!photo) {
        throw new Error("Failed to create photo object");
      }

      await photo.save();

      exhibition.photos.push({
        photo: photo,
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

import express, { Response } from "express";
import { auth, authAdmin, AuthRequest } from "../middlewares/auth";
import { Exhibition } from "../models/Exhibition";
import { populate } from "dotenv";
import Photo from "../models/Photo";
import multer from "multer";
import path from "path";


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

// Multer setup for image uploads
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}${path.extname(file.originalname)}`);
  },
});
const upload = multer({ storage });

// Update exhibition details (title, dates, thumbnail)
router.put("/:id", authAdmin, async (req: AuthRequest, res: Response): Promise<any> => {
  console.log("Headers:", req.headers); // ✅ Check if Content-Type is set
  console.log("Raw Body:", req.body); // ✅ Debugging incoming request

  try {
    const { title, startDate, endDate, thumbnail } = req.body;
    console.log("Received Data:", { title, startDate, endDate, thumbnail }); // ✅ Log parsed data

    const exhibition = await Exhibition.findById(req.params.id);
    if (!exhibition) {
      return res.status(404).json({ error: "Exhibition not found" });
    }

    exhibition.title = title;
    exhibition.start_date = new Date(startDate);
    exhibition.end_date = new Date(endDate);
    if (thumbnail) exhibition.thumbnail_url = thumbnail;

    await exhibition.save();
    res.json({ message: "Exhibition updated successfully", exhibition });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Server error" });
  }
});


// Upload exhibition thumbnail
router.post(
  "/:id/upload-thumbnail",
  authAdmin,
  upload.single("thumbnail"),
  async (req: AuthRequest, res: Response): Promise<any> => {
    try {
      const exhibition = await Exhibition.findById(req.params.id);
      if (!exhibition) {
        return res.status(404).json({ error: "Exhibition not found" });
      }

      exhibition.thumbnail_url = `/uploads/${req.file?.filename}`;
      await exhibition.save();

      res.json({ message: "Thumbnail uploaded successfully", url: exhibition.thumbnail_url });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  }
);

router.get("/:id", async (req, res): Promise<any> => {
  try {
    let exhibition = await Exhibition.findById(req.params.id).populate({
      path: "photos",
      match: { selected: true },
      populate: { path: "image" },
    });
    if (!exhibition) {
      return res.status(404).json({ error: "Exhibition not found" });
    }
    exhibition = exhibition.toObject();
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

router.post(
  "/:id/approve/:photoId",
  authAdmin,
  async (req: AuthRequest, res: Response): Promise<any> => {
    try {
      const exhibition = await Exhibition.findById(req.params.id);
      if (!exhibition) {
        return res.status(404).json({ error: "Exhibition not found" });
      }

      const photo = exhibition.photos.find(
        (photo: any) => photo.image.toString() === req.params.photoId
      );
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

router.post(
  "/:id/reject/:photoId",
  authAdmin,
  async (req: AuthRequest, res: Response): Promise<any> => {
    try {
      const exhibition = await Exhibition.findById(req.params.id);
      if (!exhibition) {
        return res.status(404).json({ error: "Exhibition not found" });
      }

      const photo = exhibition.photos.find(
        (photo: any) => photo.image.toString() === req.params.photoId
      );
      if (!photo) {
        return res.status(404).json({ error: "Photo not found" });
      }

      exhibition.photos.pull({ _id: photo._id });
      await exhibition.save();
      res.status(200);
    } catch (error) {
      console.error(error);
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

      let photo = new Photo({ ...req.body, user: req.user._id });
      if (!photo) {
        throw new Error("Failed to create photo object");
      }

      await photo.save();

      exhibition.photos.push({
        image: photo._id,
        selected: false,
      });

      await exhibition.save();
      res.status(201).json(photo);
    } catch (error) {
      res.status(400).json({ error: "Submission failed" });
    }
  }
);

export default router;

import express, { Response } from "express";
import { auth, authAdmin } from "../middlewares/auth";
import { AuthRequest } from "../types/LocalTypes";
import { Exhibition } from "../models/Exhibition";
import Photo from "../models/Photo";
import StorageUpload from "../middlewares/StorageUpload";

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

// Update exhibition details (title, descriptions, dates, thumbnail)
router.put(
  "/:id",
  authAdmin,
  StorageUpload,
  async (req: AuthRequest, res: Response): Promise<any> => {
    try {
      const { title, description, start_date, end_date } = req.body;
      console.log("req.body:", req.body);

      const exhibition = await Exhibition.findById(req.params.id);
      if (!exhibition) {
        return res.status(404).json({ error: "Exhibition not found" });
      }

      const changeIfNotNull = (key: string, value: any) => {
        if (value) exhibition[key] = value;
      };

      changeIfNotNull("title", title);
      changeIfNotNull("description", description);
      changeIfNotNull("start_date", start_date && new Date(start_date));
      changeIfNotNull("end_date", end_date && new Date(end_date));
      changeIfNotNull("thumbnail_storage_id", req.uploadedFile);
      await exhibition.save();
      res.json({ message: "Exhibition updated successfully", exhibition });
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
router.post(
  "/create",
  authAdmin,
  StorageUpload,
  async (req: AuthRequest, res: Response): Promise<any> => {
    try {
      const exhibition = new Exhibition({
        title: req.body.title,
        description: req.body.description,
        start_date: new Date(req.body.start_date),
        end_date: new Date(req.body.end_date),
        thumbnail_storage_id: req.uploadedFile,
        status: req.body.status,
      });
      await exhibition.save();
      res.status(201).json(exhibition);
    } catch (error) {
      res.status(400).json({ error: "Creation failed" });
    }
  }
);

// Submit photo to exhibition
router.post(
  "/:id/submit",
  auth,
  StorageUpload,
  async (req: AuthRequest, res: Response): Promise<any> => {
    try {
      if (!req.uploadedFile) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const exhibition = await Exhibition.findById(req.params.id);
      if (!exhibition) {
        return res.status(404).json({ error: "Exhibition not found" });
      }

      let photo = new Photo({
        title: req.body.title,
        caption: req.body.caption,
        storage_id: req.uploadedFile,
        user: req.user,
        aspect_ratio: req.uploadedFile.aspect_ratio,
      });
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

router.delete("/:id", authAdmin, async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const exhibition = await Exhibition.findById(req.params.id);
    if (!exhibition) {
      return res.status(404).json({ error: "Exhibition not found" });
    }

    // Delete associated photos
    await Photo.deleteMany({ _id: { $in: exhibition.photos } });

    // Delete exhibition
    await Exhibition.findByIdAndDelete(req.params.id);

    res.json({ message: "Exhibition deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});


export default router;

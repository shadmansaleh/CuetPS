import { Router } from "express";
import { secureStorage } from "../middlewares/MulterMiddleware";
import process from "process";
import File from "../models/FileModel";

import {
  StorageUploadController,
  StorageGetController,
  StorageDeleteController,
} from "../controllers/StorageController";

const storage = Router();

storage.post(
  "/upload",
  secureStorage.single("file"),
  StorageUploadController as any
);

storage.get("/:id", StorageGetController);
storage.delete("/:id", StorageDeleteController);

storage.get("/get_url/:id", (req, res) => {
  res.json({
    url: `${process.env.BACKEND_URL || "http://localhost:5000"}/storage/${
      req.params.id
    }`,
  });
});

storage.get("/get_info/:id", async (req, res): Promise<any> => {
  const file = File.findById(req.params.id);
  if (!file) {
    return res.status(404).json({ error: "File not found" });
  }
  res.json(file);
});

export default storage;

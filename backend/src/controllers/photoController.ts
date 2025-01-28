import { Request, Response } from "express";
import Photo from "../models/Photo";

export const getPhotos = async (req: Request, res: Response) => {
  try {
    const photos = await Photo.find().populate("uploadedBy", "name email");
    res.json(photos);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch photos." });
  }
};

export const deletePhoto = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const photo = await Photo.findByIdAndDelete(id);
    if (!photo) return res.status(404).json({ message: "Photo not found." });

    res.json({ message: "Photo deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete photo." });
  }
};

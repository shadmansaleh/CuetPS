import { NextFunction, Response } from "express";
import { secureStorage } from "../middlewares/MulterMiddleware";
import { AuthRequest } from "../types/LocalTypes";
import File from "../models/FileModel";
import User from "../models/User";
import sharp from "sharp";

export const StorageUpload = async (
  req: AuthRequest & { file: Express.Multer.File },
  res: Response,
  next: NextFunction
) => {
  if (!req.file) {
    next();
    return;
  }
  const allow_list =
    req.body.permission === "restricted"
      ? User.find({ username: { $in: req.body.allow_list } })
      : [];
  try {
    let aspectRatio = 1;

    if (req.file.mimetype.startsWith("image/")) {
      const metadata = await sharp(req.file.path).metadata();
      if (metadata.width && metadata.height) {
        aspectRatio = metadata.width / metadata.height;
      }
    }

    // create small thumbnail
    // const thumbnail_path = `./public/storage/thumbnail-${req.file.filename}`;
    // await sharp(req.file.path).resize(400).toFile(thumbnail_path);

    const file = new File({
      owner: req?.user?.id,
      path: req.file.path,
      fname: req.file.filename,
      uploadFname: req.file.originalname,
      filetype: req.file.mimetype,
      permission: req.body.permission || "public",
      aspectRatio: aspectRatio,
      permission_allowlist: allow_list,
    });

    await file.save();
    req.uploadedFile = file;
    next();
  } catch (e: any) {
    console.error(e.message);
    next({ status: 400, message: "Error uploading file" });
  }
};

export default [secureStorage.single("file"), StorageUpload];

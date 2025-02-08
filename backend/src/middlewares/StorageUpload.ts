import { NextFunction, Response } from "express";
import { secureStorage } from "../middlewares/MulterMiddleware";
import { AuthRequest } from "../types/LocalTypes";
import File from "../models/FileModel";
import User from "../models/User";

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
    const file = new File({
      owner: req?.user?.id,
      path: req.file.path,
      fname: req.file.filename,
      uploadFname: req.file.originalname,
      filetype: req.file.mimetype,
      permission: req.body.permission || "public",
      permission_allowlist: allow_list,
    });
    // save and calculate aspect ratio of uploaded photo
    await file.save();
    req.uploadedFile = file;
    next();
  } catch (e: any) {
    console.error(e.message);
    next({ status: 400, message: "Error uploading file" });
  }
};

export default [secureStorage.single("file"), StorageUpload];

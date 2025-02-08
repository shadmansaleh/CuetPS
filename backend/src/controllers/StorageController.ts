import { Response } from "express";
import * as types from "../types/LocalTypes";
import { IUser, User } from "../models/User";
import File from "../models/FileModel";
import fs from "fs/promises";
import { Document } from "mongoose";

export const StorageUploadController = async (
  req: types.AuthRequest & { file: Express.Multer.File },
  res: Response
): Promise<any> => {
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
    await file.save();
    res.status(200).json({ id: file._id });
  } catch (e: any) {
    console.error(e.message);
    return res.status(400).json({ message: "Error uploading file" });
  }
};

export const StorageGetController = async (
  req: types.AuthRequest,
  res: Response
): Promise<any> => {
  try {
    const file = await File.findById(req.params.id).exec();
    if (!file) return res.status(400).json({ message: "File not found" });
    if (
      file?.permission?.toString() === "private" &&
      file?.owner?.toString() !== req?.user?.id.toString()
    )
      return res.status(401).json({ message: "Unauthorized" });
    if (
      file?.permission?.toString() === "restricted" &&
      !file.permission_allowlist.some(
        (user) => user.toString() === req?.user?.id
      )
    )
      return res.status(401).json({ message: "Unauthorized" });
    res.status(200).sendFile(file.path, { root: __dirname + "/../.." });
  } catch (e: any) {
    console.error(e.message);
    return res.status(400).json({ message: "Error getting file" });
  }
};

export const StorageDeleteByID = async (
  id: string,
  user?: Document<unknown, any, IUser> & IUser
) => {
  const file = await File.findById(id).exec();
  if (!file) throw new Error("File not found");
  if (file?.owner?.toString() !== user?.id.toString())
    throw new Error("Unauthorized");
  await fs.unlink(file.path);
  await File.findByIdAndDelete(id).exec();
};

export const StorageDeleteController = async (
  req: types.AuthRequest,
  res: Response
): Promise<any> => {
  try {
    await StorageDeleteByID(req.params.id, req?.user);
  } catch (err: any) {
    return res.status(400).json({ message: err.message });
  }
  res.status(200).json({ message: "File deleted" });
};

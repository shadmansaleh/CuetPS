import mongoose from "mongoose";
import { Schema } from "mongoose";

export interface IFile extends mongoose.Document {
  owner: mongoose.Schema.Types.ObjectId;
  path: string;
  fname: string;
  uploadFname: string;
  filetype: string;
  url: string;
  permission: string;
  aspect_ratio: number;
  permission_allowlist: mongoose.Schema.Types.ObjectId[];
}

const FileSchema: Schema<IFile> = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    require: true,
  },
  path: {
    type: String,
    required: true,
  },
  fname: {
    type: String,
    required: true,
  },
  aspect_ratio: {
    type: Number,
    default: 1,
  },
  uploadFname: {
    type: String,
    required: true,
  },
  filetype: {
    type: String,
    required: true,
  },
  url: {
    type: String,
  },
  permission: {
    type: String,
    enum: ["private", "public", "restricted"],
    required: true,
    default: "private",
  },
  permission_allowlist: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "User",
    default: [],
  },
});

// url is derived as process.env.BACKEND_URL + /storage/ + id
FileSchema.post(["find", "findOne"], function (docs) {
  const documents = Array.isArray(docs) ? docs : [docs];
  documents.forEach((doc: any) => {
    doc.url =
      (process.env.BACKEND_URL || "http://localhost:5000") +
      "/api/storage/" +
      doc._id;
  });
  return Array.isArray(docs) ? documents : documents[0];
});

export const FileModel = mongoose.model("File", FileSchema);
export default FileModel;

import mongoose from "mongoose";

const FileSchema = new mongoose.Schema({
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

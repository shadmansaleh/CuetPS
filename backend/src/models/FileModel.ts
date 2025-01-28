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

export const FileModel = mongoose.model("File", FileSchema);
export default FileModel;

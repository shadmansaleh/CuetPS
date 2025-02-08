import mongoose from "mongoose";

const photoSchema = new mongoose.Schema(
  {
    title: String,
    caption: String,
    image_url: {
      type: String,
    },
    storage_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Storage",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    aspect_ratio: {
      type: Number,
      default: 1,
    },
    votes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

// verify either storage_id or image_url is set on save
photoSchema.pre("save", function (next) {
  if (!this.storage_id && !this.image_url) {
    return next(new Error("Either storage_id or image_url is required"));
  }
  next();
});

// url is derived as process.env.BACKEND_URL + /api/storage/ + id
photoSchema.post(["find", "findOne"], function (docs) {
  const documents = Array.isArray(docs) ? docs : [docs];
  documents.forEach((doc: any) => {
    if (doc?.storage_id) {
      doc.image_url =
        (process.env.BACKEND_URL || "http://localhost:5000") +
        "/api/storage/" +
        doc.storage_id;
    }
  });
  return Array.isArray(docs) ? documents : documents[0];
});

export const Photo = mongoose.model("Photo", photoSchema);
export default Photo;

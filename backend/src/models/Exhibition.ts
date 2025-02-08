import mongoose from "mongoose";

const exhibitionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    thumbnail_url: {
      type: String,
    },
    thumbnail_storage_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Storage",
    },
    start_date: {
      type: Date,
      required: true,
    },
    end_date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["upcoming", "active", "past"],
      required: true,
    },
    photos: [
      {
        image: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Photo",
        },
        selected: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// verify either thumbnail_storage_id or thumbnail_url is set on save
exhibitionSchema.pre("save", function (next) {
  if (!this.thumbnail_storage_id && !this.thumbnail_url) {
    return next(
      new Error("Either thumbnail_storage_id or thumbnail_url is required")
    );
  }
  next();
});

// if thumbnail_storage_id is set then thumbnail_url = process.env.BACKEND_URL + /storage/ + thumbnail_storage_id when sending data
exhibitionSchema.post(["find", "findOne"], function (docs) {
  const documents = Array.isArray(docs) ? docs : [docs];
  documents.forEach((doc: any) => {
    if (doc?.thumbnail_storage_id) {
      doc.thumbnail_url =
        (process.env.BACKEND_URL || "http://localhost:5000") +
        "/api/storage/" +
        doc.thumbnail_storage_id;
    }
  });
  return Array.isArray(docs) ? documents : documents[0];
});

export const Exhibition =
  mongoose.models.Exhibition || mongoose.model("Exhibition", exhibitionSchema);
export default Exhibition;

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
      required: true,
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
        photo: {
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

export const Exhibition =
  mongoose.models.Exhibition || mongoose.model("Exhibition", exhibitionSchema);
export default Exhibition;

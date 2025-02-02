import mongoose from "mongoose";

const photoSchema = new mongoose.Schema(
  {
    title: String,
    caption: String,
    image_url: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
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

export const Photo = mongoose.model("Photo", photoSchema);
export default Photo;

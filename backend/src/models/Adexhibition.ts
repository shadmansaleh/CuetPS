import { Schema, model, Document } from "mongoose";

interface Exhibition extends Document {
  title: string;
  description: string;
  start_date: Date;
  end_date: Date;
  themePhotoUrl: string;
  status: "upcoming" | "active" | "past";
  created_at: Date;
}

const exhibitionSchema = new Schema<Exhibition>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  start_date: { type: Date, required: true },
  end_date: { type: Date, required: true },
  themePhotoUrl: { type: String, required: true },
  status: {
    type: String,
    enum: ["upcoming", "active", "past"],
    default: "upcoming",
  },
  created_at: { type: Date, default: Date.now },
});

const Exhibition = model<Exhibition>("Adexhibition", exhibitionSchema);

export default Exhibition;

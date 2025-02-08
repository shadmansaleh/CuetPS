import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcrypt";
interface IUser extends Document {
  _id: string;
  name: string;
  email: string;
  password: string;
  bio: string;
  avatar_url: string;
  avatar_storage_id: mongoose.Schema.Types.ObjectId;
  role: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}
const userSchema: Schema<IUser> = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    bio: String,
    avatar_url: String,
    avatar_storage_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Storage",
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare passwords
userSchema.methods.comparePassword = async function (
  candidatePassword: string
) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.post(["find", "findOne"], function (docs) {
  const documents = Array.isArray(docs) ? docs : [docs];
  documents.forEach((doc: any) => {
    if (doc?.avatar_storage_id) {
      doc.avatar_url =
        (process.env.BACKEND_URL || "http://localhost:5000") +
        "/api/storage/" +
        doc.avatar_storage_id;
    }
  });
  return Array.isArray(docs) ? documents : documents[0];
});

export const User = mongoose.model("User", userSchema);
export default User;

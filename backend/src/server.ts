import { Request, Response } from "express";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import cookieParser from "cookie-parser";
import ErrorHandler from "./middlewares/ErrorHandler";
import RateLimiter from "./middlewares/RateLimiter";
import LogRequest from "./middlewares/LogRequests";
import path from "path";
import fs from "fs";

// Routes
import authRoutes from "./routes/auth";
import photoRoutes from "./routes/photos";
import userRoutes from "./routes/user";
import exhibitionRoutes from "./routes/exhibitions";
import StorageRoute from "./routes/StorageRoute";

dotenv.config();
const app = express();
const ORIGIN_URL = process.env.ORIGIN_URL || "http://localhost:3000";

// Rate Limiting & Middlewares
app.use(RateLimiter(2000));
app.use(cors({ origin: ORIGIN_URL, credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use(LogRequest);

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, "../uploads/profile_pictures");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Serve static files from uploads
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Health Check Route
app.get("/", (req: Request, res: Response) => {
  res.json({ status: "success" });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/photos", photoRoutes);
app.use("/api/user", userRoutes);
app.use("/api/exhibitions", exhibitionRoutes);
app.use("/api/storage", StorageRoute);

// Catch-all for undefined routes
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: "API endpoint not found" });
});

// Global Error Handler
app.use(ErrorHandler);

// Server Initialization
async function main() {
  const PORT = process.env.PORT ? parseInt(process.env.PORT) : 5000;
  connectDB();

  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

// Graceful Shutdown
process.on("SIGINT", () => {
  console.log("Shutting down server...");
  process.exit();
});

main().catch((err) => console.error(err));

export default app;

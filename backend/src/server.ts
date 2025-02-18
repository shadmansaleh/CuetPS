import { Request, Response } from "express";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import cookieParser from "cookie-parser";
import ErrorHandler from "./middlewares/ErrorHandler";
import RateLimiter from "./middlewares/RateLimiter";
import LogRequest from "./middlewares/LogRequests";
import contactRoutes from "./routes/contact";
import { ensureDirExists } from "./utils/fs";
import path from "path";

// Routes
import authRoutes from "./routes/auth";
import photoRoutes from "./routes/photos";
import userRoutes from "./routes/user";
import exhibitionRoutes from "./routes/exhibitions";
import StorageRoute from "./routes/StorageRoute";
import bodyParser from "body-parser";

dotenv.config();
const app = express();
const ORIGIN_URL = process.env.ORIGIN_URL || "http://localhost:3000";

// Rate Limiting & Middlewares
app.use(RateLimiter(2000));
app.use(cors({ origin: ORIGIN_URL, credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(LogRequest);

// Ensure storage directory exists
ensureDirExists(path.join(__dirname, "../public/storage"));

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
app.use("/api/contact", contactRoutes);

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

import { Request, Response } from "express";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import cookieParser from "cookie-parser";
import ErrorHandler from "./middlewares/ErrorHandler";
import RateLimiter from "./middlewares/RateLimiter";
import LogRequest from "./middlewares/LogRequests";

import authRoutes from "./routes/auth";
import photoRoutes from "./routes/photos";
import userRoutes from "./routes/user";
import exhibitionRoutes from "./routes/exhibitions";
import adminRoutes from "./routes/admin";
import StorageRoute from "./routes/StorageRoute";

const app = express();
app.use(RateLimiter(2000));

dotenv.config();
const ORIGIN_URL = process.env.ORIGIN_URL || "http://localhost:3000";

app.use(cors({ origin: ORIGIN_URL, credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use(LogRequest);

// routes

app.get("/", (req: Request, res: Response) => {
  res.json({ status: "success" });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/photos", photoRoutes);
app.use("/api/user", userRoutes);
app.use("/api/exhibitions", exhibitionRoutes);
app.use("/api/admin", adminRoutes);
app.use("api/storage", StorageRoute);
app.use(ErrorHandler);

async function main() {
  const PORT = process.env.PORT ? parseInt(process.env.PORT) : 5000;
  connectDB();

  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

main().catch((err) => console.error(err));

export default app;

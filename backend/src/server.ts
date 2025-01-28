import express from "express";
import dotenv from "dotenv";
import {connectDB} from "./config/db";
import userRoutes from "./routes/user";
import photoRoutes from "./routes/photos";

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/photos", photoRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

import { Router } from "express";
import { secureStorage } from "../middlewares/MulterMiddleware";
import { AuthUser, AuthRole } from "../middlewares/Authenticate";
import {
  StorageUploadController,
  StorageGetController,
  StorageDeleteController,
} from "../controller/StorageController";

const storage = Router();

storage.post(
  "/upload",
  secureStorage.single("file"),
  StorageUploadController as any
);

storage.get("/:id", StorageGetController);
storage.delete("/:id", StorageDeleteController);

export default storage;

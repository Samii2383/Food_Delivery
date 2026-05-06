import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { adminOnly, protect } from "../middleware/auth.js";
import { uploadSingleImage } from "../middleware/upload.js";
import {
  createFood,
  deleteFood,
  getFoodById,
  listFoods,
  updateFood
} from "../controllers/food.controller.js";

export const foodRouter = Router();

foodRouter.get("/", asyncHandler(listFoods));
foodRouter.get("/:id", asyncHandler(getFoodById));
foodRouter.post("/", protect, adminOnly, uploadSingleImage, asyncHandler(createFood));
foodRouter.put("/:id", protect, adminOnly, uploadSingleImage, asyncHandler(updateFood));
foodRouter.delete("/:id", protect, adminOnly, asyncHandler(deleteFood));


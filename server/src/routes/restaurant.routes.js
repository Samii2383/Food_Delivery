import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { adminOnly, protect } from "../middleware/auth.js";
import { uploadSingleImage } from "../middleware/upload.js";
import {
  createRestaurant,
  deleteRestaurant,
  getRestaurantById,
  listRestaurants,
  updateRestaurant
} from "../controllers/restaurant.controller.js";

export const restaurantRouter = Router();

restaurantRouter.get("/", asyncHandler(listRestaurants));
restaurantRouter.get("/:id", asyncHandler(getRestaurantById));
restaurantRouter.post("/", protect, adminOnly, uploadSingleImage, asyncHandler(createRestaurant));
restaurantRouter.put("/:id", protect, adminOnly, uploadSingleImage, asyncHandler(updateRestaurant));
restaurantRouter.delete("/:id", protect, adminOnly, asyncHandler(deleteRestaurant));


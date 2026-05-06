import { Router } from "express";
import { protect, adminOnly } from "../middleware/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getDashboardStats } from "../controllers/admin.controller.js";

export const adminRouter = Router();

adminRouter.get("/stats", protect, adminOnly, asyncHandler(getDashboardStats));


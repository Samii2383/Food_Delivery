import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { protect } from "../middleware/auth.js";
import { createRazorpayOrder, verifyPayment } from "../controllers/payment.controller.js";

export const paymentRouter = Router();

paymentRouter.post("/create-order", protect, asyncHandler(createRazorpayOrder));
paymentRouter.post("/verify", protect, asyncHandler(verifyPayment));


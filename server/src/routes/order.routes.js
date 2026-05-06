import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { adminOnly, protect } from "../middleware/auth.js";
import { validate } from "../validators/validate.js";
import { createOrderSchema, updateOrderStatusSchema } from "../validators/order.validators.js";
import {
  createOrder,
  getAllOrders,
  getMyOrders,
  updateOrderStatus
} from "../controllers/order.controller.js";

export const orderRouter = Router();

orderRouter.post("/", protect, validate({ body: createOrderSchema }), asyncHandler(createOrder));
orderRouter.get("/my", protect, asyncHandler(getMyOrders));
orderRouter.get("/", protect, adminOnly, asyncHandler(getAllOrders));
orderRouter.patch(
  "/:id/status",
  protect,
  adminOnly,
  validate({ body: updateOrderStatusSchema }),
  asyncHandler(updateOrderStatus)
);


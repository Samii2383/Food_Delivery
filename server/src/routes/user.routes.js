import { Router } from "express";
import { protect } from "../middleware/auth.js";

export const userRouter = Router();

userRouter.get("/me", protect, (req, res) => {
  res.json({ success: true, user: req.user });
});


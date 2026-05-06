import { Router } from "express";
import { protect } from "../middleware/auth.js";

export const meRouter = Router();

meRouter.get("/", protect, (req, res) => {
  res.json({ success: true, user: req.user });
});


import { Router } from "express";
import mongoose from "mongoose";

export const healthRouter = Router();

healthRouter.get("/", (_req, res) => {
  res.json({
    ok: true,
    uptime: process.uptime(),
    mongo: mongoose.connection.readyState === 1 ? "connected" : "not_connected",
    timestamp: new Date().toISOString()
  });
});


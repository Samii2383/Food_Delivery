import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import hpp from "hpp";
import mongoSanitize from "express-mongo-sanitize";
import rateLimit from "express-rate-limit";
import morgan from "morgan";

import { env } from "./config/env.js";
import { notFound } from "./middleware/notFound.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { requestId } from "./middleware/requestId.js";
import { healthRouter } from "./routes/health.routes.js";
import authRoutes from "./routes/authRoutes.js";
import { meRouter } from "./routes/me.routes.js";
import { userRouter } from "./routes/user.routes.js";
import { restaurantRouter } from "./routes/restaurant.routes.js";
import { foodRouter } from "./routes/food.routes.js";
import { orderRouter } from "./routes/order.routes.js";
import { adminRouter } from "./routes/admin.routes.js";
import { paymentRouter } from "./routes/payment.routes.js";

export function createApp() {
  const app = express();
  const allowedOrigins = env.CORS_ORIGIN.split(",").map((x) => x.trim());

  app.set("trust proxy", 1);

  app.use(requestId());
  app.use(helmet());
  app.use(hpp());
  app.use(mongoSanitize());
  app.use(
    cors({
      origin: allowedOrigins,
      credentials: true
    })
  );

  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use((req, _res, next) => {
    req.url = req.url.replace(/%0a|%0d/gi, "").trim();
    next();
  });

  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      limit: 300,
      standardHeaders: "draft-7",
      legacyHeaders: false
    })
  );

  if (env.NODE_ENV !== "production") {
    app.use(morgan("dev"));
  }

  app.get("/", (_req, res) => {
    res.json({ name: "QuickBite API", status: "ok" });
  });

  app.use("/api/health", healthRouter);
  app.use("/api/auth", authRoutes);
  console.log("Auth routes loaded");
  app.use("/api/users", userRouter);
  app.use("/api/me", meRouter);
  app.use("/api/restaurants", restaurantRouter);
  app.use("/api/foods", foodRouter);
  app.use("/api/orders", orderRouter);
  app.use("/api/payments", paymentRouter);
  app.use("/api/admin", adminRouter);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}


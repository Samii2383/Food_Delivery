import mongoose from "mongoose";
import multer from "multer";
import { env } from "../config/env.js";
import { ApiError } from "../utils/apiError.js";
import { logger } from "../utils/logger.js";

function normalizeError(err) {
  if (err instanceof ApiError) {
    return {
      statusCode: err.statusCode,
      message: err.message,
      details: err.details
    };
  }

  if (err?.name === "ZodError") {
    return {
      statusCode: 400,
      message: "Validation error",
      details: err.errors
    };
  }

  if (err instanceof mongoose.Error.ValidationError) {
    return {
      statusCode: 400,
      message: "Validation error",
      details: Object.values(err.errors).map((e) => e.message)
    };
  }

  if (err?.code === 11000) {
    return {
      statusCode: 409,
      message: "Duplicate key",
      details: err.keyValue
    };
  }

  if (err instanceof mongoose.Error.CastError) {
    return {
      statusCode: 400,
      message: `Invalid ${err.path}`,
      details: err.value
    };
  }

  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return {
        statusCode: 400,
        message: "Image too large. Maximum allowed size is 10MB."
      };
    }
    return {
      statusCode: 400,
      message: err.message || "File upload error"
    };
  }

  return {
    statusCode: 500,
    message: "Internal server error"
  };
}

export function errorHandler(err, req, res, _next) {
  const normalized = normalizeError(err);

  logger.error("Request failed", {
    requestId: req.id,
    method: req.method,
    path: req.originalUrl,
    statusCode: normalized.statusCode,
    message: err?.message,
    stack: env.NODE_ENV === "production" ? undefined : err?.stack
  });

  res.status(normalized.statusCode).json({
    success: false,
    requestId: req.id,
    message: normalized.message,
    details: normalized.details,
    ...(env.NODE_ENV === "production" ? {} : { stack: err?.stack })
  });
}


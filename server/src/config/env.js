import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const schema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(5000),

  MONGO_URI: z.string().min(1, "MONGO_URI is required"),

  JWT_ACCESS_SECRET: z.string().min(16, "JWT_ACCESS_SECRET must be >= 16 chars"),
  JWT_ACCESS_EXPIRES_IN: z.string().default("15m"),
  JWT_REFRESH_SECRET: z.string().min(16, "JWT_REFRESH_SECRET must be >= 16 chars").optional(),
  JWT_REFRESH_EXPIRES_IN: z.string().default("7d"),

  CORS_ORIGIN: z.string().min(1).default("http://localhost:5173"),
  CLOUDINARY_CLOUD_NAME: z.string().min(1),
  CLOUDINARY_API_KEY: z.string().min(1),
  CLOUDINARY_API_SECRET: z.string().min(1),

  // Dev convenience: ensure you can login as admin even without Atlas access
  AUTO_SEED_DEMO_ADMIN: z
    .enum(["true", "false"])
    .transform((v) => v === "true")
    .default("true"),
  DEMO_ADMIN_EMAIL: z.string().email().default("admin@quickbite.com"),
  DEMO_ADMIN_PASSWORD: z.string().min(8).default("Admin@12345"),

  RAZORPAY_KEY_ID: z.string().default(""),
  RAZORPAY_KEY_SECRET: z.string().default("")
});

export const env = schema.parse(process.env);


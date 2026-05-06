import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

function cleanCloudinaryUrl(value) {
  if (!value) return undefined;
  // Users sometimes paste extra tokens; keep the first whitespace/comma-separated segment.
  const first = String(value).trim().split(/[,\s]+/)[0];
  return first || undefined;
}

const schema = z
  .object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(5000),

  MONGO_URI: z.string().min(1, "MONGO_URI is required"),

  JWT_ACCESS_SECRET: z.string().min(16, "JWT_ACCESS_SECRET must be >= 16 chars"),
  JWT_ACCESS_EXPIRES_IN: z.string().default("15m"),
  JWT_REFRESH_SECRET: z.string().min(16, "JWT_REFRESH_SECRET must be >= 16 chars").optional(),
  JWT_REFRESH_EXPIRES_IN: z.string().default("7d"),

  CORS_ORIGIN: z.string().min(1).default("http://localhost:5173"),
  CLOUDINARY_URL: z
    .string()
    .optional()
    .transform((v) => cleanCloudinaryUrl(v)),
  CLOUDINARY_CLOUD_NAME: z.string().min(1).optional(),
  CLOUDINARY_API_KEY: z.string().min(1).optional(),
  CLOUDINARY_API_SECRET: z.string().min(1).optional(),

  // Dev convenience: ensure you can login as admin even without Atlas access
  AUTO_SEED_DEMO_ADMIN: z
    .enum(["true", "false"])
    .transform((v) => v === "true")
    .default("true"),
  DEMO_ADMIN_EMAIL: z.string().email().default("admin@quickbite.com"),
  DEMO_ADMIN_PASSWORD: z.string().min(8).default("Admin@12345"),

  RAZORPAY_KEY_ID: z.string().default(""),
  RAZORPAY_KEY_SECRET: z.string().default("")
})
  .superRefine((val, ctx) => {
    const hasUrl = Boolean(val.CLOUDINARY_URL);
    const hasParts = Boolean(val.CLOUDINARY_CLOUD_NAME && val.CLOUDINARY_API_KEY && val.CLOUDINARY_API_SECRET);
    if (!hasUrl && !hasParts) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["CLOUDINARY_URL"],
        message:
          "Cloudinary config missing. Provide CLOUDINARY_URL (cloudinary://api_key:api_secret@cloud_name) or CLOUDINARY_CLOUD_NAME + CLOUDINARY_API_KEY + CLOUDINARY_API_SECRET."
      });
    }
    if (hasUrl && !String(val.CLOUDINARY_URL).toLowerCase().startsWith("cloudinary://")) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["CLOUDINARY_URL"],
        message: "Invalid CLOUDINARY_URL protocol. It must begin with 'cloudinary://'."
      });
    }
  });

export const env = schema.parse(process.env);


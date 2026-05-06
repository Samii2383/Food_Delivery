import { User } from "../models/User.js";
import { env } from "../config/env.js";
import { logger } from "../utils/logger.js";

export async function ensureDemoAdmin() {
  if (env.NODE_ENV !== "development") return;
  if (!env.AUTO_SEED_DEMO_ADMIN) return;

  const email = env.DEMO_ADMIN_EMAIL.toLowerCase();
  const password = env.DEMO_ADMIN_PASSWORD;

  const existing = await User.findOne({ email }).select("+password");

  if (!existing) {
    await User.create({ name: "QuickBite Admin", email, password, role: "admin" });
    logger.info(`Seeded demo admin: ${email} / ${password}`);
    return;
  }

  let changed = false;
  if (existing.role !== "admin") {
    existing.role = "admin";
    changed = true;
  }
  if (existing.name !== "QuickBite Admin") {
    existing.name = "QuickBite Admin";
    changed = true;
  }

  // Keep password stable in dev so you can always log in
  existing.password = password;
  changed = true;

  if (changed) {
    await existing.save();
    logger.info(`Updated demo admin: ${email} / ${password}`);
  }
}


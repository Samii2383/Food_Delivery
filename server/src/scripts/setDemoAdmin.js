import "dotenv/config";
import mongoose from "mongoose";
import { User } from "../models/User.js";

const EMAIL = "admin@quickbite.com";
const PASSWORD = "Admin@12345";

async function main() {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) throw new Error("MONGO_URI missing in server/.env");

  await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 10000 });

  const existing = await User.findOne({ email: EMAIL }).select("+password");

  if (!existing) {
    await User.create({ name: "QuickBite Admin", email: EMAIL, password: PASSWORD, role: "admin" });
    console.log(`Created demo admin: ${EMAIL} / ${PASSWORD}`);
  } else {
    existing.name = "QuickBite Admin";
    existing.role = "admin";
    existing.password = PASSWORD; // will be re-hashed by pre-save hook
    await existing.save();
    console.log(`Updated demo admin: ${EMAIL} / ${PASSWORD}`);
  }

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});


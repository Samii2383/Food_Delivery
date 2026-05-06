import mongoose from "mongoose";
import { env } from "./env.js";
import { logger } from "../utils/logger.js";

export async function connectDB() {
  const mongoUri = env.MONGO_URI;

  mongoose.set("strictQuery", true);

  mongoose.connection.on("connected", () => logger.info("MongoDB Connected"));
  mongoose.connection.on("disconnected", () => logger.warn("MongoDB disconnected"));
  mongoose.connection.on("error", (err) => logger.error("MongoDB error", err));

  try {
    await mongoose.connect(mongoUri, {
      autoIndex: env.NODE_ENV !== "production",
      serverSelectionTimeoutMS: 10000
    });
  } catch (err) {
    const message = String(err?.message || "");
    const atlasHint =
      message.includes("MongoDB Atlas") || message.includes("whitelist") || message.includes("ReplicaSetNoPrimary");

    if (env.NODE_ENV === "development") {
      logger.warn(
        atlasHint
          ? "Failed to connect to MongoDB Atlas (likely IP not whitelisted). Falling back to in-memory MongoDB for dev."
          : "Failed to connect to MongoDB. Falling back to in-memory MongoDB for dev.",
        { err: { message, name: err?.name, code: err?.code } }
      );

      const { MongoMemoryServer } = await import("mongodb-memory-server");
      const mem = await MongoMemoryServer.create();
      const memUri = mem.getUri();

      // Ensure we stop the memory server on exit
      process.on("exit", () => mem.stop().catch(() => {}));
      process.on("SIGINT", () => process.exit(0));
      process.on("SIGTERM", () => process.exit(0));

      await mongoose.connect(memUri, {
        autoIndex: true,
        serverSelectionTimeoutMS: 10000
      });
      return;
    }

    throw err;
  }
}


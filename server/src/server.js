import http from "http";
import { env } from "./config/env.js";
import { createApp } from "./app.js";
import { connectDB } from "./config/db.js";
import { logger } from "./utils/logger.js";
import { ensureDemoAdmin } from "./scripts/ensureDemoAdmin.js";

async function bootstrap() {
  await connectDB();
  await ensureDemoAdmin();

  const app = createApp();
  const server = http.createServer(app);

  server.listen(env.PORT, () => {
    logger.info(`Server running on port ${env.PORT}`);
  });
}

bootstrap().catch((err) => {
  logger.error("Failed to start server", err);
  process.exit(1);
});


import app from "./app";
import { env } from "./config/env";
import { initDb } from "./config/db";
import { ensureBucket } from "./services/storage.service";
import { sequelize } from "./config/db";
import logger from "./utils/logger";
import "./models/image.model";

async function start() {
  try {
    const initDatabase = async () => {
      await initDb().catch((err) => {
        logger.error("Database initialization failed", err);
        throw err;
      });
      await sequelize.sync().catch((err) => {
        logger.error("Database sync failed", err);
        throw err;
      });
    };

    await Promise.all([
      initDatabase(),
      ensureBucket().catch((err) => {
        logger.error("MinIO bucket initialization failed", err);
        throw err;
      }),
    ]);

    app.listen(env.PORT, () => {
      logger.info(`Backend listening on port ${env.PORT}`);
    });
  } catch (err) {
    logger.error("Failed to start server", err);
    process.exit(1);
  }
}

start();

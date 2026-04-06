import app from "./app";
import { env } from "./config/env";
import { initDb } from "./config/db";
import { ensureBucket } from "./services/storage.service";
import { sequelize } from "./config/db";
import "./models/image.model";

async function start() {
  try {
    await initDb();
    await sequelize.sync();
    await ensureBucket();

    app.listen(env.PORT, () => {
      console.log(`Backend listening on port ${env.PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server", err);
    process.exit(1);
  }
}

start();

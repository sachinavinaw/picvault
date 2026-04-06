import { Dialect, Sequelize } from "sequelize";
import { env } from "./env";

const commonConfig = {
  host: env.DB_HOST,
  port: env.DB_PORT,
  username: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  logging: false,
};

const sqliteConfig =
  env.DB_DIALECT === "sqlite"
    ? {
        storage: env.DB_STORAGE,
      }
    : {};

export const sequelize = new Sequelize({
  dialect: env.DB_DIALECT as Dialect,
  ...commonConfig,
  ...sqliteConfig,
});

export async function initDb() {
  await sequelize.authenticate();
}

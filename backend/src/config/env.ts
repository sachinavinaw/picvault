import dotenv from "dotenv";

const envPath = process.env.NODE_ENV === "test" ? ".env.test" : ".env";
dotenv.config({ path: envPath });

export const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: Number(process.env.PORT || 4000),
  FRONTEND_ORIGIN: process.env.FRONTEND_ORIGIN || "http://localhost:3000",

  DB_HOST: process.env.DB_HOST || "localhost",
  DB_PORT: Number(process.env.DB_PORT || 5432),
  DB_USER: process.env.DB_USER || "postgres",
  DB_PASSWORD: process.env.DB_PASSWORD || "password",
  DB_NAME: process.env.DB_NAME || "picvault",
  DB_DIALECT:
    process.env.DB_DIALECT ||
    (process.env.NODE_ENV === "test" ? "sqlite" : "postgres"),
  DB_STORAGE:
    process.env.DB_STORAGE ||
    (process.env.NODE_ENV === "test" ? ":memory:" : undefined),

  MINIO_ENDPOINT: process.env.MINIO_ENDPOINT || "localhost",
  MINIO_PORT: Number(process.env.MINIO_PORT || 9000),
  MINIO_ACCESS_KEY: process.env.MINIO_ACCESS_KEY || "admin",
  MINIO_SECRET_KEY: process.env.MINIO_SECRET_KEY || "password",
  MINIO_BUCKET: process.env.MINIO_BUCKET || "picvault",
};

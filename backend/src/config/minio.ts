import { Client } from "minio";
import { env } from "./env";

export const BUCKET_NAME = env.MINIO_BUCKET;

export const minioClient = new Client({
  endPoint: env.MINIO_ENDPOINT,
  port: env.MINIO_PORT,
  useSSL: false,
  accessKey: env.MINIO_ACCESS_KEY,
  secretKey: env.MINIO_SECRET_KEY,
});

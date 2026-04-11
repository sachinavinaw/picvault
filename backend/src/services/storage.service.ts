import { minioClient, BUCKET_NAME } from "../config/minio";
import { v4 as uuid } from "uuid";
import { env } from "../config/env";

export async function ensureBucket() {
  const exists = await minioClient.bucketExists(BUCKET_NAME).catch(() => false);
  if (!exists) {
    await minioClient.makeBucket(BUCKET_NAME, "");
  }
}

export async function uploadImageToMinio(
  fileBuffer: Buffer,
  contentType: string,
): Promise<{ objectKey: string }> {
  const objectKey = uuid();
  const metadata = {
    "Content-Type": contentType,
  };
  await minioClient.putObject(
    BUCKET_NAME,
    objectKey,
    fileBuffer,
    fileBuffer.length,
    metadata,
  );
  return { objectKey };
}

export function getPublicUrl(objectKey: string): string {
  // Served via backend proxy route
  return `${env.BACKEND_URL}/api/images/file/${objectKey}`;
}

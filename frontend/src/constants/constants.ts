export const GET_IMAGE_QUERY_KEY = "gallery-images";

const MAX_SIZE_MB = 50;

export const UPLOAD_IMAGE = {
  MAX_FILES: 20,
  MAX_SIZE_MB,
  MAX_SIZE_BYTES: MAX_SIZE_MB * 1024 * 1024,
  ACCEPTED_TYPES: [
    "image/png",
    "image/jpeg",
    "image/gif",
    "image/svg+xml",
    "image/webp",
  ],
};

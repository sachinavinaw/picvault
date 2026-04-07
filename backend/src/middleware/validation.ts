import { Request, Response, NextFunction } from "express";

/**
 * Validate image upload request BEFORE multer processes files.
 * This protects the server from unnecessary memory usage.
 */
export function validateUploadRequest(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const contentType = req.headers["content-type"];

  // Must be multipart/form-data
  if (!contentType || !contentType.startsWith("multipart/form-data")) {
    return res.status(400).json({
      error: "Invalid content type. Expected multipart/form-data.",
    });
  }

  next();
}

/**
 * Validate each uploaded file AFTER multer parses them.
 * This ensures:
 * - Only images
 * - Max 20 files
 * - Max 50MB per file
 */
export function validateUploadedFiles(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const allFiles = (req.files || []) as Express.Multer.File[];
  const files = allFiles.filter((f) => f.fieldname === "files");

  if (!files.length) {
    return res.status(400).json({ error: "No files provided." });
  }

  if (files.length > 20) {
    return res.status(400).json({
      error: "You can upload a maximum of 20 images at once.",
    });
  }

  for (const file of files) {
    if (!file.mimetype.startsWith("image/")) {
      return res.status(400).json({
        error: `Invalid file type: ${file.originalname}. Only image files are allowed.`,
      });
    }

    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      return res.status(400).json({
        error: `File too large: ${file.originalname}. Max size is 50MB.`,
      });
    }
  }

  next();
}

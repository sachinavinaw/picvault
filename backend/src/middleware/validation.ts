import { Request, Response, NextFunction } from "express";
import { BadRequestException } from "../exceptions/BadRequestException";

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
    return next(
      new BadRequestException(
        "Invalid content type. Expected multipart/form-data.",
      ),
    );
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
    return next(new BadRequestException("No files provided."));
  }

  if (files.length > 20) {
    return next(
      new BadRequestException("You can upload a maximum of 20 images at once."),
    );
  }

  for (const file of files) {
    if (!file.mimetype.startsWith("image/")) {
      return next(
        new BadRequestException(
          `Invalid file type: ${file.originalname}. Only image files are allowed.`,
        ),
      );
    }

    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      return next(
        new BadRequestException(
          `File too large: ${file.originalname}. Max size is 50MB.`,
        ),
      );
    }
  }

  next();
}

import { Request, Response, NextFunction } from "express";
import { uploadImageToMinio, getPublicUrl } from "../services/storage.service";
import { ImageModel } from "../models/image.model";
import { minioClient, BUCKET_NAME } from "../config/minio";
import { BadRequestException } from "../exceptions/BadRequestException";

export async function uploadImages(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const files = (req.files || []) as Express.Multer.File[];
    if (!files.length) {
      throw new BadRequestException("No files provided");
    }

    const results: any[] = [];

    for (const file of files) {
      const { buffer, mimetype, originalname, size } = file;

      const { objectKey } = await uploadImageToMinio(buffer, mimetype);
      const url = getPublicUrl(objectKey);

      const image = await ImageModel.create({
        original_filename: originalname,
        object_key: objectKey,
        content_type: mimetype,
        size_bytes: size,
        url,
      });

      results.push({
        id: image.id,
        url: image.url,
        originalFilename: image.original_filename,
      });
    }

    res.status(201).json({ images: results });
  } catch (err) {
    next(err);
  }
}

export async function listImages(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const images = await ImageModel.findAll({
      order: [["created_at", "DESC"]],
    });

    res.json({
      images: images.map((img) => ({
        id: img.id,
        url: img.url,
        originalFilename: img.original_filename,
      })),
    });
  } catch (err) {
    next(err);
  }
}

export async function serveImage(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { objectKey } = req.params;

    const stat = await minioClient.statObject(BUCKET_NAME, objectKey);
    const contentType =
      stat.metaData["content-type"] ||
      stat.metaData["Content-Type"] ||
      "image/*";

    res.setHeader("Content-Type", contentType);
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");

    const stream = await minioClient.getObject(BUCKET_NAME, objectKey);
    stream.on("error", next);
    stream.pipe(res);
  } catch (err) {
    next(err);
  }
}

import { Router } from "express";
import multer from "multer";
import {
  uploadImages,
  listImages,
  serveImage,
} from "../controllers/images.controller";
import {
  validateUploadedFiles,
  validateUploadRequest,
} from "../middleware/validation";

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 100 * 1024 * 1024, // allow up to 100MB, check in middleware
  },
});

router.post(
  "/images",
  validateUploadRequest,
  upload.any(),
  validateUploadedFiles,
  uploadImages,
);
router.get("/images", listImages);
router.get("/images/file/:objectKey", serveImage);

export default router;

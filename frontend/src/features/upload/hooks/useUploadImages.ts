import { useMutation } from "@tanstack/react-query";
import apiClient from "../../../config/apiClient";
import type { ImageItem } from "../../../types/image";

const uploadImages = async (files: File[], onUploadProgress?: (progress: number) => void): Promise<ImageItem[]> => {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));

  const res = await apiClient.post("/images", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress: (progressEvent) => {
      if (onUploadProgress) {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
        onUploadProgress(percentCompleted);
      }
    },
  });

  return res.data.images as ImageItem[];
};

const useUploadImages = () => {
  return useMutation({
    mutationFn: ({ files, onUploadProgress }: { files: File[]; onUploadProgress?: (progress: number) => void }) =>
      uploadImages(files, onUploadProgress),
  });
};

export default useUploadImages;

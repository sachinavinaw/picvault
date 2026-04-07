export type ImageItem = {
  id: string;
  url: string;
  originalFilename: string;
};

type UploadStatus = "pending" | "uploading" | "completed" | "error";

export type UploadingFile = {
  id: string;
  file: File;
  progress: number;
  status: UploadStatus;
  url?: string;
};

import { useState, useCallback, useEffect, useRef } from "react";
import { type SelectedFile } from "../../../components/ImageDropZone";
import useUploadImages from "./useUploadImages";

export type ConfirmAction = "upload" | "reset" | null;

const useImageManager = () => {
  const { mutateAsync, isPending } = useUploadImages();
  const [files, setFiles] = useState<SelectedFile[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadedFileIds, setUploadedFileIds] = useState<Set<string>>(new Set());
  const allFilesUploaded = files.length > 0 && uploadedFileIds.size === files.length;

  // Keep a ref to files to safely clean up Object URLs on unmount
  // and avoid browser memory leaks
  const filesRef = useRef(files);
  useEffect(() => {
    filesRef.current = files;
  }, [files]);

  useEffect(() => {
    return () => {
      filesRef.current.forEach((f) => URL.revokeObjectURL(f.preview));
    };
  }, []);

  const handleUpload = useCallback(async () => {
    setError(null);
    setUploadProgress(0);

    try {
      const fileObjects = files.map((f) => f.file);

      await mutateAsync({
        files: fileObjects,
        onUploadProgress: (progress) => {
          setUploadProgress(progress);
        },
      });

      // Mark all uploaded files as successfully uploaded
      setUploadedFileIds(new Set(files.map((f) => f.id)));
      setUploadProgress(100);
    } catch (err: any) {
      console.error("Upload failed:", err);
      setError(err.response?.data?.error || "Upload failed");
      setUploadProgress(0);
    }
  }, [files, mutateAsync]);

  const handleReset = useCallback(() => {
    setFiles((prev) => {
      prev.forEach((f) => URL.revokeObjectURL(f.preview));
      return [];
    });
    setError(null);
    setUploadedFileIds(new Set());
    setUploadProgress(0);
  }, []);

  const handleConfirm = useCallback(() => {
    if (confirmAction === "upload") handleUpload();
    if (confirmAction === "reset") handleReset();
    setConfirmAction(null);
  }, [confirmAction, handleUpload, handleReset]);

  const handleRemoveFile = useCallback((id: string) => {
    setFiles((prev) => {
      const fileToRemove = prev.find((f) => f.id === id);
      if (fileToRemove) URL.revokeObjectURL(fileToRemove.preview);
      return prev.filter((f) => f.id !== id);
    });
  }, []);

  return {
    files,
    setFiles,
    error,
    setError,
    confirmAction,
    setConfirmAction,
    uploadProgress,
    uploadedFileIds,
    allFilesUploaded,
    isPending,
    handleUpload,
    handleReset,
    handleConfirm,
    handleRemoveFile,
  };
};

export default useImageManager;

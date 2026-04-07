import { useState } from "react";
import {
  TrashIcon,
  ArrowPathIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import FileDropZone, { type SelectedFile } from "../components/FileDropZone";
import ConfirmModal from "../components/ConfirmModal";
import { UPLOAD_IMAGE } from "../constants/constants";
import useUploadImages from "../hooks/useUploadImages";

type ConfirmAction = "upload" | "reset" | null;

const UploadImage = () => {
  const { mutateAsync, isPending } = useUploadImages();
  const [files, setFiles] = useState<SelectedFile[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadedFileIds, setUploadedFileIds] = useState<Set<string>>(
    new Set(),
  );
  const allFilesUploaded =
    files.length > 0 && uploadedFileIds.size === files.length;

  const handleUpload = async () => {
    setError(null);
    setUploadProgress(0);

    try {
      const fileObjects = files.map((f) => f.file);
      const result = await mutateAsync({
        files: fileObjects,
        onUploadProgress: (progress) => {
          setUploadProgress(progress);
        },
      });

      console.log("Upload successful:", result);

      // Mark all uploaded files as successfully uploaded
      setUploadedFileIds(new Set(files.map((f) => f.id)));
      setUploadProgress(100);
    } catch (err: any) {
      console.error("Upload failed:", err);
      setError(err.response?.data?.error || "Upload failed");
      setUploadProgress(0);
    }
  };

  const handleReset = () => {
    files.forEach((f) => URL.revokeObjectURL(f.preview));
    setFiles([]);
    setError(null);
    setUploadedFileIds(new Set());
    setUploadProgress(0);
  };

  const handleConfirm = () => {
    if (confirmAction === "upload") handleUpload();
    if (confirmAction === "reset") handleReset();
    setConfirmAction(null);
  };

  return (
    <>
      <h1 className="text-2xl font-bold mb-4 text-slate-700">Upload Images</h1>

      <div className="space-y-4">
        <FileDropZone
          files={files}
          onFilesChange={setFiles}
          error={error}
          onError={setError}
        />

        {/* File list */}
        {files.length > 0 && (
          <>
            <ul className="divide-y divide-gray-200 border border-gray-200 rounded-lg overflow-hidden">
              {files.map((f, index) => (
                <li
                  key={f.id}
                  className="flex items-center gap-4 px-4 py-3 bg-white hover:bg-gray-50"
                >
                  <img
                    src={f.preview}
                    alt={f.file.name}
                    className="h-12 w-12 rounded object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {f.file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(f.file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  {uploadedFileIds.has(f.id) ? (
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircleIcon className="h-5 w-5" />
                      <span className="text-sm">Uploaded</span>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          URL.revokeObjectURL(files[index].preview);
                          setFiles(files.filter((_, i) => i !== index));
                        }}
                        className="p-1.5 text-gray-400 hover:text-blue-600 rounded-md hover:bg-blue-50"
                        title="Replace file"
                      >
                        <ArrowPathIcon className="size-5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          URL.revokeObjectURL(files[index].preview);
                          setFiles(files.filter((_, i) => i !== index));
                        }}
                        className="p-1.5 text-gray-400 hover:text-red-600 rounded-md hover:bg-red-50"
                        title="Remove file"
                      >
                        <TrashIcon className="size-5" />
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">
                {files.length} / {UPLOAD_IMAGE.MAX_FILES} file
                {files.length !== 1 ? "s" : ""} selected
              </span>
              {!allFilesUploaded && (
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setConfirmAction("reset")}
                    disabled={isPending}
                    className="px-6 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Reset
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmAction("upload")}
                    disabled={isPending}
                    className="px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isPending ? "Uploading..." : "Upload"}
                  </button>
                </div>
              )}
            </div>

            {/* Upload Progress */}
            {isPending && (
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <ConfirmModal
        open={confirmAction !== null}
        title={confirmAction === "upload" ? "Confirm Upload" : "Confirm Reset"}
        message={
          confirmAction === "upload"
            ? `Upload ${files.length} file${files.length !== 1 ? "s" : ""}?`
            : "This will remove all selected files. Are you sure?"
        }
        onConfirm={handleConfirm}
        onCancel={() => setConfirmAction(null)}
      />
    </>
  );
};

export default UploadImage;

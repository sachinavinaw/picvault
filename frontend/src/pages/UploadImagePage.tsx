import { useState } from "react";
import { TrashIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import FileDropZone, { type SelectedFile } from "../components/FileDropZone";
import ConfirmModal from "../components/ConfirmModal";
import { UPLOAD_IMAGE } from "../constants/constants";

type ConfirmAction = "upload" | "reset" | null;

const UploadImage = () => {
  const [files, setFiles] = useState<SelectedFile[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null);

  const handleUpload = () => {
    console.log(
      "Uploading files:",
      files.map((f) => f.file),
    );
    // TODO: call your upload API here
  };

  const handleReset = () => {
    files.forEach((f) => URL.revokeObjectURL(f.preview));
    setFiles([]);
    setError(null);
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
                  <button
                    type="button"
                    onClick={() => {
                      // Replace file: trigger hidden input in drop zone
                      // For now, delete and re-add
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
                </li>
              ))}
            </ul>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">
                {files.length} / {UPLOAD_IMAGE.MAX_FILES} file
                {files.length !== 1 ? "s" : ""} selected
              </span>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setConfirmAction("reset")}
                  className="px-6 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmAction("upload")}
                  className="px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Upload
                </button>
              </div>
            </div>
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

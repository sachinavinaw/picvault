import { useNavigate } from "react-router";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import ImageDropZone from "../../components/ImageDropZone";
import ConfirmModal from "../../components/ConfirmModal";
import ProgressBar from "../../components/ProgressBar";
import useImageManager from "../../hooks/useImageManager";
import FileList from "../../features/upload/components/FileList";
import UploadControls from "../../features/upload/components/UploadControls";

const UploadImage = () => {
  const navigate = useNavigate();
  const {
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
    handleReset,
    handleConfirm,
    handleRemoveFile,
  } = useImageManager();

  return (
    <>
      <h1 className="text-2xl font-bold mb-4 text-slate-700">Upload Images</h1>

      <div className="space-y-4">
        {allFilesUploaded ? (
          <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-lg bg-green-50">
            <CheckCircleIcon className="h-12 w-12 text-green-500 mb-2" />
            <p className="text-lg font-medium text-gray-900 mb-4">
              All files uploaded successfully!
            </p>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={handleReset}
                className="px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Upload More?
              </button>
              <button
                type="button"
                onClick={() => navigate("/gallery")}
                className="px-6 py-2 bg-white text-blue-600 border border-blue-600 text-sm font-medium rounded-lg hover:bg-blue-50 transition-colors"
              >
                View Gallery
              </button>
            </div>
          </div>
        ) : (
          <ImageDropZone
            files={files}
            onFilesChange={setFiles}
            error={error}
            onError={setError}
          />
        )}

        {/* File list */}
        {files.length > 0 && (
          <>
            <FileList
              files={files}
              uploadedFileIds={uploadedFileIds}
              handleRemoveFile={handleRemoveFile}
            />

            <UploadControls
              allFilesUploaded={allFilesUploaded}
              fileLength={files.length}
              isPending={isPending}
              setConfirmAction={setConfirmAction}
            />

            {/* Upload Progress */}
            {isPending && <ProgressBar uploadProgress={uploadProgress} />}
          </>
        )}
      </div>

      {/* Confirmation Modal */}
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

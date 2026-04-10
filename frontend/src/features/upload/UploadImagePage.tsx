import ImageDropZone from "../../components/ImageDropZone";
import ConfirmModal from "../../components/ConfirmModal";
import ProgressBar from "../../components/ProgressBar";
import useImageManager from "./hooks/useImageManager";
import FileList from "../../features/upload/components/FileList";
import UploadControls from "../../features/upload/components/UploadControls";
import UploadSuccessBanner from "./components/UploadSuccessBanner";

const UploadImage = () => {
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
          <UploadSuccessBanner handleReset={handleReset} />
        ) : (
          <ImageDropZone files={files} onFilesChange={setFiles} error={error} onError={setError} />
        )}

        {/* File list */}
        {files.length > 0 && (
          <>
            <FileList files={files} uploadedFileIds={uploadedFileIds} handleRemoveFile={handleRemoveFile} />

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

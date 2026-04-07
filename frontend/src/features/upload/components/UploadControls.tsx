import type { ConfirmAction } from "../../../hooks/useImageManager";

type UploadControlsProps = {
  allFilesUploaded: boolean;
  fileLength: number;
  isPending: boolean;
  setConfirmAction: React.Dispatch<React.SetStateAction<ConfirmAction>>;
};
const UploadControls = ({
  allFilesUploaded,
  fileLength,
  isPending,
  setConfirmAction,
}: UploadControlsProps) => {
  return (
    <div className="flex items-center justify-between">
      {!allFilesUploaded && (
        <>
          <span className="text-sm text-gray-500">
            {fileLength} image
            {fileLength !== 1 ? "s" : ""} selected
          </span>
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
        </>
      )}
    </div>
  );
};

export default UploadControls;

import { CheckCircleIcon, TrashIcon } from "@heroicons/react/16/solid";
import type { SelectedFile } from "../../../components/ImageDropZone";

type FileListProps = {
  files: SelectedFile[];
  uploadedFileIds: Set<string>;
  handleRemoveFile: (id: string) => void;
};

const FileList = ({
  files,
  uploadedFileIds,
  handleRemoveFile,
}: FileListProps) => {
  return (
    <ul className="divide-y divide-gray-200 border border-gray-200 rounded-lg overflow-hidden">
      {files.map((f) => (
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
            <p className="text-sm font-medium truncate">{f.file.name}</p>
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
                onClick={() => handleRemoveFile(f.id)}
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
  );
};

export default FileList;

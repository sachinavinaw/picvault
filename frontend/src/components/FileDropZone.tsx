import { useRef, useState, type ChangeEvent, type DragEvent } from "react";

const MAX_FILES = 20;
const MAX_SIZE_MB = 50;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;
const ACCEPTED_TYPES = [
  "image/png",
  "image/jpeg",
  "image/gif",
  "image/svg+xml",
  "image/webp",
];

export interface SelectedFile {
  id: string;
  file: File;
  preview: string;
}

interface FileDropZoneProps {
  files: SelectedFile[];
  onFilesChange: (files: SelectedFile[]) => void;
  error: string | null;
  onError: (error: string | null) => void;
}

export { MAX_FILES, MAX_SIZE_MB };

const FileDropZone = ({
  files,
  onFilesChange,
  error,
  onError,
}: FileDropZoneProps) => {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const replaceIndexRef = useRef<number | null>(null);

  const validate = (incoming: File[]): File[] => {
    onError(null);
    const valid: File[] = [];
    for (const f of incoming) {
      if (!ACCEPTED_TYPES.includes(f.type)) {
        onError(`"${f.name}" is not a supported image type.`);
        continue;
      }
      if (f.size > MAX_SIZE_BYTES) {
        onError(`"${f.name}" exceeds ${MAX_SIZE_MB}MB.`);
        continue;
      }
      valid.push(f);
    }
    return valid;
  };

  const addFiles = (incoming: File[]) => {
    const valid = validate(incoming);
    if (!valid.length) return;

    const remaining = MAX_FILES - files.length;
    if (remaining <= 0) {
      onError(`Maximum ${MAX_FILES} files allowed.`);
      return;
    }
    const toAdd = valid.slice(0, remaining);
    if (valid.length > remaining) {
      onError(`Only ${remaining} more file(s) can be added.`);
    }
    onFilesChange([
      ...files,
      ...toAdd.map((file) => ({
        id: crypto.randomUUID(),
        file,
        preview: URL.createObjectURL(file),
      })),
    ]);
  };

  const replaceFile = (index: number, incoming: File[]) => {
    const valid = validate(incoming);
    if (!valid.length) return;
    const updated = [...files];
    URL.revokeObjectURL(updated[index].preview);
    const file = valid[0];
    updated[index] = {
      id: crypto.randomUUID(),
      file,
      preview: URL.createObjectURL(file),
    };
    onFilesChange(updated);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    if (replaceIndexRef.current !== null) {
      replaceFile(replaceIndexRef.current, selected);
      replaceIndexRef.current = null;
    } else {
      addFiles(selected);
    }
    e.target.value = "";
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragging(false);
    addFiles(Array.from(e.dataTransfer.files));
  };

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      <div
        className={`flex items-center justify-center w-full border border-dashed rounded-lg cursor-pointer transition-colors ${
          dragging
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 bg-gray-50 hover:bg-gray-100"
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => {
          replaceIndexRef.current = null;
          inputRef.current?.click();
        }}
      >
        <div className="flex flex-col items-center justify-center py-10">
          <svg
            className="w-10 h-10 mb-2 text-blue-700"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 17h3a3 3 0 0 0 0-6h-.025a5.56 5.56 0 0 0 .025-.5A5.5 5.5 0 0 0 7.207 9.021C7.137 9.017 7.071 9 7 9a4 4 0 1 0 0 8h2.167M12 19v-9m0 0-2 2m2-2 2 2"
            />
          </svg>
          <p className="mb-2 text-sm">
            <span className="font-semibold">Click to upload</span> or drag and
            drop
          </p>
          <p className="text-xs text-gray-500">
            PNG, JPG, GIF, SVG or WebP &middot; Max {MAX_SIZE_MB}MB each
            &middot; Up to {MAX_FILES} files
          </p>
        </div>
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept="image/*"
          multiple
          onChange={handleFileChange}
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default FileDropZone;

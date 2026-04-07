import {
  memo,
  useCallback,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
} from "react";
import Alert from "./Alert";
import { UPLOAD_IMAGE } from "../constants/constants";

export type SelectedFile = {
  id: string;
  file: File;
  preview: string;
};

type ImageDropZoneProps = {
  files: SelectedFile[];
  onFilesChange: (files: SelectedFile[]) => void;
  error: string | null;
  onError: (error: string | null) => void;
};

const ImageDropZone = ({
  files,
  onFilesChange,
  error,
  onError,
}: ImageDropZoneProps) => {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const replaceIndexRef = useRef<number | null>(null);

  const validate = useCallback(
    (incoming: File[]): File[] => {
      onError(null);
      const valid: File[] = [];
      for (const f of incoming) {
        if (!UPLOAD_IMAGE.ACCEPTED_TYPES.includes(f.type)) {
          onError(`"${f.name}" is not a supported image type.`);
          continue;
        }
        if (f.size > UPLOAD_IMAGE.MAX_SIZE_BYTES) {
          onError(`"${f.name}" exceeds ${UPLOAD_IMAGE.MAX_SIZE_MB}MB.`);
          continue;
        }
        valid.push(f);
      }
      return valid;
    },
    [onError],
  );

  const addFiles = useCallback(
    (incoming: File[]) => {
      const valid = validate(incoming);
      if (!valid.length) return;

      const remaining = UPLOAD_IMAGE.MAX_FILES - files.length;
      if (remaining <= 0) {
        onError(`Maximum ${UPLOAD_IMAGE.MAX_FILES} files allowed.`);
        return;
      }
      const toAdd = valid.slice(0, remaining);
      if (valid.length > remaining) {
        onError(`Only ${remaining} file(s) can be added.`);
      }
      onFilesChange([
        ...files,
        ...toAdd.map((file) => ({
          id: crypto.randomUUID(),
          file,
          preview: URL.createObjectURL(file),
        })),
      ]);
    },
    [files, validate, onError, onFilesChange],
  );

  const replaceFile = useCallback(
    (index: number, incoming: File[]) => {
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
    },
    [files, validate, onFilesChange],
  );

  const handleFileChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const selected = Array.from(e.target.files || []);
      if (replaceIndexRef.current !== null) {
        replaceFile(replaceIndexRef.current, selected);
        replaceIndexRef.current = null;
      } else {
        addFiles(selected);
      }
      e.target.value = "";
    },
    [replaceFile, addFiles],
  );

  const handleDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      setDragging(false);
      addFiles(Array.from(e.dataTransfer.files));
    },
    [addFiles],
  );

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
            PNG, JPG, GIF, SVG or WebP &middot; Max {UPLOAD_IMAGE.MAX_SIZE_MB}MB
            each &middot; Up to {UPLOAD_IMAGE.MAX_FILES} images
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

      {error && <Alert alertType="warning" message={error} />}
    </div>
  );
};

export default memo(ImageDropZone);

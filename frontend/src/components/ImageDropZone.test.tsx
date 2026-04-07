import "@testing-library/jest-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import type { SelectedFile } from "./ImageDropZone";
import ImageDropZone from "./ImageDropZone";
import { UPLOAD_IMAGE } from "../constants/constants";
import { renderWithQueryClient } from "../../tests/testUtils";

// Mock browser APIs
vi.stubGlobal("URL", {
  createObjectURL: vi.fn(() => "blob://mock"),
  revokeObjectURL: vi.fn(),
});

vi.stubGlobal("crypto", {
  randomUUID: vi.fn(() => "mock-uuid"),
});

describe("<ImageDropZone />", () => {
  let files: SelectedFile[];
  let onFilesChange: ReturnType<typeof vi.fn<(files: SelectedFile[]) => void>>;
  let onError: ReturnType<typeof vi.fn<(error: string | null) => void>>;

  beforeEach(() => {
    files = [];
    onFilesChange = vi.fn();
    onError = vi.fn();
  });

  const renderDropZone = () =>
    renderWithQueryClient(
      <ImageDropZone
        files={files}
        onFilesChange={onFilesChange}
        error={null}
        onError={onError}
      />,
    );

  const createFile = (name: string, type: string, size = 1000) =>
    new File(["x".repeat(size)], name, { type });

  it("renders without crashing", () => {
    renderDropZone();
    expect(screen.getByText(/Click to upload/i)).toBeInTheDocument();
  });

  it("accepts valid image files", () => {
    renderDropZone();

    const input = document.querySelector("input[type='file']")!;
    const file = new File(["hello"], "hello.png", { type: "image/png" });

    fireEvent.change(input, { target: { files: [file] } });

    expect(onFilesChange).toHaveBeenCalledTimes(1);
    const added = onFilesChange.mock.calls[0][0];
    expect(added.length).toBe(1);
    expect(added[0].file.name).toBe("hello.png");
  });

  it("rejects unsupported file types", () => {
    renderDropZone();

    const input = document.querySelector("input[type='file']")!;
    const file = createFile("bad.txt", "text/plain");

    fireEvent.change(input, { target: { files: [file] } });

    expect(onError).toHaveBeenCalledWith(
      '"bad.txt" is not a supported image type.',
    );
    expect(onFilesChange).not.toHaveBeenCalled();
  });

  it("rejects files larger than max size", () => {
    renderDropZone();

    const input = document.querySelector("input[type='file']")!;
    const file = createFile(
      "big.png",
      "image/png",
      UPLOAD_IMAGE.MAX_SIZE_BYTES + 1,
    );

    fireEvent.change(input, { target: { files: [file] } });

    expect(onError).toHaveBeenCalledWith(
      `"big.png" exceeds ${UPLOAD_IMAGE.MAX_SIZE_MB}MB.`,
    );
    expect(onFilesChange).not.toHaveBeenCalled();
  });

  it("enforces max file count", () => {
    files = Array.from({ length: UPLOAD_IMAGE.MAX_FILES }).map((_, i) => ({
      id: `id-${i}`,
      file: createFile(`img${i}.png`, "image/png"),
      preview: "blob://mock",
    }));

    renderDropZone();

    const input = document.querySelector("input[type='file']")!;
    const file = createFile("extra.png", "image/png");

    fireEvent.change(input, { target: { files: [file] } });

    expect(onError).toHaveBeenCalledWith(
      `Maximum ${UPLOAD_IMAGE.MAX_FILES} files allowed.`,
    );
    expect(onFilesChange).not.toHaveBeenCalled();
  });

  it("handles drag-and-drop", () => {
    renderDropZone();

    const dropZone = screen.getByText(/Click to upload/i).closest("div")!;
    const file = createFile("drag.png", "image/png");

    fireEvent.drop(dropZone, {
      dataTransfer: { files: [file] },
    });

    expect(onFilesChange).toHaveBeenCalledTimes(1);
  });

  it("shows error alert when error prop is provided", () => {
    render(
      <ImageDropZone
        files={[]}
        onFilesChange={onFilesChange}
        error="Something went wrong"
        onError={onError}
      />,
    );

    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
  });
});

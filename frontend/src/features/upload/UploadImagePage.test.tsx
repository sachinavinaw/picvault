import { fireEvent, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import "@testing-library/jest-dom";
import { renderWithQueryClient } from "../../utils/testUtils";
import UploadImagePage from "./UploadImagePage";

// Mock browser APIs
vi.stubGlobal("URL", {
  createObjectURL: vi.fn(() => "blob://mock"),
  revokeObjectURL: vi.fn(),
});

vi.stubGlobal("crypto", {
  randomUUID: vi.fn(() => "mock-uuid"),
});

// Mock react-router
vi.mock("react-router", () => ({
  useNavigate: () => vi.fn(),
}));

// Mock useUploadImages hook
const mutateAsyncMock = vi.fn();
vi.mock("./hooks/useUploadImages", () => ({
  default: () => ({
    mutateAsync: mutateAsyncMock,
    isPending: false,
  }),
}));

// Stub ImageDropZone
vi.mock("../../components/ImageDropZone", () => ({
  default: ({
    onFilesChange,
    error,
    onError,
  }: {
    onFilesChange: (files: any[]) => void;
    error: string | null;
    onError: (err: string | null) => void;
  }) => (
    <div>
      <button
        data-testid="add-file-btn"
        onClick={() =>
          onFilesChange([
            {
              id: "file-1",
              file: new File(["hello"], "test.png", { type: "image/png" }),
              preview: "blob://mock",
            },
          ])
        }
      >
        Add File
      </button>

      {error && <p>{error}</p>}

      <button data-testid="trigger-error-btn" onClick={() => onError("Some error")}>
        Trigger Error
      </button>
    </div>
  ),
}));

// Stub ConfirmModal
vi.mock("../../components/ConfirmModal", () => ({
  default: ({
    open,
    title,
    message,
    onConfirm,
    onCancel,
  }: {
    open: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
  }) =>
    open ? (
      <div>
        <p>{title}</p>
        <p>{message}</p>
        <button data-testid="confirm-btn" onClick={onConfirm}>
          Confirm
        </button>
        <button data-testid="cancel-btn" onClick={onCancel}>
          Cancel
        </button>
      </div>
    ) : null,
}));

describe("<UploadImagePage />", () => {
  beforeEach(() => {
    mutateAsyncMock.mockReset();
  });

  it("renders heading", () => {
    renderWithQueryClient(<UploadImagePage />);
    expect(screen.getByText("Upload Images")).toBeInTheDocument();
  });
  it("adds a file via ImageDropZone stub", () => {
    renderWithQueryClient(<UploadImagePage />);

    fireEvent.click(screen.getByTestId("add-file-btn"));

    expect(screen.getByText("test.png")).toBeInTheDocument();
  });

  it("removes a file", () => {
    renderWithQueryClient(<UploadImagePage />);

    fireEvent.click(screen.getByTestId("add-file-btn"));

    const removeBtn = screen.getByTitle("Remove file");
    fireEvent.click(removeBtn);

    expect(screen.queryByText("test.png")).not.toBeInTheDocument();
  });

  it("shows error from ImageDropZone", () => {
    renderWithQueryClient(<UploadImagePage />);

    fireEvent.click(screen.getByTestId("trigger-error-btn"));

    expect(screen.getByText("Some error")).toBeInTheDocument();
  });

  it("opens reset confirmation modal", () => {
    renderWithQueryClient(<UploadImagePage />);

    fireEvent.click(screen.getByTestId("add-file-btn"));
    fireEvent.click(screen.getByText("Reset"));

    expect(screen.getByText("Confirm Reset")).toBeInTheDocument();
  });

  it("resets files after confirming reset", () => {
    renderWithQueryClient(<UploadImagePage />);

    fireEvent.click(screen.getByTestId("add-file-btn"));
    fireEvent.click(screen.getByText("Reset"));
    fireEvent.click(screen.getByTestId("confirm-btn"));

    expect(screen.queryByText("test.png")).not.toBeInTheDocument();
  });
});

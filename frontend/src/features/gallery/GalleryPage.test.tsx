import { screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import "@testing-library/jest-dom";
import { renderWithQueryClient } from "../../../tests/testUtils";
import GalleryPage from "./GalleryPage";

// --- Mock useGetImages hook ---
const mockUseGetImages = vi.fn();

vi.mock("../../hooks/useGetImages", () => ({
  default: () => mockUseGetImages(),
}));

describe("<GalleryPage />", () => {
  beforeEach(() => {
    mockUseGetImages.mockReset();
  });

  it("renders heading", () => {
    mockUseGetImages.mockReturnValue({
      data: [],
      error: null,
    });

    renderWithQueryClient(<GalleryPage />);

    expect(screen.getByText("Gallery")).toBeInTheDocument();
  });

  it("renders image count", () => {
    mockUseGetImages.mockReturnValue({
      data: [
        { id: "1", url: "/img1.jpg", originalFilename: "img1.jpg" },
        { id: "2", url: "/img2.jpg", originalFilename: "img2.jpg" },
      ],
      error: null,
    });

    renderWithQueryClient(<GalleryPage />);

    expect(screen.getByText("Showing 2 images")).toBeInTheDocument();
  });

  it("renders images in the gallery", () => {
    mockUseGetImages.mockReturnValue({
      data: [
        { id: "1", url: "/img1.jpg", originalFilename: "img1.jpg" },
        { id: "2", url: "/img2.jpg", originalFilename: "img2.jpg" },
      ],
      error: null,
    });

    renderWithQueryClient(<GalleryPage />);

    const imgs = screen.getAllByRole("img");
    expect(imgs.length).toBe(2);
    expect(imgs[0]).toHaveAttribute("src", "/img1.jpg");
    expect(imgs[1]).toHaveAttribute("src", "/img2.jpg");
  });

  it("renders error state", () => {
    mockUseGetImages.mockReturnValue({
      data: null,
      error: new Error("Something went wrong"),
    });

    renderWithQueryClient(<GalleryPage />);

    expect(screen.getByText("Error: Something went wrong")).toBeInTheDocument();
  });

  it("renders zero images correctly", () => {
    mockUseGetImages.mockReturnValue({
      data: [],
      error: null,
    });

    renderWithQueryClient(<GalleryPage />);

    expect(screen.getByText("Showing 0 images")).toBeInTheDocument();
  });
});

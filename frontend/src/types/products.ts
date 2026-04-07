type Ratings = {
  rate: number;
  count: number;
};

type Products = {
  category: string;
  description: string;
  id: number;
  image: string;
  price: number;
  rating: Ratings;
  title: string;
};

export type { Products };

export type ImageItem = {
  id: string;
  url: string;
  originalFilename: string;
};

export type UploadingFile = {
  id: string;
  file: File;
  progress: number;
  status: "pending" | "uploading" | "completed" | "error";
  url?: string;
};

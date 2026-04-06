import { useMutation } from "@tanstack/react-query";
import apiClient from "../config/apiClient";
import type { Products } from "../types/products";

const uploadImages = async (): Promise<Products[]> => {
  const { data } = await apiClient.get<Products[]>("/products");
  return data;
};

const useUploadImages = () => {
  return useMutation({
    mutationFn: uploadImages,
  });
};

export default useUploadImages;

import { useQuery } from "@tanstack/react-query";
import apiClient from "../config/apiClient";
import { GET_IMAGE_QUERY_KEY } from "../constants/constants";
import type { Products } from "../types/products";

const fetchImages = async (): Promise<Products[]> => {
  const { data } = await apiClient.get<Products[]>("/products");
  return data;
};

const useGetImages = () => {
  return useQuery({
    queryKey: [GET_IMAGE_QUERY_KEY],
    queryFn: fetchImages,
    staleTime: 5 * 60 * 1000,
  });
};

export default useGetImages;

import { useQuery } from "@tanstack/react-query";
import type { ImageItem } from "../../../types/image";
import apiClient from "../../../config/apiClient";
import { GET_IMAGE_QUERY_KEY } from "../../../constants/constants";

const fetchImages = async (): Promise<ImageItem[]> => {
  const res = await apiClient.get("/images");
  return res.data.images as ImageItem[];
};

const useGetImages = () => {
  return useQuery({
    queryKey: [GET_IMAGE_QUERY_KEY],
    queryFn: fetchImages,
    staleTime: 5 * 60 * 1000,
  });
};

export default useGetImages;

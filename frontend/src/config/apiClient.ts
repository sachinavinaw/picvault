import axios from "axios";
import { increment, decrement } from "../stores/loadingStore";

const BASE_API_URL = "https://fakestoreapi.com";

const apiClient = axios.create({
  baseURL: BASE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    increment();
    return config;
  },
  (error) => {
    decrement();
    return Promise.reject(error);
  },
);

apiClient.interceptors.response.use(
  (response) => {
    decrement();
    return response;
  },
  (error) => {
    decrement();
    return Promise.reject(error);
  },
);

export default apiClient;

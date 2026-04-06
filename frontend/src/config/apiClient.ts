import axios from "axios";
import { increment, decrement } from "../stores/loadingStore";

const BASE_API_URL = "https://fakestoreapi.com";

// export const api = axios.create({
//   baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api",
// });

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

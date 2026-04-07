import axios, { AxiosHeaders } from "axios";
import { increment, decrement } from "../stores/loadingStore";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api",
});

//const BASE_API_URL = "https://fakestoreapi.com";
// const apiClient = axios.create({
//   baseURL: BASE_API_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

apiClient.interceptors.request.use(
  (config) => {
    increment();

    if (!config.headers) {
      config.headers = new AxiosHeaders();
    }

    if (
      !config.headers.has("Content-Type") &&
      !config.headers.has("content-type")
    ) {
      config.headers.set("Content-Type", "application/json");
    }

    if (!config.headers.has("Accept") && !config.headers.has("accept")) {
      config.headers.set("Accept", "application/json");
    }

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

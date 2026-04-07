import axios, { AxiosHeaders } from "axios";
import { increment, decrement } from "../stores/loadingStore";
import { HTTP_STATUS } from "../constants/http";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api",
});

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

    if (error.response) {
      const status = error.response.status;

      if (
        [
          HTTP_STATUS.BAD_REQUEST,
          HTTP_STATUS.FORBIDDEN,
          HTTP_STATUS.INTERNAL_SERVER_ERROR,
        ].includes(status)
      ) {
        let message = "An unexpected error occurred.";

        if (status === HTTP_STATUS.BAD_REQUEST)
          message = "Bad Request. Please check your input.";
        if (status === HTTP_STATUS.FORBIDDEN)
          message =
            "Forbidden. You do not have permission to access this resource.";
        if (status === HTTP_STATUS.INTERNAL_SERVER_ERROR)
          message = "Internal Server Error. Something went wrong on our end.";

        // Redirect to the error page with the code and message
        window.location.href = `/error?code=${status}&message=${encodeURIComponent(
          message,
        )}&returnUrl=${encodeURIComponent(window.location.pathname)}`;
      }
    } else if (
      error.code === "ERR_CONNECTION_REFUSED" ||
      error.code === "ERR_NETWORK"
    ) {
      window.location.href = `/error?code=HTTP_STATUS.SERVICE_UNAVAILABLE&message=${encodeURIComponent(
        "Connection refused. The server might be offline.",
      )}&returnUrl=${encodeURIComponent(window.location.pathname)}`;
    }

    return Promise.reject(error);
  },
);

export default apiClient;

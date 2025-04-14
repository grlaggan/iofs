import axios from "axios";

const API_URL = "http://127.0.0.1:5000";

const $api = axios.create({
  withCredentials: true,
  baseURL: API_URL,
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

$api.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
  return config;
});

$api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response.status === 401 &&
      error.config &&
      !error.config._isRetry
    ) {
      originalRequest._isRetry = true;
      try {
        const response = await axios.post(
          "http://127.0.0.1:5000/api/login/refresh/",
          {},
          { withCredentials: true }
        );
        localStorage.setItem("token", response.data.access);
        return $api.request(originalRequest);
      } catch (error) {
        console.log(error);
      }
    }
  }
);

export default $api;

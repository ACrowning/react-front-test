import axios from "axios";

export const apiInstance = axios.create({
  baseURL: "http://localhost:4000/",
});

apiInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error("Request failed:", error);
    return Promise.reject(error);
  }
);

import axios from "axios";

const api = axios.create({
  baseURL: "https://your-api.com", // 你的 API 網址
  headers: {
    "Content-Type": "application/json",
  },
});

// 攔截請求，帶上 Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;

import axios from "axios";
import config from "../../config";

const api = axios.create({
    baseURL: config.apiBaseUrl,
    withCredentials: false, // ✅ FALSE since no cookies are used
    headers: {
        "App-Key": config.appKey, // ✅ your Laravel header
        "Content-Type": "application/json",
    },
});

// Optional: Interceptor to add token automatically if available
api.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  } else {
  }
  return req;
});
 
export const get = async (url, params = {}) => {
    try {
        const response = await api.get(url, { params });
        return response.data;
    } catch (err) {
        throw err.response?.data || { message: "Unknown error" };
    }
};

export default api;


export const fetchMe = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.warn("⚠️ fetchMe skipped: no token in localStorage");
    return null;
  }

  try {
    const response = await api.get("/me");
    return response.data;
  } catch (err) {
    console.error("❌ Failed to fetch user profile:", err.response?.data || err.message);
    return null;
  }
};




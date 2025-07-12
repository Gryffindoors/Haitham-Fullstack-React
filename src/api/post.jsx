import axios from "axios";
import config from "../../config";

const postApi = axios.create({
    baseURL: config.apiBaseUrl,
    withCredentials: false, // ✅ FALSE since no cookies are used
    headers: {
        "App-Key": config.appKey, // ✅ your Laravel header
        "Content-Type": "application/json",
    },
});

postApi.interceptors.request.use((req) => {
    const token = localStorage.getItem("token");
    if (token) req.headers.Authorization = `Bearer ${token}`;
    return req;
});

export const post = async (url, data = {}) => {
    try {
        const response = await postApi.post(url, data);
        return response.data;
    } catch (err) {
        throw err.response?.data || { message: "Unknown error" };
    }
};

export const put = async (url, data = {}) => {
    try {
        const response = await postApi.put(url, data);
        return response.data;
    } catch (err) {
        throw err.response?.data || { message: "Unknown error" };
    }
};
 
export const del = async (url) => {
    try {
        const response = await postApi.delete(url);
        return response.data;
    } catch (err) {
        throw err.response?.data || { message: "Unknown error" };
    }
};

export default postApi;

import axios from "axios";

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
});

// Add a request interceptor to attach the token from localStorage
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('zentropay-token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default API;
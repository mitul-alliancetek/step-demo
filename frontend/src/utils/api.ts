import axios from "axios";

const API_BASE_URL = "http://192.168.1.9:8000/api"; // Replace with your API URL

// Create an Axios instance
const ApiHelper = axios.create({
    baseURL: API_BASE_URL, // Change this to your API URL
    headers: {
        "Content-Type": "application/json",
    },
});


ApiHelper.interceptors.request.use(
    (config) => config,
    (error) => Promise.reject(error)
);

// Response Interceptor
ApiHelper.interceptors.response.use(
    (response) => response.data.data,
    (error) => {
        console.error("API Error:", error.response);
        if (error.response?.status === 401) {
            localStorage.removeItem("token");
            window.location.href = "/login"; // Redirect to login page
        }
        return Promise.reject(error);
    }
);

export default ApiHelper;
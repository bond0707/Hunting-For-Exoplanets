import axios from 'axios';

export const baseURL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
    baseURL: baseURL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    }
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.code === 'ECONNABORTED') {
            error.message = 'Request timeout - server is taking too long to respond';
        } else if (error.response) {
            const { status, data } = error.response;
            error.message = data.detail || `Server error: ${status}`;
        } else if (error.request) {
            error.message = 'No response from server - check if backend is running';
        }
        return Promise.reject(error);
    }
);

export default api;
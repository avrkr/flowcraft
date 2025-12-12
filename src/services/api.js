import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Create axios instance with base configuration
 */
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

/**
 * Request interceptor to add auth token
 */
api.interceptors.request.use(
    (config) => {
        const authStorage = localStorage.getItem('auth-storage');
        if (authStorage) {
            try {
                const { state } = JSON.parse(authStorage);
                if (state.token) {
                    config.headers.Authorization = `Bearer ${state.token}`;
                }
            } catch (error) {
                console.error('Error parsing auth storage:', error);
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

/**
 * Response interceptor to handle errors
 */
api.interceptors.response.use(
    (response) => response.data,
    (error) => {
        if (error.response) {
            // Handle 401 Unauthorized
            if (error.response.status === 401) {
                // Clear auth storage and redirect to login
                localStorage.removeItem('auth-storage');
                window.location.href = '/login';
            }

            return Promise.reject(error.response.data);
        } else if (error.request) {
            return Promise.reject({
                success: false,
                message: 'No response from server. Please check your connection.'
            });
        } else {
            return Promise.reject({
                success: false,
                message: error.message || 'An unexpected error occurred'
            });
        }
    }
);

export default api;

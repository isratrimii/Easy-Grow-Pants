import axios from 'axios';

// Django API Client
export const api = axios.create({
    baseURL: '/api', // Proxied by Vite
    headers: {
        'Content-Type': 'application/json',
    }
});

// Add interceptor to attach JWT token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// FastAPI Client (IoT)
export const iotApi = axios.create({
    baseURL: '/iot', // Proxied and rewritten by Vite
    headers: {
        'Content-Type': 'application/json',
    }
});

// Auth Helpers
export const setAuthToken = (access, refresh) => {
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
};

export const clearAuthToken = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
};

export const isAuthenticated = () => {
    return !!localStorage.getItem('access_token');
}

import axios from 'axios';

const getBaseURL = () => {
    let url = import.meta.env.VITE_API_URL;
    
    // Default to localhost if no env is provided
    if (!url) return 'http://localhost:5000/api/v1';
    
    // Ensure the protocol is present
    if (!url.startsWith('http')) {
        url = `https://${url}`;
    }

    // Ensure the URL ends with the versioning path if your backend requires it
    // This prevents "404 Not Found" if the VITE_API_URL is just the domain
    return url.endsWith('/api/v1') ? url : `${url}/api/v1`;
};

const api = axios.create({
    baseURL: getBaseURL(),
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    }
});

/**
 * OPTIONAL: Request Interceptor
 * If you find yourself manually calling getToken() in every component, 
 * you can add a logic here to inject the token into headers automatically.
 */
api.interceptors.request.use(async (config) => {
    // You can add logic here if needed
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;
import axios from 'axios';

const api = axios.create({
    // It checks if VITE_API_URL exists (on Render), otherwise falls back to local
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
    withCredentials: true
});

export default api;
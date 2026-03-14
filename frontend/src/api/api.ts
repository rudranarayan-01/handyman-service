import axios from 'axios';

const getBaseURL = () => {
    const url = import.meta.env.VITE_API_URL;
    if (!url) return 'http://localhost:5000/api/v1';
    
    // Safety check: ensure it starts with http
    return url.startsWith('http') ? url : `https://${url}`;
};

const api = axios.create({
    baseURL: getBaseURL(),
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    }
});

export default api;
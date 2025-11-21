import axios from 'axios';

// 1. Try to get the URL from the environment variable (Vercel)
// 2. If it doesn't exist (local dev), fall back to localhost
const API_URL = 'https://fortify-production-c31d.up.railway.app/';

const api = axios.create({
	baseURL: API_URL,
});

api.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem('token');
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

export default api;

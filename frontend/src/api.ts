import axios, { AxiosError } from 'axios';
import { config } from './config';
import { getUserFriendlyError } from './utils/errorHandler';

const api = axios.create({
	baseURL: config.apiUrl,
});

// Request interceptor - add auth token
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

// Response interceptor - handle errors globally
api.interceptors.response.use(
	(response) => response,
	(error: AxiosError) => {
		// Handle 401 Unauthorized - clear token and redirect to login
		if (error.response?.status === 401) {
			localStorage.removeItem('token');
			// Only redirect if not already on login page
			if (window.location.pathname !== '/login') {
				window.location.href = '/login';
			}
		}
		
		// Enhance error with user-friendly message
		const enhancedError = {
			...error,
			userMessage: getUserFriendlyError(error),
		};
		
		return Promise.reject(enhancedError);
	}
);

export default api;

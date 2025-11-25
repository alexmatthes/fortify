import axios, { AxiosError } from 'axios';
import { config } from '../config';
import { getUserFriendlyError } from '../utils/errorHandler';

const api = axios.create({
	baseURL: config.apiUrl,
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

api.interceptors.response.use(
	(response) => response,
	(error: AxiosError) => {
		if (error.response?.status === 401) {
			localStorage.removeItem('token');
			if (window.location.pathname !== '/login') {
				window.location.href = '/login';
			}
		}

		const enhancedError = {
			...error,
			userMessage: getUserFriendlyError(error),
		};

		return Promise.reject(enhancedError);
	}
);

export default api;

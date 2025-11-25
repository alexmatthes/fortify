import axios, { AxiosError } from 'axios';
import { config } from '../config';
import { getUserFriendlyError } from '../utils/errorHandler';

/**
 * Centralized Axios instance for all API requests
 *
 * This instance exists to provide a single, consistent configuration point for
 * all API calls throughout the application. By centralizing the base URL,
 * interceptors, and error handling, we ensure that all API requests follow the
 * same authentication pattern and error handling logic without requiring each
 * component to implement these concerns individually.
 */
const api = axios.create({
	baseURL: config.apiUrl,
});

/**
 * Request interceptor - automatically adds authentication token to all requests
 *
 * This interceptor exists to eliminate the need for manual token management in
 * every API call. Instead of each component fetching the token and adding it to
 * headers individually, this interceptor automatically attaches the Bearer token
 * from localStorage to every outgoing request. This ensures consistent
 * authentication across the entire application and reduces the chance of forgetting
 * to include the token in a request.
 *
 * @param {import('axios').InternalAxiosRequestConfig} config - The axios request configuration object
 * @returns {import('axios').InternalAxiosRequestConfig} The modified config with Authorization header if token exists
 * @param {unknown} error - Any error that occurs during request configuration
 * @returns {Promise<never>} Rejected promise with the error
 */
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

/**
 * Response interceptor - handles errors globally across all API responses
 *
 * This interceptor exists to provide centralized error handling and user experience
 * improvements. Instead of requiring each component to handle authentication failures
 * and network errors individually, this interceptor automatically:
 * - Detects 401 Unauthorized responses and redirects to login (preventing users from
 *   seeing cryptic errors when their session expires)
 * - Enhances all errors with user-friendly messages (improving UX by translating
 *   technical errors into actionable feedback)
 *
 * This centralized approach ensures consistent error handling behavior and reduces
 * code duplication across components.
 *
 * @param {import('axios').AxiosResponse} response - The successful axios response
 * @returns {import('axios').AxiosResponse} The unmodified response
 * @param {AxiosError} error - The axios error object containing response data
 * @returns {Promise<never>} Rejected promise with enhanced error containing userMessage property
 */
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

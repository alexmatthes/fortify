import { AxiosError } from 'axios';

/**
 * API Error response structure
 */
interface ApiErrorResponse {
	message: string;
	errors?: Array<{ field: string; message: string }>;
}

/**
 * Extract error message from API error response
 */
export const getErrorMessage = (error: unknown): string => {
	if (error instanceof Error) {
		// Check if it's an Axios error with a response
		if ('isAxiosError' in error && (error as AxiosError).response) {
			const axiosError = error as AxiosError<ApiErrorResponse>;
			const responseData = axiosError.response?.data;

			if (responseData?.message) {
				return responseData.message;
			}

			// Handle validation errors
			if (responseData?.errors && responseData.errors.length > 0) {
				return responseData.errors.map((e) => e.message).join(', ');
			}
		}

		// Fallback to error message
		return error.message;
	}

	return 'An unexpected error occurred';
};

/**
 * Check if error is a network error
 */
export const isNetworkError = (error: unknown): boolean => {
	if (error instanceof Error) {
		if ('isAxiosError' in error) {
			const axiosError = error as AxiosError;
			return !axiosError.response; // No response means network error
		}
	}
	return false;
};

/**
 * Get user-friendly error message
 */
export const getUserFriendlyError = (error: unknown): string => {
	if (isNetworkError(error)) {
		return 'Unable to connect to the server. Please check your internet connection.';
	}

	return getErrorMessage(error);
};








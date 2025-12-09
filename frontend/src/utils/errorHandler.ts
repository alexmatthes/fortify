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

	const message = getErrorMessage(error);

	// Map common error messages to user-friendly versions
	const errorMappings: Record<string, string> = {
		'Invalid email address': 'Please enter a valid email address',
		'Password must be at least 8 characters': 'Password must be at least 8 characters long',
		'Invalid Rudiment ID': 'Invalid exercise selected',
		'Routine not found': 'This routine could not be found',
		'Permission denied': 'You do not have permission to perform this action',
		'Invalid credentials': 'Email or password is incorrect',
		'User already exists': 'An account with this email already exists',
		'Invalid token': 'Your session has expired. Please log in again.',
		'Token expired': 'Your session has expired. Please log in again.',
	};

	// Check if we have a mapping for this error
	for (const [key, value] of Object.entries(errorMappings)) {
		if (message.toLowerCase().includes(key.toLowerCase())) {
			return value;
		}
	}

	return message;
};

/**
 * Extract field-specific validation errors
 */
export const getFieldErrors = (error: unknown): Record<string, string> => {
	const fieldErrors: Record<string, string> = {};

	if (error instanceof Error && 'isAxiosError' in error) {
		const axiosError = error as AxiosError<ApiErrorResponse>;
		const responseData = axiosError.response?.data;

		if (responseData?.errors) {
			responseData.errors.forEach((err) => {
				if (err.field) {
					fieldErrors[err.field] = err.message;
				}
			});
		}
	}

	return fieldErrors;
};









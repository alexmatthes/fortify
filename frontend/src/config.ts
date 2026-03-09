/**
 * Frontend configuration
 * Centralizes environment variables and configuration values
 */

interface Config {
	apiUrl: string;
	nodeEnv: string;
	posthogKey?: string;
}

/**
 * Get API URL from environment variable or fallback to localhost
 */
function getApiUrl(): string {
	// Check for environment variable first (for production)
	if (process.env.REACT_APP_API_URL) {
		return process.env.REACT_APP_API_URL;
	}

	// Fallback to localhost for development
	return 'http://localhost:8000/api';
}

export const config: Config = {
	apiUrl: getApiUrl(),
	nodeEnv: process.env.NODE_ENV || 'development',
	posthogKey: process.env.REACT_APP_POSTHOG_KEY,
};

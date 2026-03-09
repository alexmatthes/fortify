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

// #region agent log
// Debug config to verify API URL in runtime (hypotheses H1, H2)
if (typeof fetch !== 'undefined') {
	fetch('http://127.0.0.1:7715/ingest/8d13aa7d-0203-4965-9be6-fc4d88683c89', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'X-Debug-Session-Id': '21fd50',
		},
		body: JSON.stringify({
			sessionId: '21fd50',
			runId: 'pre-fix',
			hypothesisId: 'H1',
			location: 'frontend/src/config.ts:config',
			message: 'Frontend config resolved',
			data: {
				apiUrl: config.apiUrl,
				nodeEnv: config.nodeEnv,
				hasPosthogKey: !!config.posthogKey,
			},
			timestamp: Date.now(),
		}),
	}).catch(() => {});
}
// #endregion

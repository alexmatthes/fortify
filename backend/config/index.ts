import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Configuration interface for type safety
 */
interface Config {
	port: number;
	jwtSecret: string;
	databaseUrl: string;
	nodeEnv: string;
	frontendUrl?: string;
	corsOrigins: string[];
}

/**
 * Validates and returns application configuration
 * Throws error if required environment variables are missing
 */
function getConfig(): Config {
	const jwtSecret = process.env.JWT_SECRET;
	if (!jwtSecret) {
		throw new Error('JWT_SECRET environment variable is required');
	}

	const databaseUrl = process.env.DATABASE_URL;
	if (!databaseUrl) {
		throw new Error('DATABASE_URL environment variable is required');
	}

	const port = parseInt(process.env.PORT || '8000', 10);
	if (isNaN(port)) {
		throw new Error('PORT must be a valid number');
	}

	const nodeEnv = process.env.NODE_ENV || 'development';

	// Build CORS origins array
	const corsOrigins: string[] = [
		'http://localhost:3000', // Local development
		'https://fortifydrums.com', // Production (Root)
		'https://www.fortifydrums.com', // Production (WWW)
	];

	// Add FRONTEND_URL if provided
	if (process.env.FRONTEND_URL) {
		corsOrigins.push(process.env.FRONTEND_URL);
	}

	return {
		port,
		jwtSecret,
		databaseUrl,
		nodeEnv,
		frontendUrl: process.env.FRONTEND_URL,
		corsOrigins,
	};
}

// Export validated config
export const config = getConfig();












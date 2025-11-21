"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables
dotenv_1.default.config();
/**
 * Validates and returns application configuration
 * Throws error if required environment variables are missing
 */
function getConfig() {
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
    const corsOrigins = [
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
exports.config = getConfig();

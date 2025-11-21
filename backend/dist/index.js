"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const config_1 = require("./config");
const errorHandler_1 = require("./middleware/errorHandler");
// Import Routes
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const dashboardRoutes_1 = __importDefault(require("./routes/dashboardRoutes"));
const rudimentRoutes_1 = __importDefault(require("./routes/rudimentRoutes"));
const sessionRoutes_1 = __importDefault(require("./routes/sessionRoutes"));
const app = (0, express_1.default)();
// CORS configuration
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or Postman)
        if (!origin)
            return callback(null, true);
        if (config_1.config.corsOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            if (config_1.config.nodeEnv === 'development') {
                console.log('Blocked by CORS:', origin);
            }
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));
app.use(express_1.default.json());
// Health check endpoint
app.get('/', (req, res) => {
    res.json({ message: 'Fortify API is running', environment: config_1.config.nodeEnv });
});
// API Routes
app.use('/api/auth', authRoutes_1.default);
app.use('/api/rudiments', rudimentRoutes_1.default);
app.use('/api/sessions', sessionRoutes_1.default);
app.use('/api/dashboard', dashboardRoutes_1.default);
// Error handling middleware (must be last)
app.use(errorHandler_1.errorHandler);
// Start server
const server = app.listen(config_1.config.port, () => {
    console.log(`Server is running on http://localhost:${config_1.config.port}`);
    console.log(`Environment: ${config_1.config.nodeEnv}`);
});
// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
    });
});
process.on('SIGINT', () => {
    console.log('SIGINT signal received: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
    });
});

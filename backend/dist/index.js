"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const helmet_1 = __importDefault(require("helmet"));
const path_1 = __importDefault(require("path"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const yamljs_1 = __importDefault(require("yamljs"));
const config_1 = require("./config");
const errorHandler_1 = require("./middleware/errorHandler");
const logger_1 = __importDefault(require("./utils/logger"));
// Import Routes
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const dashboardRoutes_1 = __importDefault(require("./routes/dashboardRoutes"));
const routineRoutes_1 = __importDefault(require("./routes/routineRoutes"));
const rudimentRoutes_1 = __importDefault(require("./routes/rudimentRoutes"));
const sessionRoutes_1 = __importDefault(require("./routes/sessionRoutes"));
const app = (0, express_1.default)();
// Load Swagger - Use path.join for safety
const swaggerDocument = yamljs_1.default.load(path_1.default.join(__dirname, './swagger.yaml'));
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocument));
app.set('trust proxy', 1);
// CORS configuration
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin)
            return callback(null, true);
        if (config_1.config.corsOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            // Use logger instead of console.log
            if (config_1.config.nodeEnv === 'development') {
                logger_1.default.warn(`Blocked by CORS: ${origin}`);
            }
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));
app.use((0, helmet_1.default)());
const globalLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});
const authLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: 'Too many authentication attempts, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});
app.use(globalLimiter);
app.use(express_1.default.json());
app.get('/', (req, res) => {
    res.json({ message: 'Fortify API is running', environment: config_1.config.nodeEnv });
});
app.use('/api/auth', authLimiter, authRoutes_1.default);
app.use('/api/rudiments', rudimentRoutes_1.default);
app.use('/api/sessions', sessionRoutes_1.default);
app.use('/api/dashboard', dashboardRoutes_1.default);
app.use('/api/routines', routineRoutes_1.default);
// Start server
const server = app.listen(config_1.config.port, () => {
    // Use logger.info
    logger_1.default.info(`Server is running on http://localhost:${config_1.config.port}`);
    logger_1.default.info(`Environment: ${config_1.config.nodeEnv}`);
});
// Graceful shutdown
process.on('SIGTERM', () => {
    logger_1.default.info('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        logger_1.default.info('HTTP server closed');
        process.exit(0);
    });
});
process.on('SIGINT', () => {
    logger_1.default.info('SIGINT signal received: closing HTTP server');
    server.close(() => {
        logger_1.default.info('HTTP server closed');
        process.exit(0);
    });
});
app.use(errorHandler_1.errorHandler);

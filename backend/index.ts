import cors from 'cors';
import express, { Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import { config } from './config';
import { errorHandler } from './middleware/errorHandler';
import logger from './utils/logger';

// Import Routes
import authRoutes from './routes/authRoutes';
import dashboardRoutes from './routes/dashboardRoutes';
import routineRoutes from './routes/routineRoutes';
import rudimentRoutes from './routes/rudimentRoutes';
import sessionRoutes from './routes/sessionRoutes';

const app = express();

// Load Swagger - Use path.join for safety
const swaggerDocument = YAML.load(path.join(__dirname, './swagger.yaml'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.set('trust proxy', 1);

// CORS configuration
app.use(
	cors({
		origin: (origin, callback) => {
			if (!origin) return callback(null, true);

			if (config.corsOrigins.includes(origin)) {
				callback(null, true);
			} else {
				// Use logger instead of console.log
				if (config.nodeEnv === 'development') {
					logger.warn(`Blocked by CORS: ${origin}`);
				}
				callback(new Error('Not allowed by CORS'));
			}
		},
		credentials: true,
	})
);

app.use(helmet());

const globalLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 100,
	message: 'Too many requests from this IP, please try again later.',
	standardHeaders: true,
	legacyHeaders: false,
});

const authLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 5,
	message: 'Too many authentication attempts, please try again later.',
	standardHeaders: true,
	legacyHeaders: false,
});

app.use(globalLimiter);
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
	res.json({ message: 'Fortify API is running', environment: config.nodeEnv });
});

app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/rudiments', rudimentRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/routines', routineRoutes);

// Start server
const server = app.listen(config.port, () => {
	// Use logger.info
	logger.info(`Server is running on http://localhost:${config.port}`);
	logger.info(`Environment: ${config.nodeEnv}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
	logger.info('SIGTERM signal received: closing HTTP server');
	server.close(() => {
		logger.info('HTTP server closed');
		process.exit(0);
	});
});

process.on('SIGINT', () => {
	logger.info('SIGINT signal received: closing HTTP server');
	server.close(() => {
		logger.info('HTTP server closed');
		process.exit(0);
	});
});

app.use(errorHandler);

import cors from 'cors';
import express, { Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import { config } from './config';
import { errorHandler } from './middleware/errorHandler';

// Import Routes
import authRoutes from './routes/authRoutes';
import dashboardRoutes from './routes/dashboardRoutes';
import routineRoutes from './routes/routineRoutes';
import rudimentRoutes from './routes/rudimentRoutes';
import sessionRoutes from './routes/sessionRoutes';

const app = express();

const swaggerDocument = YAML.load('./swagger.yaml');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.set('trust proxy', 1);

// CORS configuration
app.use(
	cors({
		origin: (origin, callback) => {
			// Allow requests with no origin (like mobile apps or Postman)
			if (!origin) return callback(null, true);

			if (config.corsOrigins.includes(origin)) {
				callback(null, true);
			} else {
				if (config.nodeEnv === 'development') {
					console.log('Blocked by CORS:', origin);
				}
				callback(new Error('Not allowed by CORS'));
			}
		},
		credentials: true,
	})
);

// Security middleware: Helmet for security headers
app.use(helmet());

// Rate limiting configuration
const globalLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per windowMs
	message: 'Too many requests from this IP, please try again later.',
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Stricter rate limiter for auth routes
const authLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 5, // Limit each IP to 5 requests per windowMs
	message: 'Too many authentication attempts, please try again later.',
	standardHeaders: true,
	legacyHeaders: false,
});

// Apply global rate limiter to all requests
app.use(globalLimiter);

app.use(express.json());

// Health check endpoint
app.get('/', (req: Request, res: Response) => {
	res.json({ message: 'Fortify API is running', environment: config.nodeEnv });
});

// API Routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/rudiments', rudimentRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/routines', routineRoutes);

// Start server
const server = app.listen(config.port, () => {
	console.log(`Server is running on http://localhost:${config.port}`);
	console.log(`Environment: ${config.nodeEnv}`);
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

// Error handling middleware (must be last)
app.use(errorHandler);

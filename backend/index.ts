import cors from 'cors';
import express, { Request, Response } from 'express';
import { config } from './config';
import { errorHandler } from './middleware/errorHandler';

// Import Routes
import authRoutes from './routes/authRoutes';
import dashboardRoutes from './routes/dashboardRoutes';
import rudimentRoutes from './routes/rudimentRoutes';
import sessionRoutes from './routes/sessionRoutes';

const app = express();

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

app.use(express.json());

// Health check endpoint
app.get('/', (req: Request, res: Response) => {
	res.json({ message: 'Fortify API is running', environment: config.nodeEnv });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/rudiments', rudimentRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Error handling middleware (must be last)
app.use(errorHandler);

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

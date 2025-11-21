import dotenv from 'dotenv';
dotenv.config();

import cors from 'cors';
import express, { Request, Response } from 'express';

// Import Routes
import authRoutes from './routes/authRoutes';
import rudimentRoutes from './routes/rudimentRoutes';
import sessionRoutes from './routes/sessionRoutes';

const app = express();
const PORT = process.env.PORT || 8000;

// Define ALL allowed origins
const allowedOrigins = [
	'http://localhost:3000', // Local development
	'https://fortifydrums.com', // Production (Root)
	'https://www.fortifydrums.com', // Production (WWW) - This was likely missing!
	process.env.FRONTEND_URL, // Fallback from Railway Variable
];

app.use(
	cors({
		origin: (origin, callback) => {
			// Allow requests with no origin (like mobile apps or Postman)
			if (!origin) return callback(null, true);

			if (allowedOrigins.includes(origin)) {
				callback(null, true);
			} else {
				console.log('Blocked by CORS:', origin); // Log the blocked origin for debugging
				callback(new Error('Not allowed by CORS'));
			}
		},
		credentials: true, // Important if you ever use cookies/sessions
	})
);

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
	res.send('Hello from the Fortify API!');
});

app.use('/api/auth', authRoutes);
app.use('/api/rudiments', rudimentRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/dashboard', sessionRoutes);

app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});

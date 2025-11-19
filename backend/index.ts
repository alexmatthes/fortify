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

app.use(cors());
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
	res.send('Hello from the Fortify API!');
});

app.use('/api/auth', authRoutes);
app.use('/api/rudiments', rudimentRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/dashboard', sessionRoutes); // Re-using sessionRoutes logic

app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});

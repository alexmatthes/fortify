import { Request, Response } from 'express';
import { AuthService } from '../services/authService';

export const signup = async (req: Request, res: Response) => {
	// 1. Extract data
	const { email, password } = req.body;

	// 2. Call Service
	const user = await AuthService.signup({ email, password });

	// 3. Send Response
	res.status(201).json(user);
};

export const login = async (req: Request, res: Response) => {
	// 1. Extract data
	const { email, password } = req.body;

	// 2. Call Service
	const result = await AuthService.login({ email, password });

	// 3. Send Response
	res.status(200).json(result);
};

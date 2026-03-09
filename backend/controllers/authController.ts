import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
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

export const getProfile = async (req: AuthRequest, res: Response) => {
	const user = await AuthService.getProfile(req.userId!);
	res.status(200).json(user);
};

export const changePassword = async (req: AuthRequest, res: Response) => {
	const { currentPassword, newPassword } = req.body;
	await AuthService.changePassword(req.userId!, currentPassword, newPassword);
	res.status(200).json({ message: 'Password changed successfully' });
};

export const deleteAccount = async (req: AuthRequest, res: Response) => {
	const { password } = req.body;
	await AuthService.deleteAccount(req.userId!, password);
	res.status(200).json({ message: 'Account deleted successfully' });
};

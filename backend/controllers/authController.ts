import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { AuthService } from '../services/authService';

export const signup = async (req: Request, res: Response) => {
	// 1. Extract data
	const { email, password } = req.body;

	// #region agent log
	// Backend signup entry (hypotheses H3, H4)
	if (typeof fetch !== 'undefined') {
		fetch('http://127.0.0.1:7715/ingest/8d13aa7d-0203-4965-9be6-fc4d88683c89', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'X-Debug-Session-Id': '21fd50',
			},
			body: JSON.stringify({
				sessionId: '21fd50',
				runId: 'pre-fix',
				hypothesisId: 'H4',
				location: 'backend/controllers/authController.ts:signup',
				message: 'Signup request received',
				data: {
					hasEmail: !!email,
					path: req.path,
					method: req.method,
				},
				timestamp: Date.now(),
			}),
		}).catch(() => {});
	}
	// #endregion

	// 2. Call Service
	const user = await AuthService.signup({ email, password });

	// 3. Send Response
	res.status(201).json(user);
};

export const login = async (req: Request, res: Response) => {
	// 1. Extract data
	const { email, password } = req.body;

	// #region agent log
	// Backend login entry (hypotheses H3, H5)
	if (typeof fetch !== 'undefined') {
		fetch('http://127.0.0.1:7715/ingest/8d13aa7d-0203-4965-9be6-fc4d88683c89', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'X-Debug-Session-Id': '21fd50',
			},
			body: JSON.stringify({
				sessionId: '21fd50',
				runId: 'pre-fix',
				hypothesisId: 'H3',
				location: 'backend/controllers/authController.ts:login',
				message: 'Login request received',
				data: {
					hasEmail: !!email,
					path: req.path,
					method: req.method,
				},
				timestamp: Date.now(),
			}),
		}).catch(() => {});
	}
	// #endregion

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

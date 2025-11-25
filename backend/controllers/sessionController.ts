import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { SessionService } from '../services/sessionService';

export const logSession = async (req: AuthRequest, res: Response) => {
	const session = await SessionService.logSession({
		...req.body,
		userId: req.userId!,
	});
	res.status(201).json(session);
};

export const getConsistencyData = async (req: AuthRequest, res: Response) => {
	const history = await SessionService.getConsistencyData(req.userId!);
	res.status(200).json(history);
};

export const getVelocityData = async (req: AuthRequest, res: Response) => {
	const velocity = await SessionService.getVelocityData(req.userId!);
	res.status(200).json(velocity);
};

export const getAllSessions = async (req: AuthRequest, res: Response) => {
	const page = parseInt(req.query.page as string) || 1;
	const limit = parseInt(req.query.limit as string) || 20;

	const result = await SessionService.getAll(req.userId!, page, limit);
	res.status(200).json(result);
};

export const getDashboardStats = async (req: AuthRequest, res: Response) => {
	const stats = await SessionService.getDashboardStats(req.userId!);
	res.status(200).json(stats);
};

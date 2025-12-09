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

	const filters: any = {};
	if (req.query.rudimentId) filters.rudimentId = req.query.rudimentId as string;
	if (req.query.quality) filters.quality = parseInt(req.query.quality as string);
	if (req.query.startDate) filters.startDate = new Date(req.query.startDate as string);
	if (req.query.endDate) filters.endDate = new Date(req.query.endDate as string);
	if (req.query.search) filters.search = req.query.search as string;

	const result = await SessionService.getAll(req.userId!, page, limit, filters);
	res.status(200).json(result);
};

export const exportSessions = async (req: AuthRequest, res: Response) => {
	const format = (req.query.format as 'csv' | 'json') || 'csv';

	const filters: any = {};
	if (req.query.rudimentId) filters.rudimentId = req.query.rudimentId as string;
	if (req.query.quality) filters.quality = parseInt(req.query.quality as string);
	if (req.query.startDate) filters.startDate = new Date(req.query.startDate as string);
	if (req.query.endDate) filters.endDate = new Date(req.query.endDate as string);
	if (req.query.search) filters.search = req.query.search as string;

	const data = await SessionService.exportSessions(req.userId!, format, filters);

	if (format === 'csv') {
		res.setHeader('Content-Type', 'text/csv');
		res.setHeader('Content-Disposition', 'attachment; filename=sessions.csv');
	} else {
		res.setHeader('Content-Type', 'application/json');
		res.setHeader('Content-Disposition', 'attachment; filename=sessions.json');
	}

	res.status(200).send(data);
};

export const getDashboardStats = async (req: AuthRequest, res: Response) => {
	const stats = await SessionService.getDashboardStats(req.userId!);
	res.status(200).json(stats);
};

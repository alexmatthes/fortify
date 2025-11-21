import { Response } from 'express';
import { prisma } from '../lib/prisma';
import { AuthRequest } from '../middleware/auth';
import { AuthorizationError } from '../types/errors';

/**
 * Get consistency data (practice history) for heatmap visualization
 */
export const getConsistencyData = async (req: AuthRequest, res: Response) => {
	if (!req.userId) {
		throw new AuthorizationError('User ID is required.');
	}

	// Fetch all sessions for the user (just date and duration)
	const sessions = await prisma.practiceSession.findMany({
		where: { userId: req.userId },
		select: { date: true, duration: true },
	});

	// Aggregate minutes by date (YYYY-MM-DD)
	const historyMap: Record<string, number> = {};

	sessions.forEach((session) => {
		// Split ISO string to get just the date part (e.g., "2025-11-20")
		const dateKey = session.date.toISOString().split('T')[0];

		if (!historyMap[dateKey]) {
			historyMap[dateKey] = 0;
		}
		historyMap[dateKey] += session.duration;
	});

	// Convert to array format for the frontend
	const history = Object.keys(historyMap).map((date) => ({
		date,
		count: historyMap[date], // 'count' = total minutes that day
	}));

	res.status(200).json(history);
};

/**
 * Log a new practice session
 */
export const logSession = async (req: AuthRequest, res: Response) => {
	const { rudimentId, duration, tempo } = req.body;

	if (!req.userId) {
		throw new AuthorizationError('User ID is required.');
	}

	const newSession = await prisma.practiceSession.create({
		data: {
			duration, // Zod has already validated these are numbers!
			tempo,
			userId: req.userId,
			rudimentId,
		},
	});
	
	res.status(201).json(newSession);
};

/**
 * Get all practice sessions for the authenticated user
 */
export const getAllSessions = async (req: AuthRequest, res: Response) => {
	if (!req.userId) {
		throw new AuthorizationError('User ID is required.');
	}

	const sessions = await prisma.practiceSession.findMany({
		where: { userId: req.userId },
		orderBy: { date: 'desc' },
	});
	
	res.status(200).json(sessions);
};

/**
 * Get dashboard statistics (total time, fastest tempo, most practiced rudiment)
 */
export const getDashboardStats = async (req: AuthRequest, res: Response) => {
	if (!req.userId) {
		throw new AuthorizationError('User ID is required.');
	}

	const statsAggregated = await prisma.practiceSession.aggregate({
		where: { userId: req.userId },
		_sum: { duration: true },
		_max: { tempo: true },
	});

	const statsMostPracticed = await prisma.practiceSession.groupBy({
		by: ['rudimentId'],
		where: { userId: req.userId },
		_count: { id: true },
		orderBy: { _count: { id: 'desc' } },
		take: 1,
	});

	let mostPracticedName = 'N/A';
	if (statsMostPracticed.length > 0) {
		const rudiment = await prisma.rudiment.findUnique({
			where: { id: statsMostPracticed[0].rudimentId },
		});
		if (rudiment) mostPracticedName = rudiment.name;
	}

	res.status(200).json({
		totalTime: statsAggregated._sum.duration || 0,
		fastestTempo: statsAggregated._max.tempo || 0,
		mostPracticed: mostPracticedName,
	});
};

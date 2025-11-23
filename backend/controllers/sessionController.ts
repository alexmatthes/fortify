import { PracticeSession } from '@prisma/client';
import { Response } from 'express';
import { prisma } from '../lib/prisma';
import { AuthRequest } from '../middleware/auth';
import { AuthorizationError } from '../types/errors';

// Input interfaces
interface LogSessionInput {
	rudimentId: string;
	duration: number;
	tempo: number;
	quality: number;
	userId: string;
}

interface GetConsistencyDataInput {
	userId: string;
}

interface GetAllSessionsInput {
	userId: string;
}

interface GetDashboardStatsInput {
	userId: string;
}

// Result interfaces
interface LogSessionResult {
	session: PracticeSession;
}

interface GetConsistencyDataResult {
	history: Array<{ date: Date; duration: number }>; // Changed to return raw session data
}

interface GetAllSessionsResult {
	sessions: PracticeSession[];
	pagination: { page: number; limit: number; total: number; totalPages: number };
}

interface GetDashboardStatsResult {
	totalTime: number;
	fastestTempo: number;
	mostPracticed: string;
}

/**
 * Business logic: Log a new practice session
 */
async function logSessionLogic(input: LogSessionInput): Promise<LogSessionResult> {
	if (!input.userId) throw new AuthorizationError('User ID is required.');

	const session = await prisma.practiceSession.create({
		data: {
			duration: input.duration,
			tempo: input.tempo,
			quality: input.quality,
			userId: input.userId,
			rudimentId: input.rudimentId,
		},
	});

	return { session };
}

/**
 * Business logic: Get consistency data (practice history) for heatmap visualization
 * FIX: Returns raw data so frontend can handle local timezones
 */
async function getConsistencyDataLogic(input: GetConsistencyDataInput): Promise<GetConsistencyDataResult> {
	if (!input.userId) throw new AuthorizationError('User ID is required.');

	const sessions = await prisma.practiceSession.findMany({
		where: { userId: input.userId },
		select: { date: true, duration: true },
	});

	// We return the raw list now. Aggregation happens on the frontend.
	return { history: sessions };
}

/**
 * Business logic: Get all practice sessions for the authenticated user
 * FIX: Added pagination logic
 */
async function getAllSessionsLogic(input: GetAllSessionsInput, page: number = 1, limit: number = 20): Promise<GetAllSessionsResult> {
	if (!input.userId) throw new AuthorizationError('User ID is required.');

	const skip = (page - 1) * limit;

	const sessions = await prisma.practiceSession.findMany({
		where: { userId: input.userId },
		orderBy: { date: 'desc' },
		take: limit,
		skip: skip,
		include: { rudiment: true },
	});

	const total = await prisma.practiceSession.count({ where: { userId: input.userId } });

	return {
		sessions,
		pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
	};
}

/**
 * Business logic: Get dashboard statistics
 */
async function getDashboardStatsLogic(input: GetDashboardStatsInput): Promise<GetDashboardStatsResult> {
	if (!input.userId) throw new AuthorizationError('User ID is required.');

	const statsAggregated = await prisma.practiceSession.aggregate({
		where: { userId: input.userId },
		_sum: { duration: true },
		_max: { tempo: true },
	});

	const statsMostPracticed = await prisma.practiceSession.groupBy({
		by: ['rudimentId'],
		where: { userId: input.userId },
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

	return {
		totalTime: statsAggregated._sum.duration || 0,
		fastestTempo: statsAggregated._max.tempo || 0,
		mostPracticed: mostPracticedName,
	};
}

/**
 * Express handler: Log a new practice session
 */
export async function logSession(req: AuthRequest, res: Response) {
	if (!req.userId) throw new AuthorizationError('User ID is required.');

	const input: LogSessionInput = {
		rudimentId: req.body.rudimentId,
		duration: req.body.duration,
		tempo: req.body.tempo,
		quality: req.body.quality,
		userId: req.userId,
	};

	const result = await logSessionLogic(input);
	res.status(201).json(result.session);
}

/**
 * Express handler: Get consistency data
 */
export const getConsistencyData = async (req: AuthRequest, res: Response) => {
	if (!req.userId) throw new AuthorizationError('User ID is required.');

	const input: GetConsistencyDataInput = {
		userId: req.userId,
	};

	const result = await getConsistencyDataLogic(input);
	res.status(200).json(result.history);
};

/**
 * Express handler: Get all practice sessions (Paginated)
 */
export const getAllSessions = async (req: AuthRequest, res: Response) => {
	if (!req.userId) throw new AuthorizationError('User ID is required.');

	const page = parseInt(req.query.page as string) || 1;
	const limit = parseInt(req.query.limit as string) || 20;

	const input: GetAllSessionsInput = {
		userId: req.userId,
	};

	const result = await getAllSessionsLogic(input, page, limit);
	res.status(200).json(result); // Returns { data: sessions, pagination: ... }
};

/**
 * NEW Express Handler: Get Velocity Data (Lightweight)
 */
export const getVelocityData = async (req: AuthRequest, res: Response) => {
	if (!req.userId) throw new AuthorizationError('User ID is required.');

	const sessions = await prisma.practiceSession.findMany({
		where: { userId: req.userId },
		select: { date: true, tempo: true },
		orderBy: { date: 'asc' },
	});

	res.status(200).json(sessions);
};

/**
 * Express handler: Get dashboard statistics
 */
export async function getDashboardStats(req: AuthRequest, res: Response) {
	if (!req.userId) throw new AuthorizationError('User ID is required.');

	const input: GetDashboardStatsInput = {
		userId: req.userId,
	};

	const result = await getDashboardStatsLogic(input);
	res.status(200).json({
		totalTime: result.totalTime,
		fastestTempo: result.fastestTempo,
		mostPracticed: result.mostPracticed,
	});
}

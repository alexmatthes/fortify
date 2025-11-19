import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

interface AuthRequest extends Request {
	userId?: string;
}

export constVB logSession = async (req: AuthRequest, res: Response) => {
	try {
		const { rudimentId, duration, tempo } = req.body;
        
		const newSession = await prisma.practiceSession.create({
			data: {
				duration, // Zod has already validated these are numbers!
				tempo,
				userId: req.userId!,
				rudimentId,
			},
		});
		res.status(201).json(newSession);
	} catch (error: any) {
		res.status(500).json({ message: 'Error logging session.', error: error.message });
	}
};

export const getAllSessions = async (req: AuthRequest, res: Response) => {
	try {
		const sessions = await prisma.practiceSession.findMany({
			where: { userId: req.userId },
			orderBy: { date: 'desc' },
		});
		res.status(200).json(sessions);
	} catch (error: any) {
		res.status(500).json({ message: 'Error fetching sessions.', error: error.message });
	}
};

export const getDashboardStats = async (req: AuthRequest, res: Response) => {
	try {
        // Note: Prisma aggregates can be tricky in TS, but this standard usage usually works
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
	} catch (error: any) {
		res.status(500).json({ message: 'Error fetching stats.', error: error.message });
	}
};
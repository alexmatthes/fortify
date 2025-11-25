import { prisma } from '../lib/prisma';

interface LogSessionInput {
	rudimentId: string;
	duration: number;
	tempo: number;
	quality: number;
	userId: string;
}

export const SessionService = {
	async logSession(data: LogSessionInput) {
		return prisma.practiceSession.create({
			data,
		});
	},

	async getConsistencyData(userId: string) {
		return prisma.practiceSession.findMany({
			where: { userId },
			select: { date: true, duration: true },
		});
	},

	async getVelocityData(userId: string) {
		return prisma.practiceSession.findMany({
			where: { userId },
			select: { date: true, tempo: true },
			orderBy: { date: 'asc' },
		});
	},

	async getAll(userId: string, page: number = 1, limit: number = 20) {
		const skip = (page - 1) * limit;

		const [sessions, total] = await Promise.all([
			prisma.practiceSession.findMany({
				where: { userId },
				orderBy: { date: 'desc' },
				take: limit,
				skip,
				include: { rudiment: true },
			}),
			prisma.practiceSession.count({ where: { userId } }),
		]);

		return {
			sessions,
			pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
		};
	},

	async getDashboardStats(userId: string) {
		const statsAggregated = await prisma.practiceSession.aggregate({
			where: { userId },
			_sum: { duration: true },
			_max: { tempo: true },
		});

		const statsMostPracticed = await prisma.practiceSession.groupBy({
			by: ['rudimentId'],
			where: { userId },
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
	},
};

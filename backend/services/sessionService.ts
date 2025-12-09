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

	async getAll(userId: string, page: number = 1, limit: number = 20, filters?: { rudimentId?: string; quality?: number; startDate?: Date; endDate?: Date; search?: string }) {
		const skip = (page - 1) * limit;

		const where: any = { userId };

		if (filters?.rudimentId) {
			where.rudimentId = filters.rudimentId;
		}

		if (filters?.quality !== undefined) {
			where.quality = filters.quality;
		}

		if (filters?.startDate || filters?.endDate) {
			where.date = {};
			if (filters.startDate) where.date.gte = filters.startDate;
			if (filters.endDate) where.date.lte = filters.endDate;
		}

		if (filters?.search) {
			where.rudiment = {
				name: {
					contains: filters.search,
					mode: 'insensitive',
				},
			};
		}

		const [sessions, total] = await Promise.all([
			prisma.practiceSession.findMany({
				where,
				orderBy: { date: 'desc' },
				take: limit,
				skip,
				include: { rudiment: true },
			}),
			prisma.practiceSession.count({ where }),
		]);

		return {
			sessions,
			pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
		};
	},

	async exportSessions(userId: string, format: 'csv' | 'json', filters?: { rudimentId?: string; quality?: number; startDate?: Date; endDate?: Date; search?: string }) {
		const where: any = { userId };

		if (filters?.rudimentId) {
			where.rudimentId = filters.rudimentId;
		}

		if (filters?.quality !== undefined) {
			where.quality = filters.quality;
		}

		if (filters?.startDate || filters?.endDate) {
			where.date = {};
			if (filters.startDate) where.date.gte = filters.startDate;
			if (filters.endDate) where.date.lte = filters.endDate;
		}

		if (filters?.search) {
			where.rudiment = {
				name: {
					contains: filters.search,
					mode: 'insensitive',
				},
			};
		}

		const sessions = await prisma.practiceSession.findMany({
			where,
			orderBy: { date: 'desc' },
			include: { rudiment: true },
		});

		if (format === 'csv') {
			const headers = ['Date', 'Rudiment', 'Duration (min)', 'Tempo (BPM)', 'Quality'];
			const rows = sessions.map((s) => [
				s.date.toISOString().split('T')[0],
				s.rudiment.name,
				s.duration.toString(),
				s.tempo.toString(),
				s.quality.toString(),
			]);
			return headers.join(',') + '\n' + rows.map((r) => r.join(',')).join('\n');
		} else {
			return JSON.stringify(sessions, null, 2);
		}
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

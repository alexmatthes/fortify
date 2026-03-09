"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionService = void 0;
const prisma_1 = require("../lib/prisma");
exports.SessionService = {
    async logSession(data) {
        return prisma_1.prisma.practiceSession.create({
            data,
        });
    },
    async getConsistencyData(userId) {
        return prisma_1.prisma.practiceSession.findMany({
            where: { userId },
            select: { date: true, duration: true },
        });
    },
    async getVelocityData(userId) {
        return prisma_1.prisma.practiceSession.findMany({
            where: { userId },
            select: { date: true, tempo: true },
            orderBy: { date: 'asc' },
        });
    },
    async getAll(userId, page = 1, limit = 20, filters) {
        const skip = (page - 1) * limit;
        const where = { userId };
        if (filters?.rudimentId) {
            where.rudimentId = filters.rudimentId;
        }
        if (filters?.quality !== undefined) {
            where.quality = filters.quality;
        }
        if (filters?.startDate || filters?.endDate) {
            where.date = {};
            if (filters.startDate)
                where.date.gte = filters.startDate;
            if (filters.endDate)
                where.date.lte = filters.endDate;
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
            prisma_1.prisma.practiceSession.findMany({
                where,
                orderBy: { date: 'desc' },
                take: limit,
                skip,
                include: { rudiment: true },
            }),
            prisma_1.prisma.practiceSession.count({ where }),
        ]);
        return {
            sessions,
            pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
        };
    },
    async exportSessions(userId, format, filters) {
        const where = { userId };
        if (filters?.rudimentId) {
            where.rudimentId = filters.rudimentId;
        }
        if (filters?.quality !== undefined) {
            where.quality = filters.quality;
        }
        if (filters?.startDate || filters?.endDate) {
            where.date = {};
            if (filters.startDate)
                where.date.gte = filters.startDate;
            if (filters.endDate)
                where.date.lte = filters.endDate;
        }
        if (filters?.search) {
            where.rudiment = {
                name: {
                    contains: filters.search,
                    mode: 'insensitive',
                },
            };
        }
        const sessions = await prisma_1.prisma.practiceSession.findMany({
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
        }
        else {
            return JSON.stringify(sessions, null, 2);
        }
    },
    async getDashboardStats(userId) {
        const statsAggregated = await prisma_1.prisma.practiceSession.aggregate({
            where: { userId },
            _sum: { duration: true },
            _max: { tempo: true },
        });
        const statsMostPracticed = await prisma_1.prisma.practiceSession.groupBy({
            by: ['rudimentId'],
            where: { userId },
            _count: { id: true },
            orderBy: { _count: { id: 'desc' } },
            take: 1,
        });
        let mostPracticedName = 'N/A';
        if (statsMostPracticed.length > 0) {
            const rudiment = await prisma_1.prisma.rudiment.findUnique({
                where: { id: statsMostPracticed[0].rudimentId },
            });
            if (rudiment)
                mostPracticedName = rudiment.name;
        }
        return {
            totalTime: statsAggregated._sum.duration || 0,
            fastestTempo: statsAggregated._max.tempo || 0,
            mostPracticed: mostPracticedName,
        };
    },
};

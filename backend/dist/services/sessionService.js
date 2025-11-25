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
    async getAll(userId, page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const [sessions, total] = await Promise.all([
            prisma_1.prisma.practiceSession.findMany({
                where: { userId },
                orderBy: { date: 'desc' },
                take: limit,
                skip,
                include: { rudiment: true },
            }),
            prisma_1.prisma.practiceSession.count({ where: { userId } }),
        ]);
        return {
            sessions,
            pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
        };
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

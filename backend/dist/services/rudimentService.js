"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RudimentService = void 0;
const prisma_1 = require("../lib/prisma");
const errors_1 = require("../types/errors");
exports.RudimentService = {
    async create(data) {
        return prisma_1.prisma.rudiment.create({
            data,
        });
    },
    async getAll(userId) {
        return prisma_1.prisma.rudiment.findMany({
            where: {
                OR: [{ userId }, { isStandard: true }],
            },
            orderBy: [{ isStandard: 'desc' }, { name: 'asc' }],
        });
    },
    async delete(id, userId) {
        const rudiment = await prisma_1.prisma.rudiment.findUnique({ where: { id } });
        if (!rudiment)
            throw new errors_1.NotFoundError('Rudiment not found.');
        if (rudiment.isStandard)
            throw new errors_1.AuthorizationError('Cannot delete standard rudiments.');
        if (rudiment.userId !== userId)
            throw new errors_1.AuthorizationError('Permission denied.');
        return prisma_1.prisma.rudiment.delete({ where: { id } });
    },
    async getSuggestedTempo(id, userId) {
        const rudiment = await prisma_1.prisma.rudiment.findUnique({ where: { id } });
        if (!rudiment)
            throw new errors_1.NotFoundError('Rudiment not found.');
        const lastSession = await prisma_1.prisma.practiceSession.findFirst({
            where: { userId, rudimentId: id },
            orderBy: { date: 'desc' },
        });
        if (!lastSession)
            return 60;
        let adjustment = 0;
        switch (lastSession.quality) {
            case 4:
                adjustment = 5;
                break; // Flawless
            case 3:
                adjustment = 2;
                break; // Good
            case 2:
                adjustment = 0;
                break; // Okay
            case 1:
                adjustment = -5;
                break; // Sloppy
            default:
                adjustment = 0;
        }
        return Math.max(30, lastSession.tempo + adjustment);
    },
};

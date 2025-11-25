"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoutineService = void 0;
const prisma_1 = require("../lib/prisma");
const errors_1 = require("../types/errors");
exports.RoutineService = {
    async create({ name, description, items, userId }) {
        return prisma_1.prisma.routine.create({
            data: {
                name,
                description,
                userId,
                items: {
                    // Now 'item' is typed, so no implicit any warning
                    create: items.map((item, index) => ({
                        rudimentId: item.rudimentId,
                        duration: Number(item.duration),
                        order: index,
                        tempoMode: item.tempoMode || 'MANUAL',
                        targetTempo: Number(item.targetTempo) || 60,
                        restDuration: Number(item.restDuration) || 0,
                    })),
                },
            },
            include: { items: true },
        });
    },
    async getAll(userId) {
        return prisma_1.prisma.routine.findMany({
            where: { userId },
            include: {
                items: {
                    include: { rudiment: true },
                    orderBy: { order: 'asc' },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    },
    async getById(id, userId) {
        const routine = await prisma_1.prisma.routine.findUnique({
            where: { id },
            include: {
                items: {
                    include: { rudiment: true },
                    orderBy: { order: 'asc' },
                },
            },
        });
        if (!routine) {
            throw new errors_1.NotFoundError('Routine not found');
        }
        if (routine.userId !== userId) {
            throw new errors_1.AuthorizationError('Permission denied');
        }
        return routine;
    },
    async delete(id, userId) {
        const routine = await prisma_1.prisma.routine.findUnique({ where: { id } });
        if (!routine) {
            throw new errors_1.NotFoundError('Routine not found');
        }
        if (routine.userId !== userId) {
            throw new errors_1.AuthorizationError('Permission denied');
        }
        return prisma_1.prisma.routine.delete({ where: { id } });
    },
};

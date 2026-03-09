"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoutineService = void 0;
const prisma_1 = require("../lib/prisma");
const errors_1 = require("../types/errors");
const rudimentService_1 = require("./rudimentService");
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
    async update(id, { name, description, items, userId }) {
        const routine = await prisma_1.prisma.routine.findUnique({ where: { id } });
        if (!routine) {
            throw new errors_1.NotFoundError('Routine not found');
        }
        if (routine.userId !== userId) {
            throw new errors_1.AuthorizationError('Permission denied');
        }
        // If items are provided, delete existing items and create new ones
        if (items !== undefined) {
            // Delete existing items (cascade will handle this, but we do it explicitly for clarity)
            await prisma_1.prisma.routineItem.deleteMany({
                where: { routineId: id },
            });
        }
        return prisma_1.prisma.routine.update({
            where: { id },
            data: {
                ...(name !== undefined && { name }),
                ...(description !== undefined && { description }),
                ...(items !== undefined && {
                    items: {
                        create: items.map((item, index) => ({
                            rudimentId: item.rudimentId,
                            duration: Number(item.duration),
                            order: index,
                            tempoMode: item.tempoMode || 'MANUAL',
                            targetTempo: Number(item.targetTempo) || 60,
                            restDuration: Number(item.restDuration) || 0,
                        })),
                    },
                }),
            },
            include: {
                items: {
                    include: { rudiment: true },
                    orderBy: { order: 'asc' },
                },
            },
        });
    },
    async resolveSmartTempos(id, userId) {
        const routine = await this.getById(id, userId);
        // Resolve tempos for all SMART mode items
        const resolvedItems = await Promise.all(routine.items.map(async (item) => {
            if (item.tempoMode === 'SMART') {
                const suggestedTempo = await rudimentService_1.RudimentService.getSuggestedTempo(item.rudiment.id, userId);
                return {
                    ...item,
                    targetTempo: suggestedTempo,
                };
            }
            return item;
        }));
        return {
            ...routine,
            items: resolvedItems,
        };
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

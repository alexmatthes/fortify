import { prisma } from '../lib/prisma';
import { AuthorizationError, NotFoundError } from '../types/errors';

interface CreateRoutineInput {
	name: string;
	description?: string;
	items: any[];
	userId: string;
}

export const RoutineService = {
	async create({ name, description, items, userId }: CreateRoutineInput) {
		return prisma.routine.create({
			data: {
				name,
				description,
				userId,
				items: {
					create: items.map((item: any, index: number) => ({
						rudimentId: item.rudimentId,
						duration: parseInt(item.duration),
						order: index,
						tempoMode: item.tempoMode || 'MANUAL',
						targetTempo: parseInt(item.targetTempo) || 60,
						restDuration: parseInt(item.restDuration) || 0,
					})),
				},
			},
			include: { items: true },
		});
	},

	async getAll(userId: string) {
		return prisma.routine.findMany({
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

	async getById(id: string, userId: string) {
		const routine = await prisma.routine.findUnique({
			where: { id },
			include: {
				items: {
					include: { rudiment: true },
					orderBy: { order: 'asc' },
				},
			},
		});

		if (!routine) {
			throw new NotFoundError('Routine not found');
		}

		if (routine.userId !== userId) {
			throw new AuthorizationError('Permission denied');
		}

		return routine;
	},

	async delete(id: string, userId: string) {
		const routine = await prisma.routine.findUnique({ where: { id } });

		if (!routine) {
			throw new NotFoundError('Routine not found');
		}

		if (routine.userId !== userId) {
			throw new AuthorizationError('Permission denied');
		}

		return prisma.routine.delete({ where: { id } });
	},
};

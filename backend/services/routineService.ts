import { prisma } from '../lib/prisma';
import { AuthorizationError, NotFoundError } from '../types/errors';

// Define the expected shape of an item
interface RoutineItemInput {
	rudimentId: string;
	duration: string | number;
	tempoMode?: string;
	targetTempo?: string | number;
	restDuration?: string | number;
}

interface CreateRoutineInput {
	name: string;
	description?: string;
	items: RoutineItemInput[]; // Use the interface here
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

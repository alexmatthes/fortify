import { prisma } from '../lib/prisma';
import { AuthorizationError, NotFoundError } from '../types/errors';
import { RudimentService } from './rudimentService';

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

interface UpdateRoutineInput {
	name?: string;
	description?: string;
	items?: RoutineItemInput[];
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

	async update(id: string, { name, description, items, userId }: UpdateRoutineInput) {
		const routine = await prisma.routine.findUnique({ where: { id } });

		if (!routine) {
			throw new NotFoundError('Routine not found');
		}

		if (routine.userId !== userId) {
			throw new AuthorizationError('Permission denied');
		}

		// If items are provided, delete existing items and create new ones
		if (items !== undefined) {
			// Delete existing items (cascade will handle this, but we do it explicitly for clarity)
			await prisma.routineItem.deleteMany({
				where: { routineId: id },
			});
		}

		return prisma.routine.update({
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

	async resolveSmartTempos(id: string, userId: string) {
		const routine = await this.getById(id, userId);

		// Resolve tempos for all SMART mode items
		const resolvedItems = await Promise.all(
			routine.items.map(async (item) => {
				if (item.tempoMode === 'SMART') {
					const suggestedTempo = await RudimentService.getSuggestedTempo(item.rudiment.id, userId);
					return {
						...item,
						targetTempo: suggestedTempo,
					};
				}
				return item;
			})
		);

		return {
			...routine,
			items: resolvedItems,
		};
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

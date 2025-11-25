import { prisma } from '../lib/prisma';
import { AuthorizationError, NotFoundError } from '../types/errors';

interface CreateRudimentInput {
	name: string;
	description?: string;
	category?: string;
	tempoIncrement?: number;
	userId: string;
}

export const RudimentService = {
	async create(data: CreateRudimentInput) {
		return prisma.rudiment.create({
			data,
		});
	},

	async getAll(userId: string) {
		return prisma.rudiment.findMany({
			where: {
				OR: [{ userId }, { isStandard: true }],
			},
			orderBy: [{ isStandard: 'desc' }, { name: 'asc' }],
		});
	},

	async delete(id: string, userId: string) {
		const rudiment = await prisma.rudiment.findUnique({ where: { id } });

		if (!rudiment) throw new NotFoundError('Rudiment not found.');
		if (rudiment.isStandard) throw new AuthorizationError('Cannot delete standard rudiments.');
		if (rudiment.userId !== userId) throw new AuthorizationError('Permission denied.');

		return prisma.rudiment.delete({ where: { id } });
	},

	async getSuggestedTempo(id: string, userId: string) {
		const rudiment = await prisma.rudiment.findUnique({ where: { id } });
		if (!rudiment) throw new NotFoundError('Rudiment not found.');

		const lastSession = await prisma.practiceSession.findFirst({
			where: { userId, rudimentId: id },
			orderBy: { date: 'desc' },
		});

		if (!lastSession) return 60;

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

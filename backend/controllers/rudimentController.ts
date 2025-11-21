import { Response } from 'express';
import { prisma } from '../lib/prisma';
import { AuthRequest } from '../middleware/auth';
import { AuthorizationError, NotFoundError } from '../types/errors';

/**
 * Create a new custom rudiment
 */
export const createRudiment = async (req: AuthRequest, res: Response) => {
	const { name, description, category, tempoIncrement } = req.body;
	
	if (!req.userId) {
		throw new AuthorizationError('User ID is required.');
	}

	const newRudiment = await prisma.rudiment.create({
		data: {
			name,
			description,
			category,
			tempoIncrement,
			userId: req.userId,
		},
	});
	
	res.status(201).json(newRudiment);
};

/**
 * Get all rudiments (user's custom + standard)
 */
export const getAllRudiments = async (req: AuthRequest, res: Response) => {
	const rudiments = await prisma.rudiment.findMany({
		where: {
			OR: [{ userId: req.userId }, { isStandard: true }],
		},
		orderBy: [{ isStandard: 'desc' }, { name: 'asc' }],
	});
	
	res.status(200).json(rudiments);
};

/**
 * Delete a custom rudiment
 */
export const deleteRudiment = async (req: AuthRequest, res: Response) => {
	const { id } = req.params;
	
	if (!req.userId) {
		throw new AuthorizationError('User ID is required.');
	}

	const rudiment = await prisma.rudiment.findUnique({ where: { id } });
	if (!rudiment) {
		throw new NotFoundError('Rudiment not found.');
	}
	
	if (rudiment.isStandard) {
		throw new AuthorizationError('Cannot delete standard rudiments.');
	}
	
	if (rudiment.userId !== req.userId) {
		throw new AuthorizationError('Permission denied.');
	}

	await prisma.rudiment.delete({ where: { id } });
	res.status(204).send();
};

/**
 * Get suggested tempo for a rudiment based on last session
 */
export const getSuggestedTempo = async (req: AuthRequest, res: Response) => {
	const { id } = req.params;
	
	const rudiment = await prisma.rudiment.findUnique({ where: { id } });
	if (!rudiment) {
		throw new NotFoundError('Rudiment not found.');
	}

	const lastSession = await prisma.practiceSession.findFirst({
		where: { userId: req.userId, rudimentId: id },
		orderBy: { date: 'desc' },
	});

	const suggestedTempo = lastSession ? lastSession.tempo + rudiment.tempoIncrement : 60;
	res.status(200).json({ suggested_tempo: suggestedTempo });
};

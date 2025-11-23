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
 * Get suggested tempo for a rudiment based on last session quality
 * Implements algorithmic progressive overload
 */
export const getSuggestedTempo = async (req: AuthRequest, res: Response) => {
	const { id } = req.params;

	// Verify rudiment exists
	const rudiment = await prisma.rudiment.findUnique({ where: { id } });
	if (!rudiment) {
		throw new NotFoundError('Rudiment not found.');
	}

	// Fetch the most recent session for this rudiment
	const lastSession = await prisma.practiceSession.findFirst({
		where: { userId: req.userId, rudimentId: id },
		orderBy: { date: 'desc' },
	});

	// Default to 60 BPM if no history exists
	if (!lastSession) {
		return res.status(200).json({ suggested_tempo: 60 });
	}

	// Smart Tempo Logic
	let adjustment = 0;

	switch (lastSession.quality) {
		case 4: // Flawless
			adjustment = 5; // Aggressive Push
			break;
		case 3: // Good
			adjustment = 2; // Micro-gain
			break;
		case 2: // Okay
			adjustment = 0; // Maintain/Consolidate
			break;
		case 1: // Sloppy
			adjustment = -5; // Deload/Cleanup
			break;
		default:
			adjustment = 0;
	}

	// Calculate new tempo (ensure we don't drop below reasonable minimum of 30bpm)
	const suggestedTempo = Math.max(30, lastSession.tempo + adjustment);

	res.status(200).json({ suggested_tempo: suggestedTempo });
};

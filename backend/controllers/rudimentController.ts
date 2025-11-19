import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

// Custom type to let TS know 'userId' exists on the request
interface AuthRequest extends Request {
	userId?: string;
}

export const createRudiment = async (req: AuthRequest, res: Response) => {
	try {
		const { name, description, category, tempoIncrement } = req.body;
		// We use req.userId! (asserting it exists with !)
		const newRudiment = await prisma.rudiment.create({
			data: {
				name,
				description,
				category,
				tempoIncrement,
				userId: req.userId!,
			},
		});
		res.status(201).json(newRudiment);
	} catch (error: any) {
		res.status(500).json({ message: 'Error creating rudiment.', error: error.message });
	}
};

export const getAllRudiments = async (req: AuthRequest, res: Response) => {
	try {
		const rudiments = await prisma.rudiment.findMany({
			where: {
				OR: [{ userId: req.userId }, { isStandard: true }],
			},
			orderBy: [{ isStandard: 'desc' }, { name: 'asc' }],
		});
		res.status(200).json(rudiments);
	} catch (error: any) {
		res.status(500).json({ message: 'Error fetching rudiments.', error: error.message });
	}
};

export const deleteRudiment = async (req: AuthRequest, res: Response) => {
	try {
		const { id } = req.params;
		const rudiment = await prisma.rudiment.findUnique({ where: { id } });

		if (!rudiment) {
			res.status(404).json({ message: 'Rudiment not found' });
			return;
		}
		if (rudiment.isStandard) {
			res.status(403).json({ message: 'Cannot delete standard rudiments.' });
			return;
		}
		if (rudiment.userId !== req.userId) {
			res.status(403).json({ message: 'Permission denied.' });
			return;
		}

		await prisma.rudiment.delete({ where: { id } });
		res.status(204).send();
	} catch (error: any) {
		res.status(500).json({ message: 'Error deleting rudiment.', error: error.message });
	}
};

export const getSuggestedTempo = async (req: AuthRequest, res: Response) => {
	try {
		const { id } = req.params;
		const rudiment = await prisma.rudiment.findUnique({ where: { id } });
		if (!rudiment) {
			res.status(404).json({ message: 'Rudiment not found.' });
			return;
		}

		const lastSession = await prisma.practiceSession.findFirst({
			where: { userId: req.userId, rudimentId: id },
			orderBy: { date: 'desc' },
		});

		const suggestedTempo = lastSession ? lastSession.tempo + rudiment.tempoIncrement : 60;
		res.status(200).json({ suggested_tempo: suggestedTempo });
	} catch (error: any) {
		res.status(500).json({ message: 'Error calculating tempo.', error: error.message });
	}
};

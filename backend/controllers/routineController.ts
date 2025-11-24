import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { AuthRequest } from '../middleware/auth';

export const createRoutine = async (req: AuthRequest, res: Response) => {
	try {
		const { name, description, items } = req.body;

		const routine = await prisma.routine.create({
			data: {
				name,
				description,
				userId: req.userId!,
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

		res.status(201).json(routine);
	} catch (error: any) {
		res.status(500).json({ message: 'Error creating routine', error: error.message });
	}
};

export const getRoutines = async (req: AuthRequest, res: Response) => {
	try {
		const routines = await prisma.routine.findMany({
			where: { userId: req.userId },
			include: {
				items: {
					include: { rudiment: true },
					orderBy: { order: 'asc' },
				},
			},
			orderBy: { createdAt: 'desc' },
		});
		res.status(200).json(routines);
	} catch (error: any) {
		res.status(500).json({ message: 'Error fetching routines', error: error.message });
	}
};

export const deleteRoutine = async (req: AuthRequest, res: Response) => {
	try {
		const { id } = req.params;
		const routine = await prisma.routine.findUnique({ where: { id } });

		if (!routine || routine.userId !== req.userId) {
			res.status(403).json({ message: 'Permission denied' });
			return;
		}

		await prisma.routine.delete({ where: { id } });
		res.status(200).json({ message: 'Routine deleted' });
	} catch (error: any) {
		res.status(500).json({ message: 'Error deleting routine', error: error.message });
	}
};

// --- ADD THIS FUNCTION ---
export const getRoutineById = async (req: AuthRequest, res: Response) => {
	try {
		const { id } = req.params;
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
			res.status(404).json({ message: 'Routine not found' });
			return;
		}

		if (routine.userId !== req.userId) {
			res.status(403).json({ message: 'Permission denied' });
			return;
		}

		res.status(200).json(routine);
	} catch (error: any) {
		res.status(500).json({ message: 'Error fetching routine', error: error.message });
	}
};

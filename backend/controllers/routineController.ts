import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export const createRoutine = async (req: Request, res: Response) => {
	try {
		const { name, description, items } = req.body; // items = [{ rudimentId, duration, order }]

		const routine = await prisma.routine.create({
			data: {
				name,
				description,
				userId: req.userId!,
				items: {
					create: items.map((item: any, index: number) => ({
						rudimentId: item.rudimentId,
						duration: parseInt(item.duration),
						order: index, // Automatically set order based on array position
					})),
				},
			},
			include: { items: true }, // Return the items we just created
		});

		res.status(201).json(routine);
	} catch (error: any) {
		res.status(500).json({ message: 'Error creating routine', error: error.message });
	}
};

export const getRoutines = async (req: Request, res: Response) => {
	try {
		const routines = await prisma.routine.findMany({
			where: { userId: req.userId },
			include: {
				items: {
					include: { rudiment: true }, // Get the rudiment names too
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

export const deleteRoutine = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		// Ensure the user owns the routine before deleting
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

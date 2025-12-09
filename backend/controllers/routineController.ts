import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { RoutineService } from '../services/routineService';

export const createRoutine = async (req: AuthRequest, res: Response) => {
	const routine = await RoutineService.create({
		...req.body,
		userId: req.userId!,
	});
	res.status(201).json(routine);
};

export const getRoutines = async (req: AuthRequest, res: Response) => {
	const routines = await RoutineService.getAll(req.userId!);
	res.status(200).json(routines);
};

export const getRoutineById = async (req: AuthRequest, res: Response) => {
	const routine = await RoutineService.getById(req.params.id, req.userId!);
	res.status(200).json(routine);
};

export const updateRoutine = async (req: AuthRequest, res: Response) => {
	const routine = await RoutineService.update(req.params.id, {
		...req.body,
		userId: req.userId!,
	});
	res.status(200).json(routine);
};

export const resolveSmartTempos = async (req: AuthRequest, res: Response) => {
	const routine = await RoutineService.resolveSmartTempos(req.params.id, req.userId!);
	res.status(200).json(routine);
};

export const deleteRoutine = async (req: AuthRequest, res: Response) => {
	await RoutineService.delete(req.params.id, req.userId!);
	res.status(200).json({ message: 'Routine deleted' });
};

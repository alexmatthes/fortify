import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { RudimentService } from '../services/rudimentService';

export const createRudiment = async (req: AuthRequest, res: Response) => {
	const newRudiment = await RudimentService.create({
		...req.body,
		userId: req.userId!,
	});
	res.status(201).json(newRudiment);
};

export const getAllRudiments = async (req: AuthRequest, res: Response) => {
	const rudiments = await RudimentService.getAll(req.userId!);
	res.status(200).json(rudiments);
};

export const deleteRudiment = async (req: AuthRequest, res: Response) => {
	await RudimentService.delete(req.params.id, req.userId!);
	res.status(204).send();
};

export const getSuggestedTempo = async (req: AuthRequest, res: Response) => {
	const suggestedTempo = await RudimentService.getSuggestedTempo(req.params.id, req.userId!);
	res.status(200).json({ suggested_tempo: suggestedTempo });
};

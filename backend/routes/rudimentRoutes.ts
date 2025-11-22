import express from 'express';
import { z } from 'zod';
import * as rudimentController from '../controllers/rudimentController';
import auth from '../middleware/auth';
import validate from '../middleware/validate';
import { asyncHandler } from '../utils/asyncHandler';

const router = express.Router();

const rudimentSchema = z.object({
	name: z.string().trim().min(1, 'Name is required').max(100, 'Name is too long'),
	category: z.string().trim().min(1, 'Category is required').max(50, 'Category is too long'),
	description: z.string().trim().max(500, 'Description is too long').optional(),
	tempoIncrement: z.number().int().min(1).max(20, 'Tempo increment must be between 1 and 20').optional().default(5),
});

router.post('/', auth, validate(rudimentSchema), asyncHandler(rudimentController.createRudiment));
router.get('/', auth, asyncHandler(rudimentController.getAllRudiments));
router.delete('/:id', auth, asyncHandler(rudimentController.deleteRudiment));
router.get('/:id/suggested-tempo', auth, asyncHandler(rudimentController.getSuggestedTempo));

export default router;

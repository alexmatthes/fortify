import express from 'express';
import { z } from 'zod';
import * as rudimentController from '../controllers/rudimentController';
import auth from '../middleware/auth';
import validate from '../middleware/validate';
import { asyncHandler } from '../utils/asyncHandler';

const router = express.Router();

const rudimentSchema = z.object({
	name: z.string().min(1, 'Name is required'),
	category: z.string().min(1, 'Category is required'),
	description: z.string().optional(),
	tempoIncrement: z.number().optional().default(5),
});

router.post('/', auth, validate(rudimentSchema), asyncHandler(rudimentController.createRudiment));
router.get('/', auth, asyncHandler(rudimentController.getAllRudiments));
router.delete('/:id', auth, asyncHandler(rudimentController.deleteRudiment));
router.get('/:id/suggested-tempo', auth, asyncHandler(rudimentController.getSuggestedTempo));

export default router;

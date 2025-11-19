import express from 'express';
import { z } from 'zod';
import * as rudimentController from '../controllers/rudimentController';
import auth from '../middleware/auth';
import validate from '../middleware/validate';

const router = express.Router();

const rudimentSchema = z.object({
	name: z.string().min(1, 'Name is required'),
	category: z.string().min(1, 'Category is required'),
	description: z.string().optional(),
	tempoIncrement: z.number().optional().default(5),
});

router.post('/', auth, validate(rudimentSchema), rudimentController.createRudiment);
router.get('/', auth, rudimentController.getAllRudiments);
router.delete('/:id', auth, rudimentController.deleteRudiment);
router.get('/:id/suggested-tempo', auth, rudimentController.getSuggestedTempo);

export default router;

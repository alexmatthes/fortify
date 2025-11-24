import express from 'express';
import { z } from 'zod';
import * as routineController from '../controllers/routineController';
import auth from '../middleware/auth';
import validate from '../middleware/validate';

const router = express.Router();

const createRoutineSchema = z.object({
	name: z.string().min(1, 'Name is required'),
	description: z.string().optional(),
	items: z
		.array(
			z.object({
				rudimentId: z.string(),
				duration: z.number().positive(),
				// NEW FIELDS: We must allow these through validation
				tempoMode: z.enum(['MANUAL', 'SMART']).optional().default('MANUAL'),
				targetTempo: z.number().int().positive().optional(),
				restDuration: z.number().int().min(0).optional().default(0),
			})
		)
		.min(1, 'Routine must have at least one item'),
});

router.post('/', auth, validate(createRoutineSchema), routineController.createRoutine);
router.get('/', auth, routineController.getRoutines);
router.delete('/:id', auth, routineController.deleteRoutine);

export default router;

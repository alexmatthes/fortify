import express from 'express';
import { z } from 'zod';
import * as sessionController from '../controllers/sessionController';
import auth from '../middleware/auth';
import validate from '../middleware/validate';

const router = express.Router();

const sessionSchema = z.object({
	rudimentId: z.string().cuid('Invalid Rudiment ID'),
	// z.preprocess handles the "string to number" conversion from JSON
	duration: z.preprocess((val) => Number(val), z.number().positive('Duration must be positive')),
	tempo: z.preprocess((val) => Number(val), z.number().min(30).max(300, 'Tempo out of range')),
});

router.post('/', auth, validate(sessionSchema), sessionController.logSession);
router.get('/', auth, sessionController.getAllSessions);
router.get('/stats', auth, sessionController.getDashboardStats);

export default router;

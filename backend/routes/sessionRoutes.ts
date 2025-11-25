import express from 'express';
import { z } from 'zod';
import * as sessionController from '../controllers/sessionController';
import auth from '../middleware/auth';
import validate from '../middleware/validate';
import { asyncHandler } from '../utils/asyncHandler';

const router = express.Router();

const sessionSchema = z.object({
	body: z.object({
		rudimentId: z.string().trim().cuid('Invalid Rudiment ID'),
		duration: z.preprocess((val) => Number(val), z.number().positive().max(1440)),
		tempo: z.preprocess((val) => Number(val), z.number().min(30).max(300)),
		quality: z.preprocess((val) => Number(val), z.number().int().min(1).max(4)),
	}),
});

router.get('/history', auth, asyncHandler(sessionController.getConsistencyData));
router.get('/velocity', auth, asyncHandler(sessionController.getVelocityData)); // NEW ROUTE
router.post('/', auth, validate(sessionSchema), asyncHandler(sessionController.logSession));
router.get('/', auth, asyncHandler(sessionController.getAllSessions));

export default router;

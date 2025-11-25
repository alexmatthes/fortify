import express from 'express';
import { z } from 'zod';
import * as contactController from '../controllers/contactController';
import validate from '../middleware/validate';
import { asyncHandler } from '../utils/asyncHandler';

const router = express.Router();

const contactSchema = z.object({
	name: z.string().trim().min(1, 'Name is required').max(255, 'Name is too long'),
	email: z.string().trim().toLowerCase().email('Invalid email address').max(255, 'Email address is too long'),
	subject: z.enum(['general', 'bug', 'feature', 'support', 'other'], {
		errorMap: () => ({ message: 'Invalid subject selection' }),
	}),
	message: z.string().trim().min(10, 'Message must be at least 10 characters').max(5000, 'Message is too long'),
});

router.post('/submit', validate(contactSchema), asyncHandler(contactController.submitContact));

export default router;


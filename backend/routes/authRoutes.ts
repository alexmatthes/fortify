import express from 'express';
import { z } from 'zod';
import * as authController from '../controllers/authController';
import validate from '../middleware/validate';
import { asyncHandler } from '../utils/asyncHandler';

const router = express.Router();

const signupSchema = z.object({
	email: z.string().trim().toLowerCase().email('Invalid email address').max(255, 'Email address is too long'),
	password: z
		.string()
		.trim()
		.min(8, 'Password must be at least 8 characters')
		.max(128, 'Password is too long')
		.regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
});

const loginSchema = z.object({
	email: z.string().trim().toLowerCase().email('Invalid email address').max(255, 'Email address is too long'),
	password: z.string().trim().max(128, 'Password is too long'),
});

router.post('/signup', validate(signupSchema), authController.signup);
router.post('/login', validate(loginSchema), asyncHandler(authController.login));

export default router;

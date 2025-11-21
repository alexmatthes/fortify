import express from 'express';
import { z } from 'zod';
import * as authController from '../controllers/authController';
import validate from '../middleware/validate';
import { asyncHandler } from '../utils/asyncHandler';

const router = express.Router();

const signupSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters")
});

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string()
});

router.post('/signup', validate(signupSchema), asyncHandler(authController.signup));
router.post('/login', validate(loginSchema), asyncHandler(authController.login));

export default router;
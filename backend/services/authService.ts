// backend/services/authService.ts
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { prisma } from '../lib/prisma';
import { ValidationError } from '../types/errors';

// Define the shape of input data to keep things type-safe
interface SignupData {
	email: string;
	password: string;
}

interface LoginData {
	email: string;
	password: string;
}

export const AuthService = {
	/**
	 * Handles user registration logic
	 */
	async signup({ email, password }: SignupData) {
		const existingUser = await prisma.user.findUnique({ where: { email } });
		if (existingUser) {
			throw new ValidationError('Email already in use.');
		}

		const hashedPassword = await bcrypt.hash(password, 10);
		const newUser = await prisma.user.create({
			data: { email, password: hashedPassword },
		});

		return { id: newUser.id, email: newUser.email };
	},

	/**
	 * Handles user login logic and token creation
	 */
	async login({ email, password }: LoginData) {
		const user = await prisma.user.findUnique({ where: { email } });
		if (!user) {
			throw new ValidationError('Invalid email or password.');
		}

		const isPasswordCorrect = await bcrypt.compare(password, user.password);
		if (!isPasswordCorrect) {
			throw new ValidationError('Invalid email or password.');
		}

		const token = jwt.sign({ userId: user.id }, config.jwtSecret, { expiresIn: '7d' });

		return {
			token,
			user: { id: user.id, email: user.email },
		};
	},
};

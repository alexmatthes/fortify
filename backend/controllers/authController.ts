import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma';
import { config } from '../config';
import { AppError, ValidationError } from '../types/errors';

/**
 * Sign up a new user
 */
export const signup = async (req: Request, res: Response) => {
	const { email, password } = req.body;
	
	const existingUser = await prisma.user.findUnique({ where: { email } });
	if (existingUser) {
		throw new ValidationError('Email already in use.');
	}

	const hashedPassword = await bcrypt.hash(password, 10);
	const newUser = await prisma.user.create({
		data: { email, password: hashedPassword },
	});

	res.status(201).json({ id: newUser.id, email: newUser.email });
};

/**
 * Log in an existing user
 */
export const login = async (req: Request, res: Response) => {
	const { email, password } = req.body;
	
	const user = await prisma.user.findUnique({ where: { email } });
	if (!user) {
		throw new ValidationError('Invalid email or password.');
	}

	const isPasswordCorrect = await bcrypt.compare(password, user.password);
	if (!isPasswordCorrect) {
		throw new ValidationError('Invalid email or password.');
	}

	const token = jwt.sign({ userId: user.id }, config.jwtSecret, { expiresIn: '7d' });
	res.status(200).json({ token, userId: user.id, email: user.email });
};

import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma';

export const signup = async (req: Request, res: Response) => {
	try {
		const { email, password } = req.body;
		const existingUser = await prisma.user.findUnique({ where: { email } });

		if (existingUser) {
			res.status(400).json({ message: 'Email already in use.' });
			return;
		}

		const hashedPassword = await bcrypt.hash(password, 10);
		const newUser = await prisma.user.create({
			data: { email, password: hashedPassword },
		});

		res.status(201).json({ id: newUser.id, email: newUser.email });
	} catch (error: any) {
		res.status(500).json({ message: 'Something went wrong.', error: error.message });
	}
};

export const login = async (req: Request, res: Response) => {
	try {
		const { email, password } = req.body;
		const user = await prisma.user.findUnique({ where: { email } });

		if (!user) {
			res.status(400).json({ message: 'Invalid email or password.' });
			return;
		}

		const isPasswordCorrect = await bcrypt.compare(password, user.password);
		if (!isPasswordCorrect) {
			res.status(400).json({ message: 'Invalid email or password.' });
			return;
		}

		const secret = process.env.JWT_SECRET || 'default_secret';
		const token = jwt.sign({ userId: user.id }, secret, { expiresIn: '7d' });
		res.status(200).json({ token, userId: user.id, email: user.email });
	} catch (error: any) {
		res.status(500).json({ message: 'Something went wrong.', error: error.message });
	}
};

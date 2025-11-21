import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { AuthenticationError } from '../types/errors';

// Extend the Express Request type to include 'userId'
export interface AuthRequest extends Request {
	userId?: string;
}

/**
 * Authentication middleware
 * Validates JWT token and attaches userId to request
 */
const auth = (req: AuthRequest, res: Response, next: NextFunction) => {
	try {
		const authHeader = req.header('Authorization');
		if (!authHeader || !authHeader.startsWith('Bearer ')) {
			throw new AuthenticationError('No token, authorization denied.');
		}

		const token = authHeader.split(' ')[1];
		if (!token) {
			throw new AuthenticationError('Token missing.');
		}

		// Verify token using config JWT secret
		const decoded = jwt.verify(token, config.jwtSecret) as { userId: string };
		req.userId = decoded.userId;
		next();
	} catch (error) {
		if (error instanceof AuthenticationError) {
			return res.status(error.statusCode).json({ message: error.message });
		}
		// Handle JWT verification errors - let errorHandler middleware catch it
		next(new AuthenticationError('Token is not valid.'));
	}
};

export default auth;

import { NextFunction, Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import { ZodError } from 'zod';
import { AppError } from '../types/errors';

/**
 * Centralized error handling middleware
 * Standardizes error responses and handles different error types
 */
export const errorHandler = (
	err: Error | AppError,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	// If response already sent, delegate to default Express error handler
	if (res.headersSent) {
		return next(err);
	}

	// Handle known AppError instances
	if (err instanceof AppError) {
		return res.status(err.statusCode).json({
			message: err.message,
			...(err.errors && { errors: err.errors }),
		});
	}

	// Handle Zod validation errors
	if (err instanceof ZodError) {
		return res.status(400).json({
			message: 'Validation failed',
			errors: err.errors.map((e) => ({
				field: e.path.join('.'),
				message: e.message,
			})),
		});
	}

	// Handle Prisma errors
	if (err instanceof Prisma.PrismaClientKnownRequestError) {
		// Handle unique constraint violations
		if (err.code === 'P2002') {
			return res.status(400).json({
				message: 'A record with this information already exists.',
			});
		}
		// Handle record not found
		if (err.code === 'P2025') {
			return res.status(404).json({
				message: 'Resource not found.',
			});
		}
		// Generic Prisma error
		return res.status(400).json({
			message: 'Database operation failed.',
		});
	}

	// Handle JWT errors
	if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
		return res.status(401).json({
			message: 'Invalid or expired token.',
		});
	}

	// Log unexpected errors in development
	if (process.env.NODE_ENV === 'development') {
		console.error('Unexpected error:', err);
	}

	// Generic error response (don't leak error details in production)
	return res.status(500).json({
		message: 'An unexpected error occurred.',
		...(process.env.NODE_ENV === 'development' && { error: err.message }),
	});
};


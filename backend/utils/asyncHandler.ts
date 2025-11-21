import { NextFunction, Request, Response } from 'express';

/**
 * Wrapper for async route handlers to catch errors
 * Passes errors to Express error handling middleware
 */
export const asyncHandler = (
	fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
	return (req: Request, res: Response, next: NextFunction) => {
		Promise.resolve(fn(req, res, next)).catch(next);
	};
};


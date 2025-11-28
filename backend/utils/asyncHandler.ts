import { NextFunction, Request, Response } from 'express';

/**
 * Wrapper for async route handlers to catch errors
 * Passes errors to Express error handling middleware
 */
export const asyncHandler = (
	// Change Promise<any> to Promise<void>
	fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
) => {
	return (req: Request, res: Response, next: NextFunction) => {
		Promise.resolve(fn(req, res, next)).catch(next);
	};
};







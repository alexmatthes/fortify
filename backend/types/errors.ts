/**
 * Custom error types for the application
 */

export interface ApiError {
	message: string;
	statusCode: number;
	errors?: Array<{ field: string; message: string }>;
}

export class AppError extends Error {
	statusCode: number;
	errors?: Array<{ field: string; message: string }>;

	constructor(message: string, statusCode: number = 500, errors?: Array<{ field: string; message: string }>) {
		super(message);
		this.statusCode = statusCode;
		this.errors = errors;
		this.name = 'AppError';
		Error.captureStackTrace(this, this.constructor);
	}
}

export class ValidationError extends AppError {
	constructor(message: string, errors?: Array<{ field: string; message: string }>) {
		super(message, 400, errors);
		this.name = 'ValidationError';
	}
}

export class AuthenticationError extends AppError {
	constructor(message: string = 'Authentication failed') {
		super(message, 401);
		this.name = 'AuthenticationError';
	}
}

export class AuthorizationError extends AppError {
	constructor(message: string = 'Permission denied') {
		super(message, 403);
		this.name = 'AuthorizationError';
	}
}

export class NotFoundError extends AppError {
	constructor(message: string = 'Resource not found') {
		super(message, 404);
		this.name = 'NotFoundError';
	}
}












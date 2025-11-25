"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const zod_1 = require("zod");
const errors_1 = require("../types/errors");
const logger_1 = __importDefault(require("../utils/logger"));
// Helper function to check for Prisma's known request errors
// This is a type guard which will inform TypeScript about the error's shape
function isPrismaKnownError(error) {
    return 'code' in error && typeof error.code === 'string' && error.code.startsWith('P');
}
const errorHandler = (err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }
    // Handle known AppError instances
    if (err instanceof errors_1.AppError) {
        return res.status(err.statusCode).json({
            message: err.message,
            ...(err.errors && { errors: err.errors }),
        });
    }
    // Handle Zod validation errors
    if (err instanceof zod_1.ZodError) {
        return res.status(400).json({
            message: 'Validation failed',
            errors: err.errors.map((e) => ({
                field: e.path.join('.'),
                message: e.message,
            })),
        });
    }
    // Handle Prisma errors using the type guard
    if (isPrismaKnownError(err)) {
        if (err.code === 'P2002') {
            return res.status(400).json({
                message: 'A record with this information already exists.',
            });
        }
        if (err.code === 'P2003') {
            return res.status(400).json({
                message: 'Invalid reference. The associated record (e.g. Rudiment) may not exist.',
            });
        }
        if (err.code === 'P2025') {
            return res.status(404).json({
                message: 'Resource not found.',
            });
        }
        // Log the actual database error for debugging
        logger_1.default.error('Database Error', { code: err.code, meta: err.meta });
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
    // Log unexpected errors properly
    logger_1.default.error('Unexpected error', {
        error: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method,
    });
    return res.status(500).json({
        message: 'An unexpected error occurred.',
        ...(process.env.NODE_ENV === 'development' && { error: err.message }),
    });
};
exports.errorHandler = errorHandler;

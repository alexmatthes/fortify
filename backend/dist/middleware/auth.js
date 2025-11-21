"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const errors_1 = require("../types/errors");
/**
 * Authentication middleware
 * Validates JWT token and attaches userId to request
 */
const auth = (req, res, next) => {
    try {
        const authHeader = req.header('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new errors_1.AuthenticationError('No token, authorization denied.');
        }
        const token = authHeader.split(' ')[1];
        if (!token) {
            throw new errors_1.AuthenticationError('Token missing.');
        }
        // Verify token using config JWT secret
        const decoded = jsonwebtoken_1.default.verify(token, config_1.config.jwtSecret);
        req.userId = decoded.userId;
        next();
    }
    catch (error) {
        if (error instanceof errors_1.AuthenticationError) {
            return res.status(error.statusCode).json({ message: error.message });
        }
        // Handle JWT verification errors - let errorHandler middleware catch it
        next(new errors_1.AuthenticationError('Token is not valid.'));
    }
};
exports.default = auth;

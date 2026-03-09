"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
// backend/services/authService.ts
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const prisma_1 = require("../lib/prisma");
const errors_1 = require("../types/errors");
exports.AuthService = {
    /**
     * Handles user registration logic
     */
    async signup({ email, password }) {
        const existingUser = await prisma_1.prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            throw new errors_1.ValidationError('Email already in use.');
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const newUser = await prisma_1.prisma.user.create({
            data: { email, password: hashedPassword },
        });
        return { id: newUser.id, email: newUser.email };
    },
    /**
     * Handles user login logic and token creation
     */
    async login({ email, password }) {
        const user = await prisma_1.prisma.user.findUnique({ where: { email } });
        if (!user) {
            throw new errors_1.ValidationError('Invalid email or password.');
        }
        const isPasswordCorrect = await bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordCorrect) {
            throw new errors_1.ValidationError('Invalid email or password.');
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, config_1.config.jwtSecret, { expiresIn: '7d' });
        return {
            token,
            user: { id: user.id, email: user.email },
        };
    },
    /**
     * Change user password
     */
    async changePassword(userId, currentPassword, newPassword) {
        const user = await prisma_1.prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            throw new errors_1.ValidationError('User not found.');
        }
        const isPasswordCorrect = await bcryptjs_1.default.compare(currentPassword, user.password);
        if (!isPasswordCorrect) {
            throw new errors_1.ValidationError('Current password is incorrect.');
        }
        const hashedPassword = await bcryptjs_1.default.hash(newPassword, 10);
        await prisma_1.prisma.user.update({
            where: { id: userId },
            data: { password: hashedPassword },
        });
        return { message: 'Password changed successfully' };
    },
    /**
     * Delete user account and all associated data
     */
    async deleteAccount(userId, password) {
        const user = await prisma_1.prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            throw new errors_1.ValidationError('User not found.');
        }
        const isPasswordCorrect = await bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordCorrect) {
            throw new errors_1.ValidationError('Password is incorrect.');
        }
        // Delete user (cascade will handle related data)
        await prisma_1.prisma.user.delete({ where: { id: userId } });
        return { message: 'Account deleted successfully' };
    },
    /**
     * Get user profile
     */
    async getProfile(userId) {
        const user = await prisma_1.prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, email: true },
        });
        if (!user) {
            throw new errors_1.ValidationError('User not found.');
        }
        return user;
    },
};

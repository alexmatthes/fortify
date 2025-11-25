"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma_1 = require("../../lib/prisma");
const authService_1 = require("../authService");
// Mock Prisma and Bcrypt
jest.mock('../../lib/prisma', () => ({
    prisma: {
        user: {
            findUnique: jest.fn(),
            create: jest.fn(),
        },
    },
}));
jest.mock('bcryptjs');
describe('AuthService', () => {
    it('should create a new user if email is unused', async () => {
        // Setup Mocks
        prisma_1.prisma.user.findUnique.mockResolvedValue(null); // User doesn't exist
        bcryptjs_1.default.hash.mockResolvedValue('hashed_password');
        prisma_1.prisma.user.create.mockResolvedValue({ id: '1', email: 'test@test.com' });
        // Run Logic
        const result = await authService_1.AuthService.signup({ email: 'test@test.com', password: 'password123' });
        // Assert
        expect(result.email).toBe('test@test.com');
        expect(prisma_1.prisma.user.create).toHaveBeenCalled();
    });
});

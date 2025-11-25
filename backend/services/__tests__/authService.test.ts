import bcrypt from 'bcryptjs';
import { prisma } from '../../lib/prisma';
import { AuthService } from '../authService';

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
		(prisma.user.findUnique as jest.Mock).mockResolvedValue(null); // User doesn't exist
		(bcrypt.hash as jest.Mock).mockResolvedValue('hashed_password');
		(prisma.user.create as jest.Mock).mockResolvedValue({ id: '1', email: 'test@test.com' });

		// Run Logic
		const result = await AuthService.signup({ email: 'test@test.com', password: 'password123' });

		// Assert
		expect(result.email).toBe('test@test.com');
		expect(prisma.user.create).toHaveBeenCalled();
	});
});

import express, { NextFunction, Request, Response } from 'express';
import request from 'supertest';
import sessionRouter from '../../routes/sessionRoutes';

//Import the singleton instance directly
import { prisma } from '../../lib/prisma';

//Mock the lib/prisma module instead of @prisma/client constructor
jest.mock('../../lib/prisma', () => ({
	prisma: {
		practiceSession: {
			create: jest.fn(),
			findMany: jest.fn(),
			aggregate: jest.fn(),
			groupBy: jest.fn(),
			count: jest.fn(),
		},
		rudiment: {
			findUnique: jest.fn(),
		},
		$disconnect: jest.fn(),
	},
}));

// Mock Auth Middleware
jest.mock('../../middleware/auth', () => {
	return (req: Request, res: Response, next: NextFunction) => {
		req.userId = 'test-user-id';
		next();
	};
});

const app = express();
app.use(express.json());
app.use('/api/sessions', sessionRouter);

describe('POST /api/sessions', () => {
	it('should create a new session with valid data', async () => {
		const mockSession = {
			id: 'clq3b6b1e000008l4f1y0y1y1',
			rudimentId: 'clq3b6b1e000008l4f1y0y1y1',
			duration: 10,
			tempo: 120,
			quality: 4,
			userId: 'test-user-id',
			date: new Date(),
		};

		//Configure the mock directly on the imported object
		(prisma.practiceSession.create as jest.Mock).mockResolvedValue(mockSession);

		const res = await request(app).post('/api/sessions').send({
			rudimentId: 'clq3b6b1e000008l4f1y0y1y1',
			duration: 10,
			tempo: 120,
			quality: 4,
		});

		expect(res.status).toBe(201);
		expect(res.body).toEqual(JSON.parse(JSON.stringify(mockSession)));
		expect(prisma.practiceSession.create).toHaveBeenCalledWith({
			data: {
				rudimentId: 'clq3b6b1e000008l4f1y0y1y1',
				duration: 10,
				tempo: 120,
				quality: 4,
				userId: 'test-user-id',
			},
		});
	});

	it('should fail validation with invalid data', async () => {
		const res = await request(app).post('/api/sessions').send({
			rudimentId: 'rudiment-id',
			duration: -5,
			tempo: 120,
			quality: 4,
		});

		expect(res.status).toBe(400);
	});
});

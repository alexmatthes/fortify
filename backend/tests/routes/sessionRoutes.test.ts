import request from 'supertest';
import express from 'express';
import sessionRouter from '../../routes/sessionRoutes';
import { PrismaClient } from '@prisma/client';

// Mock Prisma
const prisma = new PrismaClient();
jest.mock('@prisma/client', () => {
    const mockPrisma = {
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
    };
    return { PrismaClient: jest.fn(() => mockPrisma) };
});

// Mock Auth Middleware
jest.mock('../../middleware/auth', () => {
    return (req: any, res: any, next: any) => {
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
            rudimentId: 'clq3b6b1e000008l4f1y0y1y1', // Valid CUID
            duration: 10,
            tempo: 120,
            quality: 4,
            userId: 'test-user-id',
            date: new Date(),
        };

        // Access the mocked prisma client
        const mockPrismaInstance = new PrismaClient();
        (mockPrismaInstance.practiceSession.create as jest.Mock).mockResolvedValue(mockSession);

        const res = await request(app)
            .post('/api/sessions')
            .send({
                rudimentId: 'clq3b6b1e000008l4f1y0y1y1',
                duration: 10,
                tempo: 120,
                quality: 4,
            });

        expect(res.status).toBe(201);
        expect(res.body).toEqual(JSON.parse(JSON.stringify(mockSession)));
        expect(mockPrismaInstance.practiceSession.create).toHaveBeenCalledWith({
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
        const res = await request(app)
            .post('/api/sessions')
            .send({
                rudimentId: 'rudiment-id', // Invalid CUID
                duration: -5, // Invalid duration
                tempo: 120,
                quality: 4,
            });

        expect(res.status).toBe(400); // Validation error
    });
});

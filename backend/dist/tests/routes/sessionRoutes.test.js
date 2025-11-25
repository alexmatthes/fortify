"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const supertest_1 = __importDefault(require("supertest"));
const sessionRoutes_1 = __importDefault(require("../../routes/sessionRoutes"));
//Import the singleton instance directly
const prisma_1 = require("../../lib/prisma");
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
    return (req, res, next) => {
        req.userId = 'test-user-id';
        next();
    };
});
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/api/sessions', sessionRoutes_1.default);
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
        prisma_1.prisma.practiceSession.create.mockResolvedValue(mockSession);
        const res = await (0, supertest_1.default)(app).post('/api/sessions').send({
            rudimentId: 'clq3b6b1e000008l4f1y0y1y1',
            duration: 10,
            tempo: 120,
            quality: 4,
        });
        expect(res.status).toBe(201);
        expect(res.body).toEqual(JSON.parse(JSON.stringify(mockSession)));
        expect(prisma_1.prisma.practiceSession.create).toHaveBeenCalledWith({
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
        const res = await (0, supertest_1.default)(app).post('/api/sessions').send({
            rudimentId: 'rudiment-id',
            duration: -5,
            tempo: 120,
            quality: 4,
        });
        expect(res.status).toBe(400);
    });
});

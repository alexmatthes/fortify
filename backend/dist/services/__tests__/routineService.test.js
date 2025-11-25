"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../../lib/prisma");
const routineService_1 = require("../routineService");
// Mock Prisma
jest.mock('../../lib/prisma', () => ({
    prisma: {
        routine: {
            create: jest.fn(),
        },
    },
}));
describe('RoutineService - create', () => {
    const mockUserId = 'user-123';
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it('should create a routine with correctly mapped items and default values', async () => {
        // 1. Setup Input Data
        const input = {
            name: 'Morning Warmup',
            description: 'Get the hands moving',
            userId: mockUserId,
            items: [
                {
                    rudimentId: 'rud-1',
                    duration: '10', // Intentionally as string to test parsing
                    tempoMode: 'MANUAL',
                    targetTempo: 60,
                    restDuration: 0,
                },
                {
                    rudimentId: 'rud-2',
                    duration: 5,
                    tempoMode: 'SMART',
                    targetTempo: 120,
                    restDuration: 30,
                },
            ],
        };
        // 2. Setup Mock Return Value
        const mockCreatedRoutine = {
            id: 'routine-1',
            ...input,
            items: [
                { id: 'item-1', order: 0, ...input.items[0] },
                { id: 'item-2', order: 1, ...input.items[1] },
            ],
        };
        prisma_1.prisma.routine.create.mockResolvedValue(mockCreatedRoutine);
        // 3. Execute
        const result = await routineService_1.RoutineService.create(input);
        // 4. Assert
        expect(result).toEqual(mockCreatedRoutine);
        // Critical: Verify exactly how prisma.create was called
        expect(prisma_1.prisma.routine.create).toHaveBeenCalledWith({
            data: {
                name: 'Morning Warmup',
                description: 'Get the hands moving',
                userId: mockUserId,
                items: {
                    create: [
                        // Item 1: Verify defaults & order 0
                        {
                            rudimentId: 'rud-1',
                            duration: 10, // Parsed to int
                            order: 0, // Auto-assigned index
                            tempoMode: 'MANUAL', // Default
                            targetTempo: 60, // Default
                            restDuration: 0, // Default
                        },
                        // Item 2: Verify explicit values & order 1
                        {
                            rudimentId: 'rud-2',
                            duration: 5,
                            order: 1,
                            tempoMode: 'SMART',
                            targetTempo: 120,
                            restDuration: 30,
                        },
                    ],
                },
            },
            include: { items: true },
        });
    });
    it('should handle creating a routine with empty items', async () => {
        const input = {
            name: 'Empty Routine',
            userId: mockUserId,
            items: [],
        };
        prisma_1.prisma.routine.create.mockResolvedValue({ id: 'r-1', ...input });
        await routineService_1.RoutineService.create(input);
        expect(prisma_1.prisma.routine.create).toHaveBeenCalledWith({
            data: {
                name: 'Empty Routine',
                description: undefined,
                userId: mockUserId,
                items: {
                    create: [],
                },
            },
            include: { items: true },
        });
    });
});

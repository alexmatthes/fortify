"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../../lib/prisma");
const rudimentService_1 = require("../rudimentService");
// Mock Prisma
jest.mock('../../lib/prisma', () => ({
    prisma: {
        rudiment: { findUnique: jest.fn() },
        practiceSession: { findFirst: jest.fn() },
    },
}));
describe('RudimentService - Smart Tempo', () => {
    const mockUserId = 'user-123';
    const mockRudimentId = 'rud-123';
    beforeEach(() => {
        jest.clearAllMocks();
        // Default: Rudiment exists
        prisma_1.prisma.rudiment.findUnique.mockResolvedValue({ id: mockRudimentId });
    });
    it('should return default 60 BPM if no previous session exists', async () => {
        prisma_1.prisma.practiceSession.findFirst.mockResolvedValue(null);
        const tempo = await rudimentService_1.RudimentService.getSuggestedTempo(mockRudimentId, mockUserId);
        expect(tempo).toBe(60);
    });
    it('should increase tempo by 5 if last session was Flawless (4)', async () => {
        prisma_1.prisma.practiceSession.findFirst.mockResolvedValue({
            tempo: 100,
            quality: 4,
        });
        const tempo = await rudimentService_1.RudimentService.getSuggestedTempo(mockRudimentId, mockUserId);
        expect(tempo).toBe(105); // 100 + 5
    });
    it('should decrease tempo by 5 if last session was Sloppy (1)', async () => {
        prisma_1.prisma.practiceSession.findFirst.mockResolvedValue({
            tempo: 100,
            quality: 1,
        });
        const tempo = await rudimentService_1.RudimentService.getSuggestedTempo(mockRudimentId, mockUserId);
        expect(tempo).toBe(95); // 100 - 5
    });
    it('should never drop below 30 BPM', async () => {
        prisma_1.prisma.practiceSession.findFirst.mockResolvedValue({
            tempo: 32,
            quality: 1, // Should decrease by 5 -> 27
        });
        const tempo = await rudimentService_1.RudimentService.getSuggestedTempo(mockRudimentId, mockUserId);
        expect(tempo).toBe(30); // Capped at 30
    });
});

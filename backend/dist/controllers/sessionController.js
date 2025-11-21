"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardStats = exports.getAllSessions = exports.logSession = exports.getConsistencyData = void 0;
const prisma_1 = require("../lib/prisma");
const errors_1 = require("../types/errors");
/**
 * Get consistency data (practice history) for heatmap visualization
 */
const getConsistencyData = async (req, res) => {
    if (!req.userId) {
        throw new errors_1.AuthorizationError('User ID is required.');
    }
    // Fetch all sessions for the user (just date and duration)
    const sessions = await prisma_1.prisma.practiceSession.findMany({
        where: { userId: req.userId },
        select: { date: true, duration: true },
    });
    // Aggregate minutes by date (YYYY-MM-DD)
    const historyMap = {};
    sessions.forEach((session) => {
        // Split ISO string to get just the date part (e.g., "2025-11-20")
        const dateKey = session.date.toISOString().split('T')[0];
        if (!historyMap[dateKey]) {
            historyMap[dateKey] = 0;
        }
        historyMap[dateKey] += session.duration;
    });
    // Convert to array format for the frontend
    const history = Object.keys(historyMap).map((date) => ({
        date,
        count: historyMap[date], // 'count' = total minutes that day
    }));
    res.status(200).json(history);
};
exports.getConsistencyData = getConsistencyData;
/**
 * Log a new practice session
 */
const logSession = async (req, res) => {
    const { rudimentId, duration, tempo } = req.body;
    if (!req.userId) {
        throw new errors_1.AuthorizationError('User ID is required.');
    }
    const newSession = await prisma_1.prisma.practiceSession.create({
        data: {
            duration, // Zod has already validated these are numbers!
            tempo,
            userId: req.userId,
            rudimentId,
        },
    });
    res.status(201).json(newSession);
};
exports.logSession = logSession;
/**
 * Get all practice sessions for the authenticated user
 */
const getAllSessions = async (req, res) => {
    if (!req.userId) {
        throw new errors_1.AuthorizationError('User ID is required.');
    }
    const sessions = await prisma_1.prisma.practiceSession.findMany({
        where: { userId: req.userId },
        orderBy: { date: 'desc' },
    });
    res.status(200).json(sessions);
};
exports.getAllSessions = getAllSessions;
/**
 * Get dashboard statistics (total time, fastest tempo, most practiced rudiment)
 */
const getDashboardStats = async (req, res) => {
    if (!req.userId) {
        throw new errors_1.AuthorizationError('User ID is required.');
    }
    const statsAggregated = await prisma_1.prisma.practiceSession.aggregate({
        where: { userId: req.userId },
        _sum: { duration: true },
        _max: { tempo: true },
    });
    const statsMostPracticed = await prisma_1.prisma.practiceSession.groupBy({
        by: ['rudimentId'],
        where: { userId: req.userId },
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
        take: 1,
    });
    let mostPracticedName = 'N/A';
    if (statsMostPracticed.length > 0) {
        const rudiment = await prisma_1.prisma.rudiment.findUnique({
            where: { id: statsMostPracticed[0].rudimentId },
        });
        if (rudiment)
            mostPracticedName = rudiment.name;
    }
    res.status(200).json({
        totalTime: statsAggregated._sum.duration || 0,
        fastestTempo: statsAggregated._max.tempo || 0,
        mostPracticed: mostPracticedName,
    });
};
exports.getDashboardStats = getDashboardStats;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSuggestedTempo = exports.deleteRudiment = exports.getAllRudiments = exports.createRudiment = void 0;
const prisma_1 = require("../lib/prisma");
const errors_1 = require("../types/errors");
/**
 * Create a new custom rudiment
 */
const createRudiment = async (req, res) => {
    const { name, description, category, tempoIncrement } = req.body;
    if (!req.userId) {
        throw new errors_1.AuthorizationError('User ID is required.');
    }
    const newRudiment = await prisma_1.prisma.rudiment.create({
        data: {
            name,
            description,
            category,
            tempoIncrement,
            userId: req.userId,
        },
    });
    res.status(201).json(newRudiment);
};
exports.createRudiment = createRudiment;
/**
 * Get all rudiments (user's custom + standard)
 */
const getAllRudiments = async (req, res) => {
    const rudiments = await prisma_1.prisma.rudiment.findMany({
        where: {
            OR: [{ userId: req.userId }, { isStandard: true }],
        },
        orderBy: [{ isStandard: 'desc' }, { name: 'asc' }],
    });
    res.status(200).json(rudiments);
};
exports.getAllRudiments = getAllRudiments;
/**
 * Delete a custom rudiment
 */
const deleteRudiment = async (req, res) => {
    const { id } = req.params;
    if (!req.userId) {
        throw new errors_1.AuthorizationError('User ID is required.');
    }
    const rudiment = await prisma_1.prisma.rudiment.findUnique({ where: { id } });
    if (!rudiment) {
        throw new errors_1.NotFoundError('Rudiment not found.');
    }
    if (rudiment.isStandard) {
        throw new errors_1.AuthorizationError('Cannot delete standard rudiments.');
    }
    if (rudiment.userId !== req.userId) {
        throw new errors_1.AuthorizationError('Permission denied.');
    }
    await prisma_1.prisma.rudiment.delete({ where: { id } });
    res.status(204).send();
};
exports.deleteRudiment = deleteRudiment;
/**
 * Get suggested tempo for a rudiment based on last session
 */
const getSuggestedTempo = async (req, res) => {
    const { id } = req.params;
    const rudiment = await prisma_1.prisma.rudiment.findUnique({ where: { id } });
    if (!rudiment) {
        throw new errors_1.NotFoundError('Rudiment not found.');
    }
    const lastSession = await prisma_1.prisma.practiceSession.findFirst({
        where: { userId: req.userId, rudimentId: id },
        orderBy: { date: 'desc' },
    });
    const suggestedTempo = lastSession ? lastSession.tempo + rudiment.tempoIncrement : 60;
    res.status(200).json({ suggested_tempo: suggestedTempo });
};
exports.getSuggestedTempo = getSuggestedTempo;

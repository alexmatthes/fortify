"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardStats = exports.getAllSessions = exports.getVelocityData = exports.getConsistencyData = exports.logSession = void 0;
const sessionService_1 = require("../services/sessionService");
const logSession = async (req, res) => {
    const session = await sessionService_1.SessionService.logSession({
        ...req.body,
        userId: req.userId,
    });
    res.status(201).json(session);
};
exports.logSession = logSession;
const getConsistencyData = async (req, res) => {
    const history = await sessionService_1.SessionService.getConsistencyData(req.userId);
    res.status(200).json(history);
};
exports.getConsistencyData = getConsistencyData;
const getVelocityData = async (req, res) => {
    const velocity = await sessionService_1.SessionService.getVelocityData(req.userId);
    res.status(200).json(velocity);
};
exports.getVelocityData = getVelocityData;
const getAllSessions = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const result = await sessionService_1.SessionService.getAll(req.userId, page, limit);
    res.status(200).json(result);
};
exports.getAllSessions = getAllSessions;
const getDashboardStats = async (req, res) => {
    const stats = await sessionService_1.SessionService.getDashboardStats(req.userId);
    res.status(200).json(stats);
};
exports.getDashboardStats = getDashboardStats;

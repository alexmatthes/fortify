"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardStats = exports.exportSessions = exports.getAllSessions = exports.getVelocityData = exports.getConsistencyData = exports.logSession = void 0;
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
    const filters = {};
    if (req.query.rudimentId)
        filters.rudimentId = req.query.rudimentId;
    if (req.query.quality)
        filters.quality = parseInt(req.query.quality);
    if (req.query.startDate)
        filters.startDate = new Date(req.query.startDate);
    if (req.query.endDate)
        filters.endDate = new Date(req.query.endDate);
    if (req.query.search)
        filters.search = req.query.search;
    const result = await sessionService_1.SessionService.getAll(req.userId, page, limit, filters);
    res.status(200).json(result);
};
exports.getAllSessions = getAllSessions;
const exportSessions = async (req, res) => {
    const format = req.query.format || 'csv';
    const filters = {};
    if (req.query.rudimentId)
        filters.rudimentId = req.query.rudimentId;
    if (req.query.quality)
        filters.quality = parseInt(req.query.quality);
    if (req.query.startDate)
        filters.startDate = new Date(req.query.startDate);
    if (req.query.endDate)
        filters.endDate = new Date(req.query.endDate);
    if (req.query.search)
        filters.search = req.query.search;
    const data = await sessionService_1.SessionService.exportSessions(req.userId, format, filters);
    if (format === 'csv') {
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=sessions.csv');
    }
    else {
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', 'attachment; filename=sessions.json');
    }
    res.status(200).send(data);
};
exports.exportSessions = exportSessions;
const getDashboardStats = async (req, res) => {
    const stats = await sessionService_1.SessionService.getDashboardStats(req.userId);
    res.status(200).json(stats);
};
exports.getDashboardStats = getDashboardStats;

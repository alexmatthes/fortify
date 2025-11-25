"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSuggestedTempo = exports.deleteRudiment = exports.getAllRudiments = exports.createRudiment = void 0;
const rudimentService_1 = require("../services/rudimentService");
const createRudiment = async (req, res) => {
    const newRudiment = await rudimentService_1.RudimentService.create({
        ...req.body,
        userId: req.userId,
    });
    res.status(201).json(newRudiment);
};
exports.createRudiment = createRudiment;
const getAllRudiments = async (req, res) => {
    const rudiments = await rudimentService_1.RudimentService.getAll(req.userId);
    res.status(200).json(rudiments);
};
exports.getAllRudiments = getAllRudiments;
const deleteRudiment = async (req, res) => {
    await rudimentService_1.RudimentService.delete(req.params.id, req.userId);
    res.status(204).send();
};
exports.deleteRudiment = deleteRudiment;
const getSuggestedTempo = async (req, res) => {
    const suggestedTempo = await rudimentService_1.RudimentService.getSuggestedTempo(req.params.id, req.userId);
    res.status(200).json({ suggested_tempo: suggestedTempo });
};
exports.getSuggestedTempo = getSuggestedTempo;

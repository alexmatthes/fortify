"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteRoutine = exports.getRoutineById = exports.getRoutines = exports.createRoutine = void 0;
const routineService_1 = require("../services/routineService");
const createRoutine = async (req, res) => {
    const routine = await routineService_1.RoutineService.create({
        ...req.body,
        userId: req.userId,
    });
    res.status(201).json(routine);
};
exports.createRoutine = createRoutine;
const getRoutines = async (req, res) => {
    const routines = await routineService_1.RoutineService.getAll(req.userId);
    res.status(200).json(routines);
};
exports.getRoutines = getRoutines;
const getRoutineById = async (req, res) => {
    const routine = await routineService_1.RoutineService.getById(req.params.id, req.userId);
    res.status(200).json(routine);
};
exports.getRoutineById = getRoutineById;
const deleteRoutine = async (req, res) => {
    await routineService_1.RoutineService.delete(req.params.id, req.userId);
    res.status(200).json({ message: 'Routine deleted' });
};
exports.deleteRoutine = deleteRoutine;

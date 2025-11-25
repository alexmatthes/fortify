"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.signup = void 0;
const authService_1 = require("../services/authService");
const signup = async (req, res) => {
    // 1. Extract data
    const { email, password } = req.body;
    // 2. Call Service
    const user = await authService_1.AuthService.signup({ email, password });
    // 3. Send Response
    res.status(201).json(user);
};
exports.signup = signup;
const login = async (req, res) => {
    // 1. Extract data
    const { email, password } = req.body;
    // 2. Call Service
    const result = await authService_1.AuthService.login({ email, password });
    // 3. Send Response
    res.status(200).json(result);
};
exports.login = login;

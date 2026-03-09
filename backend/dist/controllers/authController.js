"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAccount = exports.changePassword = exports.getProfile = exports.login = exports.signup = void 0;
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
const getProfile = async (req, res) => {
    const user = await authService_1.AuthService.getProfile(req.userId);
    res.status(200).json(user);
};
exports.getProfile = getProfile;
const changePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    await authService_1.AuthService.changePassword(req.userId, currentPassword, newPassword);
    res.status(200).json({ message: 'Password changed successfully' });
};
exports.changePassword = changePassword;
const deleteAccount = async (req, res) => {
    const { password } = req.body;
    await authService_1.AuthService.deleteAccount(req.userId, password);
    res.status(200).json({ message: 'Account deleted successfully' });
};
exports.deleteAccount = deleteAccount;

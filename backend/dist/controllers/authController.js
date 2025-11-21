"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.signup = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = require("../lib/prisma");
const config_1 = require("../config");
const errors_1 = require("../types/errors");
/**
 * Sign up a new user
 */
const signup = async (req, res) => {
    const { email, password } = req.body;
    const existingUser = await prisma_1.prisma.user.findUnique({ where: { email } });
    if (existingUser) {
        throw new errors_1.ValidationError('Email already in use.');
    }
    const hashedPassword = await bcryptjs_1.default.hash(password, 10);
    const newUser = await prisma_1.prisma.user.create({
        data: { email, password: hashedPassword },
    });
    res.status(201).json({ id: newUser.id, email: newUser.email });
};
exports.signup = signup;
/**
 * Log in an existing user
 */
const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await prisma_1.prisma.user.findUnique({ where: { email } });
    if (!user) {
        throw new errors_1.ValidationError('Invalid email or password.');
    }
    const isPasswordCorrect = await bcryptjs_1.default.compare(password, user.password);
    if (!isPasswordCorrect) {
        throw new errors_1.ValidationError('Invalid email or password.');
    }
    const token = jsonwebtoken_1.default.sign({ userId: user.id }, config_1.config.jwtSecret, { expiresIn: '7d' });
    res.status(200).json({ token, userId: user.id, email: user.email });
};
exports.login = login;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const supertest_1 = __importDefault(require("supertest"));
const auth_1 = __importDefault(require("../../middleware/auth"));
// Setup a fake app just for this test
const app = (0, express_1.default)();
app.get('/protected', auth_1.default, (req, res) => res.status(200).json({ msg: 'Success' }));
describe('Auth Middleware', () => {
    it('should reject requests with no token', async () => {
        const res = await (0, supertest_1.default)(app).get('/protected');
        expect(res.statusCode).toBe(401);
    });
    it('should reject requests with invalid token', async () => {
        const res = await (0, supertest_1.default)(app).get('/protected').set('Authorization', 'Bearer invalid_token_string');
        expect(res.statusCode).toBe(401);
    });
    it('should accept valid tokens', async () => {
        // Generate a real signed token
        const token = jsonwebtoken_1.default.sign({ userId: '123' }, process.env.JWT_SECRET || 'secret');
        const res = await (0, supertest_1.default)(app).get('/protected').set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toBe(200);
    });
});

import express from 'express';
import jwt from 'jsonwebtoken';
import request from 'supertest';
import auth from '../../middleware/auth';

// Setup a fake app just for this test
const app = express();
app.get('/protected', auth, (req, res) => res.status(200).json({ msg: 'Success' }));

describe('Auth Middleware', () => {
	it('should reject requests with no token', async () => {
		const res = await request(app).get('/protected');
		expect(res.statusCode).toBe(401);
	});

	it('should reject requests with invalid token', async () => {
		const res = await request(app).get('/protected').set('Authorization', 'Bearer invalid_token_string');
		expect(res.statusCode).toBe(401);
	});

	it('should accept valid tokens', async () => {
		// Generate a real signed token
		const token = jwt.sign({ userId: '123' }, process.env.JWT_SECRET || 'secret');

		const res = await request(app).get('/protected').set('Authorization', `Bearer ${token}`);
		expect(res.statusCode).toBe(200);
	});
});

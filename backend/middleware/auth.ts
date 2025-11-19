import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

// Extend the Express Request type to include 'userId'
export interface AuthRequest extends Request {
	userId?: string;
}

const auth = (req: AuthRequest, res: Response, next: NextFunction) => {
	try {
		const authHeader = req.header('Authorization');
		if (!authHeader || !authHeader.startsWith('Bearer ')) {
			res.status(401).json({ message: 'No token, authorization denied.' });
			return;
		}

		const token = authHeader.split(' ')[1];
		if (!token) {
			res.status(401).json({ message: 'Token missing.' });
			return;
		}

		// Force the type here since we know our payload structure
		const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };
		req.userId = decoded.userId;
		next();
	} catch (error) {
		res.status(401).json({ message: 'Token is not valid.' });
	}
};

export default auth;

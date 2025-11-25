import { NextFunction, Request, Response } from 'express';
import { AnyZodObject, ZodError } from 'zod'; // Import ZodError

export const validate = (schema: AnyZodObject) => (req: Request, res: Response, next: NextFunction) => {
	try {
		schema.parse({
			body: req.body,
			query: req.query,
			params: req.params,
		});
		next();
	} catch (error) {
		// Check if it's actually a ZodError
		if (error instanceof ZodError) {
			return res.status(400).json(error.errors);
		}
		return res.status(500).json({ message: 'Internal Server Error' });
	}
};

export default validate;

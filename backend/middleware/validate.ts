import { NextFunction, Request, Response } from 'express';
import { AnyZodObject, ZodError } from 'zod';

const validate = (schema: AnyZodObject) => async (req: Request, res: Response, next: NextFunction) => {
	try {
		await schema.parseAsync(req.body);
		next();
	} catch (error) {
		if (error instanceof ZodError) {
			res.status(400).json({
				message: 'Validation failed',
				errors: error.errors.map((e) => ({
					field: e.path.join('.'),
					message: e.message,
				})),
			});
			return;
		}
		next(error);
	}
};

export default validate;

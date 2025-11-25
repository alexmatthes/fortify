import { NextFunction, Request, Response } from 'express';
import { AnyZodObject, ZodError } from 'zod'; // Import ZodError

const needsRequestEnvelope = (schema: AnyZodObject) => {
	const shape = (schema as { shape?: Record<string, unknown> }).shape;
	return Boolean(shape && (shape.body || shape.query || shape.params));
};

export const validate = (schema: AnyZodObject) => (req: Request, res: Response, next: NextFunction) => {
	try {
		const shouldWrap = needsRequestEnvelope(schema);
		const payload = shouldWrap
			? {
					body: req.body,
					query: req.query,
					params: req.params,
			  }
			: req.body;

		const result = schema.parse(payload) as any;

		if (shouldWrap) {
			if (result.body) req.body = result.body;
			if (result.query) req.query = result.query;
			if (result.params) req.params = result.params;
		} else {
			req.body = result;
		}

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

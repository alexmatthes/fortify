"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const validate = (schema) => async (req, res, next) => {
    try {
        // FIX: Assign the parsed/transformed data back to req.body
        req.body = await schema.parseAsync(req.body);
        next();
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
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
exports.default = validate;

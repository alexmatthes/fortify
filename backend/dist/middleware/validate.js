"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const zod_1 = require("zod"); // Import ZodError
const validate = (schema) => (req, res, next) => {
    try {
        schema.parse({
            body: req.body,
            query: req.query,
            params: req.params,
        });
        next();
    }
    catch (error) {
        // Check if it's actually a ZodError
        if (error instanceof zod_1.ZodError) {
            return res.status(400).json(error.errors);
        }
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};
exports.validate = validate;
exports.default = exports.validate;

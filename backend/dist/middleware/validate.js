"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const zod_1 = require("zod"); // Import ZodError
const needsRequestEnvelope = (schema) => {
    const shape = schema.shape;
    return Boolean(shape && (shape.body || shape.query || shape.params));
};
const validate = (schema) => (req, res, next) => {
    try {
        const shouldWrap = needsRequestEnvelope(schema);
        const payload = shouldWrap
            ? {
                body: req.body,
                query: req.query,
                params: req.params,
            }
            : req.body;
        const result = schema.parse(payload);
        if (shouldWrap) {
            if (result.body)
                req.body = result.body;
            if (result.query)
                req.query = result.query;
            if (result.params)
                req.params = result.params;
        }
        else {
            req.body = result;
        }
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

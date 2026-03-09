"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const zod_1 = require("zod");
const contactController = __importStar(require("../controllers/contactController"));
const validate_1 = __importDefault(require("../middleware/validate"));
const asyncHandler_1 = require("../utils/asyncHandler");
const router = express_1.default.Router();
const contactSchema = zod_1.z.object({
    name: zod_1.z.string().trim().min(1, 'Name is required').max(255, 'Name is too long'),
    email: zod_1.z.string().trim().toLowerCase().email('Invalid email address').max(255, 'Email address is too long'),
    subject: zod_1.z.enum(['general', 'bug', 'feature', 'support', 'other'], {
        errorMap: () => ({ message: 'Invalid subject selection' }),
    }),
    message: zod_1.z.string().trim().min(10, 'Message must be at least 10 characters').max(5000, 'Message is too long'),
});
router.post('/submit', (0, validate_1.default)(contactSchema), (0, asyncHandler_1.asyncHandler)(contactController.submitContact));
exports.default = router;

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
const authController = __importStar(require("../controllers/authController"));
const auth_1 = __importDefault(require("../middleware/auth"));
const validate_1 = __importDefault(require("../middleware/validate"));
const asyncHandler_1 = require("../utils/asyncHandler");
const router = express_1.default.Router();
const signupSchema = zod_1.z.object({
    email: zod_1.z.string().trim().toLowerCase().email('Invalid email address').max(255, 'Email address is too long'),
    password: zod_1.z
        .string()
        .trim()
        .min(8, 'Password must be at least 8 characters')
        .max(128, 'Password is too long')
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
});
const loginSchema = zod_1.z.object({
    email: zod_1.z.string().trim().toLowerCase().email('Invalid email address').max(255, 'Email address is too long'),
    password: zod_1.z.string().trim().max(128, 'Password is too long'),
});
const changePasswordSchema = zod_1.z.object({
    currentPassword: zod_1.z.string().trim().min(1, 'Current password is required'),
    newPassword: zod_1.z
        .string()
        .trim()
        .min(8, 'Password must be at least 8 characters')
        .max(128, 'Password is too long')
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
});
const deleteAccountSchema = zod_1.z.object({
    password: zod_1.z.string().trim().min(1, 'Password is required'),
});
router.post('/signup', (0, validate_1.default)(signupSchema), authController.signup);
router.post('/login', (0, validate_1.default)(loginSchema), (0, asyncHandler_1.asyncHandler)(authController.login));
router.get('/profile', auth_1.default, (0, asyncHandler_1.asyncHandler)(authController.getProfile));
router.put('/change-password', auth_1.default, (0, validate_1.default)(changePasswordSchema), (0, asyncHandler_1.asyncHandler)(authController.changePassword));
router.delete('/account', auth_1.default, (0, validate_1.default)(deleteAccountSchema), (0, asyncHandler_1.asyncHandler)(authController.deleteAccount));
exports.default = router;

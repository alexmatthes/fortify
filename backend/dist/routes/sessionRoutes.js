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
const sessionController = __importStar(require("../controllers/sessionController"));
const auth_1 = __importDefault(require("../middleware/auth"));
const validate_1 = __importDefault(require("../middleware/validate"));
const asyncHandler_1 = require("../utils/asyncHandler");
const router = express_1.default.Router();
const sessionSchema = zod_1.z.object({
    body: zod_1.z.object({
        rudimentId: zod_1.z.string().trim().cuid('Invalid Rudiment ID'),
        duration: zod_1.z.preprocess((val) => Number(val), zod_1.z.number().positive().max(1440)),
        tempo: zod_1.z.preprocess((val) => Number(val), zod_1.z.number().min(30).max(300)),
        quality: zod_1.z.preprocess((val) => Number(val), zod_1.z.number().int().min(1).max(4)),
    }),
});
router.get('/history', auth_1.default, (0, asyncHandler_1.asyncHandler)(sessionController.getConsistencyData));
router.get('/velocity', auth_1.default, (0, asyncHandler_1.asyncHandler)(sessionController.getVelocityData)); // NEW ROUTE
router.post('/', auth_1.default, (0, validate_1.default)(sessionSchema), (0, asyncHandler_1.asyncHandler)(sessionController.logSession));
router.get('/', auth_1.default, (0, asyncHandler_1.asyncHandler)(sessionController.getAllSessions));
exports.default = router;

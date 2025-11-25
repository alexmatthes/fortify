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
const routineController = __importStar(require("../controllers/routineController"));
const auth_1 = __importDefault(require("../middleware/auth"));
const validate_1 = __importDefault(require("../middleware/validate"));
const router = express_1.default.Router();
const createRoutineSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Name is required'),
    description: zod_1.z.string().optional(),
    items: zod_1.z
        .array(zod_1.z.object({
        rudimentId: zod_1.z.string(),
        duration: zod_1.z.number().positive(),
        // NEW FIELDS: We must allow these through validation
        tempoMode: zod_1.z.enum(['MANUAL', 'SMART']).optional().default('MANUAL'),
        targetTempo: zod_1.z.number().int().positive().optional(),
        restDuration: zod_1.z.number().int().min(0).optional().default(0),
    }))
        .min(1, 'Routine must have at least one item'),
});
router.post('/', auth_1.default, (0, validate_1.default)(createRoutineSchema), routineController.createRoutine);
router.get('/', auth_1.default, routineController.getRoutines);
router.get('/:id', auth_1.default, routineController.getRoutineById);
router.delete('/:id', auth_1.default, routineController.deleteRoutine);
exports.default = router;

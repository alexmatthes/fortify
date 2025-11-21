import express from 'express';
import * as sessionController from '../controllers/sessionController';
import auth from '../middleware/auth';
import { asyncHandler } from '../utils/asyncHandler';

const router = express.Router();

// Dashboard stats endpoint
router.get('/stats', auth, asyncHandler(sessionController.getDashboardStats));

export default router;


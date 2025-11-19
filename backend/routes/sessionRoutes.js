const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/sessionController');
const auth = require('../middleware/auth');

router.post('/', auth, sessionController.logSession);
router.get('/', auth, sessionController.getAllSessions);
router.get('/stats', auth, sessionController.getDashboardStats); // Matches /api/dashboard/stats logic

module.exports = router;

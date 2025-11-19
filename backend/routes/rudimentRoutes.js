const express = require('express');
const router = express.Router();
const rudimentController = require('../controllers/rudimentController');
const auth = require('../middleware/auth'); // Import middleware

// All these routes are protected by 'auth'
router.post('/', auth, rudimentController.createRudiment);
router.get('/', auth, rudimentController.getAllRudiments);
router.delete('/:id', auth, rudimentController.deleteRudiment);
router.get('/:id/suggested-tempo', auth, rudimentController.getSuggestedTempo);

module.exports = router;

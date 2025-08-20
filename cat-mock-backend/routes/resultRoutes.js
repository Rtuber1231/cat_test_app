const express = require('express');
const router = express.Router();
const resultController = require('../controllers/resultController');

// GET /api/results/:resultId - Get a specific result by its ID
router.get('/:resultId', resultController.getResultById);

module.exports = router;

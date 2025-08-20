const express = require('express');
const router = express.Router();
const multer = require('multer');
const testController = require('../controllers/testController');

// Configure multer for in-memory file storage
const upload = multer({ storage: multer.memoryStorage() });

// POST /api/test/create-from-pdf - Create a test from an uploaded PDF
router.post('/create-from-pdf', upload.single('pdfFile'), testController.createTestFromPdf);

// GET /api/test/:testId - Get a specific test
router.get('/:testId', testController.getTestById);

// POST /api/test/submit - Submit answers for a test
router.post('/submit', testController.submitTest);

module.exports = router;

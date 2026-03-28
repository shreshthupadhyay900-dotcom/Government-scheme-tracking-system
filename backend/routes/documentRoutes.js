const express = require('express');
const router = express.Router();
const { uploadDocument, chatWithDocument } = require('../controllers/documentController');
const upload = require('../middleware/uploadMiddleware');
const { protect } = require('../middleware/authMiddleware');

// @route   POST /api/documents/upload
// @desc    Upload PDF and extract text
// @access  Private
router.post('/upload', protect, upload.single('file'), uploadDocument);

// @route   POST /api/documents/doc-chat
// @desc    Chat with document content using AI
// @access  Private
router.post('/doc-chat', protect, chatWithDocument);

module.exports = router;

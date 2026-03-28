const express = require('express');
const router = express.Router();
const { getSchemeRecommendations } = require('../controllers/recommendationController');
const { protect } = require('../middleware/authMiddleware');

// @route   POST /api/recommendations
// @desc    Get AI-powered scheme recommendations for a user profile
// @access  Private
router.post('/', protect, getSchemeRecommendations);

module.exports = router;

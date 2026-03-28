const express = require('express');
const router = express.Router();
const { getSchemes, createScheme, checkEligibility, getSchemeById, getSchemeGuide } = require('../controllers/schemeController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', getSchemes);
router.get('/:id', getSchemeById);
router.get('/:id/guide', protect, getSchemeGuide);
router.post('/', protect, admin, createScheme);
router.post('/eligibility', checkEligibility);

module.exports = router;

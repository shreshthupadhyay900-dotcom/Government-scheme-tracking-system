const express = require('express');
const router = express.Router();
const { submitApplication, getUserApplications, updateApplicationStatus } = require('../controllers/applicationController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/', protect, submitApplication);
router.get('/', protect, getUserApplications);
router.put('/:id/status', protect, admin, updateApplicationStatus);

module.exports = router;

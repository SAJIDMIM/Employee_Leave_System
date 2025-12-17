const express = require('express');
const router = express.Router();
const { createLeave, getMyLeaves, getAllLeaves, updateLeaveStatus } = require('../controllers/leaveController');
const { protect, authorize } = require('../middleware/auth');

// Employee routes
router.post('/apply', protect, authorize('employee'), createLeave);
router.get('/my-leaves', protect, authorize('employee'), getMyLeaves);

// Admin routes
router.get('/all', protect, authorize('admin'), getAllLeaves);
router.put('/:id/status', protect, authorize('admin'), updateLeaveStatus);

module.exports = router;

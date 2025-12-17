const express = require('express');
const router = express.Router();
const {
  createLeave,
  getMyLeaves,
  getAllLeaves,
  updateLeaveStatus
} = require('../controllers/leaveController');

const { protect, authorize } = require('../middleware/auth');

// ✅ REQUIRED ENDPOINT
// POST /leaves  (Employee only)
router.post('/', protect, authorize('employee'), createLeave);

// GET /leaves/my-leaves
router.get('/my-leaves', protect, authorize('employee'), getMyLeaves);

// GET /leaves/all (Admin only)
router.get('/all', protect, authorize('admin'), getAllLeaves);

// PUT /leaves/:id/status (Admin only)
router.put('/:id/status', protect, authorize('admin'), updateLeaveStatus);

module.exports = router;

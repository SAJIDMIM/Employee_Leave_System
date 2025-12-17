const Leave = require('../models/Leave');

// Create leave request
exports.createLeave = async (req, res) => {
    try {
        const { leaveType, startDate, endDate, reason } = req.body;

        if (!leaveType || !startDate || !endDate || !reason) {
            return res.status(400).json({ success: false, message: 'Please fill in all fields' });
        }

        const start = new Date(startDate);
        const end = new Date(endDate);

        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            return res.status(400).json({ success: false, message: 'Invalid date format' });
        }

        if (start < new Date().setHours(0, 0, 0, 0)) {
            return res.status(400).json({ success: false, message: 'Start date cannot be in the past' });
        }

        if (end < start) {
            return res.status(400).json({ success: false, message: 'End date must be after start date' });
        }

        const overlap = await Leave.checkOverlap(req.user.id, start, end);
        if (overlap) {
            return res.status(400).json({ success: false, message: 'You already have a leave overlapping this period' });
        }

        const leave = await Leave.create({
            user: req.user.id,
            leaveType,
            startDate: start,
            endDate: end,
            reason
        });

        res.status(201).json({ success: true, data: leave });

    } catch (error) {
        console.error('Create leave error:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// Get employee leaves
exports.getMyLeaves = async (req, res) => {
    try {
        const leaves = await Leave.find({ user: req.user.id })
            .sort({ appliedDate: -1 })
            .populate('approvedBy', 'name');

        res.status(200).json({ success: true, count: leaves.length, data: leaves });
    } catch (error) {
        console.error('Get leaves error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Get all leaves (admin)
exports.getAllLeaves = async (req, res) => {
    try {
        const leaves = await Leave.find()
            .sort({ appliedDate: -1 })
            .populate('user', 'name email department')
            .populate('approvedBy', 'name');

        res.status(200).json({ success: true, count: leaves.length, data: leaves });
    } catch (error) {
        console.error('Get all leaves error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Update leave status (admin)
exports.updateLeaveStatus = async (req, res) => {
    try {
        const { status, comments } = req.body;
        const { id } = req.params;

        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({ success: false, message: 'Status must be "approved" or "rejected"' });
        }

        const leave = await Leave.findById(id);
        if (!leave) return res.status(404).json({ success: false, message: 'Leave request not found' });

        leave.status = status;
        leave.adminComments = comments || '';
        leave.approvedBy = req.user.id;
        leave.approvedDate = new Date();

        await leave.save();

        res.status(200).json({ success: true, data: leave });
    } catch (error) {
        console.error('Update leave error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
